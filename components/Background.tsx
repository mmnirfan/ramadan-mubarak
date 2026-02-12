'use client'

import { IslamicPattern, Lantern } from './ui'

export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <IslamicPattern className="absolute inset-0 w-full h-full text-amber-400 opacity-5" />

      {/* Floating Lanterns */}
      <Lantern style={{ top: '10%', left: '5%' }} delay={0} />
      <Lantern style={{ top: '20%', right: '8%' }} delay={1} />
      <Lantern style={{ top: '60%', left: '3%' }} delay={2} />
      <Lantern style={{ top: '70%', right: '5%' }} delay={0.5} />
      <Lantern style={{ top: '40%', left: '10%' }} delay={1.5} />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
    </div>
  )
}
