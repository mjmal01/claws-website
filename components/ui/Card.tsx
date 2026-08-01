import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-surface rounded-2xl shadow-card',
        hover && 'hover:shadow-card-hover hover:bg-surface-raised transition-all duration-200 cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
