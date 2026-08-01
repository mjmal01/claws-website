import type { MemberStatus } from '@/lib/supabase'

interface StatusIndicatorProps {
  status: MemberStatus
  showLabel?: boolean
  className?: string
}

const config: Record<MemberStatus, { dot: string; label: string; text: string }> = {
  active:   { dot: 'bg-status-active',   label: 'Active',   text: 'text-status-active' },
  at_risk:  { dot: 'bg-status-at_risk',  label: 'At Risk',  text: 'text-status-at_risk' },
  review:   { dot: 'bg-status-review',   label: 'Review',   text: 'text-status-review' },
  inactive: { dot: 'bg-status-inactive', label: 'Inactive', text: 'text-status-inactive' },
}

export function StatusIndicator({ status, showLabel = true, className = '' }: StatusIndicatorProps) {
  const { dot, label, text } = config[status]
  return (
    <span className={['inline-flex items-center gap-1.5', className].join(' ')}>
      <span className={['w-2 h-2 rounded-full', dot].join(' ')} />
      {showLabel && <span className={['text-xs font-medium', text].join(' ')}>{label}</span>}
    </span>
  )
}
