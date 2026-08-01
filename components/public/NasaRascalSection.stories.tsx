import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NasaRascalSection } from './NasaRascalSection'

const meta = {
  title: 'Public/NasaRascalSection',
  component: NasaRascalSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NasaRascalSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
