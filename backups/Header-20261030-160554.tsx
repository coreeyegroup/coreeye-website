import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header onKeyDown={event => {
      if (event.key === 'Escape' && open) {
        close()
        document.getElementById('menu-toggle')?.focus()
      }
    }}>
      <div className="shell header-inner">
        <a className="brand" href="#home" onClick={close}>
          CORE EYE GROUP
          <small>PRIVATE INSTITUTIONAL STEWARDSHIP</small>
        </a>
        <button id="menu-toggle" className="menu-toggle"
          aria-expanded={open} aria-controls="main-nav"
          onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="main-nav" aria-label="Main navigation" className={open ? 'open' : ''}>
          <a href="#group" onClick={close}>The Group</a>
          <a href="#expertise" onClick={close}>Expertise</a>
          <a href="#clients" onClick={close}>Who We Serve</a>
          <a href="#engagement" onClick={close}>Private Engagement ↗</a>
        </nav>
      </div>
    </header>
  )
}
