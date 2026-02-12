'use client'

import { Star } from 'lucide-react'
import { ImportantDate } from '@/lib/types'

interface DateCardProps extends ImportantDate {}

export function DateCard({
  date,
  hijriDate,
  event,
  description,
  isHighlight = false,
}: DateCardProps) {
  const dateParts = date.split(' ')
  const dayNumber = dateParts[0]
  const monthPart = dateParts.slice(1).join(' ')

  return (
    <div
      className={`relative p-5 rounded-xl border transition-all duration-300 ${
        isHighlight
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-400/40'
          : 'bg-slate-800/30 border-amber-500/20 hover:border-amber-500/40'
      }`}
    >
      {isHighlight && (
        <div className="absolute -top-2 -right-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[60px]">
          <p className="text-2xl font-bold text-amber-300">{dayNumber}</p>
          <p className="text-xs text-slate-400">{monthPart}</p>
        </div>
        <div className="flex-1 border-l border-amber-500/20 pl-4">
          <p className="font-semibold text-white">{event}</p>
          <p className="text-xs text-amber-400/70 mt-0.5">{hijriDate}</p>
          {description && (
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
