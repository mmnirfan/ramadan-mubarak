'use client'

import { useCallback, useEffect, useState } from 'react'
import { CalendarX2, AtSign, MessageSquare, CheckCircle2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react'
import { DatePicker, Modal } from './ui'
import { CancellationFormData, FormErrorCode, initialCancellationData } from '@/lib/types'
import { submitCancellation, validateCancellation } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'

const REASON_MAX_LENGTH = 300

export function CancellationSection() {
  const { t, locale, formatDateKey } = useLanguage()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CancellationFormData>(initialCancellationData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<{ code: FormErrorCode; detail?: string; dates?: string[] } | null>(null)
  const [result, setResult] = useState<{ cancelledDates: string[]; notFoundDates: string[] } | null>(null)

  // The PWA shortcut opens the page at #cancel - open the dialog straight away
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#cancel') setOpen(true)
    }
    const frame = requestAnimationFrame(openFromHash)
    window.addEventListener('hashchange', openFromHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', openFromHash)
    }
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    // Start fresh next time once a cancellation went through
    if (result) {
      setFormData(initialCancellationData)
      setResult(null)
    }
    setError(null)
    if (window.location.hash === '#cancel') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [result])

  const update = (field: keyof CancellationFormData, value: string | Date[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateCancellation(formData)
    if (validationError) {
      setError({ code: validationError })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await submitCancellation(formData)
      if (response.success) {
        setResult({
          cancelledDates: response.cancelledDates ?? [],
          notFoundDates: response.notFoundDates ?? [],
        })
      } else {
        setError({
          code: response.errorCode ?? 'generic',
          detail: response.error,
          dates: response.notFoundDates,
        })
      }
    } catch {
      setError({ code: 'unexpected' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Server messages are English-only; in Urdu show the translated message instead
  const errorMessage = error
    ? locale === 'en' && error.detail && error.code === 'generic'
      ? error.detail
      : t.errors[error.code]
    : ''

  const dateChips = (dates: string[], tone: 'emerald' | 'amber') => (
    <div className="flex flex-wrap gap-2">
      {dates.map((date) => (
        <span
          key={date}
          className={`text-sm px-2 py-1 rounded ${
            tone === 'emerald' ? 'text-emerald-200 bg-emerald-500/20' : 'text-amber-200 bg-amber-500/20'
          }`}
        >
          {formatDateKey(date)}
        </span>
      ))}
    </div>
  )

  return (
    <section id="cancel" className="relative z-10 px-6 pb-8 scroll-mt-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
          <div className="p-3 bg-rose-500/15 rounded-xl flex-shrink-0">
            <CalendarX2 className="w-7 h-7 text-rose-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-semibold text-white mb-1">{t.cancel.title}</h3>
            <p className="text-slate-400 text-sm">{t.cancel.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="w-full sm:w-auto flex-shrink-0 rounded-xl border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/20 px-6 py-3 font-semibold text-rose-200 transition-colors"
          >
            {t.cancel.button}
          </button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={close}
        title={result ? t.cancel.successTitle : t.cancel.modalTitle}
        description={result ? undefined : t.cancel.modalSubtitle}
        closeLabel={t.cancel.close}
      >
        {result ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-emerald-200">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
              <p className="text-sm text-slate-300">{t.cancel.successText}</p>
            </div>

            {result.cancelledDates.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <p className="text-emerald-300 font-medium text-sm">{t.cancel.cancelledFor(result.cancelledDates.length)}</p>
                {dateChips(result.cancelledDates, 'emerald')}
              </div>
            )}

            {result.notFoundDates.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <p className="text-amber-300 font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {t.cancel.notFoundFor(result.notFoundDates.length)}
                </p>
                {dateChips(result.notFoundDates, 'amber')}
              </div>
            )}

            <button type="button" onClick={close} className="w-full py-3 rounded-xl font-semibold btn-primary">
              {t.cancel.done}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="cancelContact" className="block text-amber-200/80 text-sm font-medium mb-2">
                {t.cancel.contact}
              </label>
              <div className="relative" dir="ltr">
                <AtSign className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                <input
                  id="cancelContact"
                  type="text"
                  inputMode="email"
                  autoComplete="tel"
                  value={formData.contact}
                  onChange={(e) => update('contact', e.target.value)}
                  placeholder={t.cancel.contactPlaceholder}
                  className="input-field ps-12"
                />
              </div>
            </div>

            <DatePicker
              label={t.cancel.datesLabel}
              values={formData.dates}
              onChange={(dates) => update('dates', dates)}
            />

            <div>
              <label htmlFor="cancelReason" className="block text-amber-200/80 text-sm font-medium mb-2">
                {t.cancel.reason}
              </label>
              <div className="relative">
                <MessageSquare className="absolute start-4 top-4 w-5 h-5 text-amber-400/50" />
                <textarea
                  id="cancelReason"
                  rows={2}
                  maxLength={REASON_MAX_LENGTH}
                  value={formData.reason}
                  onChange={(e) => update('reason', e.target.value)}
                  placeholder={t.cancel.reasonPlaceholder}
                  className="input-field ps-12 resize-y"
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <span className="text-sm block">{errorMessage}</span>
                  {error.dates && error.dates.length > 0 && dateChips(error.dates, 'amber')}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 bg-rose-500/90 hover:bg-rose-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.cancel.submitting}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span>{t.cancel.submit(formData.dates.length)}</span>
                </>
              )}
            </button>
          </form>
        )}
      </Modal>
    </section>
  )
}
