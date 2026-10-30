'use client'

import { WifiOff, RotateCw } from 'lucide-react'
import { RamadanTimetableSection } from './RamadanTimetableSection'
import { useLanguage } from '@/lib/i18n'

/**
 * Shown by the service worker when there is no connection. The timetable
 * is static data, so it still works offline - the most useful thing at Sehri time.
 */
export function OfflineContent() {
  const { t } = useLanguage()

  return (
    <>
      <section className="px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-8 text-center">
          <WifiOff className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">{t.offline.title}</h1>
          <p className="text-slate-400 mb-6">{t.offline.text}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold btn-primary"
          >
            <RotateCw className="w-5 h-5" />
            {t.offline.retry}
          </button>
        </div>
      </section>
      <RamadanTimetableSection />
    </>
  )
}
