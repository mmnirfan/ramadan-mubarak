'use client'

import Link from 'next/link'
import { SearchX, Home, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function NotFoundContent() {
  const { t } = useLanguage()

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto glass-card rounded-3xl p-8 sm:p-12 text-center">
        <SearchX className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        <p className="font-display text-6xl font-bold shimmer-text mb-2" dir="ltr">404</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">{t.notFound.title}</h1>
        <p className="text-slate-400 mb-8">{t.notFound.text}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold btn-primary">
            <Home className="w-5 h-5" />
            {t.notFound.home}
          </Link>
          <Link
            href="/#timetable"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-6 py-3 text-amber-200 transition-colors"
          >
            <Clock className="w-5 h-5" />
            {t.notFound.timetable}
          </Link>
        </div>
      </div>
    </section>
  )
}
