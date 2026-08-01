import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  // Ghost/secondary variants use white/near-white text with no opaque fill,
  // tuned for a dark page background. Storybook's own `backgrounds`
  // parameter only paints the storybook canvas iframe, not design-sync's
  // independently-compiled preview page, so without this `ghost` renders
  // invisible against the preview's default white (found via design-sync
  // compare).
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full flex items-center justify-center bg-space p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Claim →' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'View all tasks' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Posting…' },
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Claim →' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
