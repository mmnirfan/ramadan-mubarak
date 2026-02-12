'use client'

import { CSSProperties } from 'react'

interface LanternProps {
  style?: CSSProperties
  delay?: number
}

export function Lantern({ style, delay = 0 }: LanternProps) {
  return (
    <div
      className="absolute opacity-20"
      style={{
        ...style,
        animation: `float 6s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg
        width="30"
        height="50"
        viewBox="0 0 30 50"
        fill="currentColor"
        className="text-amber-400"
      >
        <path d="M15 0L18 5H12L15 0Z" />
        <rect x="10" y="5" width="10" height="3" rx="1" />
        <path d="M8 8C8 8 5 15 5 25C5 35 8 42 15 42C22 42 25 35 25 25C25 15 22 8 22 8H8Z" />
        <ellipse cx="15" cy="25" rx="5" ry="8" fill="rgba(255,200,100,0.5)" />
        <path d="M12 42L10 50H20L18 42" fill="currentColor" />
      </svg>
    </div>
  )
}
