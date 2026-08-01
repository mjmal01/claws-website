import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Navbar } from './Navbar'

const meta = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { nextjs: { navigation: { pathname: '/' } } },
}

export const AboutActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/about' } } },
}
