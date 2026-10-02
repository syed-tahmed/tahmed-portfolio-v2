import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
 * Gives every section a soft rise-and-fade as it scrolls into view.
 * Sections that run their own animations opt out with data-no-reveal.
 */
export function useSectionReveal() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray('main section:not([data-no-reveal])')

      sections.forEach((section) => {
        gsap.from(section, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            once: true,
          },
        })
      })
    })

    // Recalculate once images and fonts have settled
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300)

    return () => {
      clearTimeout(timer)
      context.revert()
    }
  }, [pathname])
}
