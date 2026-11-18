import { divisions } from '../content/company'
import './CoreVisual.css'

type Props = {
  onExplore: (index: number) => void
}

export default function CoreVisual({ onExplore }: Props) {
  return (
    <aside className="core-visual" aria-label="Four disciplines around your private mandate">
      <p className="eyebrow">The intelligence beneath the surface</p>

      <div className="core-composition">
        <svg viewBox="0 0 600 390" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="core-light">
              <stop stopColor="#e2cda3" stopOpacity=".16" />
              <stop offset="1" stopColor="#e2cda3" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="300" cy="195" rx="270" ry="185" fill="url(#core-light)" />
          <g stroke="#91b0b8" strokeOpacity=".3">
            <circle cx="300" cy="195" r="145" />
            <circle cx="300" cy="195" r="122" strokeDasharray="2 9" />
            <path d="M25 195H575M300 18V372" strokeDasharray="3 9" />
          </g>
          <path d="M35 195Q300 -65 565 195Q300 455 35 195Z"
            stroke="#ddc79d" strokeWidth="1.5" />
          <circle cx="300" cy="195" r="85" stroke="#ddc79d" />
          <circle cx="300" cy="195" r="67" stroke="#ddc79d" strokeOpacity=".35" />
          <g fill="#e2cda3">
            <circle cx="300" cy="50" r="4" />
            <circle cx="445" cy="195" r="4" />
            <circle cx="300" cy="340" r="4" />
            <circle cx="155" cy="195" r="4" />
          </g>
        </svg>
        <div className="core-purpose">
          <span>AT THE CORE</span>
          <strong>Your priorities.</strong>
          <small>Your private mandate.</small>
        </div>
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
