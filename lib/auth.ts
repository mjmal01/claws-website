import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SignJWT } from 'jose'
import { createServerSupabaseClient, createAdminSupabaseClient } from './supabase'
import type { MemberRole } from './supabase'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string | null
      role: MemberRole
      subteam: string | null
    }
    supabaseAccessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: MemberRole
    subteam: string | null
    supabaseAccessToken: string
  }
}

// Mints a short-lived Supabase-compatible access token from the NextAuth
// session so RLS's auth.uid() resolves for the browser client (realtime +
// storage uploads). We don't use Supabase Auth at all — this signs against
// the project's own JWT secret so Postgres accepts it as if Supabase Auth
// had issued it.
async function mintSupabaseAccessToken(memberId: string, email: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!)
  return new SignJWT({ role: 'authenticated', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(memberId)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret)
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? ''
      if (!email.endsWith('@umich.edu')) {
        return '/auth/error?error=not-umich'
      }
      return true
    },

    async jwt({ token, user, trigger }) {
      if (user?.email || trigger === 'update') {
        const email = user?.email ?? token.email ?? ''
        const name  = user?.name  ?? token.name  ?? email.split('@')[0]
        const supabase = await createServerSupabaseClient()

        let { data: member } = await supabase
          .from('members')
          .select('id, role, subteam')
          .eq('email', email)
          .single()

        // First login — create the member row using service role (bypasses RLS INSERT restriction)
        if (!member && email.endsWith('@umich.edu')) {
          const admin = createAdminSupabaseClient()
          const { data: newMember } = await admin
            .from('members')
            .insert({ email, name, role: 'member', active: true })
            .select('id, role, subteam')
            .single()
          member = newMember
        }

        if (member) {
          const row = member as { id: string; role: MemberRole; subteam: string | null }
          token.id      = row.id
          token.role    = row.role
          token.subteam = row.subteam
        }
      }
      // Re-minted on every session read (cheap, no I/O) so the 1h Supabase
      // token never goes stale while the longer-lived NextAuth session cookie
      // is still valid.
      if (token.id) {
        token.supabaseAccessToken = await mintSupabaseAccessToken(token.id, token.email ?? '')
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.subteam = token.subteam
      session.supabaseAccessToken = token.supabaseAccessToken
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    error:  '/auth/error',
  },

  session: {
    strategy: 'jwt',
  },
}

export function isSubteamLead(
  userId: string,
  subteamLeadId: string | null
): boolean {
  return subteamLeadId === userId
}
