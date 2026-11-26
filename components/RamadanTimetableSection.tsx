'use client'

import { Clock } from 'lucide-react'
import { RAMADAN_TIMETABLE } from '@/lib/timetable'
import { fromDateKey } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

// 12-hour clock without AM/PM - the column headers say morning / evening
const clock = ([hours, minutes]: readonly [number, number]) =>
  `${hours > 12 ? hours - 12 : hours}:${String(minutes).padStart(2, '0')}`

export function RamadanTimetableSection() {
  const { t, formatDayMonth, formatWeekday } = useLanguage()

  const headers = [
    { label: t.timetable.roza },
    { label: t.timetable.date },
    { label: t.timetable.day },
    { label: t.timetable.sehri, hint: t.timetable.morning },
    { label: t.timetable.azan, hint: t.timetable.morning },
    { label: t.timetable.iftar, hint: t.timetable.evening },
  ]

  return (
    <section id="timetable" className="relative z-10 px-6 py-16 scroll-mt-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">
              {t.timetable.badge}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            {t.timetable.title}
          </h2>
          <p className="text-slate-400 font-body">
            {t.timetable.subtitle}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-3 sm:p-6">
          <table className="w-full text-center text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-amber-500/30">
                {headers.map(({ label, hint }) => (
                  <th key={label} scope="col" className="py-3 px-1 font-semibold text-amber-300 align-bottom">
                    {label}
                    {hint && (
                      <span className="block text-[11px] font-normal text-amber-400/60">{hint}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RAMADAN_TIMETABLE.map((row, index) => {
                const date = fromDateKey(row.date) as Date
                const isFriday = date.getDay() === 5
                return (
                  <tr
                    key={row.date}
                    className={`border-b border-amber-500/10 last:border-0 ${
                      isFriday ? 'bg-emerald-500/10' : index % 2 ? 'bg-slate-800/20' : ''
                    }`}
                  >
                    <td className="py-2 px-1 font-semibold text-amber-300">{index + 1}</td>
                    <td className="py-2 px-1 text-slate-200 whitespace-nowrap">{formatDayMonth(date)}</td>
                    <td className={`py-2 px-1 ${isFriday ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {formatWeekday(date)}
                    </td>
                    <td className="py-2 px-1 font-semibold text-sky-300 tabular-nums" dir="ltr">
                      {clock(row.sehri)}
                    </td>
                    <td className="py-2 px-1 text-slate-200 tabular-nums" dir="ltr">
                      {clock(row.azan)}
                    </td>
                    <td className="py-2 px-1 font-semibold text-amber-200 tabular-nums" dir="ltr">
                      {clock(row.iftar)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" />
            <span>{t.timetable.fridayLegend}</span>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          {t.timetable.note}
        </p>
      </div>
    </section>
  )
}
