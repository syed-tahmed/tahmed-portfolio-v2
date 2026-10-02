import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks, site } from '../../data/site.js'
import { useScrollToSection } from '../../hooks/useScrollToSection.js'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const scrollToSection = useScrollToSection()

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close the mobile menu with the Escape key
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Stop the page behind the open menu from scrolling
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleSectionClick = (sectionId) => {
    setMenuOpen(false)
    scrollToSection(sectionId)
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo" aria-label={`${site.name}, home`}>
          <span className="navbar__mark" aria-hidden="true">
            <i className="navbar__dot navbar__dot--orange" />
            <i className="navbar__dot navbar__dot--blue" />
          </span>
          <span className="navbar__name">{site.name}</span>
        </NavLink>

        <nav
          id="primary-navigation"
          className={`navbar__nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main"
        >
          <ul className="navbar__links">
            {navLinks.map((link) =>
              link.type === 'section' ? (
                <li key={link.label}>
                  <button
                    type="button"
                    className="navbar__section-link"
                    onClick={() => handleSectionClick(link.sectionId)}
                  >
                    {link.label}
                  </button>
                </li>
              ) : (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => (isActive ? 'is-active' : '')}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <button
          type="button"
          className={`navbar__burger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Navbar
