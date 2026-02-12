'use client'

import { CalendarDays } from 'lucide-react'
import { DateCard } from './ui'
import { IMPORTANT_DATES } from '@/lib/utils'

export function ImportantDatesSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">
              Mark Your Calendar
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Important Dates
          </h2>
          <p className="text-slate-400 font-body">
            Ramadan & Eid Al-Fitr 2026 Schedule
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {IMPORTANT_DATES.map((item, index) => (
            <DateCard key={index} {...item} />
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          * Dates are based on expected moon sighting and may vary by 1-2 days
        </p>
      </div>
    </section>
  )
}
