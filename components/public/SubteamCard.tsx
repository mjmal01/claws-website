import Link from 'next/link'

interface SubteamCardProps {
  icon: string
  name: string
  description: string
  memberCount?: number
  href?: string
}

export function SubteamCard({ icon, name, description, memberCount, href }: SubteamCardProps) {
  const content = (
    <div className="group relative bg-surface rounded-2xl border border-surface-border p-6 shadow-card hover:shadow-card-hover hover:border-surface-muted transition-all duration-300 h-full flex flex-col">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-white-90 font-semibold text-lg mb-2 group-hover:text-white transition-colors duration-200">
        {name}
      </h3>
      <p className="text-white-50 text-sm leading-relaxed flex-1">{description}</p>
      {memberCount !== undefined && (
        <div className="mt-4 pt-4 border-t border-surface-border">
          <span className="text-maize text-sm font-medium">{memberCount} members</span>
        </div>
      )}
      {href && (
        <div className="mt-3 flex items-center gap-1 text-nebula text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Learn more</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>
  }

  return content
}
