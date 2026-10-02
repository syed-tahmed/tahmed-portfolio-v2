import { useEffect, useRef } from 'react'

function AboutBrush() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement

    if (!canvas || !host) return undefined

    const ctx = canvas.getContext('2d')

    if (!ctx) return undefined

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let pointer = null
    let brush = null
    let lastTime = 0

    const paintGradient = () => {
      ctx.clearRect(0, 0, width, height)

      const base = ctx.createLinearGradient(
        0,
        0,
        width,
        height
      )

      base.addColorStop(0, '#fff5f1')
      base.addColorStop(0.38, '#faf8fb')
      base.addColorStop(0.68, '#eefcf8')
      base.addColorStop(1, '#f8e7f1')

      ctx.fillStyle = base
      ctx.fillRect(0, 0, width, height)

      const mint = ctx.createRadialGradient(
        width * 0.74,
        height * 0.18,
        0,
        width * 0.74,
        height * 0.18,
        width * 0.65
      )

      mint.addColorStop(
        0,
        'rgba(150, 235, 218, 0.32)'
      )

      mint.addColorStop(
        1,
        'rgba(150, 235, 218, 0)'
      )

      ctx.fillStyle = mint
      ctx.fillRect(0, 0, width, height)

      const pink = ctx.createRadialGradient(
        width * 0.72,
        height * 0.86,
        0,
        width * 0.72,
        height * 0.86,
        width * 0.65
      )

      pink.addColorStop(
        0,
        'rgba(255, 174, 207, 0.24)'
      )

      pink.addColorStop(
        1,
        'rgba(255, 174, 207, 0)'
      )

      ctx.fillStyle = pink
      ctx.fillRect(0, 0, width, height)
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()

      width = rect.width
      height = rect.height

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      )

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      )

      paintGradient()

      brush = null
      pointer = null
    }

    const stamp = (x, y, size) => {
      ctx.save()

      ctx.globalCompositeOperation =
        'destination-out'

      const core = ctx.createRadialGradient(
        x,
        y,
        size * 0.05,
        x,
        y,
        size
      )

      core.addColorStop(
        0,
        'rgba(0,0,0,0.98)'
      )

      core.addColorStop(
        0.42,
        'rgba(0,0,0,0.78)'
      )

      core.addColorStop(
        0.72,
        'rgba(0,0,0,0.32)'
      )

      core.addColorStop(
        1,
        'rgba(0,0,0,0)'
      )

      ctx.fillStyle = core

      ctx.beginPath()

      ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      )

      ctx.fill()

      /*
       * Small random bristles make the edge
       * feel like a real brush instead of a circle.
       */

      const bristles = 28

      for (let i = 0; i < bristles; i += 1) {
        const angle =
          Math.random() * Math.PI * 2

        const distance =
          size * (
            0.55 +
            Math.random() * 0.42
          )

        const bx =
          x +
          Math.cos(angle) *
          distance

        const by =
          y +
          Math.sin(angle) *
          distance

        const r =
          size *
          (
            0.035 +
            Math.random() * 0.09
          )

        ctx.globalAlpha =
          0.18 +
          Math.random() * 0.22

        ctx.beginPath()

        ctx.arc(
          bx,
          by,
          r,
          0,
          Math.PI * 2
        )

        ctx.fill()
      }

      ctx.restore()
    }

    const onPointerMove = (event) => {
      const rect =
        host.getBoundingClientRect()

      pointer = {
        x:
          event.clientX -
          rect.left,

        y:
          event.clientY -
          rect.top,
      }

      if (!brush) {
        brush = {
          ...pointer,
        }
      }
    }

    const onPointerLeave = () => {
      pointer = null
    }

    const tick = (time) => {
      const delta = Math.min(
        (time - lastTime) / 16.67 || 1,
        3
      )

      lastTime = time

      if (pointer && brush) {
        const dx =
          pointer.x -
          brush.x

        const dy =
          pointer.y -
          brush.y

        const distance =
          Math.hypot(dx, dy)

        const step = 7

        const count =
          Math.max(
            1,
            Math.ceil(
              distance / step
            )
          )

        for (
          let i = 1;
          i <= count;
          i += 1
        ) {
          const t = i / count

          const x =
            brush.x +
            dx * t

          const y =
            brush.y +
            dy * t

          const size =
            58 +
            Math.sin(
              (time + i * 31) *
              0.012
            ) *
            8

          stamp(
            x,
            y,
            size
          )
        }

        brush.x +=
          dx *
          Math.min(
            0.28 * delta,
            1
          )

        brush.y +=
          dy *
          Math.min(
            0.28 * delta,
            1
          )
      }

      raf =
        requestAnimationFrame(tick)
    }

    resize()

    host.addEventListener(
      'pointermove',
      onPointerMove
    )

    host.addEventListener(
      'pointerleave',
      onPointerLeave
    )

    window.addEventListener(
      'resize',
      resize
    )

    raf =
      requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)

      host.removeEventListener(
        'pointermove',
        onPointerMove
      )

      host.removeEventListener(
        'pointerleave',
        onPointerLeave
      )

      window.removeEventListener(
        'resize',
        resize
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="about-intro__brush-canvas"
      aria-hidden="true"
    />
  )
}

export default AboutBrush
