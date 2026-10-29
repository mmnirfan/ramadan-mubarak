import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ramadan 1448 (2027) - expected in India (usually a day after the Gulf).
 * The end includes the possible 30th day.
 */
export const RAMADAN_YEAR = 2027
export const RAMADAN_START = new Date(2027, 1, 9) // Tue, Feb 9, 2027
export const RAMADAN_END = new Date(2027, 2, 10) // Wed, Mar 10, 2027

/**
 * Convert a local date to yyyy-MM-dd without shifting to UTC
 * (toISOString() would move IST midnight to the previous day)
 */
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Parse a yyyy-MM-dd key to a local date
 */
export function fromDateKey(dateKey: string): Date | null {
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

/**
 * Check if a date is within Ramadan 2027
 */
export function isRamadanDate(date: Date): boolean {
  return date >= RAMADAN_START && date <= RAMADAN_END
}

/**
 * Get days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Get first day of month (0 = Sunday, 6 = Saturday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

/**
 * Prayer times for Bengaluru as [hours, minutes] (24h), Asr per Hanafi method,
 * approximate for mid-Ramadan 2027 (Feb 24)
 */
export const PRAYER_TIMES = {
  fajr: [5, 27],
  sunrise: [6, 38],
  dhuhr: [12, 35],
  asr: [16, 49],
  maghrib: [18, 28],
  isha: [19, 39],
} as const

export type PrayerName = keyof typeof PRAYER_TIMES

/**
 * Approximate meal times as [hours, minutes] (24h)
 */
export const MEAL_TIMES = {
  iftar: [18, 28],
  suhoor: [4, 30],
} as const

/**
 * Department values (labels live in the translations)
 */
export const DEPARTMENTS = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Operations',
  'Sales',
  'Legal',
  'Executive',
  'Admin',
  'Other',
] as const

export type Department = (typeof DEPARTMENTS)[number]
