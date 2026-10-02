import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { focusLines } from '../../data/site.js'
import WaveField from '../ui/WaveField.jsx'
import './FocusText.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * Pinned scroll section.
 * The section sticks to the screen while you scroll, and the scroll plays
 * a timeline instead of moving the page. Each sentence rises out of the
 * waves word by word, like a swell lifting it, holds still to be read,
 * then sinks back under as the next swell rolls over it. Behind the text
 * the camera flies further out across the sea of dots.
 */
function FocusText() {
  const sectionRef = useRef(null)
  const linesRef = useRef([])
  const barRef = useRef(null)
  // Shared with the wave field, which reads it every frame
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-static')
      return undefined
    }

    const context = gsap.context(() => {
      const lines = linesRef.current.filter(Boolean)
      const words = lines.map((line) => line.querySelectorAll('.focus-text__word'))
      const scene = 3 // rise 1, hold 1, sink 1

      // Every word waits below the surface, tipped back and blurred
      gsap.set(section.querySelectorAll('.focus-text__word'), {
        opacity: 0,
        y: 70,
        rotateX: -70,
        filter: 'blur(8px)',
        transformOrigin: '50% 100%',
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * lines.length * 1.1,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      words.forEach((group, index) => {
        const at = index * scene

        // Rise with the swell, left to right like a wave travelling across
        timeline.to(
          group,
          { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1, ease: 'sine.out', stagger: 0.06 },
          at,
        )

        // Hold still for a moment so it can be read

        // Sink back under, in the same direction, except the last sentence
        if (index < words.length - 1) {
          timeline.to(
            group,
            { opacity: 0, y: 80, rotateX: 70, filter: 'blur(8px)', duration: 1, ease: 'sine.in', stagger: 0.06 },
            at + 2,
          )
        }
      })

      timeline.to({}, { duration: 0.8 })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section className="focus-text" ref={sectionRef} data-no-reveal>
      <WaveField progressRef={progressRef} />
      <div className="focus-text__shade" aria-hidden="true" />

      <div className="focus-text__stage">
        {focusLines.map((line, index) => (
          <p
            key={line}
            className="focus-text__line"
            ref={(element) => {
              linesRef.current[index] = element
            }}
          >
            {/* Each word is its own element so it can rise and sink on its own */}
            {line.split(' ').map((word, wordIndex) => (
              <span className="focus-text__word" key={word + wordIndex}>
                {word}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className="focus-text__progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
    </section>
  )
}

export default FocusText
