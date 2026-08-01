import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Subnav } from './Subnav'

const ABOUT_ITEMS = [
  { label: 'Overview', href: '/about' },
  { label: 'Projects', href: '/about/projects' },
  { label: 'Subteams', href: '/about/subteams' },
  { label: 'Supporters', href: '/about/supporters' },
  { label: 'FAQ', href: '/about/faq' },
]

const meta = {
  title: 'Layout/Subnav',
  component: Subnav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Subnav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { items: ABOUT_ITEMS },
  parameters: { nextjs: { navigation: { pathname: '/about' } } },
}

export const ProjectsActive: Story = {
  args: { items: ABOUT_ITEMS },
  parameters: { nextjs: { navigation: { pathname: '/about/projects' } } },
}
