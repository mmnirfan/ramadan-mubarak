import { RegistrationFormData, ApiResponse } from './types'

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''

/**
 * Extended API Response with multiple dates support
 */
export interface RegistrationResponse extends ApiResponse {
  isDuplicate?: boolean
  partialDuplicate?: boolean
  duplicateType?: 'email' | 'phone'
  mealType?: string
  date?: string
  savedDates?: string[]
  duplicateDates?: string[]
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
      dates: formData.dates.map(d => d.toISOString().split('T')[0]),
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

    try {
      const result = await response.json()
      
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
          mealType: result.mealType,
          savedDates: result.savedDates,
          duplicateDates: result.duplicateDates,
          message: result.message,
        }
      }
      
      return {
        success: result.success,
        savedDates: result.savedDates,
        message: result.message || 'Registration saved successfully',
      }
    } catch {
      return {
        success: true,
        message: 'Registration saved successfully',
      }
    }
  } catch (error) {
    console.error('Submission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit registration',
    }
  }
}

/**
 * Validate form data
 */
export function validateFormData(formData: RegistrationFormData): string | null {
  if (!formData.fullName.trim()) {
    return 'Please enter your full name'
  }
  
  if (!formData.email.trim()) {
    return 'Please enter your email address'
  }
  
  if (!formData.email.includes('@')) {
    return 'Please enter a valid email address'
  }
  
  if (!formData.department) {
    return 'Please select your department'
  }
  
  if (!formData.mealType) {
    return 'Please select a meal type'
  }
  
  if (!formData.dates || formData.dates.length === 0) {
    return 'Please select at least one date'
  }
  
  return null
}