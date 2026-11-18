import ExpertiseFlow from '../components/ExpertiseFlow'
import './DivisionProcess.css'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { divisions } from '../content/company'
import './DivisionPage.css'

export default function DivisionPage({ id }: { id: string }) {
  const division = divisions.find(item => item.id === id)

  if (!division) {
    return (
      <main className="shell section">
        <p className="eyebrow">Core Eye Group</p>
        <h1>Page not found.</h1>
        <p>The requested page is unavailable.</p>
        <a className="button dark-button" href="/">Return to the Group →</a>
      </main>
    )
  }

  return (
    <>
      <a className="skip" href="#division-main">Skip to content</a>
      <Header />

      <main id="division-main">
        <section className="division-page-hero">
          <div className="shell">
            <p className="eyebrow">The Group / Expertise / {division.name}</p>
            <h1>{division.verb}</h1>
            <p>{division.summary}</p>
            <a className="button" href="/#engagement">Explore a Private Engagement ↗</a>
          </div>
        </section>

        <section className="shell section division-page-layout">
          <div>
            <p className="eyebrow">{division.name}</p>
            <h2>Expertise shaped<br />around the requirement.</h2>
            <p>Every proposed engagement starts with the situation, its
              dependencies and the responsibilities involved.</p>
          </div>
          <div>
            <p className="eyebrow">Areas of focus</p>
            <div className="division-focus">
              {division.scope.map((item, index) => (
                <article key={item}>
                  <span>0{index + 1}</span>
                  <h3>{item}</h3>
                </article>
              ))}
            </div>
            <div className="deliverable">
              <p className="eyebrow">Potential engagement output</p>
              <p>{division.output}</p>
            </div>
          </div>
        </section>

        <section className="division-service-process">
          <div className="shell division-page-layout">
            <div>
              <p className="eyebrow">How the expertise works</p>
              <h2>From understanding<br />to a defined output.</h2>
              <p>Explore the stages below to see how the discipline
                connects information, specialist work and practical deliverables.</p>
              <a className="quiet-link" href="/#working-method">
                Explore our working method →
              </a>
            </div>
            <ExpertiseFlow key={division.id} division={division.id} />
          </div>
        </section>

        <section className="division-boundaries">
          <div className="shell division-page-layout">
            <div>
              <p className="eyebrow">A defined mandate</p>
              <h2>Clarity before commitment.</h2>
            </div>
            <div>
              <p>Objectives, deliverables, responsibilities and communication
                arrangements are established for the agreed work.</p>
              <p>{division.id === 'finance'
                ? 'Financial research, technology, advisory and execution activities require distinct scopes. Any applicable professional permissions must be established before the relevant activity is undertaken.'
                : division.id === 'cyber'
                ? 'Assessments and testing require explicit authorisation. Protective measures reduce risk; they cannot eliminate every threat.'
                : division.id === 'it'
                ? 'System ownership, hosting, recovery objectives, documentation and support responsibilities are defined within the engagement.'
                : 'Identity and communication work requires clear ownership and approval arrangements. Public opinion and reputation outcomes cannot be guaranteed.'}
              </p>
              <a className="quiet-link" href="/#engagement-guide">Read the engagement guide →</a>
            </div>
          </div>
        </section>

        <section className="shell section">
          <p className="eyebrow">Connected expertise</p>
          <h2>A broader perspective.</h2>
          <div className="division-page-links">
            {divisions.filter(item => item.id !== id).map(item => (
              <a key={item.id} href={`/expertise/${item.id}`}>
                <strong>{item.name} ↗</strong>
                <span>{item.verb}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
