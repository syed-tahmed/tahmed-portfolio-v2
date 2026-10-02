import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './WireTerrain.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * A wireframe landscape rushing towards a glowing sun.
 * Points are placed in 3D, then projected onto the canvas by hand.
 * Scrolling past the card lifts the sun above the horizon.
 */
function WireTerrain({ lineColor = '#b12b00', accent = '#ff3c00' }) {
  const canvasRef = useRef(null)
  const riseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement
    let frame
    let width = 0
    let height = 0
    let offset = 0

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ROWS = 34
    const COLS = 26
    const SPACING = 2.4
    const FOCAL = 260
    const CAM_Y = 2.4

    const hash = (x, z) => {
      const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
      return n - Math.floor(n)
    }

    const heightAt = (x, z) => {
      const ix = Math.floor(x / 6)
      const iz = Math.floor(z / 6)
      const fx = x / 6 - ix
      const fz = z / 6 - iz
      const sx = fx * fx * (3 - 2 * fx)
      const sz = fz * fz * (3 - 2 * fz)

      const a = hash(ix, iz)
      const b = hash(ix + 1, iz)
      const c = hash(ix, iz + 1)
      const d = hash(ix + 1, iz + 1)
      const noise = (a + (b - a) * sx) * (1 - sz) + (c + (d - c) * sx) * sz

      const valley = Math.min(1, Math.max(0, (Math.abs(x) - 5) / 14))
      return noise * 4.5 * valley
    }

    // The horizon slides down as the sun rises, so the view tilts with it
    const horizonY = () => height * (0.62 - riseRef.current * 0.14)

    const project = (x, y, z) => ({
      sx: width / 2 + (FOCAL * x) / z,
      sy: horizonY() - (FOCAL * (y - CAM_Y)) / z,
    })

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const rect = parent.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const drawSun = () => {
      const cx = width / 2
      const radius = Math.min(width, height) * 0.22
      // Starts half-sunk, climbs as the visitor scrolls
      const cy = horizonY() - riseRef.current * radius * 1.1

      const halo = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 2.6)
      halo.addColorStop(0, accent + '55')
      halo.addColorStop(1, 'transparent')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      // Clip to the disc, and stop it just below the horizon
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()
      ctx.beginPath()
      ctx.rect(0, 0, width, horizonY() + radius * 0.12)
      ctx.clip()

      const body = ctx.createLinearGradient(0, cy - radius, 0, cy + radius)
      body.addColorStop(0, '#ffd9a8')
      body.addColorStop(1, accent)
      ctx.fillStyle = body
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)

      ctx.restore()
    }

    const draw = () => {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)
      drawSun()

      if (!reduceMotion) offset = (offset + 0.035) % SPACING

      // The land only exists below the horizon line
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, horizonY(), width, height - horizonY())
      ctx.clip()

      ctx.lineWidth = 1
      ctx.strokeStyle = lineColor

      for (let r = 1; r < ROWS; r += 1) {
        const z = r * SPACING + offset
        ctx.beginPath()
        for (let c = 0; c <= COLS; c += 1) {
          const x = (c - COLS / 2) * SPACING
          const point = project(x, heightAt(x, z + offset), z)
          if (c === 0) ctx.moveTo(point.sx, point.sy)
          else ctx.lineTo(point.sx, point.sy)
        }
        ctx.globalAlpha = Math.max(0, 1 - r / ROWS) * 0.9
        ctx.stroke()
      }

      for (let c = 0; c <= COLS; c += 1) {
        const x = (c - COLS / 2) * SPACING
        ctx.beginPath()
        for (let r = 1; r < ROWS; r += 1) {
          const z = r * SPACING + offset
          const point = project(x, heightAt(x, z + offset), z)
          if (r === 1) ctx.moveTo(point.sx, point.sy)
          else ctx.lineTo(point.sx, point.sy)
        }
        ctx.globalAlpha = 0.45
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.restore()
      frame = requestAnimationFrame(draw)
    }

    resize()
    frame = requestAnimationFrame(draw)

    const observer = new ResizeObserver(resize)
    observer.observe(parent)

    // riseRef goes from 0 to 1 while the card travels up the screen
    const trigger = ScrollTrigger.create({
      trigger: parent,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        riseRef.current = self.progress
      },
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      trigger.kill()
    }
  }, [lineColor, accent])

  return <canvas className="wire-terrain" ref={canvasRef} aria-hidden="true" />
}

export default WireTerrain
