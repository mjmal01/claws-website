import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Countdown } from './Countdown'

function daysFromNow(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

const meta = {
  title: 'UI/Countdown',
  component: Countdown,
  parameters: { layout: 'centered' },
  // Countdown has no background of its own — its text-white-50 label and
  // maize numerals are designed to sit on a dark surface, which production
  // always provides (a parent card/section). Storybook's own `backgrounds`
  // parameter only paints the storybook canvas iframe, not design-sync's
  // independently-compiled preview page, so without this the preview
  // renders the label at ~50% white on white (invisible) and no container
  // (found via design-sync compare) — same class of fix as HelpClient.
  decorators: [
    (Story) => (
      <div className="bg-space-950 rounded-2xl p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Countdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { targetDate: daysFromNow(12), label: 'NASA SUITS 2026' },
}

export const NoLabel: Story = {
  args: { targetDate: daysFromNow(3) },
}
