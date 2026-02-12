'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { formatDate, isRamadanDate, getDaysInMonth, getFirstDayOfMonth } from '@/lib/utils'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  label: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1))

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())

  const isRamadanDay = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return isRamadanDate(date)
  }

  const selectDate = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onChange(selected)
    setIsOpen(false)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="relative">
      <label className="block text-amber-200/80 text-sm font-medium mb-2">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white cursor-pointer hover:border-amber-400/50 transition-all duration-300 flex items-center gap-3"
      >
        <Calendar className="w-5 h-5 text-amber-400" />
        <span className={value ? 'text-white' : 'text-slate-400'}>
          {value ? formatDate(value) : 'Select date'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-300"
            >
              ←
            </button>
            <span className="text-amber-100 font-semibold">
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-300"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-amber-400/60 font-medium py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isRamadan = isRamadanDay(day)
              const isSelected =
                value &&
                value.getDate() === day &&
                value.getMonth() === currentMonth.getMonth() &&
                value.getFullYear() === currentMonth.getFullYear()

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`
                    p-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/30'
                        : isRamadan
                        ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center gap-2 text-xs text-amber-300/60">
            <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30"></div>
            <span>Ramadan 2026 (Feb 17 - Mar 18)</span>
          </div>
        </div>
      )}
    </div>
  )
}
