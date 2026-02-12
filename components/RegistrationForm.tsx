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
} from 'lucide-react'
import { DatePicker } from './ui'
import { RegistrationFormData, initialFormData } from '@/lib/types'
import { submitRegistration, validateFormData } from '@/lib/api'
import { DEPARTMENTS } from '@/lib/utils'

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (field: keyof RegistrationFormData, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSubmitError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    // Validate form
    const validationError = validateFormData(formData)
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitRegistration(formData)

      if (result.success) {
        setIsSubmitted(true)

        // Reset form after showing success
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData(initialFormData)
        }, 4000)
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
    formData.date

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
              Fill in your details to join the blessed gatherings
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
              <p className="text-slate-400">
                Jazak Allah Khair. You&apos;ll receive a confirmation email shortly.
              </p>
              <p className="text-amber-400/70 text-sm mt-4">
                Your registration has been saved to our records.
              </p>
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

                <div className="grid md:grid-cols-2 gap-6">
                  <DatePicker
                    label="Select Date *"
                    value={formData.date}
                    onChange={(date) => handleInputChange('date', date)}
                  />

                  <div>
                    <label className="block text-amber-200/80 text-sm font-medium mb-2">
                      Number of Guests
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
                </div>

                <div>
                  <label className="block text-amber-200/80 text-sm font-medium mb-2">
                    Dietary Requirements / Notes
                  </label>
                  <textarea
                    value={formData.dietaryNotes}
                    onChange={(e) => handleInputChange('dietaryNotes', e.target.value)}
                    placeholder="Any allergies, dietary restrictions, or special requests..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
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
                      <span>Register for Meal</span>
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
