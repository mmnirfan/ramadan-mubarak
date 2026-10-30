import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { NotFoundContent } from '@/components/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <PageShell>
      <NotFoundContent />
    </PageShell>
  )
}
