import { type HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'maize' | 'nebula' | 'success' | 'warning' | 'danger' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white-10 text-white-70',
  maize:   'bg-maize-muted text-maize border border-maize/20',
  nebula:  'bg-nebula-muted text-nebula-light border border-nebula/20',
  success: 'bg-status-active/15 text-status-active border border-status-active/20',
  warning: 'bg-status-at_risk/15 text-status-at_risk border border-status-at_risk/20',
  danger:  'bg-status-review/15 text-status-review border border-status-review/20',
  muted:   'bg-surface-muted/30 text-white-30',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
