import { useEffect, useRef, useState } from 'react'

const fullTurn = Math.PI * 2
const motionPreference = '(prefers-reduced-motion: reduce)'
const ringCount = 24
const maxDistance = 24
const strandCount = 18

// Keep the particle field reproducible while distributing phases independently.
function phase(seed: number) {
  const mixed = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b)
  return ((mixed ^ (mixed >>> 16)) >>> 0) / 0x100000000
}

const particles = Array.from({ length: 150 }, (_, index) => ({
  angle: index * 2.39996,
  depth: phase(index + 37) * maxDistance,
  radius: .45 + phase(index + 257) * .8,
  size: .48 + phase(index + 521) * 1.4,
  light: .33 + phase(index + 769) * .55,
}))

function drawCore(ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) {
  const cx = width / 2
  const cy = height * .51
  const span = width * .72
  const travel = seconds * 1.24
  const drift = Math.sin(seconds * .25) * .09
  ctx.clearRect(0, 0, width, height)

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * .38)
  glow.addColorStop(0, 'rgba(216, 245, 255, .88)')
  glow.addColorStop(.055, 'rgba(145, 212, 247, .41)')
  glow.addColorStop(.2, 'rgba(95, 170, 231, .24)')
  glow.addColorStop(.55, 'rgba(91, 149, 221, .08)')
  glow.addColorStop(1, 'rgba(91, 149, 221, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  function tracePoint(angle: number, depth: number, radius = 1) {
    const scale = span * radius / (depth + 1.04)
    const turn = angle + Math.log1p(depth) * 1.60 + drift
    const ripple = 1 + Math.sin(angle * 3 + depth * .48) * .09
    return [
      cx + Math.cos(turn) * scale * ripple + scale * .11 * Math.sin(depth * .43),
      cy + Math.sin(turn) * scale * .79 * ripple,
    ] as const
  }

  const ink = ctx.createRadialGradient(cx, cy, 2, cx, cy, width * .53)
  ink.addColorStop(0, 'rgba(203, 240, 255, .13)')
  ink.addColorStop(.25, 'rgba(183, 226, 250, .64)')
  ink.addColorStop(.62, 'rgba(154, 188, 240, .46)')
  ink.addColorStop(1, 'rgba(137, 172, 225, 0)')
  ctx.strokeStyle = ink
  ctx.lineWidth = .58

  for (let strand = 0; strand < strandCount; strand++) {
    ctx.globalAlpha = strand % 5 === 0 ? .9 : .34
    ctx.beginPath()
    for (let step = 0; step <= 44; step++) {
      const depth = (step / 44) ** 1.8 * (maxDistance + 10)
      const point = tracePoint(strand * fullTurn / strandCount, depth)
      if (step === 0) ctx.moveTo(...point)
      else ctx.lineTo(...point)
    }
    ctx.stroke()
  }

  for (let ring = 0; ring < ringCount; ring++) {
    const spacing = maxDistance / ringCount
    const depth = (ring * spacing - travel % maxDistance + maxDistance) % maxDistance
    const angle = ring * 2.39996
    const fade = Math.min(1, depth / 1.2, (maxDistance - depth) / 3.5)
    ctx.globalAlpha = fade * (ring % 4 === 0 ? .69 : .28)
    ctx.beginPath()
    for (let step = 0; step <= 38; step++) {
      const point = tracePoint(angle + step / 38 * fullTurn * .82, depth)
      if (step === 0) ctx.moveTo(...point)
      else ctx.lineTo(...point)
    }
    ctx.stroke()
  }

  ctx.fillStyle = '#c8edff'
  for (const particle of particles) {
    const depth = (particle.depth - travel % maxDistance + maxDistance) % maxDistance
    const [x, y] = tracePoint(particle.angle, depth, particle.radius)
    const radius = Math.min(2.1, particle.size * 4.4 / (depth + 2.1))
    const fade = Math.min(1, depth / .65, (maxDistance - depth) / 4)
    ctx.globalAlpha = particle.light * fade
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, fullTurn)
    ctx.fill()
  }

  ctx.globalAlpha = 1
  ctx.fillStyle = '#e2f8ff'
  ctx.beginPath()
  ctx.arc(cx, cy, Math.max(1.4, width * .005), 0, fullTurn)
  ctx.fill()
}

export default function QuantumCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elapsed = useRef(0)
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia(motionPreference).matches)
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null)
  const playing = motionOverride ?? !reduceMotion

  useEffect(() => {
    const preference = window.matchMedia(motionPreference)
    const update = () => {
      setReduceMotion(preference.matches)
      setMotionOverride(null)
    }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let frame = 0
    let previousTime: number | undefined
    let inView = false

    function tick(time: number) {
      if (previousTime !== undefined) elapsed.current += Math.min((time - previousTime) / 1000, .05)
      previousTime = time
      if (width && height && context) drawCore(context, width, height, elapsed.current)
      frame = requestAnimationFrame(tick)
    }

    function updatePlayback() {
      cancelAnimationFrame(frame)
      previousTime = undefined
      if (playing && inView && !document.hidden) frame = requestAnimationFrame(tick)
    }

    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width
      height = entry.contentRect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (width && height) drawCore(context, width, height, elapsed.current)
    })
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      updatePlayback()
    })
    resize.observe(canvas)
    visibility.observe(canvas)
    document.addEventListener('visibilitychange', updatePlayback)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', updatePlayback)
    }
  }, [playing])

  return (
    <div className="core-composition">
      <canvas className="quantum-illustration" ref={canvasRef} aria-hidden="true" />
      <button type="button" className="core-motion-toggle"
        aria-label={playing ? 'Pause quantum animation' : 'Play quantum animation'}
        onClick={() => setMotionOverride(!playing)}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M7 5h3v14H7zm7 0h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
        </svg>
      </button>
    </div>
  )
}
