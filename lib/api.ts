import { RegistrationFormData, RegistrationResponse, LookupResponse, FormErrorCode, CancellationFormData, CancellationResponse } from './types'
import { toDateKey, isRamadanDate } from './utils'
import { translations } from './i18n/translations'

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''

/**
 * Occupation as stored in the sheet - always the English label, whatever
 * language the form was filled in, so the organisers can read it
 */
function occupationLabel(formData: RegistrationFormData): string {
  if (!formData.occupation) return ''
  if (formData.occupation === 'other') return `Other: ${formData.occupationOther.trim()}`
  return translations.en.occupations[formData.occupation]
}

/**
 * Submit registration to Google Sheets (supports multiple dates)
 */
export async function submitRegistration(
  formData: RegistrationFormData
): Promise<RegistrationResponse> {
  try {
    // Prepare data for submission
    const submitData = {
      ...formData,
      occupation: occupationLabel(formData),
      occupationOther: undefined, // already folded into occupation; dropped by JSON.stringify
      dates: formData.dates.map(toDateKey),
      timestamp: new Date().toISOString(),
    }

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('Google Script URL not configured')
      return {
        success: true,
        message: 'Registration saved (demo mode)',
        savedDates: submitData.dates,
      }
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(submitData),
    })

    let result: RegistrationResponse
    try {
      result = await response.json()
    } catch {
      // Non-JSON reply (e.g. a Google error page) - the save cannot be confirmed
      return {
        success: false,
        errorCode: 'unconfirmed',
        error: 'Could not confirm your registration. Please try again.',
      }
    }

    if (result.isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        duplicateType: result.duplicateType,
        mealType: result.mealType,
        duplicateDates: result.duplicateDates,
        message: result.message,
        error: result.message,
      }
    }

    if (result.partialDuplicate) {
      return {
        success: true,
        partialDuplicate: true,
        duplicateType: result.duplicateType,
        mealType: result.mealType,
        savedDates: result.savedDates,
        duplicateDates: result.duplicateDates,
        message: result.message,
      }
    }

    return {
      success: Boolean(result.success),
      savedDates: result.savedDates,
      message: result.message || 'Registration saved successfully',
      error: result.error,
    }
  } catch (error) {
    console.error('Submission error:', error)
    // Network/CORS failure - usually the Apps Script deployment is not
    // shared with "Anyone", so Google returns a sign-in page instead of JSON
    if (error instanceof TypeError) {
      return {
        success: false,
        errorCode: 'network',
        error: 'Could not reach the registration server. Please try again later.',
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit registration',
    }
  }
}

/**
 * Fetch existing registrations from Google Sheets by mobile number or name
 */
export async function lookupRegistrations(
  query: { phone?: string; name?: string }
): Promise<LookupResponse> {
  if (!GOOGLE_SCRIPT_URL) {
    return { success: true, count: 0, registrations: [] }
  }

  try {
    const params = new URLSearchParams()
    if (query.phone?.trim()) params.set('phone', query.phone.trim())
    if (query.name?.trim()) params.set('name', query.name.trim())

    const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`)
    return await response.json()
  } catch (error) {
    console.error('Lookup error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch registrations',
    }
  }
}

/**
 * Validate form data - returns an error code (translated in the UI) or null
 */
export function validateFormData(formData: RegistrationFormData): FormErrorCode | null {
  if (!formData.fullName.trim()) {
    return 'fullName'
  }

  if (formData.phone.replace(/\D/g, '').length < 10) {
    return 'phone'
  }

  // Email is optional, but must be valid when given
  if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    return 'emailInvalid'
  }

  if (!formData.occupation) {
    return 'occupation'
  }

  if (formData.occupation === 'other' && !formData.occupationOther.trim()) {
    return 'occupationOther'
  }

  if (!formData.address.trim()) {
    return 'address'
  }

  if (!formData.masjidName.trim()) {
    return 'masjidName'
  }

  if (!formData.dates || formData.dates.length === 0) {
    return 'dates'
  }

  if (formData.dates.some(d => !isRamadanDate(d))) {
    return 'datesOutOfRange'
  }

  return null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Cancel Sehri on the given dates. The person is identified by the mobile
 * number or email they registered with.
 */
export async function submitCancellation(
  formData: CancellationFormData
): Promise<CancellationResponse> {
  const contact = formData.contact.trim()
  const submitData = {
    action: 'cancel',
    ...(contact.includes('@') ? { email: contact } : { phone: contact }),
    dates: formData.dates.map(toDateKey),
    reason: formData.reason.trim(),
  }

  if (!GOOGLE_SCRIPT_URL) {
    console.warn('Google Script URL not configured')
    return { success: true, message: 'Cancelled (demo mode)', cancelledDates: submitData.dates }
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(submitData),
    })

    let result: CancellationResponse & { notFound?: boolean }
    try {
      result = await response.json()
    } catch {
      return { success: false, errorCode: 'unconfirmed', error: 'Could not confirm the cancellation. Please try again.' }
    }

    if (result.notFound) {
      return { success: false, errorCode: 'notFound', notFoundDates: result.notFoundDates, error: result.message }
    }

    return {
      success: Boolean(result.success),
      cancelledDates: result.cancelledDates,
      notFoundDates: result.notFoundDates,
      message: result.message,
      error: result.error,
    }
  } catch (error) {
    console.error('Cancellation error:', error)
    if (error instanceof TypeError) {
      return { success: false, errorCode: 'network', error: 'Could not reach the registration server. Please try again later.' }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to cancel' }
  }
}

/**
 * Validate the cancellation form - returns an error code (translated in the UI) or null
 */
export function validateCancellation(formData: CancellationFormData): FormErrorCode | null {
  const contact = formData.contact.trim()
  const isEmail = contact.includes('@')
  if (isEmail ? !EMAIL_PATTERN.test(contact) : contact.replace(/\D/g, '').length < 10) {
    return 'contact'
  }

  if (formData.dates.length === 0) {
    return 'dates'
  }

  if (formData.dates.some(d => !isRamadanDate(d))) {
    return 'datesOutOfRange'
  }

  return null
}
