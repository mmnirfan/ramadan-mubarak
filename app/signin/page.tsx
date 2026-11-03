import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Background } from '@/components/Background'
import { SignInForm } from '@/components/admin/SignInForm'
import { getAdminSession } from '@/lib/auth/server'

export const metadata: Metadata = {
  title: 'Admin Sign In',
  robots: { index: false, follow: false },
}

// Only allow redirecting back into the admin area (no open redirects)
function safeNext(next: string | string[] | undefined): string {
  return typeof next === 'string' && /^\/admin(\/|$)/.test(next) ? next : '/admin'
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = safeNext((await searchParams).next)
  if (await getAdminSession()) redirect(next)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
      <Background />
      <main className="relative z-10 w-full flex justify-center">
        <SignInForm next={next} />
      </main>
    </div>
  )
}
