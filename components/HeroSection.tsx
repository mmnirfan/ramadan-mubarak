'use client'

import { Clock } from 'lucide-react'
import { CrescentMoon } from './ui'
import { PRAYER_TIMES, PrayerName } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export function HeroSection() {
  const { t, formatTime } = useLanguage()

  return (
    <section className="relative z-10 px-6 pt-16 pb-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CrescentMoon />
        </div>

        <p className="font-arabic text-3xl text-amber-300/80 mb-4">رمضان مبارك</p>

        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="shimmer-text">{t.hero.titleLine1}</span>
          <br />
          <span className="text-white/90">{t.hero.titleLine2}</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
          {t.hero.intro}
        </p>

        {/* Prayer Times Banner */}
        <div className="mt-10 glass-card rounded-2xl p-6 max-w-4xl mx-auto animate-glow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="font-body text-amber-200 font-medium">
              {t.hero.prayerTimesTitle}
            </span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {(Object.entries(PRAYER_TIMES) as [PrayerName, readonly [number, number]][]).map(
              ([name, [hours, minutes]]) => (
                <div key={name} className="text-center">
                  <p className="text-xs text-slate-400 ltr:uppercase ltr:tracking-wider mb-1">
                    {t.prayers[name]}
                  </p>
                  <p className="font-body text-amber-100 font-semibold">
                    {formatTime(hours, minutes)}
                  </p>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-slate-500 mt-4">{t.hero.prayerTimesNote}</p>
        </div>
      </div>
    </section>
  )
}
