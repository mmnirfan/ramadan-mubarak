import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getAdminSession } from '@/lib/auth/server'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  // proxy.ts already redirects signed-out visitors; this is a second check
  const session = await getAdminSession()
  if (!session) redirect('/signin?next=/admin')

  return <AdminDashboard username={session.sub} />
}
