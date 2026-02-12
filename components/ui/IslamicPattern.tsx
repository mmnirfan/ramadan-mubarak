'use client'

interface IslamicPatternProps {
  className?: string
}

export function IslamicPattern({ className = '' }: IslamicPatternProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="islamicPattern"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0L50 25L25 50L0 25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <circle
            cx="25"
            cy="25"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.2"
          />
          <path
            d="M25 15L35 25L25 35L15 25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.4"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamicPattern)" />
    </svg>
  )
}
