'use client'

import Link from 'next/link'
import { Moon, Star, MapPin, Languages } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function Header() {
  const { t, toggleLocale } = useLanguage()

  return (
    <header className="relative z-10 pt-[max(2rem,env(safe-area-inset-top))] px-4 sm:px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" strokeWidth={1.5} />
            <Star className="absolute -top-1 -end-1 w-3 h-3 text-amber-300 fill-amber-300" />
          </div>
          <span className="font-display text-xl sm:text-2xl font-semibold text-amber-100" dir="ltr">
            Ramadan<span className="text-amber-400">Hub</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-amber-200/70">
            <MapPin className="w-4 h-4" />
            <span>{t.header.location}</span>
          </div>

          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.language.switchLabel}
            className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 text-sm text-amber-200 transition-colors"
          >
            <Languages className="w-4 h-4" />
            <span>{t.language.switchTo}</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
