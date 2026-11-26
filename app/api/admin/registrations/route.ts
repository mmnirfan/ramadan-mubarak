import { NextResponse } from 'next/server'
import { getAdminSession, noStore, unauthorized } from '@/lib/auth/server'
import { AdminSheetError, callAdminScript } from '@/lib/admin/sheet'
import type { AdminListResponse } from '@/lib/admin/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getAdminSession())) return unauthorized()

  try {
    const result = await callAdminScript<AdminListResponse>('admin.list')
    return NextResponse.json(result, { status: result.success ? 200 : 502, headers: noStore })
  } catch (error) {
    const message = error instanceof AdminSheetError ? error.message : 'Failed to load registrations'
    return NextResponse.json({ success: false, error: message }, { status: 502, headers: noStore })
  }
}
