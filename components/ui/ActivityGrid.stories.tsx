import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ActivityGrid } from './ActivityGrid'

// Deterministic synthetic data, keyed off today so the grid always has
// something recent to render regardless of capture date.
function makeData(seed: number) {
  const data: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = 0; i < 140; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const count = (i * seed) % 5 === 0 ? 0 : ((i * seed) % 4)
    data.push({ date: d.toISOString().split('T')[0], count })
  }
  return data
}

const meta = {
  title: 'UI/ActivityGrid',
  component: ActivityGrid,
  parameters: { layout: 'padded' },
  // ActivityGrid's empty/low cells use low-opacity light fills meant to sit
  // on a dark page background. Storybook's own `backgrounds` parameter only
  // paints the storybook canvas iframe, not design-sync's independently-
  // compiled preview page, so without this those cells wash out to
  // invisible against the preview's default white (found via design-sync
  // compare).
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-space p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActivityGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { data: makeData(7), weeks: 20 },
}

export const Sparse: Story = {
  args: { data: makeData(3).slice(0, 10), weeks: 20 },
}
