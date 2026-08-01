import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/layout/SessionProvider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'CLAWS — Collaborative Lab for Advancing Work in Space',
    template: '%s | CLAWS',
  },
  description:
    'CLAWS is a University of Michigan student organization building innovative technology for NASA space exploration challenges.',
  keywords: ['CLAWS', 'NASA', 'SUITS', 'RASC-AL', 'University of Michigan', 'space', 'aerospace'],
  openGraph: {
    type: 'website',
    siteName: 'CLAWS',
    title: 'CLAWS — Collaborative Lab for Advancing Work in Space',
    description: 'University of Michigan student org building for NASA SUITS and RASC-AL challenges.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-black text-white antialiased font-sans">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
