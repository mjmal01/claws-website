import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Modal } from './Modal'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// Modal is fixed-position/overlay — always shown open (a closed modal
// renders null, nothing to preview). cardMode: "single" set in
// .design-sync/config.json's overrides for this component.
export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'New Announcement',
    children: (
      <p className="text-white-70 text-sm">
        Write your announcement, attach an image, and post it to the news feed.
      </p>
    ),
  },
}

export const Large: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Order History',
    size: 'lg',
    children: (
      <p className="text-white-70 text-sm">
        Full merch order history — item, size, submitted date, and fulfillment status.
      </p>
    ),
  },
}
