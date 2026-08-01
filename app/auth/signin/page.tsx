import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SignInClient } from './SignInClient'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  // Only redirect if the session has a resolved member id — avoids loop
  // when session exists but member row creation is still pending
  if (session?.user?.id) redirect('/members')

  return <SignInClient />
}
