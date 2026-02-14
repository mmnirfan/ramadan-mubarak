'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { formatDate, isRamadanDate, getDaysInMonth, getFirstDayOfMonth } from '@/lib/utils'

interface DatePickerProps {
  values: Date[]
  onChange: (dates: Date[]) => void
  label: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function DatePicker({ values, onChange, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1))

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())

  const isRamadanDay = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return isRamadanDate(date)
  }

  const isDateSelected = (day: number): boolean => {
    return values.some(d => 
      d.getDate() === day && 
      d.getMonth() === currentMonth.getMonth() && 
      d.getFullYear() === currentMonth.getFullYear()
    )
  }

  const toggleDate = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (isDateSelected(day)) {
      // Remove date
      onChange(values.filter(d => 
        !(d.getDate() === day && 
          d.getMonth() === currentMonth.getMonth() && 
          d.getFullYear() === currentMonth.getFullYear())
      ))
    } else {
      // Add date
      onChange([...values, selectedDate].sort((a, b) => a.getTime() - b.getTime()))
    }
  }

  const removeDate = (dateToRemove: Date) => {
    onChange(values.filter(d => d.getTime() !== dateToRemove.getTime()))
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
      
      {/* Selected Dates Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white cursor-pointer hover:border-amber-400/50 transition-all duration-300 min-h-[48px]"
      >
        {values.length === 0 ? (
          <div className="flex items-center gap-3 text-slate-400">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Click to select dates (multiple allowed)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="text-amber-300 text-sm font-medium">
              {values.length} date{values.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>

      {/* Selected Dates Tags */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {values.map((date, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-lg px-3 py-1.5 text-sm"
            >
              <span className="text-amber-200">{formatDate(date)}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeDate(date)
                }}
                className="text-amber-400 hover:text-amber-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Calendar Dropdown */}
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
              const isSelected = isDateSelected(day)

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDate(day)}
                  className={`
                    p-2 rounded-lg text-sm font-medium transition-all duration-200 relative
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
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-300/60">
              <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30"></div>
              <span>Ramadan 2026</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}