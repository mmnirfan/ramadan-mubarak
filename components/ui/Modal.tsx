'use client'

import { ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  closeLabel: string
  children: ReactNode
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Centered dialog rendered into <body> - ancestors with backdrop-filter
 * (the glass cards) would otherwise break `position: fixed`.
 * Closes on Escape / backdrop click, traps Tab focus and locks page scroll.
 */
export function Modal({ open, onClose, title, description, closeLabel, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = requestAnimationFrame(() => {
      const firstField = dialogRef.current?.querySelector<HTMLElement>('input, textarea, select')
      ;(firstField ?? dialogRef.current)?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => onCloseRef.current()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 animate-fade-in focus:outline-none"
      >
        <button
          type="button"
          onClick={() => onCloseRef.current()}
          aria-label={closeLabel}
          className="absolute top-4 end-4 p-2 rounded-full text-slate-400 hover:text-amber-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id={titleId} className="font-display text-2xl font-bold text-white pe-10 mb-2">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="text-slate-400 text-sm mb-6">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>,
    document.body
  )
}
