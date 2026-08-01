import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getMerchItems,
  getMemberMerchOrders,
  getFlightTagClaim,
  getMemberById,
} from '@/lib/supabase'
import { enrichMerchItems } from '@/lib/merch'
import MerchPageClient from './MerchPageClient'

export default async function MerchPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [items, orders, flightTagClaim, member] = await Promise.all([
    getMerchItems(),
    getMemberMerchOrders(session.user.id),
    getFlightTagClaim(session.user.id),
    getMemberById(session.user.id),
  ])

  // Enrich with state relative to server-side now
  const now = new Date()
  const enriched = enrichMerchItems(items, now)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MerchPageClient
        enrichedItems={enriched}
        orders={orders}
        flightTagClaim={flightTagClaim}
        memberEmail={member?.email ?? session.user.email ?? ''}
        itemMap={Object.fromEntries(items.map((i) => [i.id, i.name]))}
        serverNow={now.toISOString()}
      />
    </div>
  )
}
