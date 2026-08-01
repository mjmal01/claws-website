import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeroRolodexSection } from './HeroRolodexSection'

const meta = {
  title: 'Public/HeroRolodexSection',
  component: HeroRolodexSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroRolodexSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
