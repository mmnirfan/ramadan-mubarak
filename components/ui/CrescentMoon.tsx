'use client'

import { Moon, Star } from 'lucide-react'

interface CrescentMoonProps {
  className?: string
}

export function CrescentMoon({ className = '' }: CrescentMoonProps) {
  return (
    <div className={`relative ${className}`}>
      <Moon
        className="w-20 h-20 text-amber-300 fill-amber-200"
        strokeWidth={1}
      />
      <Star
        className="absolute -top-2 -right-4 w-4 h-4 text-amber-300 fill-amber-200 animate-pulse"
      />
      <Star
        className="absolute top-6 -right-8 w-3 h-3 text-amber-300 fill-amber-200 animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <Star
        className="absolute -top-4 right-4 w-2 h-2 text-amber-300 fill-amber-200 animate-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  )
}
