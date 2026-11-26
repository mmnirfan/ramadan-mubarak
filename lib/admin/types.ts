/**
 * One booking (one person, one date) as returned to the admin dashboard.
 * The sheet keeps one row per person; the script expands each row into
 * one booking per date so the dashboard can count meals per day.
 */
export type BookingStatus = 'Active' | 'Cancelled' | 'Removed'

export interface AdminRegistration {
  row: number           // sheet row number = the person; used (with phone) to identify them
  timestamp: string     // ISO, when the person first registered
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
  emailed?: boolean       // whether the person was notified by email
  removedDates?: string[] // yyyy-MM-dd - the dates that were actually removed
  error?: string
}
