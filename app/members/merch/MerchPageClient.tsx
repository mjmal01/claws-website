'use client'

import { useState, useEffect, useTransition } from 'react'
import type { MerchOrder, FlightTagClaim } from '@/lib/supabase'
import type { MerchItemWithState } from '@/lib/merch'
import { groupByLine, getNextDrop, formatCountdown, enrichMerchItems } from '@/lib/merch'
import { claimFlightTag } from '@/app/actions/merch'

// ─── Milestone dates ──────────────────────────────────────────────────────────
const MILESTONES = [
  { date: 'Mar 18', label: 'Flight Line', ts: new Date('2026-03-18T00:00:00') },
  { date: 'Mar 25', label: 'Jacket Close', ts: new Date('2026-03-25T23:59:59') },
  { date: 'Apr 1',  label: 'Collectibles', ts: new Date('2026-04-01T00:00:00') },
  { date: 'Apr 8',  label: 'Items Close',  ts: new Date('2026-04-08T23:59:59') },
  { date: 'Apr 18', label: 'Sweat Line',   ts: new Date('2026-04-18T00:00:00') },
  { date: 'Apr 25', label: 'Final Close',  ts: new Date('2026-04-25T23:59:59') },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  enrichedItems: MerchItemWithState[]
  orders: MerchOrder[]
  flightTagClaim: FlightTagClaim | null
  memberEmail: string
  itemMap: Record<string, string>
  serverNow: string
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MerchPageClient({
  enrichedItems,
  orders,
  flightTagClaim: initialClaim,
  memberEmail,
  itemMap,
  serverNow,
}: Props) {
  const [now, setNow] = useState<Date>(new Date(serverNow))
  const [claimed, setClaimed] = useState<boolean>(!!initialClaim)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Ticker — update every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Re-enrich items with live `now`
  const liveItems = enrichMerchItems(enrichedItems, now) as MerchItemWithState[]
  const lines = groupByLine(liveItems)
  const nextDrop = getNextDrop(liveItems, now)

  // Timeline active milestone
  const activeMilestoneIdx = MILESTONES.findLastIndex((m) => now >= m.ts)

  function handleClaimFlightTag() {
    setClaimError(null)
    startTransition(async () => {
      const result = await claimFlightTag()
      if (result.ok) {
        setClaimed(true)
      } else {
        setClaimError(result.error ?? 'Something went wrong')
      }
    })
  }

  return (
    <div className="space-y-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-display-sm text-white tracking-tight">CLAWS Spring 2026 Collection</h1>
        <p className="mt-1 text-white/50 text-sm">Michigan&apos;s NASA challenge team</p>
      </div>

      {/* ── Timeline Bar ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-6">
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-5">Collection Timeline</p>
        <div className="relative">
          {/* Track */}
          <div className="absolute top-3 left-0 right-0 h-px bg-white/10" />
          {/* Progress */}
          <div
            className="absolute top-3 left-0 h-px bg-maize transition-all"
            style={{
              width: activeMilestoneIdx >= 0
                ? `${((activeMilestoneIdx + 1) / MILESTONES.length) * 100}%`
                : '0%',
            }}
          />
          <div className="relative flex justify-between">
            {MILESTONES.map((m, i) => {
              const isPast   = now >= m.ts
              const isActive = i === activeMilestoneIdx
              return (
                <div key={m.date} className="flex flex-col items-center gap-2" style={{ width: `${100 / MILESTONES.length}%` }}>
                  <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    isActive ? 'bg-maize border-maize shadow-glow-maize' :
                    isPast   ? 'bg-maize/60 border-maize/60' :
                               'bg-space-950 border-white/20'
                  }`} />
                  <p className={`text-xs font-semibold ${isActive ? 'text-maize' : isPast ? 'text-white/50' : 'text-white/25'}`}>
                    {m.date}
                  </p>
                  <p className={`text-[10px] text-center leading-tight ${isActive ? 'text-white/70' : 'text-white/25'}`}>
                    {m.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Next Drop Countdown ─────────────────────────────────────────────── */}
      {nextDrop && (
        <div className="rounded-2xl border border-maize/20 bg-maize-muted p-5 flex items-center gap-4">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="text-xs text-maize/70 uppercase tracking-widest font-semibold">Next Drop</p>
            <p className="text-2xl font-bold text-maize mt-0.5">
              {formatCountdown(nextDrop.getTime() - now.getTime())}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {nextDrop.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* ── FLIGHT LINE ─────────────────────────────────────────────────────── */}
      <MerchSection
        emoji="✈️"
        title="FLIGHT LINE"
        badge={lines.flight.some((i) => i.state !== 'locked') ? 'Live Now' : 'Drops Mar 18'}
        badgeVariant={lines.flight.some((i) => i.state !== 'locked') ? 'active' : 'locked'}
      >
        {lines.flight.length === 0 ? (
          <LockedTeaser label="Drops Mar 18" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lines.flight.map((item) => {
              if (item.slug === 'flight-tag') {
                return (
                  <ItemCard key={item.id} item={item}>
                    {item.state === 'locked' ? (
                      <LockedPill dropsLabel={item.dropsLabel} />
                    ) : claimed ? (
                      <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                        <span>✅</span>
                        <span>Claimed — pick up at next meeting</span>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={handleClaimFlightTag}
                          disabled={isPending}
                          className="px-5 py-2.5 rounded-xl bg-maize text-black text-sm font-semibold hover:bg-maize-light transition-colors disabled:opacity-50"
                        >
                          {isPending ? 'Claiming…' : 'Claim Flight Tag →'}
                        </button>
                        {claimError && <p className="text-red-400 text-xs mt-2">{claimError}</p>}
                      </div>
                    )}
                  </ItemCard>
                )
              }

              if (item.slug === 'flight-jacket') {
                return (
                  <ItemCard key={item.id} item={item}>
                    {item.state === 'locked' ? (
                      <LockedPill dropsLabel={item.dropsLabel} />
                    ) : item.state === 'closed' ? (
                      <p className="text-sm text-white/40">Orders closed</p>
                    ) : (
                      <FlightJacketOrderForm item={item} memberEmail={memberEmail} now={now} />
                    )}
                  </ItemCard>
                )
              }

              return (
                <ItemCard key={item.id} item={item}>
                  <GenericItemAction item={item} memberEmail={memberEmail} now={now} />
                </ItemCard>
              )
            })}
          </div>
        )}
      </MerchSection>

      {/* ── COLLECTIBLES LINE ───────────────────────────────────────────────── */}
      <MerchSection
        emoji="🏅"
        title="COLLECTIBLES LINE"
        badge={lines.collectibles.some((i) => i.state !== 'locked') ? 'Live Now' : 'Drops Apr 1'}
        badgeVariant={lines.collectibles.some((i) => i.state !== 'locked') ? 'active' : 'locked'}
      >
        {lines.collectibles.every((i) => i.state === 'locked') || lines.collectibles.length === 0 ? (
          <LockedTeaser label="Drops Apr 1" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lines.collectibles.map((item) => (
              <ItemCard key={item.id} item={item}>
                <GenericItemAction item={item} memberEmail={memberEmail} now={now} />
              </ItemCard>
            ))}
          </div>
        )}
      </MerchSection>

      {/* ── SWEAT LINE ──────────────────────────────────────────────────────── */}
      <MerchSection
        emoji="👕"
        title="SWEAT LINE — End of Year Drop"
        badge={lines.sweat.some((i) => i.state !== 'locked') ? 'Live Now' : 'Drops Apr 18'}
        badgeVariant={lines.sweat.some((i) => i.state !== 'locked') ? 'active' : 'locked'}
      >
        {lines.sweat.every((i) => i.state === 'locked') || lines.sweat.length === 0 ? (
          <LockedTeaser label="Drops Apr 18" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lines.sweat.map((item) => (
              <ItemCard key={item.id} item={item}>
                <GenericItemAction item={item} memberEmail={memberEmail} now={now} sizes />
              </ItemCard>
            ))}
          </div>
        )}
      </MerchSection>

      {/* ── Coming Soon teasers ─────────────────────────────────────────────── */}
      {(lines.collectibles.every((i) => i.state === 'locked') ||
        lines.sweat.every((i) => i.state === 'locked')) && (
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Coming Soon</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lines.collectibles.every((i) => i.state === 'locked') && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex items-center gap-4">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-white/50 text-sm">Collectibles</p>
                  <p className="text-xs text-white/30 mt-0.5">Drops Apr 1</p>
                </div>
              </div>
            )}
            {lines.sweat.every((i) => i.state === 'locked') && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex items-center gap-4">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-white/50 text-sm">Sweat Line</p>
                  <p className="text-xs text-white/30 mt-0.5">Drops Apr 18</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Your Orders ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Your Orders</p>
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
            <span className="text-2xl mb-2 block">🛍️</span>
            <p className="text-sm text-white/30">No orders yet</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-card overflow-hidden">
            <div className="divide-y divide-white/5">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {itemMap[order.item_id] ?? 'Unknown item'}
                    </p>
                    {order.size && (
                      <p className="text-xs text-white/40 mt-0.5">Size: {order.size}</p>
                    )}
                  </div>
                  <p className="text-xs text-white/40 flex-shrink-0">
                    {new Date(order.submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                    order.status === 'fulfilled'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20'
                  }`}>
                    {order.status === 'fulfilled' ? 'Fulfilled' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MerchSection({
  emoji,
  title,
  badge,
  badgeVariant,
  children,
}: {
  emoji: string
  title: string
  badge: string
  badgeVariant: 'active' | 'locked'
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
          badgeVariant === 'active'
            ? 'bg-green-500/15 text-green-400 border-green-500/20'
            : 'bg-white/5 text-white/40 border-white/10'
        }`}>
          {badge}
        </span>
      </div>
      {children}
    </div>
  )
}

function ItemCard({
  item,
  children,
}: {
  item: MerchItemWithState
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-5 space-y-3">
      <div>
        <h3 className="font-semibold text-white text-sm">{item.name}</h3>
        {item.order_type === 'rolling' && (
          <p className="text-xs text-white/40 mt-0.5">Order anytime — processed weekly</p>
        )}
        {item.state === 'open' && item.closes_at && item.closesIn && (
          <p className="text-xs text-yellow-400 mt-0.5">
            Closes in {formatCountdown(item.closesIn)}
          </p>
        )}
        {item.state === 'open' && item.order_type === 'free' && (
          <p className="text-xs text-maize mt-0.5">FREE</p>
        )}
      </div>
      {children}
    </div>
  )
}

function LockedTeaser({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 flex flex-col items-center gap-3 text-center">
      <span className="text-3xl">🔒</span>
      <p className="text-sm text-white/40">{label}</p>
    </div>
  )
}

function LockedPill({ dropsLabel }: { dropsLabel: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/40 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
      🔒 Drops {dropsLabel ?? 'soon'}
    </span>
  )
}

function FlightJacketOrderForm({
  item,
  memberEmail,
  now,
}: {
  item: MerchItemWithState
  memberEmail: string
  now: Date
}) {
  const [size, setSize] = useState<string>('')

  const formUrl = item.google_form_url
    ? `${item.google_form_url}${item.google_form_url.includes('?') ? '&' : '?'}entry.email=${encodeURIComponent(memberEmail)}${size ? `&entry.size=${encodeURIComponent(size)}` : ''}`
    : '#'

  void now

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              size === s
                ? 'bg-maize text-black border-maize'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          size
            ? 'bg-maize text-black hover:bg-maize-light'
            : 'bg-white/10 text-white/40 cursor-not-allowed pointer-events-none'
        }`}
      >
        Order →
      </a>
    </div>
  )
}

function GenericItemAction({
  item,
  memberEmail,
  now,
  sizes = false,
}: {
  item: MerchItemWithState
  memberEmail: string
  now: Date
  sizes?: boolean
}) {
  const [size, setSize] = useState<string>('')

  void now

  if (item.state === 'locked') return <LockedPill dropsLabel={item.dropsLabel} />
  if (item.state === 'closed') return <p className="text-sm text-white/40">Orders closed</p>
  if (item.state === 'rolling' || item.state === 'open') {
    const formUrl = item.google_form_url
      ? `${item.google_form_url}${item.google_form_url.includes('?') ? '&' : '?'}entry.email=${encodeURIComponent(memberEmail)}${size ? `&entry.size=${encodeURIComponent(size)}` : ''}`
      : '#'

    return (
      <div className="space-y-3">
        {sizes && (
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  size === s
                    ? 'bg-maize text-black border-maize'
                    : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {!item.google_form_url ? (
          <p className="text-xs text-white/30 italic">No order form configured</p>
        ) : (
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              sizes && !size
                ? 'bg-white/10 text-white/40 cursor-not-allowed pointer-events-none'
                : 'bg-maize text-black hover:bg-maize-light'
            }`}
          >
            Order →
          </a>
        )}
      </div>
    )
  }
  return null
}
