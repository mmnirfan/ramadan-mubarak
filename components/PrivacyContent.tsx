'use client'

import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { CONTACT_EMAIL } from '@/lib/utils'

export function PrivacyContent() {
  const { t } = useLanguage()

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16">
      <article className="max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-amber-400 flex-shrink-0" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{t.privacy.title}</h1>
        </div>
        <p className="text-xs text-slate-500 mb-6">{t.privacy.updated}</p>
        <p className="text-slate-300 leading-relaxed mb-8">{t.privacy.intro}</p>

        <div className="space-y-8">
          {t.privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-amber-300 mb-3">{section.heading}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed list-disc ps-5 marker:text-amber-400">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-slate-400 text-sm mt-10">
          {t.privacy.contact}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
            {CONTACT_EMAIL}
          </a>
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-5 py-3 text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t.privacy.back}
        </Link>
      </article>
    </section>
  )
}
