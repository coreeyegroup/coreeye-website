import './GroupProfile.css'

const disciplines = [
  {
    id: 'finance',
    name: 'Finance',
    responsibility: 'Information and decisions',
    description: 'Financial intelligence and the technology supporting informed decisions.',
  },
  {
    id: 'it',
    name: 'IT',
    responsibility: 'Systems and continuity',
    description: 'Enterprise engineering connecting systems, workflows and operational ownership.',
  },
  {
    id: 'cyber',
    name: 'Cyber',
    responsibility: 'Exposure and protection',
    description: 'Security assessment and protective measures within a clearly authorised scope.',
  },
  {
    id: 'digital',
    name: 'Digital',
    responsibility: 'Identity and presence',
    description: 'Digital experiences and communication aligned with institutional identity.',
  },
]

export default function GroupProfile() {
  return (
    <section className="section group-profile" id="group">
      <div className="shell">
        <div className="group-profile-heading">
          <div>
            <p className="eyebrow">The Group</p>
            <h2>Clarity beneath<br />the surface.</h2>
          </div>
          <div className="group-profile-introduction">
            <p className="group-profile-lead">
              The visible outcome rests on responsibilities that are often unseen.
            </p>
            <p>
              Financial information depends on reliable systems. Those systems
              depend on considered security. Public presence depends on coherent
              identity and communication.
            </p>
            <p>
              Core Eye Group brings these disciplines into a coordinated
              perspective, shaped around the priorities of institutions,
              families and private principals.
            </p>
          </div>
        </div>

        <div className="group-mandate">
          <div>
            <p className="eyebrow">At the core</p>
            <h3>Your priorities.<br />A defined responsibility.</h3>
          </div>
          <p>
            Each proposed engagement begins with the requirement.
            The relevant expertise, scope, ownership and deliverables
            are then established around it.
          </p>
        </div>

        <div className="group-discipline-map" aria-label="The group's connected disciplines">
          {disciplines.map((discipline, index) => (
            <a key={discipline.id} href={`/expertise/${discipline.id}`}>
              <span className="group-discipline-label">
                <span>0{index + 1} / {discipline.name}</span>
                <span aria-hidden="true">↗</span>
              </span>
              <h3>{discipline.responsibility}</h3>
              <p>{discipline.description}</p>
            </a>
          ))}
        </div>

        <div className="group-profile-close">
          <span>Discretion in the relationship. Clarity in the mandate.</span>
          <a href="#working-method">Our working method →</a>
        </div>
      </div>
    </section>
  )
}
