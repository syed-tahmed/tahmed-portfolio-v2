import { useState } from 'react'
import { Link } from 'react-router-dom'
import { footer, site, socials } from '../../data/site.js'
import { useScrollToSection } from '../../hooks/useScrollToSection.js'
import ParticleDrift from '../ui/ParticleDrift.jsx'
import MarqueeStrip from './MarqueeStrip.jsx'
import ScrollTopRing from './ScrollTopRing.jsx'
import RobotAssistant from './RobotAssistant.jsx'
import './Footer.css'

function Footer() {
  const [copied, setCopied] = useState(false)
  const scrollToSection = useScrollToSection()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <footer className="footer">
      {/* Soft colour blobs and drifting particles behind the footer */}
      <span className="footer__blob footer__blob--blue" aria-hidden="true" />
      <span className="footer__blob footer__blob--purple" aria-hidden="true" />
      <ParticleDrift />

      <ScrollTopRing />
      <MarqueeStrip />

      <div className="container footer__inner">
        <nav className="footer__links" aria-label="Footer">
          <ul>
            {footer.pages.map((page) =>
              page.type === 'section' ? (
                <li key={page.label}>
                  <button type="button" onClick={() => scrollToSection(page.sectionId)}>
                    {page.label}
                  </button>
                </li>
              ) : (
                <li key={page.label}>
                  <Link to={page.to}>{page.label}</Link>
                </li>
              ),
            )}
          </ul>

          <ul>
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__right">
          <div className="footer__cta">
            <p>{footer.prompt}</p>
            <button type="button" className="btn" onClick={copyEmail}>
              {copied ? 'Copied' : 'Copy Email'}
            </button>
          </div>

          <RobotAssistant />
        </div>
      </div>

      <p className="footer__credit">{footer.credit}</p>
    </footer>
  )
}

export default Footer
