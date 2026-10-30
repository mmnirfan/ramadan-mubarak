import type { Occupation } from './utils'

/**
 * Sehri registration for people staying in PGs / hostels / rooms in Hoskote
 * (supports multiple dates)
 */
export interface RegistrationFormData {
  fullName: string
  phone: string
  email: string        // optional
  occupation: Occupation | ''
  occupationOther: string  // free text when occupation is 'other'
  address: string      // where they are staying (PG / hostel / room)
  masjidName: string   // nearest masjid to where they are staying
  mealType: 'suhoor'  // Sehri only
  dates: Date[]
}

/**
 * Initial form state
 */
export const initialFormData: RegistrationFormData = {
  fullName: '',
  phone: '',
  email: '',
  occupation: '',
  occupationOther: '',
  address: '',
  masjidName: '',
  mealType: 'suhoor',
  dates: [],
}

/**
 * Prayer time type
 */
export interface PrayerTime {
  name: string
  time: string
}

/**
 * Important date type
 */
export interface ImportantDate {
  date: string
  hijriDate: string
  event: string
  description?: string
  isHighlight?: boolean
}

/**
 * API response type
 */
export interface ApiResponse {
  success: boolean
  message?: string
  error?: string
  data?: Record<string, unknown>
}

/**
 * Extended API response with multiple dates support
 */
export interface RegistrationResponse extends ApiResponse {
  isDuplicate?: boolean
  partialDuplicate?: boolean
  duplicateType?: 'name' | 'phone'
  mealType?: string
  savedDates?: string[]      // yyyy-MM-dd
  duplicateDates?: string[]  // yyyy-MM-dd
  errorCode?: FormErrorCode  // set for client-side failures, translated in the UI
}

/**
 * Error codes shown to the user (messages live in the translations)
 */
export type FormErrorCode =
  | 'fullName'
  | 'emailInvalid'
  | 'phone'
  | 'occupation'
  | 'occupationOther'
  | 'address'
  | 'masjidName'
  | 'dates'
  | 'datesOutOfRange'
  | 'contact'
  | 'notFound'
  | 'network'
  | 'unconfirmed'
  | 'generic'
  | 'unexpected'

/**
 * An existing registration returned by the lookup endpoint
 */
export interface ExistingRegistration {
  mealType: string
  date: string  // yyyy-MM-dd
}

/**
 * Lookup response (search by phone or name)
 */
export interface LookupResponse extends ApiResponse {
  count?: number
  registrations?: ExistingRegistration[]
}

/**
 * Sehri cancellation - identified by the mobile number or email used to register
 */
export interface CancellationFormData {
  contact: string  // mobile number or email
  dates: Date[]
  reason: string   // optional
}

export const initialCancellationData: CancellationFormData = {
  contact: '',
  dates: [],
  reason: '',
}

export interface CancellationResponse extends ApiResponse {
  cancelledDates?: string[]  // yyyy-MM-dd
  notFoundDates?: string[]   // yyyy-MM-dd - no active booking on these dates
  errorCode?: FormErrorCode
}