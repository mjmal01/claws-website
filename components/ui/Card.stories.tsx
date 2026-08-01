import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './Card'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-white font-semibold mb-2">MEISSA</h3>
        <p className="text-white-70 text-sm">Multi-agent Exploration for In-Situ Science and Autonomy.</p>
      </div>
    ),
  },
}

export const Hoverable: Story = {
  args: {
    hover: true,
    children: (
      <div className="p-6">
        <h3 className="text-white font-semibold mb-2">AR HUD</h3>
        <p className="text-white-70 text-sm">Augmented reality heads-up display for astronaut EVA support.</p>
      </div>
    ),
  },
}
