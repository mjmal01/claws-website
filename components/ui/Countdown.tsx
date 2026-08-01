'use client'

import { useState, useEffect } from 'react'
import { formatCountdown } from '@/lib/merch'

interface CountdownProps {
  targetDate: Date | string
  label?: string
  className?: string
}

export function Countdown({ targetDate, label, className = '' }: CountdownProps) {
  const [ms, setMs] = useState<number>(0)

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => setMs(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className={['text-center', className].join(' ')}>
      {label && <p className="text-white-50 text-xs mb-1 uppercase tracking-wider">{label}</p>}
      <p className="font-mono text-maize font-semibold">{formatCountdown(ms)}</p>
    </div>
  )
}
