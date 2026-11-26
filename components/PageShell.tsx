import { ReactNode } from 'react'
import { Background } from './Background'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Common frame for secondary pages (privacy, not found, offline)
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
      <Background />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
