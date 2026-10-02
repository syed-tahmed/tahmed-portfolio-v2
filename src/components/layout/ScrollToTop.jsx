import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/*
 * Starts every new page at the top instead of keeping the old scroll position.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default ScrollToTop
