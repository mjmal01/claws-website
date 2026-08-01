import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortalNav } from './PortalNav'
import type { Member, Subteam } from '@/lib/supabase'

const member: Member = {
  id: '9f17ed55-d3d4-4520-adee-925e4b843e34',
  email: 'mjmal@umich.edu',
  name: 'Molly Maloney',
  role: 'member',
  subteam: 'ai',
  active: true,
  joined: '2026-03-24',
  avatar_url: null,
  bio: null,
  points: 120,
  streak: 3,
  status: 'active',
  phone: null,
}

const leadershipMember: Member = { ...member, role: 'leadership' }

const subteam: Subteam = {
  slug: 'ai',
  name: 'AI',
  description: null,
  lead_id: null,
  slack_channel: null,
}

const meta = {
  title: 'Layout/PortalNav',
  component: PortalNav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PortalNav>

export default meta
type Story = StoryObj<typeof meta>

export const MemberView: Story = {
  args: { member, subteamData: subteam, unreadCount: 0 },
  parameters: { nextjs: { navigation: { pathname: '/members' } } },
}

export const WithUnread: Story = {
  args: { member, subteamData: subteam, unreadCount: 3 },
  parameters: { nextjs: { navigation: { pathname: '/members' } } },
}

export const LeadershipWithManage: Story = {
  args: { member: leadershipMember, subteamData: subteam, unreadCount: 0 },
  parameters: { nextjs: { navigation: { pathname: '/members/manage' } } },
}
