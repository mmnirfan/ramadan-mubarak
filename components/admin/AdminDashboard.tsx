'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toaster, toast } from 'sonner'
import {
  CalendarClock, Users, UtensilsCrossed, XCircle, RefreshCw, LogOut, Search, Trash2, Landmark, Phone, Mail,
  MapPin, Briefcase, Moon, AlertCircle, ExternalLink, X,
} from 'lucide-react'
import type { AdminRegistration, AdminRemoveResponse, BookingStatus } from '@/lib/admin/types'
import { RAMADAN_TIMETABLE } from '@/lib/timetable'
import { fromDateKey, toDateKey } from '@/lib/utils'

const RAMADAN_DATES = RAMADAN_TIMETABLE.map((d) => d.date)
const TIMEZONE = 'Asia/Kolkata'
// After this hour (IST) the next Sehri to prepare is tomorrow's
const SEHRI_CUTOFF_HOUR = 6

const dateLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
const dateTimeLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: TIMEZONE })
const formatKey = (key: string) => { const d = fromDateKey(key); return d ? dateLabel.format(d) : key }
const formatIso = (iso: string) => { const d = new Date(iso); return iso && !Number.isNaN(d.getTime()) ? dateTimeLabel.format(d) : '' }
// A sheet row holds one person with several dates, so a booking is row + date
const bookingId = (r: { row: number; date: string }) => `${r.row}|${r.date}`
const daysLabel = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`

/** One person (one sheet row) with all of their bookings, sorted by date */
type Person = Omit<AdminRegistration, 'date' | 'status' | 'statusChangedAt' | 'reason'> & { bookings: AdminRegistration[] }
const normalizePhone = (phone: string) => { const digits = phone.replace(/\D/g, ''); return digits.length > 10 ? digits.slice(-10) : digits }
const normalizeText = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase()

/**
 * The upcoming Sehri (yyyy-MM-dd): today's before 6 AM IST, otherwise tomorrow's,
 * moved to the first Ramadan day if Ramadan hasn't started. null after Ramadan.
 */
function nextSehriDate(now: Date): string | null {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  )
  const today = fromDateKey(`${parts.year}-${parts.month}-${parts.day}`) as Date
  if (Number(parts.hour) >= SEHRI_CUTOFF_HOUR) today.setDate(today.getDate() + 1)
  const candidate = toDateKey(today)
  return RAMADAN_DATES.find((d) => d >= candidate) ?? null
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Cancelled: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Removed: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

export function AdminDashboard({ username }: { username: string }) {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('Active')
  const [removing, setRemoving] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const response = await fetch('/api/admin/registrations', { cache: 'no-store' })
      if (response.status === 401) {
        router.replace('/signin?next=/admin')
        return
      }
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Failed to load registrations')
      setRegistrations(result.registrations)
      setLastLoaded(new Date())
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    // Fetching on mount; setState happens after the await, not synchronously in the effect
    void load()
  }, [load])

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    router.replace('/signin')
    router.refresh()
  }

  // ---------- Derived numbers ----------
  const active = useMemo(() => registrations.filter((r) => r.status === 'Active'), [registrations])
  const nextDate = useMemo(() => nextSehriDate(lastLoaded ?? new Date()), [lastLoaded])
  const nextBookings = useMemo(() => active.filter((r) => r.date === nextDate), [active, nextDate])
  const uniquePeople = useMemo(() => new Set(active.map((r) => normalizePhone(r.phone))).size, [active])
  const cancelledCount = registrations.filter((r) => r.status === 'Cancelled').length
  const removedCount = registrations.filter((r) => r.status === 'Removed').length

  const nextByMasjid = useMemo(() => {
    const groups = new Map<string, { name: string; count: number }>()
    nextBookings.forEach((r) => {
      const key = normalizeText(r.masjidName) || '(not given)'
      const group = groups.get(key) ?? { name: r.masjidName.trim() || '(not given)', count: 0 }
      group.count++
      groups.set(key, group)
    })
    return [...groups.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [nextBookings])

  const perDate = useMemo(() => {
    const counts = new Map(RAMADAN_DATES.map((d) => [d, 0]))
    active.forEach((r) => counts.set(r.date, (counts.get(r.date) ?? 0) + 1))
    return [...counts.entries()]
  }, [active])
  const maxPerDate = Math.max(1, ...perDate.map(([, n]) => n))

  // ---------- People list (one entry per person = one sheet row) ----------
  const people = useMemo(() => {
    const byRow = new Map<number, Person>()
    registrations.forEach((r) => {
      const person = byRow.get(r.row) ?? { ...r, bookings: [] }
      person.bookings.push(r)
      byRow.set(r.row, person)
    })
    byRow.forEach((p) => p.bookings.sort((a, b) => a.date.localeCompare(b.date)))
    return [...byRow.values()]
  }, [registrations])

  // A person is listed when they have a date with the chosen status (and on the
  // chosen date); their chips show every date with that status.
  const filtered = useMemo(() => {
    const query = normalizeText(search)
    const digits = search.replace(/\D/g, '')
    return people
      .map((p) => ({ person: p, shown: p.bookings.filter((b) => statusFilter === 'all' || b.status === statusFilter) }))
      .filter(({ shown }) => shown.length > 0 && (dateFilter === 'all' || shown.some((b) => b.date === dateFilter)))
      .filter(({ person: p }) => {
        if (!query) return true
        const text = normalizeText([p.fullName, p.email, p.masjidName, p.address, p.occupation].join(' '))
        return text.includes(query) || (digits.length >= 3 && p.phone.replace(/\D/g, '').includes(digits))
      })
      .sort((a, b) => a.person.fullName.localeCompare(b.person.fullName))
  }, [people, search, dateFilter, statusFilter])

  // ---------- Remove dates (confirmation toast, then result toast) ----------
  const removeDates = (person: Person, dates: string[]) => {
    const ids = dates.map((date) => bookingId({ row: person.row, date }))
    setRemoving((prev) => new Set([...prev, ...ids]))
    const request = fetch('/api/admin/registrations/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row: person.row, phone: person.phone, dates }),
    }).then(async (response) => {
      if (response.status === 401) {
        router.replace('/signin?next=/admin')
        throw new Error('Your session expired - please sign in again')
      }
      const result = (await response.json().catch(() => ({}))) as AdminRemoveResponse
      if (!result.success) throw new Error(result.error || 'Could not remove the booking')
      return result
    })

    toast.promise(request, {
      loading: `Removing ${person.fullName}...`,
      success: (result) => {
        const what = `${person.fullName}: ${daysLabel(result.removedDates?.length ?? dates.length)} removed`
        return result.emailed ? `${what} - email sent to ${person.email}` : `${what} (no email on file, not notified)`
      },
      error: (error: Error) => error.message,
    })

    request
      .then((result) => {
        const removed = new Set(result.removedDates ?? dates)
        const now = new Date().toISOString()
        setRegistrations((prev) =>
          prev.map((r) =>
            r.row === person.row && r.status === 'Active' && removed.has(r.date)
              ? { ...r, status: 'Removed', statusChangedAt: now, reason: `Removed by admin (${username})` }
              : r
          )
        )
      })
      .catch(() => {})
      .finally(() => setRemoving((prev) => { const next = new Set(prev); ids.forEach((id) => next.delete(id)); return next }))
  }

  const confirmRemove = (person: Person, dates: string[]) => {
    const all = dates.length > 1
    toast.warning(all ? `Remove all of ${person.fullName}'s Sehri?` : `Remove ${person.fullName}'s Sehri?`, {
      id: `confirm-${person.row}-${dates.join(',')}`,
      description: `${all ? `${daysLabel(dates.length)}: ` : ''}${dates.map(formatKey).join(', ')}. ${
        person.email ? `One email will be sent to ${person.email}.` : 'No email on file - they will not be notified.'
      }`,
      duration: 15000,
      action: { label: 'Remove', onClick: () => removeDates(person, dates) },
      cancel: { label: 'Cancel', onClick: () => {} },
    })
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <Toaster theme="dark" position="top-center" richColors closeButton />

      <header className="sticky top-0 z-30 border-b border-amber-500/15 bg-slate-950/85 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Moon className="w-7 h-7 text-amber-400 flex-shrink-0" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-amber-100 leading-tight">RamadanHub Admin</p>
              <p className="text-xs text-slate-400 truncate">Signed in as {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-amber-200 hover:bg-slate-800">
              <ExternalLink className="w-4 h-4" /> Site
            </Link>
            <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-amber-200 hover:bg-slate-800 disabled:opacity-50" aria-label="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/10">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {loadError && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Could not load registrations</p>
              <p className="text-sm text-red-300/90">{loadError}</p>
            </div>
          </div>
        )}

        {/* Summary */}
        <section aria-label="Summary" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="col-span-2 lg:col-span-1 glass-card rounded-2xl p-5 border-amber-400/40 bg-amber-500/10">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
              <CalendarClock className="w-4 h-4" /> Next Sehri to prepare
            </div>
            <p className="mt-2 font-display text-4xl font-bold text-white">{loading && !lastLoaded ? '–' : nextBookings.length}</p>
            <p className="text-sm text-slate-300">{nextDate ? formatKey(nextDate) : 'Ramadan has ended'}</p>
          </div>
          <StatCard icon={UtensilsCrossed} label="Active bookings" value={active.length} hint="meals across all dates" loading={loading && !lastLoaded} />
          <StatCard icon={Users} label="People registered" value={uniquePeople} hint="unique mobile numbers" loading={loading && !lastLoaded} />
          <StatCard icon={XCircle} label="Cancelled / removed" value={cancelledCount + removedCount} hint={`${cancelledCount} cancelled · ${removedCount} removed`} loading={loading && !lastLoaded} />
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Next Sehri by masjid */}
          <section className="glass-card rounded-2xl p-5" aria-labelledby="by-masjid">
            <h2 id="by-masjid" className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-400" /> Next Sehri by masjid
            </h2>
            <p className="text-xs text-slate-400 mb-4">{nextDate ? formatKey(nextDate) : '-'}</p>
            {nextByMasjid.length === 0 ? (
              <p className="text-sm text-slate-400">No bookings for this date yet.</p>
            ) : (
              <ul className="space-y-2">
                {nextByMasjid.map((group) => (
                  <li key={group.name} className="flex items-center justify-between gap-3 rounded-lg bg-slate-800/40 px-3 py-2">
                    <span className="text-sm text-slate-200 truncate">{group.name}</span>
                    <span className="font-semibold text-amber-300 tabular-nums">{group.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Bookings per date */}
          <section className="glass-card rounded-2xl p-5 lg:col-span-2" aria-labelledby="per-date">
            <h2 id="per-date" className="font-display text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <CalendarClock className="w-5 h-5 text-amber-400" /> Active bookings per date
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {perDate.map(([date, count]) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => { setDateFilter(date); setStatusFilter('Active') }}
                  className={`flex items-center gap-3 rounded-md px-2 py-1.5 text-start hover:bg-slate-800/60 ${date === nextDate ? 'ring-1 ring-amber-400/60 bg-amber-500/10' : ''}`}
                  aria-label={`${formatKey(date)}: ${count} bookings - show in list`}
                >
                  <span className="w-24 flex-shrink-0 text-xs text-slate-300">{formatKey(date)}</span>
                  <span className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <span className="block h-full rounded-full bg-amber-400" style={{ width: `${(count / maxPerDate) * 100}%` }} />
                  </span>
                  <span className="w-8 text-end text-sm font-semibold tabular-nums text-amber-200">{count}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* All registrations */}
        <section className="glass-card rounded-2xl p-4 sm:p-5" aria-labelledby="all-registrations">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
            <div className="flex-1">
              <h2 id="all-registrations" className="font-display text-lg font-semibold text-white">All registrations</h2>
              <p className="text-xs text-slate-400">
                {filtered.length} of {people.length} {people.length === 1 ? 'person' : 'people'}
                {lastLoaded && ` · updated ${dateTimeLabel.format(lastLoaded)}`}
              </p>
              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400" aria-label="Date colours">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Active</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400" /> Cancelled</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> Removed</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
              <label className="relative">
                <span className="sr-only">Search</span>
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, phone, masjid..."
                  className="input-field ps-9 py-2.5 text-sm sm:w-64"
                />
              </label>
              <label>
                <span className="sr-only">Date</span>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-field py-2.5 text-sm pe-10">
                  <option value="all" className="bg-slate-900">All dates</option>
                  {RAMADAN_DATES.map((d) => (
                    <option key={d} value={d} className="bg-slate-900">{formatKey(d)}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Status</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')} className="input-field py-2.5 text-sm pe-10">
                  <option value="Active" className="bg-slate-900">Active</option>
                  <option value="Cancelled" className="bg-slate-900">Cancelled</option>
                  <option value="Removed" className="bg-slate-900">Removed</option>
                  <option value="all" className="bg-slate-900">All statuses</option>
                </select>
              </label>
            </div>
          </div>

          {loading && !lastLoaded ? (
            <p className="py-10 text-center text-slate-400">Loading registrations...</p>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-slate-400">No registrations match these filters.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-start text-xs uppercase tracking-wide text-amber-300/80 border-b border-amber-500/20">
                      <th scope="col" className="py-2 pe-3 text-start font-semibold">Name</th>
                      <th scope="col" className="py-2 pe-3 text-start font-semibold">Contact</th>
                      <th scope="col" className="py-2 pe-3 text-start font-semibold">Occupation</th>
                      <th scope="col" className="py-2 pe-3 text-start font-semibold">Address / Masjid</th>
                      <th scope="col" className="py-2 pe-3 text-start font-semibold">Sehri dates</th>
                      <th scope="col" className="py-2 text-end font-semibold"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(({ person: p, shown }) => (
                      <tr key={p.row} className="border-b border-slate-800 align-top">
                        <td className="py-3 pe-3">
                          <p className="font-medium text-white">{p.fullName}</p>
                          <p className="text-xs text-slate-500">Registered {formatIso(p.timestamp)}</p>
                        </td>
                        <td className="py-3 pe-3">
                          <p className="text-slate-200 whitespace-nowrap" dir="ltr">{p.phone}</p>
                          {p.email && <p className="text-xs text-slate-400 break-all">{p.email}</p>}
                        </td>
                        <td className="py-3 pe-3 text-slate-300">{p.occupation}</td>
                        <td className="py-3 pe-3 max-w-[14rem]">
                          <p className="text-slate-300">{p.address}</p>
                          <p className="text-xs text-amber-300/80 mt-0.5">{p.masjidName}</p>
                        </td>
                        <td className="py-3 pe-3 min-w-[16rem]">
                          <DateChips person={p} shown={shown} highlight={dateFilter} removing={removing} onRemove={confirmRemove} />
                        </td>
                        <td className="py-3 text-end">
                          <RemoveAllButton person={p} removing={removing} onRemove={confirmRemove} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <ul className="lg:hidden space-y-3">
                {filtered.map(({ person: p, shown }) => (
                  <li key={p.row} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{p.fullName}</p>
                      <p className="text-xs text-slate-500">Registered {formatIso(p.timestamp)}</p>
                    </div>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <Detail icon={Phone}><span dir="ltr">{p.phone}</span></Detail>
                      {p.email && <Detail icon={Mail}><span className="break-all">{p.email}</span></Detail>}
                      <Detail icon={Briefcase}>{p.occupation}</Detail>
                      <Detail icon={MapPin}>{p.address}</Detail>
                      <Detail icon={Landmark}>{p.masjidName}</Detail>
                    </dl>
                    <div className="mt-3">
                      <DateChips person={p} shown={shown} highlight={dateFilter} removing={removing} onRemove={confirmRemove} />
                    </div>
                    <div className="mt-3 flex justify-end empty:hidden">
                      <RemoveAllButton person={p} removing={removing} onRemove={confirmRemove} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, hint, loading }: { icon: typeof Users; label: string; value: number; hint: string; loading: boolean }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
        <Icon className="w-4 h-4 text-amber-400" /> {label}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-white">{loading ? '–' : value}</p>
      <p className="text-xs text-slate-400">{hint}</p>
    </div>
  )
}

type RemoveHandler = (person: Person, dates: string[]) => void

/**
 * The person's dates as chips. Active dates have an × to remove just that date;
 * cancelled / removed dates are struck through, with when and why on hover.
 */
function DateChips({ person, shown, highlight, removing, onRemove }: {
  person: Person; shown: AdminRegistration[]; highlight: string; removing: Set<string>; onRemove: RemoveHandler
}) {
  const activeCount = person.bookings.filter((b) => b.status === 'Active').length
  return (
    <div>
      <ul className="flex flex-wrap gap-1.5">
        {shown.map((b) => {
          const busy = removing.has(bookingId(b))
          const changed = b.status !== 'Active'
            ? `${b.status}${b.statusChangedAt ? ` ${formatIso(b.statusChangedAt)}` : ''}${b.reason ? ` - ${b.reason}` : ''}`
            : undefined
          return (
            <li
              key={b.date}
              title={changed}
              className={`inline-flex items-center gap-1 rounded-full border ps-2.5 text-xs font-medium ${STATUS_STYLES[b.status]} ${
                b.status === 'Active' ? 'pe-1' : 'pe-2.5 py-1 line-through decoration-1'
              } ${b.date === highlight ? 'ring-2 ring-amber-400' : ''} ${busy ? 'opacity-50' : ''}`}
            >
              <span className="whitespace-nowrap">{formatKey(b.date)}</span>
              {b.status === 'Active' && (
                <button
                  type="button"
                  onClick={() => onRemove(person, [b.date])}
                  disabled={busy}
                  className="rounded-full p-1 text-emerald-200/80 hover:bg-rose-500/25 hover:text-rose-100 disabled:cursor-not-allowed"
                  aria-label={`Remove ${person.fullName}'s Sehri on ${formatKey(b.date)}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {changed && <span className="sr-only">({changed})</span>}
            </li>
          )
        })}
      </ul>
      <p className="mt-1.5 text-[11px] text-slate-500">
        {daysLabel(activeCount)} active
        {person.bookings.length > activeCount && ` · ${person.bookings.length - activeCount} cancelled / removed`}
      </p>
    </div>
  )
}

/** Removes every active date of the person (one email). */
function RemoveAllButton({ person, removing, onRemove }: { person: Person; removing: Set<string>; onRemove: RemoveHandler }) {
  const activeDates = person.bookings.filter((b) => b.status === 'Active').map((b) => b.date)
  if (activeDates.length === 0) return null
  const busy = activeDates.some((date) => removing.has(bookingId({ row: person.row, date })))
  return (
    <button
      type="button"
      onClick={() => onRemove(person, activeDates)}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15 disabled:opacity-50 whitespace-nowrap"
      aria-label={`Remove all ${activeDates.length} active Sehri dates of ${person.fullName}`}
    >
      <Trash2 className="w-4 h-4" />
      {activeDates.length > 1 ? 'Remove all' : 'Remove'}
    </button>
  )
}

function Detail({ icon: Icon, children }: { icon: typeof Users; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-slate-300">
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400/70" />
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}
