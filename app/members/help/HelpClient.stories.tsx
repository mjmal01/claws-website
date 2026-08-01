import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import HelpClient from './HelpClient'
import type { SubteamSlug } from '@/lib/supabase'

const subteamNames: Record<SubteamSlug, string> = {
  ar: 'AR', ai: 'AI', infrastructure: 'Infrastructure', ux: 'UX', hardware: 'Hardware',
  research: 'Research', outreach: 'Outreach', content: 'Content', social: 'Social',
}

const meta = {
  title: 'Members/HelpClient',
  component: HelpClient,
  parameters: { layout: 'fullscreen' },
  // HelpClient has no background of its own — production always nests it
  // inside app/members/layout.tsx's `bg-space` wrapper. Storybook's own
  // `backgrounds` parameter only paints the storybook canvas iframe, not
  // design-sync's independently-compiled preview page, so without this the
  // preview renders white-on-white (found via design-sync compare).
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-space">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HelpClient>

export default meta
type Story = StoryObj<typeof meta>

export const Member: Story = {
  args: {
    userRole: 'member',
    userSubteam: 'ai',
    subteamNames,
    isLead: false,
    isLeadership: false,
    isFaculty: false,
  },
}

export const SubteamLead: Story = {
  args: {
    userRole: 'member',
    userSubteam: 'ai',
    subteamNames,
    isLead: true,
    isLeadership: false,
    isFaculty: false,
  },
}

export const Leadership: Story = {
  args: {
    userRole: 'leadership',
    userSubteam: 'ai',
    subteamNames,
    isLead: false,
    isLeadership: true,
    isFaculty: false,
  },
}

export const Faculty: Story = {
  args: {
    userRole: 'faculty',
    userSubteam: null,
    subteamNames,
    isLead: false,
    isLeadership: false,
    isFaculty: true,
  },
}
