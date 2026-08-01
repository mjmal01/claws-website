interface DayData {
  date: string // YYYY-MM-DD
  count: number
}

interface ActivityGridProps {
  data: DayData[]
  weeks?: number
  className?: string
}

function getColor(count: number): string {
  if (count === 0) return 'bg-surface-border/50'
  if (count === 1) return 'bg-nebula/40'
  if (count === 2) return 'bg-nebula/70'
  return 'bg-nebula'
}

export function ActivityGrid({ data, weeks = 20, className = '' }: ActivityGridProps) {
  const dateMap = new Map(data.map((d) => [d.date, d.count]))

  const days: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push({ date: key, count: dateMap.get(key) ?? 0 })
  }

  const columns: { date: string; count: number }[][] = []
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7))
  }

  return (
    <div className={['flex gap-1', className].join(' ')}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} activities`}
              className={['w-3 h-3 rounded-sm transition-colors', getColor(day.count)].join(' ')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
