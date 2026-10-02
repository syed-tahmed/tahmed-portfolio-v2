import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collaboration } from '../../data/site.js'
import ToolIcon from '../ui/ToolIcon.jsx'
import './Collaboration.css'

gsap.registerPlugin(ScrollTrigger)

// Inner ring turns one way, outer ring the other
const innerTools = ['figma', 'react', 'js']
const outerTools = ['tailwind', 'framer', 'cube']

function Orbit({ tools, className }) {
  return (
    <div className={`collab__orbit ${className}`} aria-hidden="true">
      {tools.map((tool, index) => (
        <span
          className="collab__tool"
          key={tool}
          style={{ '--angle': `${(360 / tools.length) * index}deg` }}
        >
          {/* Counter-rotates so the glyph itself stays upright */}
          <span className="collab__tool-inner">
            <ToolIcon name={tool} />
          </span>
        </span>
      ))}
    </div>
  )
}

function Collaboration() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from(['.collab__title', '.collab__cta'], {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })

      gsap.from('.collab__photo', {
        scale: 0.92,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => context.revert()
  }, [])

  return (
    <section className="collab section" ref={sectionRef} data-no-reveal>
      <div className="container collab__grid">
        <div className="collab__content">
          <h2 className="collab__title">
            {collaboration.title}{' '}
            <span className="collab__highlight">{collaboration.highlight}</span>
          </h2>
          <Link className="btn collab__cta" to={collaboration.buttonUrl}>
            {collaboration.buttonLabel}
          </Link>
        </div>

        <div className="collab__media">
          <Orbit tools={outerTools} className="collab__orbit--outer" />
          <Orbit tools={innerTools} className="collab__orbit--inner" />
          <div className="collab__photo">
            <img src={collaboration.image} alt={collaboration.imageAlt} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Collaboration
