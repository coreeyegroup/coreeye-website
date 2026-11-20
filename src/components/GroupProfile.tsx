import Arrow from './Arrow'
import { divisions } from '../content/company'
import './GroupProfile.css'

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

        <div className="group-discipline-map" aria-label="The group's connected disciplines">
          {divisions.map((discipline, index) => (
            <a key={discipline.id} href={`/expertise/${discipline.id}/`}>
              <span className="group-discipline-label">
                <span>0{index + 1} / {discipline.name}</span>
                <span aria-hidden="true"><Arrow /></span>
              </span>
              <h3>{discipline.capability}</h3>
              <p>{discipline.summary}</p>
            </a>
          ))}
        </div>

        <div className="group-profile-close">
          <span>Discretion in the relationship. Clarity in the mandate.</span>
          <a href="#working-method">Our working method <Arrow direction="right" /></a>
        </div>
      </div>
    </section>
  )
}
