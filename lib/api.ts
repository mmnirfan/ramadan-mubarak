import { RegistrationFormData, ApiResponse } from './types'

/**
 * Google Apps Script Web App URL
 * Replace with your deployed Google Apps Script URL
 */
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''

/**
 * Submit registration to Google Sheets
 */
export async function submitRegistration(
  formData: RegistrationFormData
): Promise<ApiResponse> {
  try {
    // Prepare data for submission
    const submitData = {
      ...formData,
      date: formData.date ? formData.date.toISOString().split('T')[0] : '',
      timestamp: new Date().toISOString(),
    }

    // Check if URL is configured
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('Google Script URL not configured')
      // Return success for demo purposes
      return {
        success: true,
        message: 'Registration saved (demo mode)',
      }
    }

    // Submit to Google Sheets via Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData),
    })

    // Since no-cors doesn't return response body, we assume success
    return {
      success: true,
      message: 'Registration saved successfully',
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
  
  if (!formData.date) {
    return 'Please select a date'
  }
  
  return null // No errors
}
