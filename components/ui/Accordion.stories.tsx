import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Accordion } from './Accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  // Accordion has no background of its own — production always nests it
  // inside a dark-bg page. Storybook's own `backgrounds` parameter only
  // paints the storybook canvas iframe, not design-sync's independently-
  // compiled preview page, so without this the preview renders white text
  // on white background (found via design-sync compare).
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-space p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { question: 'What is CLAWS?', answer: 'CLAWS (Collaborative Lab for Advancing Work in Space) is a University of Michigan student organization focused on developing innovative technology for NASA space exploration challenges.' },
      { question: 'What subteams can I join?', answer: 'CLAWS has nine subteams: AR, AI, Infrastructure, UX, Hardware, Research, Outreach, Content, and Social.' },
      { question: 'Do I need experience to join?', answer: 'No prior experience is required. We welcome students of all skill levels and backgrounds.' },
    ],
  },
}
