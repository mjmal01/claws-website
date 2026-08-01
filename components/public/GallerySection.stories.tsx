import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { GallerySection } from './GallerySection'

const meta = {
  title: 'Public/GallerySection',
  component: GallerySection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof GallerySection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
