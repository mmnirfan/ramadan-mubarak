import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, isSameOrigin, noStore, unauthorized } from '@/lib/auth/server'
import { AdminSheetError, callAdminScript } from '@/lib/admin/sheet'
import type { AdminRemoveResponse } from '@/lib/admin/types'

export const dynamic = 'force-dynamic'

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/
// A person can book at most every day of Ramadan
const MAX_DATES = 31

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 403, headers: noStore })
  }

  let body: { row?: unknown; phone?: unknown; date?: unknown; dates?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400, headers: noStore })
  }

  const row = Number(body.row)
  const phone = typeof body.phone === 'string' ? body.phone : ''
  // One date (`date`) or several (`dates`) of the same person
  const rawDates: unknown[] = Array.isArray(body.dates) ? body.dates : [body.date]
  const dates = [...new Set(rawDates.filter((d): d is string => typeof d === 'string'))]
  const datesValid = dates.length > 0 && dates.length <= MAX_DATES && dates.length === rawDates.length && dates.every((d) => DATE_KEY.test(d))
  if (!Number.isInteger(row) || row < 2 || !phone || !datesValid) {
    return NextResponse.json({ success: false, error: 'Invalid booking' }, { status: 400, headers: noStore })
  }

  try {
    // The script re-checks the phone so a shifted row can't remove the wrong person
    const result = await callAdminScript<AdminRemoveResponse>('admin.remove', { row, phone, dates, removedBy: session.sub })
    return NextResponse.json(result, { status: result.success ? 200 : 409, headers: noStore })
  } catch (error) {
    const message = error instanceof AdminSheetError ? error.message : 'Failed to remove registration'
    return NextResponse.json({ success: false, error: message }, { status: 502, headers: noStore })
  }
}
