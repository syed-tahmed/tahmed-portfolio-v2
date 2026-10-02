import { useEffect, useRef } from 'react'
import './ShapeMosaic.css'

/*
 * A grid of small shapes that spin slowly.
 * Shapes near the cursor grow, turn faster and light up.
 */
function ShapeMosaic({ ink = '#5c6191', lit = '#ffcf6b', cell = 34, reach = 170 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement
    const pointer = { x: -9999, y: -9999, hold: 0 }
    let cells = []
    let frame
    let width = 0
    let height = 0
    let time = 0

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Repeatable random value per grid position
    const hash = (x, y) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
      return n - Math.floor(n)
    }

    const build = () => {
      cells = []
      const cols = Math.ceil(width / cell) + 1
      const rows = Math.ceil(height / cell) + 1

      for (let c = 0; c < cols; c += 1) {
        for (let r = 0; r < rows; r += 1) {
          const seed = hash(c, r)
          cells.push({
            x: (c + 0.5) * cell,
            y: (r + 0.5) * cell,
            kind: Math.floor(hash(c + 7.3, r - 2.1) * 6),
            seed,
            spin: seed < 0.5 ? 1 : -1,
          })
        }
      }
    }

    // Draws one of six outlines, centred on the origin
    const drawShape = (kind, radius) => {
      ctx.beginPath()
      if (kind === 0) {
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
      } else if (kind === 1) {
        ctx.rect(-radius * 0.8, -radius * 0.8, radius * 1.6, radius * 1.6)
      } else if (kind === 2) {
        ctx.moveTo(0, -radius)
        ctx.lineTo(radius * 0.9, radius * 0.7)
        ctx.lineTo(-radius * 0.9, radius * 0.7)
        ctx.closePath()
      } else if (kind === 3) {
        ctx.moveTo(0, -radius)
        ctx.lineTo(radius, 0)
        ctx.lineTo(0, radius)
        ctx.lineTo(-radius, 0)
        ctx.closePath()
      } else if (kind === 4) {
        const arm = radius * 0.3
        ctx.rect(-radius, -arm, radius * 2, arm * 2)
        ctx.rect(-arm, -radius, arm * 2, radius * 2)
      } else {
        ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2)
        ctx.moveTo(radius * 0.4, 0)
        ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2)
      }
      ctx.stroke()
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const rect = parent.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      build()
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      if (!reduceMotion) time += 0.006

      // Ease the highlight in and out as the pointer arrives and leaves
      const wanted = pointer.x > -999 ? 1 : 0
      pointer.hold += (wanted - pointer.hold) * 0.08

      ctx.lineWidth = 1.4

      cells.forEach((item) => {
        const distance = Math.hypot(item.x - pointer.x, item.y - pointer.y)
        let near = Math.max(0, 1 - distance / reach)
        near = near * near * pointer.hold

        const angle = time * (0.6 + item.seed) * item.spin + item.seed * Math.PI * 2 + near * 2.4
        const radius = cell * 0.26 * (1 + near * 0.6)

        ctx.save()
        ctx.translate(item.x, item.y)
        ctx.rotate(angle)
        ctx.strokeStyle = near > 0.02 ? lit : ink
        ctx.globalAlpha = 0.4 + near * 0.6
        drawShape(item.kind, radius)
        ctx.restore()
      })

      ctx.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    const onMove = (event) => {
      const rect = parent.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    frame = requestAnimationFrame(draw)

    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
    }
  }, [ink, lit, cell, reach])

  return <canvas className="shape-mosaic" ref={canvasRef} aria-hidden="true" />
}

export default ShapeMosaic
