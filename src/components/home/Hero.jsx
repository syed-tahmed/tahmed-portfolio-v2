import { Link } from 'react-router-dom'
import { hero } from '../../data/site.js'
import ResumeBadge from '../ui/ResumeBadge.jsx'
import PeekRobot from '../ui/PeekRobot.jsx'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="hero__greeting">{hero.greeting}</p>

          <h1 className="hero__title">
            <span className="hero__line">{hero.titleTop}</span>
            <span className="hero__line hero__line--badge">
              <span className="hero__badge">{hero.badge}</span>
              {hero.titleBottom}
            </span>
          </h1>

          <p className="hero__intro">{hero.intro}</p>

          <Link to="/contact" className="btn hero__cta">
            Let&rsquo;s Talk
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M4 12 12 4m0 0H5.5M12 4v6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <dl className="hero__stats">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__media">
          <PeekRobot />
          <div className="hero__photo">
            <img src={hero.image} alt={hero.imageAlt} />
          </div>
          <div className="hero__badge-wrap">
            <ResumeBadge />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
