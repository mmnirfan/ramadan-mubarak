/**
 * Form data types for registration
 */
export interface RegistrationFormData {
  fullName: string
  email: string
  phone: string
  department: string
  employeeId: string
  mealType: 'iftar' | 'suhoor' | ''
  date: Date | null
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
  date: null,
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
 * Department option type
 */
export interface DepartmentOption {
  value: string
  label: string
}
