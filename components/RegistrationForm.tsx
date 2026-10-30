'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Briefcase,
  House,
  MapPin,
  Landmark,
  Moon,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react'
import { DatePicker } from './ui'
import { RegistrationFormData, RegistrationResponse, FormErrorCode, initialFormData } from '@/lib/types'
import { submitRegistration, validateFormData } from '@/lib/api'
import { OCCUPATION_GROUPS, OccupationGroup } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export function RegistrationForm() {
  const { t, locale, formatDateKey } = useLanguage()
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<{ code: FormErrorCode; detail?: string } | null>(null)
  const [submitResult, setSubmitResult] = useState<{
    savedDates?: string[]
    duplicateDates?: string[]
    partialDuplicate?: boolean
    isDuplicate?: boolean
    duplicateType?: 'name' | 'phone'
  } | null>(null)

  const handleInputChange = (field: keyof RegistrationFormData, value: string | Date[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSubmitError(null)
    setSubmitResult(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitResult(null)

    const validationError = validateFormData(formData)
    if (validationError) {
      setSubmitError({ code: validationError })
      return
    }

    setIsSubmitting(true)

    try {
      const result: RegistrationResponse = await submitRegistration(formData)

      if (result.success && !result.partialDuplicate) {
        // Full success
        setSubmitResult({
          savedDates: result.savedDates,
        })
        setIsSubmitted(true)

        setTimeout(() => {
          setIsSubmitted(false)
          setFormData(initialFormData)
          setSubmitResult(null)
        }, 5000)
      } else if (result.success && result.partialDuplicate) {
        // Partial success - some dates saved, some were duplicates
        setSubmitResult({
          savedDates: result.savedDates,
          duplicateDates: result.duplicateDates,
          partialDuplicate: true,
        })
        setIsSubmitted(true)

        setTimeout(() => {
          setIsSubmitted(false)
          setFormData(initialFormData)
          setSubmitResult(null)
        }, 6000)
      } else if (result.isDuplicate) {
        // All dates were duplicates
        setSubmitResult({
          isDuplicate: true,
          duplicateType: result.duplicateType,
          duplicateDates: result.duplicateDates,
        })
      } else {
        setSubmitError({ code: result.errorCode ?? 'generic', detail: result.error })
      }
    } catch {
      setSubmitError({ code: 'unexpected' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Server messages are English-only; in Urdu show the translated message instead
  const errorMessage = submitError
    ? locale === 'en' && submitError.detail && submitError.code === 'generic'
      ? submitError.detail
      : t.errors[submitError.code]
    : ''

  const isFormValid =
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.occupation &&
    (formData.occupation !== 'other' || formData.occupationOther.trim()) &&
    formData.address.trim() &&
    formData.masjidName.trim() &&
    formData.dates.length > 0

  const labelClass = 'block text-amber-200/80 text-sm font-medium mb-2'
  const iconClass = 'absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50'

  return (
    <section id="register" className="relative z-10 px-6 py-16 scroll-mt-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 animate-slide-up">
          {/* Form Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm font-medium">
                {t.form.badge}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              {t.form.title}
            </h2>
            <p className="text-slate-400 font-body">
              {t.form.subtitle}
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {t.form.successTitle}
              </h3>
              <p className="text-slate-400 mb-4">
                {t.form.successText}
              </p>

              {/* Show saved dates */}
              {submitResult?.savedDates && submitResult.savedDates.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-4 text-start max-w-md mx-auto">
                  <p className="text-emerald-300 font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.form.registeredFor(submitResult.savedDates.length)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submitResult.savedDates.map((date, i) => (
                      <span key={i} className="text-emerald-200 text-sm bg-emerald-500/20 px-2 py-1 rounded">
                        {formatDateKey(date)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Show duplicate dates warning if partial */}
              {submitResult?.partialDuplicate && submitResult?.duplicateDates && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4 text-start max-w-md mx-auto">
                  <p className="text-amber-300 font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {t.form.alreadyRegisteredFor(submitResult.duplicateDates.length)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submitResult.duplicateDates.map((date, i) => (
                      <span key={i} className="text-amber-200 text-sm bg-amber-500/20 px-2 py-1 rounded">
                        {formatDateKey(date)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-amber-300 mb-4">
                  <User className="w-5 h-5" />
                  <span className="font-body font-semibold">
                    {t.form.personalInfo}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className={labelClass}>
                      {t.form.fullName}
                    </label>
                    <div className="relative">
                      <User className={iconClass} />
                      <input
                        id="fullName"
                        type="text"
                        required
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder={t.form.fullNamePlaceholder}
                        className="input-field ps-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      {t.form.phone}
                    </label>
                    <div className="relative" dir="ltr">
                      <Phone className={iconClass} />
                      <input
                        id="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t.form.phonePlaceholder}
                        className="input-field ps-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      {t.form.email}
                    </label>
                    <div className="relative" dir="ltr">
                      <Mail className={iconClass} />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t.form.emailPlaceholder}
                        className="input-field ps-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="occupation" className={labelClass}>
                      {t.form.occupation}
                    </label>
                    <div className="relative">
                      <Briefcase className={iconClass} />
                      <select
                        id="occupation"
                        required
                        value={formData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        className="input-field ps-12 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">
                          {t.form.occupationPlaceholder}
                        </option>
                        {(Object.keys(OCCUPATION_GROUPS) as OccupationGroup[]).map((group) => (
                          <optgroup key={group} label={t.occupationGroups[group]} className="bg-slate-900">
                            {OCCUPATION_GROUPS[group].map((occupation) => (
                              <option key={occupation} value={occupation} className="bg-slate-900">
                                {t.occupations[occupation]}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {formData.occupation === 'other' && (
                    <div className="md:col-span-2 animate-fade-in">
                      <label htmlFor="occupationOther" className={labelClass}>
                        {t.form.occupationOther}
                      </label>
                      <div className="relative">
                        <Briefcase className={iconClass} />
                        <input
                          id="occupationOther"
                          type="text"
                          required
                          autoFocus
                          value={formData.occupationOther}
                          onChange={(e) => handleInputChange('occupationOther', e.target.value)}
                          placeholder={t.form.occupationOtherPlaceholder}
                          className="input-field ps-12"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Where You Are Staying */}
              <div className="space-y-6 pt-6 border-t border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-300 mb-4">
                  <House className="w-5 h-5" />
                  <span className="font-body font-semibold">{t.form.stayDetails}</span>
                </div>

                <div>
                  <label htmlFor="address" className={labelClass}>
                    {t.form.address}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute start-4 top-4 w-5 h-5 text-amber-400/50" />
                    <textarea
                      id="address"
                      required
                      rows={3}
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={t.form.addressPlaceholder}
                      className="input-field ps-12 resize-y"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="masjidName" className={labelClass}>
                    {t.form.masjid}
                  </label>
                  <div className="relative">
                    <Landmark className={iconClass} />
                    <input
                      id="masjidName"
                      type="text"
                      required
                      aria-describedby="masjidHint"
                      value={formData.masjidName}
                      onChange={(e) => handleInputChange('masjidName', e.target.value)}
                      placeholder={t.form.masjidPlaceholder}
                      className="input-field ps-12"
                    />
                  </div>
                  <p id="masjidHint" className="flex items-center gap-2 text-amber-400/70 text-xs mt-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    {t.form.masjidHint}
                  </p>
                </div>
              </div>

              {/* Sehri Dates */}
              <div className="space-y-6 pt-6 border-t border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-300 mb-4">
                  <Moon className="w-5 h-5" />
                  <span className="font-body font-semibold">{t.form.sehriDetails}</span>
                </div>

                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-100/90">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{t.form.sehriInfo}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-amber-400/70" />
                    <span className="text-amber-400/70 text-xs">
                      {t.form.multiDateHint}
                    </span>
                  </div>
                  <DatePicker
                    label={t.form.datesLabel}
                    values={formData.dates}
                    onChange={(dates) => handleInputChange('dates', dates)}
                  />
                </div>
              </div>

              {/* All Dates Duplicate Warning */}
              {submitResult?.isDuplicate && (
                <div className="flex items-start gap-3 text-amber-300 bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 animate-fade-in">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-200 mb-1">
                      {t.form.duplicateTitle}
                    </p>
                    <p className="text-amber-300/90 text-sm mb-2">
                      {submitResult.duplicateType === 'name' ? t.form.duplicateByName : t.form.duplicateByPhone}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submitResult.duplicateDates?.map((date, i) => (
                        <span key={i} className="text-amber-200 text-sm bg-amber-500/20 px-2 py-1 rounded">
                          {formatDateKey(date)}
                        </span>
                      ))}
                    </div>
                    <p className="text-amber-400/70 text-xs mt-3">
                      {t.form.duplicateHelp}
                    </p>
                  </div>
                </div>
              )}

              {/* General Error Message */}
              {submitError && !submitResult?.isDuplicate && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full py-4 px-8 rounded-xl font-body font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      <span>{t.form.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 rtl:-scale-x-100" />
                      <span>{t.form.submit(formData.dates.length)}</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  {t.form.privacyNote}{' '}
                  <Link href="/privacy" className="text-amber-300/80 underline underline-offset-2 hover:text-amber-200">
                    {t.form.privacyLink}
                  </Link>
                  {t.form.privacySuffix}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
