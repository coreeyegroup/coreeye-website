import Arrow from './Arrow'
import { divisions } from '../content/company'
import QuantumCore from './QuantumCore'
import './CoreVisual.css'

type Props = {
  onExplore: (index: number) => void
}

export default function CoreVisual({ onExplore }: Props) {
  return (
    <aside className="core-visual" aria-label="Four disciplines around your private mandate">
      <p className="eyebrow">The intelligence beneath the surface</p>

      <QuantumCore />

      <div className="core-disciplines">
        {divisions.map((item, index) => (
          <button key={item.id} onClick={() => onExplore(index)}>
            <span>0{index + 1} / {item.id.toUpperCase()}</span>
            <strong>{item.capability}</strong>
            <span aria-hidden="true"><Arrow /></span>
          </button>
        ))}
      </div>
      <p className="core-caption">Select a discipline to explore its responsibility.</p>
    </aside>
  )
}
