'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Building2,
  ChefHat,
  Users,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { DatePicker } from './ui'
import { RegistrationFormData, RegistrationResponse, FormErrorCode, initialFormData } from '@/lib/types'
import { submitRegistration, validateFormData } from '@/lib/api'
import { DEPARTMENTS, MEAL_TIMES } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export function RegistrationForm() {
  const { t, locale, formatDateKey, formatTime } = useLanguage()
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
    mealType?: string
  } | null>(null)

  // The server sends "Iftar" / "Suhoor" - show it in the current language
  const mealLabel = (mealType?: string) => {
    const key = mealType?.toLowerCase()
    return key === 'iftar' || key === 'suhoor' ? t.meals[key] : mealType
  }

  const handleInputChange = (field: keyof RegistrationFormData, value: string | Date[] | null) => {
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
          mealType: result.mealType,
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
          mealType: result.mealType,
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

  // Server messages are English-only; in Arabic show the translated message instead
  const errorMessage = submitError
    ? locale === 'en' && submitError.detail && submitError.code === 'generic'
      ? submitError.detail
      : t.errors[submitError.code]
    : ''

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.department &&
    formData.mealType &&
    formData.dates.length > 0

  return (
    <section className="relative z-10 px-6 py-16">
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
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-amber-300 mb-4">
                  <User className="w-5 h-5" />
                  <span className="font-body font-semibold">
                    {t.form.personalInfo}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.fullName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder={t.form.fullNamePlaceholder}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.employeeId}
                    </label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      placeholder={t.form.employeeIdPlaceholder}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.email}
                    </label>
                    <div className="relative">
                      <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <input
                        type="email"
                        required
                        dir="ltr"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t.form.emailPlaceholder}
                        className="input-field ps-12 rtl:text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.phone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t.form.phonePlaceholder}
                        className="input-field ps-12 rtl:text-right"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.department}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <select
                        required
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="input-field ps-12 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">
                          {t.form.departmentPlaceholder}
                        </option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept} className="bg-slate-900">
                            {t.departments[dept]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Details */}
              <div className="space-y-6 pt-6 border-t border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-300 mb-4">
                  <ChefHat className="w-5 h-5" />
                  <span className="font-body font-semibold">{t.form.mealDetails}</span>
                </div>

                {/* Meal Type Selection */}
                <div>
                  <label className="block text-amber-200/80 text-sm font-medium mb-3">
                    {t.form.mealType}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('mealType', 'iftar')}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.mealType === 'iftar'
                          ? 'border-amber-400 bg-amber-500/20'
                          : 'border-amber-500/20 bg-slate-800/30 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🌙</div>
                        <p className="font-display text-xl font-semibold text-white">
                          {t.meals.iftar}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {t.form.iftarDescription}
                        </p>
                        <p className="text-xs text-amber-400 mt-2">
                          ~{formatTime(...MEAL_TIMES.iftar)}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInputChange('mealType', 'suhoor')}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.mealType === 'suhoor'
                          ? 'border-amber-400 bg-amber-500/20'
                          : 'border-amber-500/20 bg-slate-800/30 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">⭐</div>
                        <p className="font-display text-xl font-semibold text-white">
                          {t.meals.suhoor}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">{t.form.suhoorDescription}</p>
                        <p className="text-xs text-amber-400 mt-2">
                          ~{formatTime(...MEAL_TIMES.suhoor)}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Multi-Date Picker */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.guests}
                    </label>
                    <div className="relative">
                      <Users className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <select
                        value={formData.guestCount}
                        onChange={(e) => handleInputChange('guestCount', e.target.value)}
                        className="input-field ps-12 appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num} className="bg-slate-900">
                            {t.form.guestOption(num)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      {t.form.dietary}
                    </label>
                    <input
                      type="text"
                      value={formData.dietaryNotes}
                      onChange={(e) => handleInputChange('dietaryNotes', e.target.value)}
                      placeholder={t.form.dietaryPlaceholder}
                      className="input-field"
                    />
                  </div>
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
                      {submitResult.duplicateType === 'name' ? t.form.duplicateByName : t.form.duplicateByPhone}{' '}
                      <strong>{mealLabel(submitResult.mealType)}</strong> {t.form.duplicateSuffix}
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
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
