'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import { Dictionary, Locale, translations } from './translations'
import { fromDateKey } from '@/lib/utils'

const STORAGE_KEY = 'ramadanhub-locale'

// Arabic keeps Western digits so dates, times and phone numbers stay consistent
const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  ar: 'ar-AE-u-nu-latn',
}

/**
 * Tiny external store so the saved language is read without a
 * hydration mismatch (the server always renders English first).
 */
const listeners = new Set<() => void>()
let currentLocale: Locale | null = null

function readLocale(): Locale {
  if (currentLocale) return currentLocale
  try {
    currentLocale = localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en'
  } catch {
    currentLocale = 'en'
  }
  return currentLocale
}

function writeLocale(locale: Locale) {
  currentLocale = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Storage unavailable (private mode) - the choice lasts for this page view only
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

interface LanguageContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  formatDate: (date: Date) => string
  formatDateKey: (dateKey: string) => string
  formatMonth: (date: Date) => string
  formatTime: (hours: number, minutes: number) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => 'en' as Locale)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  const value = useMemo<LanguageContextValue>(() => {
    const intlLocale = INTL_LOCALES[locale]
    const dateFormat = new Intl.DateTimeFormat(intlLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const monthFormat = new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' })
    const timeFormat = new Intl.DateTimeFormat(intlLocale, { hour: 'numeric', minute: '2-digit' })

    const formatDate = (date: Date) => dateFormat.format(date)

    return {
      locale,
      dir,
      t: translations[locale],
      setLocale: writeLocale,
      toggleLocale: () => writeLocale(locale === 'ar' ? 'en' : 'ar'),
      formatDate,
      formatDateKey: (dateKey: string) => {
        const date = fromDateKey(dateKey)
        return date ? formatDate(date) : dateKey
      },
      formatMonth: (date: Date) => monthFormat.format(date),
      formatTime: (hours: number, minutes: number) =>
        timeFormat.format(new Date(2027, 1, 1, hours, minutes)),
    }
  }, [locale, dir])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside <LanguageProvider>')
  }
  return context
}
