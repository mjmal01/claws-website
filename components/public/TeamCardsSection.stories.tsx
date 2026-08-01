import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TeamCardsSection } from './TeamCardsSection'

const meta = {
  title: 'Public/TeamCardsSection',
  component: TeamCardsSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TeamCardsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
