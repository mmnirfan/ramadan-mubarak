'use client'

import { Clock } from 'lucide-react'
import { CrescentMoon } from './ui'
import { PRAYER_TIMES } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="relative z-10 px-6 pt-16 pb-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CrescentMoon />
        </div>

        <p className="font-arabic text-3xl text-amber-300/80 mb-4">رمضان مبارك</p>

        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="shimmer-text">Iftar & Suhoor</span>
          <br />
          <span className="text-white/90">Registration</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
          Join your colleagues for blessed meals during the holy month of Ramadan
          2026. Register for office Iftar and Suhoor gatherings.
        </p>

        {/* Prayer Times Banner */}
        <div className="mt-10 glass-card rounded-2xl p-6 max-w-4xl mx-auto animate-glow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="font-body text-amber-200 font-medium">
              Today&apos;s Prayer Times - Abu Dhabi
            </span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(PRAYER_TIMES).map(([name, time]) => (
              <div key={name} className="text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  {name}
                </p>
                <p className="font-body text-amber-100 font-semibold">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
