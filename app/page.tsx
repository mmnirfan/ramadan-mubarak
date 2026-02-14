import {
  Header,
  HeroSection,
  RegistrationForm,
  ImportantDatesSection,
  GuidelinesSection,
  EidSection,
  FastingTipsSection,
  ContactSection,
  Footer,
  Background,
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
      {/* Background Elements */}
      <Background />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Registration Form */}
      <RegistrationForm />

      {/* Section Divider */}
      <div className="section-divider max-w-4xl mx-auto my-8" />

      {/* Important Dates */}
      <ImportantDatesSection />

      {/* Section Divider */}
      <div className="section-divider max-w-4xl mx-auto my-8" />

      {/* Office Guidelines */}
      <GuidelinesSection />

      {/* Section Divider */}
      <div className="section-divider max-w-4xl mx-auto my-8" />

      {/* Eid Celebration */}
      <EidSection />

      {/* Section Divider */}
      <div className="section-divider max-w-4xl mx-auto my-8" />

      {/* Fasting Tips */}
      <FastingTipsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
