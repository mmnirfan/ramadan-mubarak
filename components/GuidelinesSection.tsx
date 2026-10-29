'use client'

import {
  BookOpen,
  Clock,
  Utensils,
  Coffee,
  HandHeart,
  Landmark,
  Gift,
  LucideIcon,
} from 'lucide-react'
import { InfoCard } from './ui'
import { useLanguage, Dictionary } from '@/lib/i18n'

type GuidelineKey = keyof Dictionary['guidelines']['items']

const GUIDELINE_ICONS: Record<GuidelineKey, LucideIcon> = {
  hours: Clock,
  etiquette: Utensils,
  iftar: Coffee,
  considerate: HandHeart,
  prayer: Landmark,
  charity: Gift,
}

export function GuidelinesSection() {
  const { t } = useLanguage()

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">
              {t.guidelines.badge}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            {t.guidelines.title}
          </h2>
          <p className="text-slate-400 font-body">
            {t.guidelines.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {(Object.keys(GUIDELINE_ICONS) as GuidelineKey[]).map((key) => {
            const item = t.guidelines.items[key]
            return (
              <InfoCard key={key} icon={GUIDELINE_ICONS[key]} title={item.title}>
                <p>
                  {item.before}
                  {item.strong && <strong className="text-amber-300">{item.strong}</strong>}
                  {item.after}
                </p>
              </InfoCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
