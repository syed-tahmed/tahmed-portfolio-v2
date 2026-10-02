import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/*
 * Scrolls to a section on the home page.
 * If the visitor is on another page, it goes home first and then scrolls.
 */
export function useScrollToSection() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (sectionId) => {
      const scroll = () => {
        const target = document.getElementById(sectionId)
        if (!target) return
        // Lenis exposes itself on window, so section links stay smooth too
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -70 })
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      if (pathname === '/') {
        scroll()
      } else {
        navigate('/')
        // Wait for the home page to render before scrolling
        setTimeout(scroll, 120)
      }
    },
    [navigate, pathname],
  )
}
