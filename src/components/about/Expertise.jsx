import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { expertise } from '../../data/site.js'
import './Expertise.css'

gsap.registerPlugin(ScrollTrigger)

// One small mark per group, drawn inline
const groupIcons = [
  'M4 20h16M6 16l4-10 4 6 4-4 2 8',
  'M9 4h6M10 4v5l-5 9a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2l-5-9V4',
]

function Expertise() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.expertise__head > *', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })

      gsap.from('.expertise__card', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.expertise__cards', start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => context.revert()
  }, [])

  return (
    <section className="expertise section" ref={sectionRef} data-no-reveal>
      <div className="container">
        <header className="expertise__head">
          <h2>{expertise.title}</h2>
          <p>{expertise.intro}</p>
        </header>

        <div className="expertise__cards">
          {expertise.groups.map((group, groupIndex) => {
            let count = 0

            return (
              <article
                className={`expertise__card expertise__card--${groupIndex + 1}`}
                key={group.title}
              >
                <div className="expertise__card-head">
                  <span className="expertise__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path d={groupIcons[groupIndex % groupIcons.length]} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <h3>{group.title}</h3>
                    <p className="expertise__note">{group.note}</p>
                  </div>
                </div>

                <div className="expertise__columns">
                  {group.columns.map((column) => (
                    <ul key={column[0]}>
                      {column.map((skill) => {
                        count += 1
                        return (
                          <li key={skill}>
                            <span className="expertise__num">{String(count).padStart(2, '0')}</span>
                            {skill}
                          </li>
                        )
                      })}
                    </ul>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Expertise
