import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMemberById, getSubteamBySlug } from '@/lib/supabase'
import { Subnav } from '@/components/layout/Subnav'

const SUBNAV_ITEMS = [
  { label: 'Attendance', href: '/members/manage/attendance' },
  { label: 'Members',    href: '/members/manage/members' },
  { label: 'Tasks',      href: '/members/manage/tasks' },
  { label: 'Merch',      href: '/members/manage/merch' },
  { label: 'News',       href: '/members/manage/news' },
]

export default async function ManageLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const member = await getMemberById(session.user.id)
  if (!member) redirect('/auth/signin')

  const subteamData = member.subteam ? await getSubteamBySlug(member.subteam) : null
  const isSubteamLead = subteamData?.lead_id === member.id
  const canManage = member.role === 'leadership' || member.role === 'faculty' || isSubteamLead

  if (!canManage) {
    redirect('/members')
  }

  return (
    <>
      <div className="border-b border-white-10 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-lg font-semibold text-white">Manage</h1>
        </div>
      </div>
      <Subnav items={SUBNAV_ITEMS} />
      {children}
    </>
  )
}
