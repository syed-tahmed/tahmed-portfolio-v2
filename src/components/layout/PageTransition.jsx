import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

/*
 * Fades the page content in whenever the route changes.
 */
function PageTransition({ children }) {
  const wrapperRef = useRef(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // Opacity only. A transform on this wrapper would break pinned
      // sections, because fixed elements stop sticking inside a transform.
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'opacity' },
      )
    }, wrapperRef)

    return () => context.revert()
  }, [pathname])

  return <div ref={wrapperRef}>{children}</div>
}

export default PageTransition
