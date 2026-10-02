import { marquee } from '../../data/site.js'
import './ScrollTopRing.css'

const circlePath = 'M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0'

/*
 * Rotating circular label that scrolls the page back to the top.
 */
function ScrollTopRing() {
  const goTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <button type="button" className="scroll-ring" onClick={goTop} aria-label="Back to top">
      <svg className="scroll-ring__svg" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="scroll-ring-path" d={circlePath} />
        </defs>
        <text className="scroll-ring__text">
          <textPath href="#scroll-ring-path" startOffset="0%">{marquee.ringText}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="scroll-ring__arrow">
        <path d="M12 20V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export default ScrollTopRing
