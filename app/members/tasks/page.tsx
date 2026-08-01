import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMemberTasksWithDetails } from '@/lib/supabase'
import TaskListClient from './TaskListClient'

export default async function TasksPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const tasks = await getMemberTasksWithDetails(session.user.id)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const semesterPoints = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points_value, 0)

  const overdueCount = tasks.filter(
    (t) => !t.completed && t.due_date && new Date(t.due_date + 'T00:00:00') < today
  ).length

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Tasks</h1>
          <p className="mt-1 text-white/50 text-sm">
            {tasks.filter((t) => !t.completed).length} remaining
            {overdueCount > 0 && (
              <span className="ml-1 text-red-400">· {overdueCount} overdue</span>
            )}
            <span className="mx-2 text-white/20">·</span>
            {semesterPoints} pts earned this semester
          </p>
        </div>
      </div>

      <TaskListClient tasks={tasks} semesterPoints={semesterPoints} />
    </div>
  )
}
