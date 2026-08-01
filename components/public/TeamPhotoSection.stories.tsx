import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TeamPhotoSection } from './TeamPhotoSection'

const meta = {
  title: 'Public/TeamPhotoSection',
  component: TeamPhotoSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TeamPhotoSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
