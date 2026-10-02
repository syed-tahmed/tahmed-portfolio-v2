import ShapeMosaic from './ShapeMosaic.jsx'
import './BannerAura.css'

/*
 * Dark banner background with a grid of slowly turning shapes.
 */
function BannerAura() {
  return (
    <div className="aura" aria-hidden="true">
      <ShapeMosaic ink="#Black" lit="#ffcf6b" cell={34} reach={180} />
    </div>
  )
}

export default BannerAura
