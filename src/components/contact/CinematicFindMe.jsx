import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './CinematicFindMe.css'

const scenes = [
  {
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85',
    title: 'FOLLOW THE PATH',
    text: 'Somewhere beyond the noise, there is a better direction.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85',
    title: 'KEEP GOING',
    text: 'Scroll deeper. The right connection is closer than you think.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=2200&q=85',
    title: 'YOU FOUND ME',
    text: 'Let’s turn an idea into something worth remembering.',
  },
]

export default function CinematicFindMe() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const current = Math.min(Math.max(-rect.top / total, 0), 1)

      setProgress(current)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()

    return () => window.removeEventListener('scroll', update)
  }, [])

  const activeScene = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2

  const cameraX = progress * -4
  const cameraY = progress * -2
  const cameraScale = 1 + progress * 0.13

  return (
    <section
      ref={sectionRef}
      className="cinematic-find"
      style={{
        '--camera-x': `${cameraX}%`,
        '--camera-y': `${cameraY}%`,
        '--camera-scale': cameraScale,
        '--progress': progress,
      }}
    >
      <div className="cinematic-find__sticky">

        <div className="cinematic-find__world">

          {scenes.map((scene, index) => (
            <div
              key={scene.title}
              className={`cinematic-find__scene ${
                activeScene === index ? 'is-active' : ''
              }`}
            >
              <img
                src={scene.image}
                alt=""
                className="cinematic-find__image"
              />
            </div>
          ))}

          <div className="cinematic-find__sky" />
          <div className="cinematic-find__fog cinematic-find__fog--one" />
          <div className="cinematic-find__fog cinematic-find__fog--two" />

          <svg
            className="cinematic-find__route"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M90 620 C180 580 180 500 300 490 C430 480 410 370 540 350 C690 325 640 210 820 145"
            />
            <circle cx="90" cy="620" r="7" />
            <circle cx="820" cy="145" r="10" />
          </svg>

          <div className="cinematic-find__grain" />
          <div className="cinematic-find__vignette" />
        </div>

        <div className="cinematic-find__top">
          <span>CONTACT / 01</span>
          <span>FOLLOW THE LIGHT</span>
        </div>

        <div className="cinematic-find__copy">
          <span className="cinematic-find__eyebrow">
            A LITTLE JOURNEY
          </span>

          <h2>
            {scenes[activeScene].title}
          </h2>

          <p>
            {scenes[activeScene].text}
          </p>
        </div>

        <div className="cinematic-find__progress">
          <span>01</span>

          <div className="cinematic-find__progress-line">
            <i />
          </div>

          <span>03</span>
        </div>

        <div className="cinematic-find__destination">
          <span className="cinematic-find__destination-dot" />
          <span>YOU ARE HERE</span>
        </div>

        <div className="cinematic-find__final">
          <span>THE JOURNEY ENDS HERE</span>

          <h3>
            Let’s create something
            <br />
            worth finding.
          </h3>

          <Link to="/contact" className="cinematic-find__button">
            Contact me
            <span>↗</span>
          </Link>
        </div>

        <div className="cinematic-find__scroll">
          <span>SCROLL TO EXPLORE</span>
          <i />
        </div>
      </div>
    </section>
  )
}
