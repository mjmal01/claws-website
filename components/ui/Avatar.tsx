import Image from 'next/image'

interface AvatarProps {
  src: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: { px: 24, cls: 'w-6 h-6 text-xs' },
  sm: { px: 32, cls: 'w-8 h-8 text-xs' },
  md: { px: 40, cls: 'w-10 h-10 text-sm' },
  lg: { px: 56, cls: 'w-14 h-14 text-base' },
  xl: { px: 80, cls: 'w-20 h-20 text-xl' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const { px, cls } = sizes[size]

  if (src) {
    return (
      <div className={[cls, 'relative rounded-full overflow-hidden flex-shrink-0', className].join(' ')}>
        <Image src={src} alt={name} width={px} height={px} className="object-cover w-full h-full" />
      </div>
    )
  }

  return (
    <div
      className={[cls, 'rounded-full bg-nebula-muted border border-nebula/20 flex items-center justify-center font-semibold text-nebula-light flex-shrink-0', className].join(' ')}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
