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
import { RegistrationFormData, initialFormData } from '@/lib/types'
import { submitRegistration, validateFormData, RegistrationResponse } from '@/lib/api'
import { DEPARTMENTS } from '@/lib/utils'

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitResult, setSubmitResult] = useState<{
    savedDates?: string[]
    duplicateDates?: string[]
    partialDuplicate?: boolean
    isDuplicate?: boolean
    mealType?: string
  } | null>(null)

  const handleInputChange = (field: keyof RegistrationFormData, value: string | Date[] | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSubmitError('')
    setSubmitResult(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitResult(null)

    const validationError = validateFormData(formData)
    if (validationError) {
      setSubmitError(validationError)
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
          duplicateDates: result.duplicateDates,
          mealType: result.mealType,
        })
      } else {
        setSubmitError(result.error || 'Failed to submit. Please try again.')
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.fullName &&
    formData.email &&
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
                Ramadan 2026
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Register for Meals
            </h2>
            <p className="text-slate-400 font-body">
              Fill in your details and select multiple dates at once
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Registration Successful!
              </h3>
              <p className="text-slate-400 mb-4">
                Jazak Allah Khair. You&apos;ll receive a confirmation email shortly.
              </p>
              
              {/* Show saved dates */}
              {submitResult?.savedDates && submitResult.savedDates.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-4 text-left max-w-md mx-auto">
                  <p className="text-emerald-300 font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Registered for {submitResult.savedDates.length} date(s):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submitResult.savedDates.map((date, i) => (
                      <span key={i} className="text-emerald-200 text-sm bg-emerald-500/20 px-2 py-1 rounded">
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Show duplicate dates warning if partial */}
              {submitResult?.partialDuplicate && submitResult?.duplicateDates && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4 text-left max-w-md mx-auto">
                  <p className="text-amber-300 font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Already registered for {submitResult.duplicateDates.length} date(s):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submitResult.duplicateDates.map((date, i) => (
                      <span key={i} className="text-amber-200 text-sm bg-amber-500/20 px-2 py-1 rounded">
                        {date}
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
                    Personal Information
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      placeholder="e.g., EMP-12345"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@company.com"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+971 XX XXX XXXX"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Department *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <select
                        required
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="input-field pl-12 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">
                          Select department
                        </option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept.value} value={dept.value} className="bg-slate-900">
                            {dept.label}
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
                  <span className="font-body font-semibold">Meal Details</span>
                </div>

                {/* Meal Type Selection */}
                <div>
                  <label className="block text-amber-200/80 text-sm font-medium mb-3">
                    Meal Type *
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
                          Iftar
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          Evening meal at sunset
                        </p>
                        <p className="text-xs text-amber-400 mt-2">~6:18 PM</p>
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
                          Suhoor
                        </p>
                        <p className="text-sm text-slate-400 mt-1">Pre-dawn meal</p>
                        <p className="text-xs text-amber-400 mt-2">~4:30 AM</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Multi-Date Picker */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-amber-400/70" />
                    <span className="text-amber-400/70 text-xs">
                      You can select multiple dates for the same meal type
                    </span>
                  </div>
                  <DatePicker
                    label="Select Dates *"
                    values={formData.dates}
                    onChange={(dates) => handleInputChange('dates', dates)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Number of Guests (per day)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
                      <select
                        value={formData.guestCount}
                        onChange={(e) => handleInputChange('guestCount', e.target.value)}
                        className="input-field pl-12 appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num} className="bg-slate-900">
                            {num} {num === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Dietary Requirements
                    </label>
                    <input
                      type="text"
                      value={formData.dietaryNotes}
                      onChange={(e) => handleInputChange('dietaryNotes', e.target.value)}
                      placeholder="Allergies, restrictions..."
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
                      Already Registered!
                    </p>
                    <p className="text-amber-300/90 text-sm mb-2">
                      You have already registered for <strong>{submitResult.mealType}</strong> on all selected dates:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submitResult.duplicateDates?.map((date, i) => (
                        <span key={i} className="text-amber-200 text-sm bg-amber-500/20 px-2 py-1 rounded">
                          {date}
                        </span>
                      ))}
                    </div>
                    <p className="text-amber-400/70 text-xs mt-3">
                      Please select different dates or contact HR to modify your registration.
                    </p>
                  </div>
                </div>
              )}

              {/* General Error Message */}
              {submitError && !submitResult?.isDuplicate && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{submitError}</span>
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
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>
                        Register for {formData.dates.length || 0} Date{formData.dates.length !== 1 ? 's' : ''}
                      </span>
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