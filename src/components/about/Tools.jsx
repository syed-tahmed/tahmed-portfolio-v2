import { tools } from '../../data/site.js'
import ToolLogo from '../ui/ToolLogo.jsx'
import './Tools.css'

function Tools() {
  // The list is rendered twice so the loop has no visible seam
  const loop = [...tools.items, ...tools.items]

  return (
    <section className="tools section" data-no-reveal>
      <h2 className="tools__title">{tools.title}</h2>

      <div className="tools__viewport">
        <div className="tools__track">
          {loop.map((item, index) => (
            <figure className="tools__item" key={item.label + index}>
              <span className="tools__badge">
                <ToolLogo name={item.logo} />
              </span>
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tools
