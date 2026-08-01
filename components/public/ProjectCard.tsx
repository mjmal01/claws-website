import Link from 'next/link'

interface ProjectCardProps {
  title: string
  subtitle: string
  description: string
  tags: string[]
  status: 'active' | 'completed' | 'upcoming'
  href?: string
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-status-active/15 text-status-active border border-status-active/30',
    dot: 'bg-status-active',
  },
  completed: {
    label: 'Completed',
    className: 'bg-white-10 text-white-50 border border-surface-border',
    dot: 'bg-white-50',
  },
  upcoming: {
    label: 'Upcoming',
    className: 'bg-nebula-muted text-nebula border border-nebula/30',
    dot: 'bg-nebula',
  },
}

export function ProjectCard({ title, subtitle, description, tags, status, href }: ProjectCardProps) {
  const cfg = statusConfig[status]

  const content = (
    <div className="group bg-surface rounded-2xl border border-surface-border p-6 shadow-card hover:shadow-card-hover hover:border-surface-muted transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </span>
      </div>
      <h3 className="text-white-90 font-semibold text-lg mb-1 group-hover:text-white transition-colors duration-200">
        {title}
      </h3>
      <p className="text-maize text-sm font-medium mb-3">{subtitle}</p>
      <p className="text-white-50 text-sm leading-relaxed flex-1">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-surface-raised rounded-lg text-xs text-white-50 border border-surface-border"
          >
            {tag}
          </span>
        ))}
      </div>
      {href && (
        <div className="mt-4 pt-4 border-t border-surface-border flex items-center gap-1 text-nebula text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>View project</span>
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
