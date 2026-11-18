import './Footer.css'

export default function Footer() {
  return (
    <footer className="institutional-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-identity">
            <a className="brand" href="/#home">CORE EYE GROUP</a>
            <p className="footer-position">Private Institutional Stewardship</p>
            <p>Financial intelligence, enterprise technology,
              cybersecurity and digital reputation.</p>
            <p className="footer-statement">A coordinated perspective.<br />
              A considered relationship.</p>
          </div>

          <nav className="footer-nav" aria-label="Footer group navigation">
            <h2>The Group</h2>
            <a href="/#group">Our perspective</a>
            <a href="/#clients">Who we serve</a>
            <a href="/#connected">Connected expertise</a>
          </nav>

          <nav className="footer-nav" aria-label="Footer expertise navigation">
            <h2>Expertise</h2>
            <a href="/expertise/finance">Core Eye Finance</a>
            <a href="/expertise/it">Core Eye IT</a>
            <a href="/expertise/cyber">Core Eye Cyber</a>
            <a href="/expertise/digital">Core Eye Digital</a>
            <a href="/#connected">Illustrative mandates</a>
          </nav>

          <nav className="footer-nav" aria-label="Footer engagement navigation">
            <h2>Private Engagement</h2>
            <a href="/#engagement-guide">Before an introduction</a>
            <a href="/#engagement">The engagement process</a>
            <p>Enquiry delivery is not yet enabled in this development preview.</p>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Core Eye Group</span>
          <span>Development preview · Content and company disclosures under review</span>
          <a href="/#home">Return to the beginning ↑</a>
        </div>
      </div>
    </footer>
  )
}
