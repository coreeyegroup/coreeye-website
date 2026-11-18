import { useEffect, useRef, useState } from 'react'
import { divisions } from '../content/company'
import './ExpertiseMenu.css'

export default function ExpertiseMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  function navigate() {
    setOpen(false)
    onNavigate()
  }

  return (
    <div className="expertise-menu" ref={container}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation()
          setOpen(false)
          trigger.current?.focus()
        }
      }}>
      <button ref={trigger} className="expertise-trigger"
        aria-expanded={open} aria-controls="expertise-dropdown"
        aria-current={window.location.pathname.startsWith("/expertise/") ? 'location' : undefined}
        onClick={() => setOpen(value => !value)}>
        Expertise <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <div id="expertise-dropdown" className="expertise-dropdown" hidden={!open}>
        <p className="expertise-menu-label">Four specialist disciplines</p>
        {divisions.map(item => (
          <a key={item.id} href={`/expertise/${item.id}`} onClick={navigate}>
            <strong>{item.name}</strong>
            <span>{item.verb}</span>
          </a>
        ))}
        <a className="expertise-overview" href="/#expertise" onClick={navigate}>
          Explore the integrated perspective →
        </a>
      </div>
    </div>
  )
}
