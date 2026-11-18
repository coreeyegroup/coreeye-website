import Footer from './components/Footer'
import EngagementGuide from './components/EngagementGuide'
import PageExperience from './components/PageExperience'
import CoreVisual from './components/CoreVisual'
import ConnectedExpertise from './components/ConnectedExpertise'
import { useEffect, useRef, useState } from 'react'
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
  const dialog = useRef<HTMLDialogElement>(null)
  const introductionButton = useRef<HTMLButtonElement>(null)
  const active = divisions[division]
  const client = audiences[audience]

  function explore(index: number) {
    setDivision(index)
    document.getElementById('expertise')?.scrollIntoView()
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
                Financial intelligence. Enterprise engineering. Cyber protection.
                Digital reputation. Connected around the responsibilities of
                institutions, distinguished families and private principals.
              </p>
              <div className="actions">
                <a className="button" href="#engagement">Request a Private Introduction ↗</a>
                <a className="quiet-link" href="#expertise">Explore our expertise →</a>
              </div>
            </div>
            <CoreVisual onExplore={explore} />
          </div>
          <div className="shell hero-base">
            <span>Selective relationships. Significant responsibilities.</span>
            <span>Private, mandate-led engagement.</span>
          </div>
        </section>

        <section className="shell section introduction" id="group">
          <div>
            <p className="eyebrow">The Group</p>
            <h2>Clarity beneath<br />the surface.</h2>
          </div>
          <div className="reading">
            <p className="lead">Wealth, technology, security and reputation are interconnected responsibilities.</p>
            <p>Core Eye brings specialist disciplines into a coordinated perspective.
              Each engagement begins with understanding what matters, where dependencies
              exist and which responsibilities require attention.</p>
            <p>Our intended relationships span institutions, families and private
              principals who value discretion, informed judgment and long-term continuity.</p>
          </div>
        </section>

        <section className="expertise section" id="expertise">
          <div className="shell">
            <p className="eyebrow">Our expertise</p>
            <h2>Four disciplines.<br />Defined responsibilities.</h2>
            <div className="expertise-layout">
              <div className="division-list" role="group" aria-label="Choose a division">
                {divisions.map((item, index) => (
                  <button key={item.id} aria-pressed={division === index}
                    aria-controls="division-detail" onClick={() => setDivision(index)}>
                    <span>0{index + 1}</span>{item.name}<span>↗</span>
                  </button>
                ))}
              </div>
              <article id="division-detail" className="division-detail" aria-live="polite">
                <p className="eyebrow">{active.name}</p>
                <h3>{active.verb}</h3>
                <p>{active.summary}</p>
                <ul>{active.scope.map(item => <li key={item}>{item}</li>)}</ul>
                <div className="deliverable">
                  <span className="eyebrow">Potential engagement output</span>
                  <p>{active.output}</p>
                </div>
                <a className="quiet-link" href={`/expertise/${active.id}`}>Explore {active.name} ↗</a>
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

        <section className="principles section">
          <div className="shell">
            <p className="eyebrow">The way we work</p>
            <h2>Quiet in approach.<br />Clear in responsibility.</h2>
            <div className="principle-grid">
              {[
                ['Discretion', 'Careful disclosure and respect for the boundaries of each relationship.'],
                ['Judgment', 'Analysis and technology interpreted within the context of the decision.'],
                ['Accountability', 'Defined scope, responsibilities and communication arrangements.'],
                ['Continuity', 'Attention to ownership, institutional knowledge and long-term dependencies.'],
              ].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <EngagementGuide />

        <section className="shell section" id="engagement">
          <p className="eyebrow">Private engagement</p>
          <h2>Begin with understanding.</h2>
          <div className="engagement-grid">
            {[
              ['01 / Introduction', 'Understand your context', 'Establish priorities and the nature of the proposed work.'],
              ['02 / Alignment', 'Define the requirements', 'Consider suitability, specialist needs and scope.'],
              ['03 / Mandate', 'Agree the relationship', 'Document objectives, responsibilities and delivery arrangements.'],
            ].map(([label, title, text]) => <article key={label}>
              <p className="eyebrow">{label}</p><h3>{title}</h3><p>{text}</p>
            </article>)}
          </div>
          <button ref={introductionButton} className="button dark-button"
            onClick={() => dialog.current?.showModal()}>Request a Private Introduction ↗</button>
        </section>
      </main>
      <Footer />
      <dialog ref={dialog} aria-labelledby="dialog-title"
        onClose={() => introductionButton.current?.focus()}>
        <button className="dialog-close" onClick={() => dialog.current?.close()}>Close ×</button>
        <p className="eyebrow">Private introduction</p>
        <h2 id="dialog-title">A considered beginning.</h2>
        <p>The enquiry channel is being prepared. This preview does not collect or send information.</p>
        <p>Once configured, the first introduction will request contact details and a brief
          outline of your priorities. Sensitive documents should be shared through an agreed channel.</p>
      </dialog>
    </>
  )
}
