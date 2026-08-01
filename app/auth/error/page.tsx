import Link from 'next/link'

interface Props {
  searchParams: { error?: string }
}

export default function AuthErrorPage({ searchParams }: Props) {
  const isNotUmich = searchParams.error === 'not-umich'

  return (
    <div className="min-h-screen bg-space flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-4xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-white mb-3">
          {isNotUmich ? 'Access Restricted' : 'Authentication Error'}
        </h1>
        <p className="text-white-50 mb-6">
          {isNotUmich
            ? 'The CLAWS portal is only available to @umich.edu accounts. Please sign in with your University of Michigan Google account.'
            : 'Something went wrong during sign-in. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-xl bg-maize text-space font-semibold text-sm hover:bg-maize-light transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/join"
            className="px-6 py-3 rounded-xl bg-surface border border-surface-border text-white-70 text-sm hover:text-white transition-colors"
          >
            Apply to Join CLAWS
          </Link>
        </div>
      </div>
    </div>
  )
}
