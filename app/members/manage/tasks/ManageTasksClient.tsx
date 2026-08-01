'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { TaskWithAssigner, Member, Subteam } from '@/lib/supabase'
import { createTask, deleteTask } from '@/app/actions/tasks'
import { createBrowserSupabaseClient } from '@/lib/supabase'

type Filter = 'all' | 'open' | 'overdue' | 'completed'

function isOverdue(task: TaskWithAssigner) {
  if (task.completed || !task.due_date) return false
  return new Date(task.due_date + 'T23:59:59') < new Date()
}

interface Props {
  initialTasks: TaskWithAssigner[]
  members: Member[]
  subteams: Subteam[]
  isLeadership: boolean
  userSubteam: string | null
}

export default function ManageTasksClient({ initialTasks, members, subteams, isLeadership, userSubteam }: Props) {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<TaskWithAssigner[]>(initialTasks)
  const [filter, setFilter] = useState<Filter>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()
  const [createError, setCreateError] = useState('')
  const [assignType, setAssignType] = useState<'member' | 'subteam'>('member')
  const [uploading, setUploading] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

  // Realtime
  useEffect(() => {
    if (!session?.supabaseAccessToken) return
    const supabase = createBrowserSupabaseClient(session.supabaseAccessToken)
    const channel = supabase
      .channel('manage_tasks_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, async (payload) => {
        if (payload.eventType === 'DELETE') {
          setTasks((prev) => prev.filter((t) => t.id !== (payload.old as { id: string }).id))
        } else if (payload.eventType === 'INSERT') {
          // Known gap: attachments.file_url here is the raw storage path
          // (attachments is a private bucket) — signing needs the
          // service-role client, which the browser doesn't have. Fresh on
          // the next full page load via getAllTasksForManage().
          const { data } = await supabase
            .from('tasks')
            .select(`*, assigner:members!tasks_assigned_by_fkey(id, name), assignee:members!tasks_member_id_fkey(id, name, subteam), attachments:task_attachments(*)`)
            .eq('id', (payload.new as { id: string }).id)
            .single()
          if (data) setTasks((prev) => [data as TaskWithAssigner, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as TaskWithAssigner
          setTasks((prev) => prev.map((t) => t.id === updated.id ? { ...t, ...updated } : t))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [session?.supabaseAccessToken])

  async function handleCreate(formData: FormData) {
    setCreateError('')
    startTransition(async () => {
      try {
        const result = await createTask(formData)
        // Upload attachment if any
        if (attachmentFile && result.taskId && session?.user.id) {
          setUploading(true)
          const supabase = createBrowserSupabaseClient(session.supabaseAccessToken)
          const path = `tasks/${result.taskId}/${Date.now()}_${attachmentFile.name}`
          const { data: uploadData } = await supabase.storage.from('attachments').upload(path, attachmentFile)
          if (uploadData) {
            // attachments is a private bucket — store the raw storage path,
            // not a public URL (getPublicUrl() would return a link that
            // 403s). Read paths sign it fresh via lib/supabase.ts's
            // signAttachmentUrls() before it ever reaches the client.
            await supabase.from('task_attachments').insert({
              task_id: result.taskId,
              member_id: session.user.id,
              file_name: attachmentFile.name,
              file_url: path,
              file_size: attachmentFile.size,
              mime_type: attachmentFile.type,
            })
          }
          setUploading(false)
          setAttachmentFile(null)
        }
        setShowCreate(false)
      } catch (e) {
        setCreateError((e as Error).message)
      }
    })
  }

  function handleDelete(taskId: string) {
    startTransition(async () => {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    })
  }

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      ((t as TaskWithAssigner & { assignee?: { name: string } }).assignee?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'open' && !t.completed) ||
      (filter === 'overdue' && isOverdue(t)) ||
      (filter === 'completed' && t.completed)
    return matchesSearch && matchesFilter
  })

  const overdueCount = tasks.filter(isOverdue).length

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks or assignees…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
          {(['all', 'open', 'overdue', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === f ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {f}
              {f === 'overdue' && overdueCount > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-1 text-[10px]">{overdueCount}</span>
              )}
            </button>
          ))}
        </div>
        {isLeadership && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex-shrink-0"
          >
            + Create Task
          </button>
        )}
      </div>

      {/* Task table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_180px_120px_100px_80px] gap-4 px-5 py-3 bg-white/[0.02] border-b border-white/5">
          {['Task', 'Assignee', 'Due Date', 'Status', ''].map((h) => (
            <span key={h} className="text-xs font-semibold uppercase tracking-widest text-white/30">{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          filtered.map((task) => {
            const overdue = isOverdue(task)
            const assignee = (task as TaskWithAssigner & { assignee?: { name: string; subteam?: string } }).assignee
            return (
              <div
                key={task.id}
                className={`grid grid-cols-1 sm:grid-cols-[1fr_180px_120px_100px_80px] gap-2 sm:gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
                  overdue ? 'border-l-2 border-l-red-500/50' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-white/30' : 'text-white'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-white/30 truncate mt-0.5">{task.description}</p>
                  )}
                  {task.subteam && (
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 uppercase">
                      {task.subteam}
                    </span>
                  )}
                  {task.attachments.length > 0 && (
                    <span className="inline-block ml-1 text-[10px] text-white/30">
                      📎 {task.attachments.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-white/60 truncate">
                    {assignee?.name ?? (task.subteam ? `All ${task.subteam}` : '—')}
                  </span>
                </div>
                <div className="flex items-center">
                  {task.due_date ? (
                    <span className={`text-sm ${overdue ? 'text-red-400' : 'text-white/50'}`}>
                      {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })}
                      {overdue && <span className="ml-1 text-[10px]">OVERDUE</span>}
                    </span>
                  ) : (
                    <span className="text-white/25 text-sm">No deadline</span>
                  )}
                </div>
                <div className="flex items-center">
                  <StatusBadge completed={task.completed} overdue={overdue} />
                </div>
                <div className="flex items-center justify-end">
                  {isLeadership && (
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isPending}
                      className="text-white/20 hover:text-red-400 transition-colors text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Create task modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Create Task</h2>
              <button onClick={() => { setShowCreate(false); setCreateError('') }}
                className="text-white/40 hover:text-white text-xl">✕</button>
            </div>

            <form action={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Title *</label>
                <input name="title" required placeholder="Task title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">Description</label>
                <textarea name="description" rows={3} placeholder="What needs to be done?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 text-sm resize-none" />
              </div>

              {/* Assign type toggle */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Assign to</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setAssignType('member')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${assignType === 'member' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50'}`}>
                    Member
                  </button>
                  <button type="button" onClick={() => setAssignType('subteam')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${assignType === 'subteam' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50'}`}>
                    Whole Subteam
                  </button>
                </div>
                {assignType === 'member' ? (
                  <select name="member_id"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm">
                    <option value="">Select member…</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} {m.subteam ? `(${m.subteam})` : ''}</option>
                    ))}
                  </select>
                ) : (
                  <select name="subteam"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm">
                    <option value="">Select subteam…</option>
                    {(isLeadership ? subteams : subteams.filter((s) => s.slug === userSubteam)).map((s) => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Due Date</label>
                  <input name="due_date" type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Points Value</label>
                  <select name="points_value" defaultValue="15"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm">
                    <option value="10">10 pts</option>
                    <option value="15">15 pts</option>
                    <option value="20">20 pts</option>
                    <option value="25">25 pts</option>
                  </select>
                </div>
              </div>

              {/* File attachment */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Attach file (optional, up to 50 MB)</label>
                <input
                  type="file"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
                  className="text-xs text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/70 file:text-xs hover:file:bg-white/20 file:cursor-pointer"
                />
                {attachmentFile && (
                  <p className="text-xs text-white/40 mt-1">
                    {attachmentFile.name} · {(attachmentFile.size / 1024).toFixed(0)} KB
                  </p>
                )}
              </div>

              {createError && <p className="text-red-400 text-xs">{createError}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowCreate(false); setCreateError('') }}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending || uploading}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                  {isPending || uploading ? 'Creating…' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ completed, overdue }: { completed: boolean; overdue: boolean }) {
  if (completed) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Done</span>
  }
  if (overdue) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">Overdue</span>
  }
  return <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">Open</span>
}
