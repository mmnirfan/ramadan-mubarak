'use client'

import { MessageCircle, Mail, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function ContactSection() {
  const { t } = useLanguage()

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            {t.contact.title}
          </h3>
          <p className="text-slate-400 mb-6">
            {t.contact.text}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hr@company.com"
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl px-6 py-3 text-amber-200 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span dir="ltr">hr@company.com</span>
            </a>
            <a
              href="tel:+918012345678"
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 rounded-xl px-6 py-3 text-slate-200 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              <span dir="ltr">+91 80 1234 5678</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
