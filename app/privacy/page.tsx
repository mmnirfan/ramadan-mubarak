import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { PrivacyContent } from '@/components/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How RamadanHub collects, uses and protects the information you give when registering or cancelling Sehri in Hoskote.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <PageShell>
      <PrivacyContent />
    </PageShell>
  )
}
