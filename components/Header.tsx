'use client'

import { Moon, Star, MapPin } from 'lucide-react'

export function Header() {
  return (
    <header className="relative z-10 pt-8 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Moon className="w-10 h-10 text-amber-400" strokeWidth={1.5} />
            <Star className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 fill-amber-300" />
          </div>
          <span className="font-display text-2xl font-semibold text-amber-100">
            Ramadan<span className="text-amber-400">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-amber-200/70">
          <MapPin className="w-4 h-4" />
          <span>Abu Dhabi, UAE</span>
        </div>
      </nav>
    </header>
  )
}
