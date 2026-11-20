import Arrow from './Arrow'
import { useEffect, useState } from 'react'
import './PageExperience.css'

export default function PageExperience() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 800)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window)) return

    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)

        if (preference.matches || !entry.target.animate) continue

        const animation = entry.target.animate(
          [
            { opacity: 0.65, transform: 'translateY(16px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 550,
            easing: 'cubic-bezier(.2,.7,.2,1)',
          },
        )
        animations.add(animation)
        animation.onfinish = () => animations.delete(animation)
      }
    }, { threshold: 0.08 })

    document.querySelectorAll(
      '.introduction, .expertise-layout, .audience-grid, .connected-heading, .principle-grid, .engagement-grid',
    ).forEach(element => observer.observe(element))

    const stop = () => {
      if (preference.matches) {
        animations.forEach(animation => animation.cancel())
        animations.clear()
      }
    }
    preference.addEventListener('change', stop)

    return () => {
      observer.disconnect()
      preference.removeEventListener('change', stop)
      animations.forEach(animation => animation.cancel())
    }
  }, [])

  function returnToTop() {
    const target = document.getElementById('home')
    if (!target) return
    target.tabIndex = -1
    target.focus({ preventScroll: true })
    window.scrollTo({
      top: 0,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <button className="back-to-top" hidden={!showTop}
      onClick={returnToTop} aria-label="Back to top of page">
      <span aria-hidden="true"><Arrow direction="up" /></span>
      <span>Top</span>
    </button>
  )
}
