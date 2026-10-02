import { useEffect, useRef } from 'react'
import './ParticleDrift.css'

/*
 * Drifting dots joined by lines, drawn on a canvas.
 * Dots near the cursor light up and link to it.
 */
function ParticleDrift({ count = 70, linkDistance = 140, hoverRadius = 170 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pointer = { x: -9999, y: -9999 }
    let dots = []
    let frame
    let width = 0
    let height = 0

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const build = () => {
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.9,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      dots.forEach((dot) => {
        if (!reduceMotion) {
          dot.x += dot.vx
          dot.y += dot.vy
        }

        // Wrap around the edges
        if (dot.x < -10) dot.x = width + 10
        if (dot.x > width + 10) dot.x = -10
        if (dot.y < -10) dot.y = height + 10
        if (dot.y > height + 10) dot.y = -10
      })

      // Lines between nearby dots
      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const distance = Math.hypot(dx, dy)
          if (distance > linkDistance) continue
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.16 * (1 - distance / linkDistance)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(dots[i].x, dots[i].y)
          ctx.lineTo(dots[j].x, dots[j].y)
          ctx.stroke()
        }
      }

      // Dots, brighter near the cursor
      dots.forEach((dot) => {
        const distance = Math.hypot(pointer.x - dot.x, pointer.y - dot.y)
        const near = distance < hoverRadius

        if (near) {
          ctx.strokeStyle = `rgba(226, 69, 109, ${0.45 * (1 - distance / hoverRadius)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(dot.x, dot.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }

        ctx.fillStyle = near ? 'rgba(255, 200, 215, 0.95)' : 'rgba(255, 255, 255, 0.45)'
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, near ? dot.r * 1.6 : dot.r, 0, Math.PI * 2)
        ctx.fill()
      })

      frame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    const onPointerLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    build()
    draw()

    const onResize = () => {
      resize()
      build()
    }

    window.addEventListener('resize', onResize)
    canvas.parentElement.addEventListener('pointermove', onPointerMove)
    canvas.parentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      canvas.parentElement.removeEventListener('pointermove', onPointerMove)
      canvas.parentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [count, linkDistance, hoverRadius])

  return <canvas className="particle-drift" ref={canvasRef} aria-hidden="true" />
}

export default ParticleDrift
