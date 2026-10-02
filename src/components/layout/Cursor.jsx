import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

/*
 * A two-part cursor: a small solid dot that tracks the pointer exactly,
 * and a larger ring that eases towards it. The ring grows over links
 * and buttons, and shows a label over project images.
 */
function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [state, setState] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only on devices with a real pointer, so phones keep the native touch
    const fine = window.matchMedia('(pointer: fine)').matches
    const stillness = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || stillness) return undefined

    setEnabled(true)

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...target }
    let frame

    const onMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px)`
      }

      // What is under the pointer decides how the ring looks
      const el = event.target.closest('a, button, input, textarea, select')
      if (!el) {
        setState('')
      } else if (el.matches('input, textarea, select')) {
        setState('text')
      } else {
        setState('link')
      }
    }

    // The ring catches up a few frames behind, which reads as weight
    const follow = () => {
      ring.x += (target.x - ring.x) * 0.16
      ring.y += (target.y - ring.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      }
      frame = requestAnimationFrame(follow)
    }

    const onLeave = () => setState('hidden')
    const onEnter = () => setState('')

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    frame = requestAnimationFrame(follow)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <span className={`cursor-dot is-${state}`} ref={dotRef} aria-hidden="true" />
      <span className={`cursor-ring is-${state}`} ref={ringRef} aria-hidden="true" />
    </>
  )
}

export default Cursor
