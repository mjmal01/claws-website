import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusIndicator } from './StatusIndicator'

const meta = {
  title: 'UI/StatusIndicator',
  component: StatusIndicator,
  parameters: { layout: 'centered' },
  argTypes: {
    status: { control: 'select', options: ['active', 'at_risk', 'review', 'inactive'] },
  },
  // StatusIndicator has no background of its own — production always nests
  // it inside a dark-bg ancestor. Storybook's own `backgrounds` parameter
  // only paints the storybook canvas iframe, not design-sync's
  // independently-compiled preview page, so without this the preview
  // renders on white (found via design-sync compare — legible since the
  // status text is colored not white, but still the wrong page backdrop).
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-space flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = { args: { status: 'active' } }
export const AtRisk: Story = { args: { status: 'at_risk' } }
export const Review: Story = { args: { status: 'review' } }
export const Inactive: Story = { args: { status: 'inactive' } }
export const NoLabel: Story = { args: { status: 'active', showLabel: false } }

export const AllStatuses: Story = {
  args: { status: 'active' },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatusIndicator status="active" />
      <StatusIndicator status="at_risk" />
      <StatusIndicator status="review" />
      <StatusIndicator status="inactive" />
    </div>
  ),
}
