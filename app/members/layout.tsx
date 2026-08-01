import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMemberById, getMemberNotifications, getSubteamBySlug } from '@/lib/supabase'
import { PortalNav } from '@/components/layout/PortalNav'

export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const [member, notifications] = await Promise.all([
    getMemberById(session.user.id),
    getMemberNotifications(session.user.id),
  ])

  if (!member) {
    redirect('/auth/signin')
  }

  const subteamData = member.subteam ? await getSubteamBySlug(member.subteam) : null
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-space">
      <PortalNav member={member} subteamData={subteamData} unreadCount={unreadCount} />
      <main className="pt-16">{children}</main>
    </div>
  )
}
