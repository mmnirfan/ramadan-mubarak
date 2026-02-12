'use client'

import { Gift, CalendarDays, MapPin, Clock } from 'lucide-react'

export function EidSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-4">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-200 text-sm font-medium">
                    Celebration
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  Eid Al-Fitr 2026
                </h2>

                <p className="font-arabic text-2xl text-amber-300/80 mb-4">
                  عيد مبارك
                </p>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  Join us for the Eid celebration at our office! We&apos;ll be
                  hosting a special Eid breakfast gathering with traditional
                  sweets, gifts for children, and family-friendly activities.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CalendarDays className="w-5 h-5 text-amber-400" />
                    <span>
                      <strong className="text-white">Date:</strong> March 19-21,
                      2026 (Public Holidays)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>
                      <strong className="text-white">Eid Prayer:</strong> Abu
                      Dhabi National Exhibition Centre
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>
                      <strong className="text-white">Office Event:</strong> March
                      22nd, 10:00 AM
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-amber-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                  <div className="text-center">
                    <p className="text-6xl mb-2">🎉</p>
                    <p className="font-display text-lg font-semibold text-amber-200">
                      Eid Mubarak!
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
