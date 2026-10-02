import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process } from '../../data/site.js'
import ProcessIcon from '../ui/ProcessIcon.jsx'
import './Process.css'

gsap.registerPlugin(ScrollTrigger)

function Process() {
  const sectionRef = useRef(null)
  const stepsRef = useRef([])
  const lineRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const steps = stepsRef.current.filter(Boolean)
      if (steps.length === 0) return

      // Highlight whichever step is closest to the middle of the screen
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          end: 'bottom 38%',
          // Fires in both directions, so scrolling back up steps backwards too
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(index)
          },
          onEnterBack: () => setActiveIndex(index),
        })
      })

      // Progress line grows as the list scrolls past
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process__steps',
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 2.2,
          },
        },
      )

      gsap.from('.process__step', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.process__steps',
          start: 'top 85%',
          once: true,
        },
      })
    }, sectionRef)

    return () => context.revert()
  }, [])

  return (
    <section className="process section" ref={sectionRef} data-no-reveal>
      <div className="container process__grid">
        <div className="process__intro">
          <p className="process__label">{process.label}</p>
          <h2>{process.title}</h2>
          <p className="process__description">{process.description}</p>
        </div>

        <ol className="process__steps">
          <span className="process__track" aria-hidden="true">
            <span className="process__progress" ref={lineRef} />
          </span>

          {process.steps.map((step, index) => (
            <li
              key={step.title}
              className={`process__step ${index === activeIndex ? 'is-active' : ''}`}
              ref={(element) => {
                stepsRef.current[index] = element
              }}
            >
              <span className="process__dot" aria-hidden="true">
                <ProcessIcon name={step.icon} />
              </span>
              <div className="process__card">
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
