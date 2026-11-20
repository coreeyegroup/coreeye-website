export default function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'right' | 'up' }) {
  const path = direction === 'right' ? 'M3 8h10M9 4l4 4-4 4'
    : direction === 'up' ? 'M8 13V3M4 7l4-4 4 4'
    : 'M4 12l8-8M5 4h7v7'

  return (
    <svg className="link-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}
