import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // All /members routes require a valid @umich.edu session
    if (pathname.startsWith('/members')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/members')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/members/:path*'],
}
