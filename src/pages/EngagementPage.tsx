import Arrow from '../components/Arrow'
import Footer from '../components/Footer'
import Header from '../components/Header'
import IntroductionForm from '../components/IntroductionForm'
import { divisions } from '../content/company'

export default function EngagementPage({ privacy = false }: { privacy?: boolean }) {
  const interest = new URLSearchParams(window.location.search).get('enquiry')
  const initialInterest = divisions.find(division => division.id === interest)?.interest

  return (
    <>
      <a className="skip" href="#engagement-main">Skip to content</a>
      <Header />
      <main id="engagement-main" className="engagement-page">
        <section className="division-page-hero">
          <div className="shell">
            <p className="eyebrow">Core Eye Group</p>
            <h1>{privacy ? 'Enquiry privacy' : 'Private engagement'}</h1>
            <p>{privacy
              ? 'How we use the information you submit through the website enquiry form.'
              : 'Contact us about an institutional requirement, a private mandate or a strategic partnership.'}</p>
          </div>
        </section>
        <section className="shell section division-page-layout">
          {privacy ? (
            <>
              <div>
                <h2>Information you share</h2>
                <p>We ask for your name, email address, area of interest and a brief outline of your
                  requirement. If you provide an organisation name, it is included in your enquiry.</p>
              </div>
              <div>
                <h2>How we use it</h2>
                <p>The website forwards your enquiry to the Core Eye Group enquiry mailbox so the team can
                  review your request and respond. Please leave credentials, account details and confidential
                  documents out of your initial message.</p>
                <p>For questions about an enquiry or the handling of your details, email{' '}
                  <a href="mailto:contact@coreeyegroup.com">contact@coreeyegroup.com</a>. Include the reference
                  shown after submission if you have it.</p>
                <a className="quiet-link" href="/contact/">Return to contact <Arrow direction="right" /></a>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2>Request a private introduction</h2>
                <p>We review your enquiry before discussing any next steps. A short, general outline gives us
                  enough context to direct it to the relevant team.</p>
                <a className="quiet-link" href="/#engagement-guide">Read the engagement guide <Arrow /></a>
              </div>
              <IntroductionForm initialInterest={initialInterest} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
