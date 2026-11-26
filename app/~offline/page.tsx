import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { OfflineContent } from '@/components/OfflineContent'

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <PageShell>
      <OfflineContent />
    </PageShell>
  )
}
