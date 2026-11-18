import ExpertiseMenu from './ExpertiseMenu'
import { useEffect, useRef, useState } from 'react'

const links = [
  { id: 'group', label: 'The Group' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'clients', label: 'Who We Serve' },
  { id: 'connected', label: 'Our Approach' },
  { id: 'engagement', label: 'Private Engagement ↗' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menu = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)


  /* Measure header for section layout */
  useEffect(() => {
    const element = header.current
    if (!element) return

    const measure = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${Math.ceil(element.getBoundingClientRect().height)}px`,
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--header-height')
    }
  }, [])

  useEffect(() => {
    let frame = 0

    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const threshold = (header.current?.offsetHeight ?? 92) + 100
        let current = ''
        for (const link of links) {
          const section = document.getElementById(link.id)
          if (section && section.getBoundingClientRect().top <= threshold) {
            current = link.id
          }
        }
        setActive(current)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const breakpoint = matchMedia('(min-width: 801px)')
    const reset = () => {
      if (breakpoint.matches) setOpen(false)
    }
    breakpoint.addEventListener('change', reset)
    return () => breakpoint.removeEventListener('change', reset)
  }, [])

  useEffect(() => {
    if (!open) return

    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menu.current?.focus()
      }
    }
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
    }
  }, [open])

  return (
    <header ref={header}>
      <div className="shell header-inner">
        <a className="brand" href="/" onClick={() => setOpen(false)}>
          CORE EYE GROUP
          <small>PRIVATE INSTITUTIONAL STEWARDSHIP</small>
        </a>
        <button ref={menu} id="menu-toggle" className="menu-toggle"
          aria-expanded={open} aria-controls="main-nav"
          onClick={() => setOpen(value => !value)}>
          {open ? 'Close ×' : 'Menu +'}
        </button>
        <nav id="main-nav" aria-label="Main navigation"
          className={open ? 'open' : ''}>
          {links.map(link => link.id === 'expertise' ? (
            <ExpertiseMenu key={link.id} onNavigate={() => setOpen(false)} />
          ) : (
            <a key={link.id} href={`${window.location.pathname === '/' ? '' : '/'}#${link.id}`}
              aria-current={active === link.id ? 'location' : undefined}
              onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
