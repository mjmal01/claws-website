'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { NewsPostWithAuthor } from '@/lib/supabase'
import { createNewsPost, deleteNewsPost } from '@/app/actions/news'
import Image from 'next/image'

interface Props {
  initialPosts: NewsPostWithAuthor[]
  isLeadership: boolean
  currentUserId: string
}

export default function NewsFeedClient({ initialPosts, isLeadership, currentUserId }: Props) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<NewsPostWithAuthor[]>(initialPosts)
  const [showCompose, setShowCompose] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  // Realtime subscription
  useEffect(() => {
    if (!session?.supabaseAccessToken) return
    const supabase = createBrowserSupabaseClient(session.supabaseAccessToken)
    const channel = supabase
      .channel('news_posts_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news_posts' },
        async (payload) => {
          // Fetch full post with author
          const { data } = await supabase
            .from('news_posts')
            .select('*, author:members!news_posts_author_id_fkey(id, name, avatar_url)')
            .eq('id', (payload.new as { id: string }).id)
            .single()
          if (data) {
            const post = data as NewsPostWithAuthor
            setPosts((prev) => [post, ...prev])
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'news_posts' },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== (payload.old as { id: string }).id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [session?.supabaseAccessToken])

  async function handleImageUpload(file: File) {
    setUploadingImage(true)
    try {
      const supabase = createBrowserSupabaseClient(session?.supabaseAccessToken)
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('news').getPublicUrl(path)
      setImageUrl(data.publicUrl)
    } catch {
      setError('Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  function handleSubmit(formData: FormData) {
    if (imageUrl) formData.set('image_url', imageUrl)
    setError('')
    startTransition(async () => {
      try {
        await createNewsPost(formData)
        setShowCompose(false)
        setImageUrl('')
      } catch (e) {
        setError((e as Error).message)
      }
    })
  }

  function handleDelete(postId: string) {
    startTransition(async () => {
      await deleteNewsPost(postId)
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    })
  }

  return (
    <div className="space-y-6">
      {/* Compose button */}
      {isLeadership && (
        <button
          onClick={() => setShowCompose(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors text-sm"
        >
          <span className="text-lg">📢</span>
          Post an announcement…
        </button>
      )}

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">New Announcement</h2>
              <button onClick={() => { setShowCompose(false); setImageUrl(''); setError('') }}
                className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <input
                  name="title"
                  required
                  placeholder="Title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <textarea
                  name="body"
                  required
                  rows={5}
                  placeholder="Write your announcement…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>
              {/* Image upload */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Attach image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]) }}
                  className="text-xs text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/70 file:text-xs hover:file:bg-white/20 file:cursor-pointer"
                />
                {uploadingImage && <p className="text-xs text-blue-400 mt-1">Uploading…</p>}
                {imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden">
                    <Image src={imageUrl} alt="preview" fill className="object-cover" />
                    <button type="button" onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">✕</button>
                  </div>
                )}
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowCompose(false); setImageUrl(''); setError('') }}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending || uploadingImage}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                  {isPending ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No announcements yet</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isLeadership={isLeadership}
            currentUserId={currentUserId}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  )
}

function PostCard({
  post,
  isLeadership,
  currentUserId,
  onDelete,
}: {
  post: NewsPostWithAuthor
  isLeadership: boolean
  currentUserId: string
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const date = new Date(post.created_at)
  const isAuthor = post.author_id === currentUserId

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {post.image_url && (
        <div className="relative w-full h-48">
          <Image src={post.image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {post.author?.avatar_url ? (
              <Image
                src={post.author.avatar_url}
                alt={post.author.name}
                width={32} height={32}
                className="rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-xs text-blue-400 flex-shrink-0">
                {post.author?.name?.[0] ?? '?'}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-white/60 text-xs">{post.author?.name ?? 'CLAWS'}</span>
              <span className="text-white/25 text-xs mx-2">·</span>
              <time className="text-white/25 text-xs">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(isLeadership || isAuthor) && (
              <button
                onClick={() => onDelete(post.id)}
                className="text-white/20 hover:text-red-400 text-xs transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        <h2 className="mt-3 text-lg font-semibold text-white leading-snug">{post.title}</h2>

        {expanded && (
          <div className="mt-3 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>
        )}
      </div>
    </article>
  )
}
