import { marquee } from '../../data/site.js'
import './Marquee.css'

/*
 * Endless scrolling strip.
 * The list is rendered twice so the loop has no visible seam.
 */
function MarqueeStrip() {
  const items = [...marquee.items, ...marquee.items, ...marquee.items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {items.map((item, index) => (
              <span className="marquee__item" key={`${copy}-${index}`}>
                {item}
                <i className="marquee__sep" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarqueeStrip
