'use client'

import {
  BookOpen,
  Clock,
  Utensils,
  Coffee,
  HandHeart,
  Landmark,
  Gift,
} from 'lucide-react'
import { InfoCard } from './ui'

export function GuidelinesSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">
              Office Information
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Ramadan Guidelines
          </h2>
          <p className="text-slate-400 font-body">
            Supporting our colleagues during the holy month
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard icon={Clock} title="Reduced Working Hours">
            <p>
              During Ramadan, office hours are reduced to{' '}
              <strong className="text-amber-300">9:00 AM - 3:00 PM</strong> (6
              hours) in accordance with UAE labor law. Please plan your meetings
              and deadlines accordingly.
            </p>
          </InfoCard>

          <InfoCard icon={Utensils} title="Eating & Drinking Etiquette">
            <p>
              Out of respect for fasting colleagues, please use designated break
              rooms for eating and drinking during daylight hours. The cafeteria
              will remain open with limited services.
            </p>
          </InfoCard>

          <InfoCard icon={Coffee} title="Iftar at Office">
            <p>
              Daily Iftar will be served in the main conference hall starting at{' '}
              <strong className="text-amber-300">
                Maghrib prayer time (~6:18 PM)
              </strong>
              . All employees are welcome to join regardless of religious
              background.
            </p>
          </InfoCard>

          <InfoCard icon={HandHeart} title="Be Considerate">
            <p>
              Fasting colleagues may experience lower energy levels, especially in
              the afternoon. Please be understanding and considerate when
              scheduling intensive meetings or deadlines.
            </p>
          </InfoCard>

          <InfoCard icon={Landmark} title="Prayer Facilities">
            <p>
              Prayer rooms are available on{' '}
              <strong className="text-amber-300">floors 2, 5, and 8</strong>. Wudu
              facilities are adjacent to each prayer room. Jumu&apos;ah (Friday)
              prayer is at 12:30 PM in the main hall.
            </p>
          </InfoCard>

          <InfoCard icon={Gift} title="Charity & Giving">
            <p>
              Our company Zakat and Sadaqah collection boxes are available at
              reception. Contributions support local charities and families in
              need. HR will match donations up to AED 10,000.
            </p>
          </InfoCard>
        </div>
      </div>
    </section>
  )
}
