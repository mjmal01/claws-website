import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AlumniSection } from './AlumniSection'

const meta = {
  title: 'Public/AlumniSection',
  component: AlumniSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AlumniSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
