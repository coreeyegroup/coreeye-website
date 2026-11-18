import { useState } from 'react'
import './ExpertiseFlow.css'

const flows = {
  finance: [
    ['Information', 'Establish the evidence',
      'Identify relevant financial information, reporting sources and gaps in the available evidence.'],
    ['Interpretation', 'Connect information to the decision',
      'Consider the questions, assumptions and risks that the agreed analysis needs to address.'],
    ['Decision support', 'Make the findings usable',
      'Present the agreed analysis through an intelligence brief, reporting framework or technology specification.'],
  ],
  it: [
    ['Systems', 'Understand the operating environment',
      'Map applications, infrastructure, integrations and the workflows they support.'],
    ['Engineering', 'Address the dependencies',
      'Define and implement the agreed technical changes, with attention to integration, maintainability and ownership.'],
    ['Continuity', 'Support dependable operation',
      'Provide the agreed systems, documentation and handover arrangements for ongoing operation.'],
  ],
  cyber: [
    ['Exposure', 'Identify what needs protection',
      'Understand relevant assets, access paths and security concerns within the authorised scope.'],
    ['Assessment', 'Examine the controls',
      'Assess the agreed environment and explain findings in the context of operational priorities.'],
    ['Action', 'Define the response',
      'Document findings, prioritised recommendations and agreed remediation or review requirements.'],
  ],
  digital: [
    ['Presence', 'Understand the public footprint',
      'Review the agreed digital properties, audience requirements and public-facing information.'],
    ['Alignment', 'Connect identity and communication',
      'Define the structure, experience and communication appropriate to the institution or principal.'],
    ['Delivery', 'Create a coherent presence',
      'Deliver the agreed digital experience, content framework or implementation plan.'],
  ],
}

type DivisionId = keyof typeof flows

export default function ExpertiseFlow({ division }: { division: string }) {
  const [selected, setSelected] = useState(0)
  const stages = flows[division as DivisionId]
  if (!stages) return null
  const stage = stages[selected]

  return (
    <div className="expertise-flow">
      <p className="eyebrow">From requirement to output</p>
      <div className="expertise-flow-controls" role="group"
        aria-label="Explore how this discipline works">
        {stages.map(([name], index) => (
          <button key={name} type="button"
            aria-pressed={selected === index}
            aria-controls={`flow-detail-${division}`}
            onClick={() => setSelected(index)}>
            <span className="flow-node">0{index + 1}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div id={`flow-detail-${division}`} className="expertise-flow-detail"
        aria-live="polite">
        <h4>{stage[1]}</h4>
        <p>{stage[2]}</p>
      </div>
    </div>
  )
}
