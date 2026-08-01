import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  // Avatar's fallback fill/ring colors are tuned for a dark page background.
  // Storybook's own `backgrounds` parameter only paints the storybook canvas
  // iframe, not design-sync's independently-compiled preview page, so
  // without this the preview washes out against the default white (found
  // via design-sync compare).
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full flex items-center justify-center bg-space p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// No src — falls back to initials
export const Initials: Story = {
  args: { src: null, name: 'Molly Maloney', size: 'md' },
}

// Real next/image path — proves @storybook/nextjs-vite's Image mock
// actually resolves local /public images, the exact thing the
// package-shape sync needed a process-shim workaround for.
export const WithImage: Story = {
  args: { src: '/images/gallery/W9fCA582Pw9jY156CiO9EJ37ng.jpg', name: 'Molly Maloney', size: 'md' },
}

export const Sizes: Story = {
  args: { src: null, name: 'Ani A' },
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar src={null} name="Ani A" size="xs" />
      <Avatar src={null} name="Ani A" size="sm" />
      <Avatar src={null} name="Ani A" size="md" />
      <Avatar src={null} name="Ani A" size="lg" />
      <Avatar src={null} name="Ani A" size="xl" />
    </div>
  ),
}
