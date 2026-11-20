import Arrow from './components/Arrow'
import IntroductionForm from './components/IntroductionForm'
import GroupProfile from './components/GroupProfile'
import ExpertiseFlow from './components/ExpertiseFlow'
import EngagementProcess from './components/EngagementProcess'
import Footer from './components/Footer'
import EngagementGuide from './components/EngagementGuide'
import PageExperience from './components/PageExperience'
import CoreVisual from './components/CoreVisual'
import ConnectedExpertise from './components/ConnectedExpertise'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Header from './components/Header'
import { audiences, divisions } from './content/company'
import './styles/site.css'
import './styles/refinement.css'
import './styles/sections.css'

export default function App() {
  /* Restore incoming homepage section */
  useEffect(() => {
    function restoreSection() {
      let id = ''
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        return
      }
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
    }

    const frame = requestAnimationFrame(restoreSection)
    window.addEventListener('hashchange', restoreSection)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', restoreSection)
    }
  }, [])

  const [division, setDivision] = useState(0)
  const [audience, setAudience] = useState(0)
  const expertiseHeading = useRef<HTMLHeadingElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const introductionButton = useRef<HTMLButtonElement>(null)
  const introductionOrigin = useRef<HTMLElement | null>(null)
  const [introductionSession, setIntroductionSession] = useState(0)
  const [introductionInterest, setIntroductionInterest] = useState('')
  const [introductionPending, setIntroductionPending] = useState(false)

  function openIntroduction() {
    introductionOrigin.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialog.current?.showModal()
  }

  function closeIntroduction() {
    setIntroductionInterest('')
    setIntroductionSession(value => value + 1)
    const origin = introductionOrigin.current
    if (origin?.isConnected) {
      origin.focus({ preventScroll: true })
    } else {
      introductionButton.current?.focus({ preventScroll: true })
    }
  }
  const active = divisions[division]
  const client = audiences[audience]

  useEffect(() => {
    const url = new URL(window.location.href)
    const requested = url.searchParams.get('enquiry')
    const interest = divisions.find(item => item.id === requested)?.interest

    if (!interest) return

    const frame = requestAnimationFrame(() => {
      setIntroductionInterest(interest)
      introductionOrigin.current = introductionButton.current
      dialog.current?.showModal()

      url.searchParams.delete('enquiry')
      window.history.replaceState(
        window.history.state,
        '',
        url.pathname + url.search + url.hash,
      )
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  function explore(index: number) {
    flushSync(() => setDivision(index))
    expertiseHeading.current?.focus({ preventScroll: true })
    expertiseHeading.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <PageExperience />
      <main id="main">
        <section className="hero" id="home">
          <div className="shell hero-grid">
            <div>
              <p className="eyebrow">Intelligence · Discretion · Continuity</p>
              <h1>We operate at the <em>unseen core</em> of wealth, technology, and security</h1>
              <p className="hero-copy">
                Core Eye Group is a private strategic intelligence and technology group.
                We bring together financial intelligence, enterprise infrastructure, cybersecurity
                and digital authority for institutions, family offices and private principals.
              </p>
              <div className="actions">
                <button type="button" className="button"
                  onClick={openIntroduction}>
                  Request a Private Introduction <Arrow />
                </button>
                <a className="quiet-link" href="#expertise">Explore our expertise <Arrow direction="right" /></a>
              </div>
            </div>
            <CoreVisual onExplore={explore} />
          </div>
          <div className="shell hero-base">
            <span>Selective relationships. Significant responsibilities.</span>
            <span>Private, mandate-led engagement.</span>
          </div>
        </section>

        <GroupProfile />

        <section className="expertise section" id="expertise">
          <div className="shell">
            <p className="eyebrow">Our expertise</p>
            <h2>Four disciplines.<br />Defined responsibilities.</h2>
            <div className="expertise-layout">
              <div className="expertise-rail">
              <div className="division-list" role="group" aria-label="Choose a division">
                {divisions.map((item, index) => (
                  <button key={item.id} aria-pressed={division === index}
                    aria-controls="division-detail" onClick={() => setDivision(index)}>
                    <span>0{index + 1}</span>{item.capability}<span><Arrow /></span>
                  </button>
                ))}
              </div>
                <ExpertiseFlow key={active.id} division={active.id} />
              </div>
              <article id="division-detail" className="division-detail" aria-live="polite">
                <p className="eyebrow">{active.name}</p>
                <h3 ref={expertiseHeading} tabIndex={-1}>{active.capability}</h3>
                <p>{active.summary}</p>
                <ul>{active.scope.map(item => <li key={item}>{item}</li>)}</ul>
                <div className="deliverable">
                  <span className="eyebrow">Potential engagement output</span>
                  <p>{active.output}</p>
                </div>
                <a className="quiet-link" href={`/expertise/${active.id}/`}>Explore {active.name} <Arrow /></a>
                <p className="scope-note">Scope, responsibilities and any applicable professional
                  permissions are established for each mandate. Outcomes depend on the agreed work and context.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="shell section" id="clients">
          <p className="eyebrow">Who we serve</p>
          <h2>A select circle.<br />Individual understanding.</h2>
          <p className="section-copy">Explore the priorities that can shape a relationship.
            Audience categories describe our intended positioning.</p>
          <div className="audience-grid" role="group" aria-label="Choose a client profile">
            {audiences.map((item, index) => (
              <button key={item.name} aria-pressed={audience === index}
                aria-controls="audience-detail" onClick={() => setAudience(index)}>
                <strong>{item.name}</strong><span>{item.context}</span>
              </button>
            ))}
          </div>
          <article id="audience-detail" className="audience-detail" aria-live="polite">
            <div><p className="eyebrow">The responsibility</p><h3>{client.priority}</h3></div>
            <div><p className="eyebrow">Connecting the expertise</p><p>{client.connection}</p></div>
          </article>
        </section>

        <ConnectedExpertise />

        <EngagementProcess />

        <EngagementGuide />

        <section className="shell section" id="engagement">
          <p className="eyebrow">Private engagement</p>
          <h2>Begin with understanding.</h2>
          <p className="section-copy">Tell us what needs attention. We will review your enquiry before
            discussing scope, responsibilities, and any next steps.</p>
          <button ref={introductionButton} className="button dark-button"
            onClick={openIntroduction}>Request a Private Introduction <Arrow /></button>
        </section>
      </main>
      <Footer />
      <dialog ref={dialog} aria-labelledby="dialog-title"
        onCancel={event => {
          if (introductionPending) event.preventDefault()
        }}
        onClose={closeIntroduction}>
        <button type="button" className="dialog-close"
          disabled={introductionPending}
          onClick={() => dialog.current?.close()}>
          {introductionPending ? 'Submitting…' : 'Close ×'}
        </button>
        <p className="eyebrow">Private introduction</p>
        <h2 id="dialog-title">A private introduction.</h2>
        <IntroductionForm
          key={`${introductionSession}-${introductionInterest}`}
          initialInterest={introductionInterest}
          onSubmittingChange={setIntroductionPending}
        />
      </dialog>
    </>
  )
}
