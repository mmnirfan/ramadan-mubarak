/**
 * Server-side calls to the Google Apps Script admin actions.
 * The admin key never reaches the browser - only route handlers import this file.
 */

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || ''

export class AdminSheetError extends Error {}

export async function callAdminScript<T>(action: 'admin.list' | 'admin.remove', payload: Record<string, unknown> = {}): Promise<T> {
  if (!SCRIPT_URL || !ADMIN_API_KEY) {
    throw new AdminSheetError('GOOGLE_SCRIPT_URL / ADMIN_API_KEY are not configured on the server')
  }

  let response: Response
  try {
    response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, key: ADMIN_API_KEY, ...payload }),
      cache: 'no-store',
    })
  } catch {
    throw new AdminSheetError('Could not reach the Google Apps Script')
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new AdminSheetError('Unexpected response from the Google Apps Script (is the new version deployed?)')
  }
}
