/**
 * Registration row as returned to the admin dashboard
 */
export type BookingStatus = 'Active' | 'Cancelled' | 'Removed'

export interface AdminRegistration {
  row: number           // sheet row number - used (with phone + date) to identify a booking
  timestamp: string     // ISO
  fullName: string
  phone: string
  email: string
  occupation: string
  address: string
  masjidName: string
  date: string          // yyyy-MM-dd
  status: BookingStatus
  statusChangedAt: string // ISO, when cancelled / removed
  reason: string        // cancel reason, or "Removed by admin"
}

export interface AdminListResponse {
  success: boolean
  registrations?: AdminRegistration[]
  error?: string
}

export interface AdminRemoveResponse {
  success: boolean
  emailed?: boolean     // whether the person was notified by email
  error?: string
}
