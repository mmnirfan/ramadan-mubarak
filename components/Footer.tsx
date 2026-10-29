'use client'

import { Moon } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative z-10 px-6 py-12 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-6 h-6 text-amber-400" />
            <span className="font-display text-xl font-semibold text-amber-100" dir="ltr">
              RamadanHub
            </span>
          </div>
          <p className="text-slate-400 font-body text-sm max-w-md mx-auto mb-4">
            {t.footer.tagline}
          </p>
          <p className="font-arabic text-lg text-amber-300/60">
            تقبل الله منا ومنكم
          </p>
          <p className="text-xs text-slate-500 mt-4">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
