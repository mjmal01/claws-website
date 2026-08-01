import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SubteamCard } from './SubteamCard'

const meta = {
  title: 'Public/SubteamCard',
  component: SubteamCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SubteamCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: '🤖',
    name: 'AI',
    description: 'Machine learning and autonomy for planetary rovers and mission systems.',
    memberCount: 12,
    href: '/about/subteams',
  },
}

export const NoMemberCount: Story = {
  args: {
    icon: '🛰️',
    name: 'Infrastructure',
    description: 'Communications, power systems, and the backbone that keeps every mission running.',
    href: '/about/subteams',
  },
}
