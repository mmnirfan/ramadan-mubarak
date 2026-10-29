/**
 * Form data types for registration (supports multiple dates)
 */
export interface RegistrationFormData {
  fullName: string
  email: string
  phone: string
  department: string
  employeeId: string
  mealType: 'iftar' | 'suhoor' | ''
  dates: Date[]  // Changed from single date to array
  guestCount: string
  dietaryNotes: string
}

/**
 * Initial form state
 */
export const initialFormData: RegistrationFormData = {
  fullName: '',
  email: '',
  phone: '',
  department: '',
  employeeId: '',
  mealType: '',
  dates: [],  // Empty array for multiple dates
  guestCount: '1',
  dietaryNotes: '',
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
}

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
 * Department option type
 */
export interface DepartmentOption {
  value: string
  label: string
}