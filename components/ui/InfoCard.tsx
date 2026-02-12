'use client'

import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface InfoCardProps {
  icon: LucideIcon
  title: string
  children: ReactNode
  gradient?: string
}

export function InfoCard({
  icon: Icon,
  title,
  children,
  gradient = 'from-amber-500/10 to-transparent',
}: InfoCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${gradient} hover:border-amber-400/30 transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-500/20 rounded-xl">
          <Icon className="w-6 h-6 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-white mb-2">
            {title}
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
