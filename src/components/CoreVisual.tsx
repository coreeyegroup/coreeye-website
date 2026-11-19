import { divisions } from '../content/company'
import './CoreVisual.css'

type Props = {
  onExplore: (index: number) => void
}

const orbits = [
  { angle: 23, radius: 217, depth: 58, color: '#91a4fa', trail: 4, duration: '4.7s' },
  { angle: -43, radius: 201, depth: 62, color: '#a8c3ff', trail: 52, duration: '4.3s' },
  { angle: 69, radius: 161, depth: 53, color: '#58d9ff', trail: 23, duration: '4.9s' },
]

export default function CoreVisual({ onExplore }: Props) {
  return (
    <aside className="core-visual" aria-label="Four disciplines around your private mandate">
      <p className="eyebrow">The intelligence beneath the surface</p>

      <div className="core-composition">
        <svg className="quantum-illustration" viewBox="0 0 600 390" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="quantum-halo">
              <stop stopColor="#78eaff" stopOpacity=".75" />
              <stop offset=".24" stopColor="#29bdeb" stopOpacity=".39" />
              <stop offset=".62" stopColor="#487cf0" stopOpacity=".15" />
              <stop offset="1" stopColor="#487cf0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="quantum-core">
              <stop offset=".32" stopColor="#fff" />
              <stop offset=".63" stopColor="#caffff" stopOpacity=".96" />
              <stop offset="1" stopColor="#44d9ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="quantum-particle">
              <stop offset=".18" stopColor="#fff" />
              <stop offset=".42" stopColor="#a7e2ff" stopOpacity=".8" />
              <stop offset="1" stopColor="#72bdff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="quantum-flare">
              <stop stopColor="#63b6ff" stopOpacity="0" />
              <stop offset=".5" stopColor="#cefaff" stopOpacity=".6" />
              <stop offset="1" stopColor="#63b6ff" stopOpacity="0" />
            </linearGradient>
            <filter id="quantum-trail-glow">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          <g transform="translate(300 195)">
            <ellipse rx="211" ry="156" fill="url(#quantum-halo)" />
            <g stroke="#6b9bef" strokeOpacity=".14">
              <ellipse rx="226" ry="94" transform="rotate(4)" />
              <ellipse rx="192" ry="102" transform="rotate(-68)" />
              <ellipse rx="201" ry="103" transform="rotate(52)" />
            </g>
            {orbits.map(({ angle, radius, depth, color, trail, duration }) => (
              <g key={angle} transform={`rotate(${angle})`} stroke={color}>
                <ellipse rx={radius} ry={depth} strokeOpacity=".5" />
                <ellipse rx={radius} ry={depth} pathLength="100" strokeDasharray="30 70"
                  strokeDashoffset={trail} strokeWidth="4" strokeOpacity=".8"
                  filter="url(#quantum-trail-glow)" />
                <ellipse rx={radius} ry={depth} pathLength="100" strokeDasharray="30 70"
                  strokeDashoffset={trail} strokeWidth="1.5" strokeLinecap="round" />
                <circle className="quantum-particle-still" cx={-radius} r="9"
                  fill="url(#quantum-particle)" stroke="none" />
                <circle className="quantum-particle-moving" r="9" fill="url(#quantum-particle)" stroke="none">
                  <animateMotion dur={duration} fill="freeze"
                    path={`M ${-radius} 0 A ${radius} ${depth} 0 1 0 ${radius} 0 A ${radius} ${depth} 0 1 0 ${-radius} 0`} />
                </circle>
              </g>
            ))}
            <path d="M-201 0H201" stroke="url(#quantum-flare)" strokeWidth="1.4" />
            <circle r="32" fill="url(#quantum-halo)" />
            <circle r="17" fill="url(#quantum-core)" />
          </g>
        </svg>
      </div>

      <div className="core-disciplines">
        {divisions.map((item, index) => (
          <button key={item.id} onClick={() => onExplore(index)}>
            <span>0{index + 1} / {item.id.toUpperCase()}</span>
            <strong>{['Intelligence', 'Continuity', 'Protection', 'Presence'][index]}</strong>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p className="core-caption">Select a discipline to explore its responsibility.</p>
    </aside>
  )
}
