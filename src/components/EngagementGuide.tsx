import Arrow from './Arrow'
import './EngagementGuide.css'

const questions = [
  {
    title: 'What can a private mandate involve?',
    answer: 'An engagement may focus on a single discipline or connect several areas of expertise. The starting point is a specific requirement: clearer financial information, dependable systems, reduced digital exposure or a considered institutional presence.',
  },
  {
    title: 'How is the appropriate scope established?',
    answer: 'The proposed work is assessed against its objectives, complexity, specialist requirements and jurisdiction. Responsibilities, deliverables and any necessary professional permissions must be defined before the mandate is agreed.',
  },
  {
    title: 'Does every engagement involve all four divisions?',
    answer: 'The relevant disciplines are selected around the requirement. A focused technology project may require IT and Cyber, while a broader continuity brief may also involve Finance and Digital. Coordination should make the work clearer and more effective.',
  },
  {
    title: 'What belongs in an initial introduction?',
    answer: 'A brief description of the situation, the area requiring attention and a professional contact route are sufficient to begin assessing suitability. Financial credentials, identity documents and sensitive security information should be reserved for an agreed channel.',
  },
  {
    title: 'What does selective engagement mean?',
    answer: 'Each proposed relationship is considered individually for alignment, scope and the expertise required. The purpose is to establish whether the group is an appropriate fit for the responsibility being entrusted.',
  },
]

export default function EngagementGuide() {
  return (
    <section className="engagement-guide section" id="engagement-guide">
      <div className="shell guide-layout">
        <div className="guide-introduction">
          <p className="eyebrow">Before an introduction</p>
          <h2>A clearer understanding.<br />A considered next step.</h2>
          <p>Understand how a requirement becomes a defined engagement,
            and what is useful to share at the beginning.</p>
          <a href="#engagement">Explore private engagement <Arrow /></a>
        </div>
        <div className="guide-questions">
          {questions.map((question, index) => (
            <details key={question.title}>
              <summary>
                <span className="guide-number">0{index + 1}</span>
                <span>{question.title}</span>
                <span className="guide-plus" aria-hidden="true">+</span>
              </summary>
              <p>{question.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
