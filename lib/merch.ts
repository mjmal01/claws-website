import type { MerchItem } from './supabase'

export type MerchItemState = 'locked' | 'open' | 'closed' | 'rolling'

export interface MerchItemWithState extends MerchItem {
  state: MerchItemState
  opensIn: number | null      // ms until opens_at, if locked
  closesIn: number | null     // ms until closes_at, if open
  dropsLabel: string | null   // human-readable drop date, if locked
}

export function getMerchItemState(item: MerchItem, now: Date = new Date()): MerchItemState {
  const opensAt = new Date(item.opens_at)

  if (now < opensAt) return 'locked'

  if (item.order_type === 'rolling') return 'rolling'

  if (item.closes_at) {
    const closesAt = new Date(item.closes_at)
    if (now > closesAt) return 'closed'
  }

  return 'open'
}

export function enrichMerchItem(item: MerchItem, now: Date = new Date()): MerchItemWithState {
  const state = getMerchItemState(item, now)
  const opensAt = new Date(item.opens_at)

  return {
    ...item,
    state,
    opensIn: state === 'locked' ? opensAt.getTime() - now.getTime() : null,
    closesIn: state === 'open' && item.closes_at
      ? new Date(item.closes_at).getTime() - now.getTime()
      : null,
    dropsLabel: state === 'locked'
      ? formatDropDate(opensAt)
      : null,
  }
}

export function enrichMerchItems(items: MerchItem[], now: Date = new Date()): MerchItemWithState[] {
  return items.map((item) => enrichMerchItem(item, now))
}

function formatDropDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function groupByLine(items: MerchItemWithState[]): {
  flight: MerchItemWithState[]
  collectibles: MerchItemWithState[]
  sweat: MerchItemWithState[]
} {
  return {
    flight:      items.filter((i) => i.line === 'flight'),
    collectibles: items.filter((i) => i.line === 'collectibles'),
    sweat:       items.filter((i) => i.line === 'sweat'),
  }
}

export function isLineVisible(line: 'flight' | 'collectibles' | 'sweat', items: MerchItemWithState[]): boolean {
  return items.some((i) => i.line === line && i.state !== 'locked')
}

export function getNextDrop(items: MerchItemWithState[], _now: Date = new Date()): Date | null {
  const locked = items
    .filter((i) => i.state === 'locked')
    .map((i) => new Date(i.opens_at))
    .sort((a, b) => a.getTime() - b.getTime())
  return locked[0] ?? null
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Closed'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}
