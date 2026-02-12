'use client'

import { Heart, Sunrise, Sun, Moon } from 'lucide-react'

export function FastingTipsSection() {
  const tips = [
    {
      icon: Sunrise,
      title: 'Suhoor Nutrition',
      description:
        'Eat complex carbs, protein, and drink plenty of water. Avoid salty foods that increase thirst during the day.',
      color: 'blue',
    },
    {
      icon: Sun,
      title: 'During the Day',
      description:
        'Take short breaks, avoid direct sunlight, and schedule demanding tasks for the morning when energy is higher.',
      color: 'amber',
    },
    {
      icon: Moon,
      title: 'Breaking Fast',
      description:
        'Start with dates and water, eat slowly, and avoid overeating. Include fruits and vegetables in your Iftar.',
      color: 'purple',
    },
  ]

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Heart className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">Wellness</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Tips for Fasting at Work
          </h2>
          <p className="text-slate-400 font-body">
            Stay healthy and productive during Ramadan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="glass-card rounded-2xl p-6 text-center hover:border-amber-400/30 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 bg-${tip.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <tip.icon className={`w-8 h-8 text-${tip.color}-400`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                {tip.title}
              </h3>
              <p className="text-slate-400 text-sm">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
