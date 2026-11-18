import { useState } from 'react'
import './EngagementProcess.css'

const stages = [
  {
    name: 'Understand',
    heading: 'Establish what matters.',
    description:
      'Begin with the decision, responsibility or operational requirement. Identify the people, information and systems involved before proposing the work.',
    questions: [
      'What requires attention?',
      'Who holds responsibility?',
      'Where do dependencies exist?',
    ],
    output: 'An initial brief describing priorities, context and the proposed requirement.',
    principle: 'Discretion',
    practice: 'Request only the information needed to assess the introduction.',
  },
  {
    name: 'Define',
    heading: 'Make the responsibility clear.',
    description:
      'Translate the requirement into a proposed scope. Establish deliverables, boundaries, specialist needs and the responsibilities of each party.',
    questions: [
      'What is included in the mandate?',
      'What expertise or permissions are required?',
      'How will progress be assessed?',
    ],
    output: 'A proposed scope with deliverables, responsibilities and review arrangements.',
    principle: 'Judgment',
    practice: 'Assess suitability and constraints before agreeing the mandate.',
  },
  {
    name: 'Coordinate',
    heading: 'Connect the relevant expertise.',
    description:
      'Select the disciplines needed for the agreed work. Make the handoffs between financial information, technology, security and digital presence explicit.',
    questions: [
      'Which disciplines are relevant?',
      'Who owns each workstream?',
      'How will decisions and changes be communicated?',
    ],
    output: 'A delivery plan identifying workstreams, owners and dependencies.',
    principle: 'Accountability',
    practice: 'Assign clear ownership and maintain agreed communication.',
  },
  {
    name: 'Deliver',
    heading: 'Leave clarity that continues.',
    description:
      'Review the agreed outputs, explain their use and document any remaining dependencies. Establish the appropriate handover or ongoing review arrangements.',
    questions: [
      'What has been delivered?',
      'What requires continuing attention?',
      'Who takes responsibility next?',
    ],
    output: 'Agreed deliverables, handover information and documented next steps.',
    principle: 'Continuity',
    practice: 'Support understanding and ownership beyond the immediate work.',
  },
]

export default function EngagementProcess() {
  const [selected, setSelected] = useState(0)
  const stage = stages[selected]

  return (
    <section className="principles section work-process" id="working-method">
      <div className="shell">
        <div className="work-heading">
          <div>
            <p className="eyebrow">The way we work</p>
            <h2>Quiet in approach.<br />Clear at every stage.</h2>
          </div>
          <p>
            A defined process connects your priorities to the appropriate
            expertise, responsibilities and deliverables.
          </p>
        </div>

        <div className="work-stages" role="group" aria-label="Explore engagement stages">
          {stages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={selected === index}
              aria-controls="work-stage-detail"
              onClick={() => setSelected(index)}
            >
              <span className="work-number">0{index + 1}</span>
              <strong>{item.name}</strong>
              <span aria-hidden="true">{index < stages.length - 1 ? '→' : '↗'}</span>
            </button>
          ))}
        </div>

        <article id="work-stage-detail" className="work-detail" aria-live="polite">
          <div>
            <p className="eyebrow">Stage 0{selected + 1} / {stage.name}</p>
            <h3>{stage.heading}</h3>
            <p>{stage.description}</p>
            <ul>
              {stage.questions.map(question => <li key={question}>{question}</li>)}
            </ul>
          </div>

          <div className="work-outcomes">
            <div>
              <p className="eyebrow">Expected output</p>
              <p>{stage.output}</p>
            </div>
            <div>
              <p className="eyebrow">{stage.principle} in practice</p>
              <p>{stage.practice}</p>
            </div>
          </div>
        </article>

        <p className="work-note">
          The sequence and documentation are adapted to the agreed mandate.
        </p>
      </div>
    </section>
  )
}
