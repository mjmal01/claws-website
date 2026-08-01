import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NasaSuitsSection } from './NasaSuitsSection'

const meta = {
  title: 'Public/NasaSuitsSection',
  component: NasaSuitsSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NasaSuitsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
