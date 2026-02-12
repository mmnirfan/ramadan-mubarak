import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | null): string {
  if (!date) return ''
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/**
 * Check if a date is within Ramadan 2026
 */
export function isRamadanDate(date: Date): boolean {
  const ramadanStart = new Date(2026, 1, 17) // Feb 17, 2026
  const ramadanEnd = new Date(2026, 2, 18) // March 18, 2026
  return date >= ramadanStart && date <= ramadanEnd
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
 * Prayer times for Abu Dhabi (approximate for Ramadan 2026)
 */
export const PRAYER_TIMES = {
  fajr: '5:23 AM',
  sunrise: '6:42 AM',
  dhuhr: '12:32 PM',
  asr: '3:52 PM',
  maghrib: '6:18 PM',
  isha: '7:36 PM',
}

/**
 * Important dates for Ramadan 2026
 */
export const IMPORTANT_DATES = [
  {
    date: '17 Feb',
    hijriDate: '1 Ramadan 1447',
    event: 'First Day of Ramadan',
    description: 'Beginning of the holy month',
    isHighlight: true,
  },
  {
    date: '28 Feb',
    hijriDate: '12 Ramadan 1447',
    event: 'Office Iftar Gathering',
    description: 'Company-wide Iftar event',
    isHighlight: false,
  },
  {
    date: '8 Mar',
    hijriDate: '20 Ramadan 1447',
    event: 'Last 10 Nights Begin',
    description: 'Laylatul Qadr period begins',
    isHighlight: false,
  },
  {
    date: '13 Mar',
    hijriDate: '25 Ramadan 1447',
    event: 'Laylatul Qadr (Expected)',
    description: 'Night of Power - odd nights',
    isHighlight: true,
  },
  {
    date: '18 Mar',
    hijriDate: '30 Ramadan 1447',
    event: 'Last Day of Ramadan',
    description: 'Final day of fasting',
    isHighlight: false,
  },
  {
    date: '19 Mar',
    hijriDate: '1 Shawwal 1447',
    event: 'Eid Al-Fitr',
    description: 'Celebration of breaking the fast',
    isHighlight: true,
  },
  {
    date: '19-21 Mar',
    hijriDate: '1-3 Shawwal 1447',
    event: 'Eid Holiday',
    description: 'Official UAE public holidays',
    isHighlight: false,
  },
]

/**
 * Department options
 */
export const DEPARTMENTS = [
  { value: 'IT', label: 'Information Technology' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Executive', label: 'Executive' },
  { value: 'Admin', label: 'Administration' },
  { value: 'Other', label: 'Other' },
]
