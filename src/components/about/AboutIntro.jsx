import { useEffect, useRef } from 'react'
import { about } from '../../data/site.js'
import './AboutIntro.css'

function AboutIntro() {
  const frameRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    const canvas = canvasRef.current

    if (!frame || !canvas) return undefined

    const ctx = canvas.getContext('2d')

    let width = 0
    let height = 0
    let dpr = 1

    let lastX = null
    let lastY = null

    const resize = () => {
      const rect = frame.getBoundingClientRect()

      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /*
       * The canvas itself contains the gradient.
       * The mouse will ERASE this gradient.
       */
      const gradient = ctx.createLinearGradient(
        0,
        0,
        width,
        height,
      )

      gradient.addColorStop(0, '#fff8f4')
      gradient.addColorStop(0.35, '#f7fbfb')
      gradient.addColorStop(0.62, '#e8f8f4')
      gradient.addColorStop(0.82, '#f8eaf2')
      gradient.addColorStop(1, '#fde9f1')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    const erase = (x, y, angle) => {
      ctx.save()

      ctx.translate(x, y)
      ctx.rotate(angle)

      /*
       * destination-out = TRUE ERASER.
       * It removes the gradient instead of painting white.
       */
      ctx.globalCompositeOperation = 'destination-out'

      const widthSize = 105 + Math.random() * 55
      const heightSize = 55 + Math.random() * 35

      /*
       * Soft outer brush.
       */
      const gradient = ctx.createRadialGradient(
        0,
        0,
        5,
        0,
        0,
        widthSize,
      )

      gradient.addColorStop(0, 'rgba(0,0,0,0.95)')
      gradient.addColorStop(0.45, 'rgba(0,0,0,0.72)')
      gradient.addColorStop(0.72, 'rgba(0,0,0,0.32)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = gradient

      ctx.beginPath()

      ctx.ellipse(
        0,
        0,
        widthSize,
        heightSize,
        0,
        0,
        Math.PI * 2,
      )

      ctx.fill()

      /*
       * Small irregular dry-brush cuts.
       */
      for (let i = 0; i < 7; i += 1) {
        const offsetX =
          (Math.random() - 0.5) * widthSize * 1.5

        const offsetY =
          (Math.random() - 0.5) * heightSize * 1.4

        const size =
          10 + Math.random() * 24

        ctx.globalAlpha =
          0.18 + Math.random() * 0.25

        ctx.beginPath()

        ctx.ellipse(
          offsetX,
          offsetY,
          size * 2.2,
          size * 0.45,
          (Math.random() - 0.5) * 0.8,
          0,
          Math.PI * 2,
        )

        ctx.fill()
      }

      ctx.restore()
    }

    const handleMouseMove = (event) => {
      const rect = frame.getBoundingClientRect()

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (
        x < 0 ||
        y < 0 ||
        x > rect.width ||
        y > rect.height
      ) {
        return
      }

      if (lastX === null) {
        lastX = x
        lastY = y
        erase(x, y, 0)
        return
      }

      const dx = x - lastX
      const dy = y - lastY

      const distance = Math.sqrt(
        dx * dx + dy * dy,
      )

      const angle = Math.atan2(dy, dx)

      const steps = Math.max(
        1,
        Math.ceil(distance / 12),
      )

      for (let i = 0; i < steps; i += 1) {
        const progress = i / steps

        const brushX =
          lastX + dx * progress

        const brushY =
          lastY + dy * progress

        erase(
          brushX,
          brushY,
          angle,
        )
      }

      lastX = x
      lastY = y
    }

    const handleMouseLeave = () => {
      lastX = null
      lastY = null
    }

    resize()

    window.addEventListener('resize', resize)

    frame.addEventListener(
      'mousemove',
      handleMouseMove,
    )

    frame.addEventListener(
      'mouseleave',
      handleMouseLeave,
    )

    return () => {
      window.removeEventListener('resize', resize)

      frame.removeEventListener(
        'mousemove',
        handleMouseMove,
      )

      frame.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
    }
  }, [])

  return (
    <section className="about-intro">
      <div
        className="container about-intro__grid"
        ref={frameRef}
      >
        <canvas
          ref={canvasRef}
          className="about-intro__brush"
          aria-hidden="true"
        />

        <figure className="about-intro__card">
          <img
            src={about.image}
            alt={about.imageName}
          />

          <figcaption>
            <span
              className="about-intro__dot"
              aria-hidden="true"
            />

            <div>
              <strong>{about.imageName}</strong>
              <small>{about.imageRole}</small>
            </div>
          </figcaption>
        </figure>

        <div className="about-intro__body">
          <h1>{about.title}</h1>

          {about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}

          <div className="about-intro__links">
            <a
              className="about-intro__resume"
              href={about.resumeUrl}
            >
              Resume ↗
            </a>

            {about.links.map((link) => (
              <a
                key={link.label}
                className="about-intro__link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutIntro
