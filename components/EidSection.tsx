'use client'

import { Gift, CalendarDays, MapPin } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function EidSection() {
  const { t } = useLanguage()

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 start-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-start flex-1">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-4">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-200 text-sm font-medium">
                    {t.eid.badge}
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  {t.eid.title}
                </h2>

                <p className="font-arabic text-2xl text-amber-300/80 mb-4">
                  عيد مبارك
                </p>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {t.eid.text}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CalendarDays className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong className="text-white">{t.eid.dateLabel}</strong> {t.eid.dateValue}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong className="text-white">{t.eid.prayerLabel}</strong> {t.eid.prayerValue}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-amber-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                  <div className="text-center">
                    <p className="text-6xl mb-2">🎉</p>
                    <p className="font-display text-lg font-semibold text-amber-200">
                      {t.eid.mubarak}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
