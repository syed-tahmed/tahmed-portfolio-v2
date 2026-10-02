import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Timeline.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * One labelled timeline, used for both education and work history.
 * Cards rise and tilt into place, and a glow follows the cursor inside each card.
 */
function Timeline({ label, icon, items, colourOffset = 0 }) {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.timeline__item', {
        y: 60,
        opacity: 0,
        rotateX: -8,
        transformOrigin: 'top center',
        duration: 1,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: '.timeline__list', start: 'top 84%', once: true },
      })

      gsap.from('.timeline__label', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.timeline__list',
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 1,
            },
          },
        )
      }
    }, sectionRef)

    return () => context.revert()
  }, [])

  // Moves a soft highlight to wherever the cursor sits inside the card
  const trackGlow = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width) * 100 + '%')
    card.style.setProperty('--my', ((event.clientY - rect.top) / rect.height) * 100 + '%')
  }

  return (
    <section className="timeline" ref={sectionRef} data-no-reveal>
      <div className="container timeline__grid">
        <h2 className="timeline__label">
          <span className="timeline__icon" aria-hidden="true">{icon}</span>
          {label}
        </h2>

        <ol className="timeline__list">
          <span className="timeline__track" aria-hidden="true">
            <span className="timeline__progress" ref={lineRef} />
          </span>

          {items.map((item, index) => (
            <li className="timeline__item" key={item.title + item.period}>
              <span className="timeline__marker" aria-hidden="true">
                <span className="timeline__pulse" />
              </span>

              <article
                className={`timeline__card timeline__card--${((index + colourOffset) % 4) + 1}`}
                onPointerMove={trackGlow}
              >
                <span className="timeline__glow" aria-hidden="true" />

                <div className="timeline__head">
                  <span className="timeline__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="timeline__period">{item.period}</span>
                </div>

                <h3>{item.title}</h3>
                <p className="timeline__subtitle">{item.subtitle}</p>
                <p className="timeline__detail">{item.detail}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Timeline
