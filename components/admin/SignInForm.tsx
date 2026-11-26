'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from 'lucide-react'

export function SignInForm({ next }: { next: string }) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.ok && result.success) {
        router.replace(next)
        router.refresh()
        return
      }
      setError(result.error || 'Sign-in failed. Please try again.')
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 mb-4">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Sign In</h1>
          <p className="text-slate-400 text-sm mt-2">For RamadanHub organisers only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-amber-200/80 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field ps-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-amber-200/80 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field ps-12 pe-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-amber-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 btn-primary"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>
      </div>

      <Link href="/" className="mt-6 inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-amber-200">
        <ArrowLeft className="w-4 h-4" />
        Back to RamadanHub
      </Link>
    </div>
  )
}
