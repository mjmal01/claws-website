import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNewsPostsWithAuthors } from '@/lib/supabase'
import NewsFeedClient from './NewsFeedClient'

export default async function NewsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const posts = await getNewsPostsWithAuthors(50)
  const isLeadership = session.user.role === 'leadership'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Announcements</h1>
          <p className="mt-1 text-white/50 text-sm">Internal org updates and news</p>
        </div>
        {isLeadership && <ComposeButton />}
      </div>

      <NewsFeedClient
        initialPosts={posts}
        isLeadership={isLeadership}
        currentUserId={session.user.id}
      />
    </div>
  )
}

function ComposeButton() {
  return (
    // Rendered by NewsFeedClient — this slot is handled client-side
    // We pass isLeadership prop to the client component instead
    null
  )
}
