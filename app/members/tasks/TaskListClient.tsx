'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { TaskWithAssigner } from '@/lib/supabase'
import { completeTask, uncompleteTask } from '@/app/actions/tasks'
import { createBrowserSupabaseClient } from '@/lib/supabase'

type TaskBucket = 'overdue' | 'this_week' | 'pending' | 'completed'
type Filter = 'all' | 'pending' | 'overdue' | 'completed'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue',   label: 'Overdue' },
]

function classifyTask(task: TaskWithAssigner, now: Date): TaskBucket {
  if (task.completed) return 'completed'
  if (!task.due_date) return 'pending'
  const due = new Date(task.due_date + 'T00:00:00')
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  if (due < today) return 'overdue'
  const weekOut = new Date(today)
  weekOut.setDate(weekOut.getDate() + 7)
  if (due <= weekOut) return 'this_week'
  return 'pending'
}

interface Props {
  tasks: TaskWithAssigner[]
  semesterPoints: number
}

export default function TaskListClient({ tasks: initialTasks }: Props) {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<TaskWithAssigner[]>(initialTasks)
  const [filter, setFilter]   = useState<Filter>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const now = new Date()

  // Realtime: listen for new task assignments and updates
  useEffect(() => {
    if (!session?.supabaseAccessToken) return
    const supabase = createBrowserSupabaseClient(session.supabaseAccessToken)
    const channel = supabase
      .channel('tasks_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        async (payload) => {
          const { data } = await supabase
            .from('tasks')
            .select(`*, assigner:members!tasks_assigned_by_fkey(id, name), attachments:task_attachments(*)`)
            .eq('id', (payload.new as { id: string }).id)
            .single()
          if (data) {
            setTasks((prev) => [
              {
                ...(data as TaskWithAssigner),
                assigner: (data as { assigner: TaskWithAssigner['assigner'] }).assigner,
                attachments: [],
              },
              ...prev,
            ])
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => {
          const updated = payload.new as TaskWithAssigner
          setTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
          )
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [session?.supabaseAccessToken])

  const classified = tasks.map((t) => ({ task: t, bucket: classifyTask(t, now) }))

  const overdue   = classified.filter((c) => c.bucket === 'overdue')
  const thisWeek  = classified.filter((c) => c.bucket === 'this_week')
  const upcoming  = classified.filter((c) => c.bucket === 'pending')
  const completed = classified.filter((c) => c.bucket === 'completed')

  // Live semester points (re-derived from current task state)
  const semPts = tasks.filter((t) => t.completed).reduce((s, t) => s + t.points_value, 0)

  const filtered: { task: TaskWithAssigner; bucket: TaskBucket }[] = (() => {
    switch (filter) {
      case 'pending':   return [...overdue, ...thisWeek, ...upcoming]
      case 'overdue':   return overdue
      case 'completed': return completed
      default:          return classified as { task: TaskWithAssigner; bucket: TaskBucket }[]
    }
  })()

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function handleToggle(task: TaskWithAssigner) {
    startTransition(async () => {
      if (task.completed) {
        await uncompleteTask(task.id)
        setTasks((prev) =>
          prev.map((t) => t.id === task.id ? { ...t, completed: false, completed_at: null } : t)
        )
      } else {
        await completeTask(task.id)
        setTasks((prev) =>
          prev.map((t) => t.id === task.id ? { ...t, completed: true, completed_at: new Date().toISOString() } : t)
        )
      }
    })
  }

  function renderSection(
    label: string,
    items: { task: TaskWithAssigner; bucket: TaskBucket }[],
    accentDot: string
  ) {
    if (items.length === 0) return null
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${accentDot}`} />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</h2>
          <span className="text-xs text-white/25">({items.length})</span>
        </div>
        <div className="space-y-2">
          {items.map(({ task }) => (
            <TaskRow
              key={task.id}
              task={task}
              bucket={classifyTask(task, now)}
              isExpanded={expanded.has(task.id)}
              onToggleExpand={() => toggleExpand(task.id)}
              onToggleComplete={() => handleToggle(task)}
              isPending={isPending}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {f.label}
            {f.key === 'overdue' && overdue.length > 0 && (
              <span className="ml-1.5 bg-red-500/80 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                {overdue.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-sm">No tasks assigned yet</p>
        </div>
      ) : filter !== 'all' ? (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              <p className="text-sm">No tasks in this filter</p>
            </div>
          ) : (
            filtered.map(({ task }) => (
              <TaskRow
                key={task.id}
                task={task}
                bucket={classifyTask(task, now)}
                isExpanded={expanded.has(task.id)}
                onToggleExpand={() => toggleExpand(task.id)}
                onToggleComplete={() => handleToggle(task)}
                isPending={isPending}
              />
            ))
          )}
        </div>
      ) : (
        <div>
          {renderSection('Overdue', overdue, 'bg-red-500')}
          {renderSection('Due This Week', thisWeek, 'bg-yellow-400')}
          {renderSection('Upcoming', upcoming, 'bg-white/30')}
          {renderSection('Completed', completed, 'bg-green-500')}
          {overdue.length === 0 && thisWeek.length === 0 && upcoming.length === 0 && completed.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-sm">All caught up!</p>
            </div>
          )}
        </div>
      )}

      {/* Semester footer */}
      {tasks.length > 0 && (
        <div className="mt-8 px-5 py-4 rounded-2xl border border-white/8 bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-white/40">Semester total from completed tasks</span>
          <span className="text-sm font-semibold text-maize">{semPts} pts</span>
        </div>
      )}
    </div>
  )
}

// ─── TaskRow ──────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  bucket,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  isPending,
}: {
  task: TaskWithAssigner
  bucket: TaskBucket
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleComplete: () => void
  isPending: boolean
}) {
  const dueDateLabel = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      })
    : null

  const dateColor =
    bucket === 'overdue'   ? 'text-red-400' :
    bucket === 'this_week' ? 'text-yellow-400' :
    bucket === 'completed' ? 'text-white/25' :
    'text-white/50'

  const borderColor =
    task.completed         ? 'border-white/5 bg-white/[0.02]' :
    bucket === 'overdue'   ? 'border-red-500/20 bg-red-500/[0.04]' :
    bucket === 'this_week' ? 'border-yellow-400/15 bg-yellow-400/[0.03]' :
                             'border-white/8 bg-white/[0.03]'

  return (
    <div className={`rounded-xl border transition-colors ${borderColor}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          disabled={isPending}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          className={`flex-shrink-0 w-5 h-5 rounded border transition-colors ${
            task.completed
              ? 'bg-green-600 border-green-600 flex items-center justify-center'
              : 'border-white/20 hover:border-white/50'
          }`}
        >
          {task.completed && <span className="text-white text-xs">✓</span>}
        </button>

        {/* Title */}
        <button
          onClick={onToggleExpand}
          className={`flex-1 text-left text-sm font-medium transition-colors ${
            task.completed ? 'line-through text-white/30' : 'text-white hover:text-white/80'
          }`}
        >
          {task.title}
        </button>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {task.subteam && (
            <span className="hidden sm:block text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/40 uppercase tracking-wide">
              {task.subteam}
            </span>
          )}
          {dueDateLabel && (
            <span className={`text-xs ${dateColor}`}>{dueDateLabel}</span>
          )}
          <span className="text-xs text-maize/60 font-medium">+{task.points_value}pts</span>
          <button
            onClick={onToggleExpand}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            className="text-white/20 hover:text-white/50 transition-colors text-xs w-4"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-12 pb-4 space-y-3 border-t border-white/5 pt-3">
          {task.assigner && (
            <p className="text-xs text-white/40">
              Assigned by <span className="text-white/60">{task.assigner.name}</span>
            </p>
          )}
          {task.description && (
            <p className="text-sm text-white/60 leading-relaxed">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-white/30">
            {task.due_date && (
              <span>
                Due{' '}
                <span className={dateColor}>
                  {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'long', day: 'numeric',
                  })}
                </span>
              </span>
            )}
            {task.completed && task.completed_at && (
              <span>
                Completed{' '}
                <span className="text-green-400">
                  {new Date(task.completed_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric',
                  })}
                </span>
              </span>
            )}
          </div>
          {task.attachments.length > 0 && (
            <div className="pt-1">
              <p className="text-xs text-white/25 mb-1.5">Attachments</p>
              <div className="flex flex-wrap gap-2">
                {task.attachments.map((a) => (
                  <a
                    key={a.id}
                    href={a.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs"
                  >
                    <span>📎</span>
                    <span className="truncate max-w-[160px]">{a.file_name}</span>
                    {a.file_size && (
                      <span className="text-white/30 flex-shrink-0">
                        ({(a.file_size / 1024).toFixed(0)}kb)
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

