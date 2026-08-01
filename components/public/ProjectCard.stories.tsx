import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProjectCard } from './ProjectCard'

const meta = {
  title: 'Public/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'padded' },
  argTypes: {
    status: { control: 'select', options: ['active', 'completed', 'upcoming'] },
  },
} satisfies Meta<typeof ProjectCard>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: {
    title: 'MEISSA',
    subtitle: 'Multi-agent Exploration',
    description: 'Multi-agent Exploration for In-Situ Science and Autonomy — coordinating autonomous rovers for planetary exploration.',
    tags: ['AI', 'Robotics', 'Autonomy'],
    status: 'active',
    href: '/about/projects',
  },
}

export const Completed: Story = {
  args: {
    title: 'AR HUD',
    subtitle: 'Augmented Reality Heads-Up Display',
    description: 'An augmented reality heads-up display for astronaut EVA support, built for the NASA SUITS challenge.',
    tags: ['AR', 'Hardware', 'UX'],
    status: 'completed',
    href: '/about/projects',
  },
}

export const Upcoming: Story = {
  args: {
    title: 'Mission Control',
    subtitle: 'Ground Station Interface',
    description: 'A real-time mission control dashboard for monitoring rover telemetry and mission status.',
    tags: ['Infrastructure', 'UX'],
    status: 'upcoming',
    href: '/about/projects',
  },
}
