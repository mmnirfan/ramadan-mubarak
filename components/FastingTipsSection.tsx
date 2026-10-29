'use client'

import { Heart, Sunrise, Sun, Moon, LucideIcon } from 'lucide-react'
import { useLanguage, Dictionary } from '@/lib/i18n'

type TipKey = keyof Dictionary['tips']['items']

// Full class names so Tailwind can detect them (dynamic `bg-${color}-500` is never generated)
const TIP_STYLES: Record<TipKey, { icon: LucideIcon; background: string; iconColor: string }> = {
  suhoor: { icon: Sunrise, background: 'bg-blue-500/20', iconColor: 'text-blue-400' },
  day: { icon: Sun, background: 'bg-amber-500/20', iconColor: 'text-amber-400' },
  iftar: { icon: Moon, background: 'bg-purple-500/20', iconColor: 'text-purple-400' },
}

export function FastingTipsSection() {
  const { t } = useLanguage()

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Heart className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">{t.tips.badge}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            {t.tips.title}
          </h2>
          <p className="text-slate-400 font-body">
            {t.tips.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(Object.keys(TIP_STYLES) as TipKey[]).map((key) => {
            const { icon: Icon, background, iconColor } = TIP_STYLES[key]
            const tip = t.tips.items[key]
            return (
              <div
                key={key}
                className="glass-card rounded-2xl p-6 text-center hover:border-amber-400/30 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${background} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {tip.title}
                </h3>
                <p className="text-slate-400 text-sm">{tip.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
