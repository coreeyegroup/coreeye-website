import { useState } from 'react'
import './ConnectedExpertise.css'

const situations = [
  {
    label: 'Family office continuity',
    title: 'Continuity across people, systems and generations.',
    context: 'A family office needs a coordinated view of its information, digital assets and operational dependencies.',
    priority: 'Understand what exists, who is responsible and where continuity requires attention.',
    roles: [
      ['Finance', 'Information clarity', 'Define financial reporting and intelligence requirements for informed oversight.'],
      ['IT', 'Operational foundations', 'Map systems, ownership, integrations and recovery dependencies.'],
      ['Cyber', 'Sensitive access', 'Review authorised access to information, identities and communication channels.'],
      ['Digital', 'Identity and legacy', 'Organise official digital assets, public representation and custodianship.'],
    ],
    output: 'A coordinated roadmap connecting priorities, dependencies, responsible owners and proposed delivery phases.',
  },
  {
    label: 'Institutional resilience',
    title: 'Confidence in the foundations of an institution.',
    context: 'An organisation needs to understand how critical operations depend on technology, information and specialist providers.',
    priority: 'Identify dependencies that could interrupt operations or weaken accountability.',
    roles: [
      ['Finance', 'Decision requirements', 'Clarify the information and reporting needed by the relevant decision-makers.'],
      ['IT', 'Systems continuity', 'Review essential workflows, integrations, documentation and recovery requirements.'],
      ['Cyber', 'Exposure and access', 'Assess authorised information flows and prioritise relevant security concerns.'],
      ['Digital', 'Institutional presence', 'Align digital ownership and communication responsibilities with the organisation.'],
    ],
    output: 'An operational dependency map and prioritised improvement plan with agreed implementation boundaries.',
  },
  {
    label: 'A principal’s public exposure',
    title: 'A visible life. A considered digital presence.',
    context: 'A prominent principal needs to coordinate public visibility with privacy and ownership of digital channels.',
    priority: 'Establish trusted official channels and understand the exposure surrounding them.',
    roles: [
      ['Finance', 'Mandate relevance', 'Include financial intelligence only where the agreed brief requires it.'],
      ['IT', 'Ownership and recovery', 'Document domain, platform and account ownership and recovery arrangements.'],
      ['Cyber', 'Identity protection', 'Assess exposed information, account access and impersonation concerns.'],
      ['Digital', 'Public representation', 'Review official channels, identity consistency and content governance.'],
    ],
    output: 'A digital presence and protection brief defining channel ownership, priorities and escalation responsibilities.',
  },
]

export default function ConnectedExpertise() {
  const [selected, setSelected] = useState(0)
  const situation = situations[selected]

  return (
    <section className="connected section" id="connected">
      <div className="shell">
        <div className="connected-heading">
          <div>
            <p className="eyebrow">The integrated perspective</p>
            <h2>See how the disciplines connect.</h2>
          </div>
          <p>Explore illustrative engagement structures. The relevant disciplines
            and scope are selected around the actual requirement.</p>
        </div>

        <div className="situation-selector" role="group"
          aria-label="Choose an illustrative situation">
          {situations.map((item, index) => (
            <button key={item.label}
              aria-pressed={selected === index}
              aria-controls="connected-detail"
              onClick={() => setSelected(index)}>
              <span>0{index + 1}</span>{item.label}
            </button>
          ))}
        </div>

        <div id="connected-detail" aria-live="polite" aria-atomic="true">
          <div className="mandate-context">
            <div>
              <p className="eyebrow">Illustrative situation</p>
              <h3>{situation.title}</h3>
              <p>{situation.context}</p>
            </div>
            <div className="mandate-priority">
              <p className="eyebrow">The priority at the core</p>
              <p>{situation.priority}</p>
            </div>
          </div>

          <div className="connected-roles">
            {situation.roles.map(([name, title, description], index) => (
              <article key={name}>
                <div className="role-label">
                  <span>0{index + 1}</span>
                  <span>CORE EYE {name.toUpperCase()}</span>
                </div>
                <h4>{title}</h4>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="connected-output">
            <p className="eyebrow">Proposed engagement output</p>
            <p>{situation.output}</p>
            <a href="#engagement">Discuss a private mandate ↗</a>
          </div>
        </div>
        <p className="illustration-note">
          Illustrative structures for discussion. These are not client case studies.
        </p>
      </div>
    </section>
  )
}
