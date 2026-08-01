import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './Badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'maize', 'nebula', 'success', 'warning', 'danger', 'muted'] },
  },
  // Badge's fill/text colors (esp. `default`) are tuned for a dark page
  // background. Storybook's own `backgrounds` parameter only paints the
  // storybook canvas iframe, not design-sync's independently-compiled
  // preview page, so without this `default` renders invisible and the
  // tinted variants wash out against the preview's default white (found
  // via design-sync compare).
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full flex items-center justify-center bg-space p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { variant: 'default', children: 'AI' } }
export const Maize: Story = { args: { variant: 'maize', children: 'Leadership' } }
export const Nebula: Story = { args: { variant: 'nebula', children: 'Infrastructure' } }
export const Success: Story = { args: { variant: 'success', children: 'Active' } }
export const Warning: Story = { args: { variant: 'warning', children: 'At Risk' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Review' } }
export const Muted: Story = { args: { variant: 'muted', children: 'Inactive' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="maize">Maize</Badge>
      <Badge variant="nebula">Nebula</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  ),
}
