import '../../styles/wave-button.css'

// Two crests, each drawn twice so the loop has no seam
const crest = 'M0 12 C 25 2, 50 22, 75 12 S 125 2, 150 12 S 200 22, 200 12 L200 22 L0 22 Z'

/*
 * Drop this inside any element with the class "btn-wave".
 * The water rises from the bottom on hover.
 */
function WaveFill() {
  return (
    <span className="btn-wave__water" aria-hidden="true">
      <svg viewBox="0 0 200 22" preserveAspectRatio="none">
        <path d={crest} />
      </svg>
      <svg viewBox="0 0 200 22" preserveAspectRatio="none">
        <path d={crest} />
      </svg>
    </span>
  )
}

export default WaveFill
