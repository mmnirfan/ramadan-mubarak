import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, isSameOrigin, noStore, unauthorized } from '@/lib/auth/server'
import { AdminSheetError, callAdminScript } from '@/lib/admin/sheet'
import type { AdminRemoveResponse } from '@/lib/admin/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 403, headers: noStore })
  }

  let body: { row?: unknown; phone?: unknown; date?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400, headers: noStore })
  }

  const row = Number(body.row)
  const phone = typeof body.phone === 'string' ? body.phone : ''
  const date = typeof body.date === 'string' ? body.date : ''
  if (!Number.isInteger(row) || row < 2 || !phone || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ success: false, error: 'Invalid booking' }, { status: 400, headers: noStore })
  }

  try {
    // Phone + date are re-checked by the script so a shifted row can't remove the wrong person
    const result = await callAdminScript<AdminRemoveResponse>('admin.remove', { row, phone, date, removedBy: session.sub })
    return NextResponse.json(result, { status: result.success ? 200 : 409, headers: noStore })
  } catch (error) {
    const message = error instanceof AdminSheetError ? error.message : 'Failed to remove registration'
    return NextResponse.json({ success: false, error: message }, { status: 502, headers: noStore })
  }
}
