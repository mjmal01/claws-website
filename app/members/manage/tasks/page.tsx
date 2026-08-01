import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getAllTasksForManage, getAllActiveMembers, getSubteams } from '@/lib/supabase'
import ManageTasksClient from './ManageTasksClient'

export default async function ManageTasksPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const { role, subteam: userSubteam } = session.user

  // Only leadership and leads can access
  if (role === 'alumni') redirect('/members')

  const [tasks, members, subteams] = await Promise.all([
    getAllTasksForManage(role, session.user.id, userSubteam as Parameters<typeof getAllTasksForManage>[2]),
    getAllActiveMembers(),
    getSubteams(),
  ])

  // Leads only see their subteam members for assignment
  const assignableMembers =
    role === 'leadership' || role === 'faculty'
      ? members
      : members.filter((m) => m.subteam === userSubteam)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Management</h1>
          <p className="mt-1 text-white/50 text-sm">
            {tasks.filter((t) => !t.completed).length} open · {tasks.filter((t) => t.completed).length} completed
          </p>
        </div>
      </div>

      <ManageTasksClient
        initialTasks={tasks}
        members={assignableMembers}
        subteams={subteams}
        isLeadership={role === 'leadership'}
        userSubteam={userSubteam}
      />
    </div>
  )
}
