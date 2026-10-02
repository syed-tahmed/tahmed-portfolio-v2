import { site } from '../../data/site.js'
import './ResumeBadge.css'

/*
 * Circular badge with text running around a circle.
 * The ring spins on its own; clicking it downloads the resume PDF.
 */
function ResumeBadge() {
  return (
    <a
      className="resume-badge"
      href={site.resume}
      download
      aria-label="Download my resume"
      title="Download my resume"
    >
      <svg className="resume-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="resume-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text className="resume-badge__text">
          <textPath href="#resume-circle" startOffset="0%">
            DOWNLOAD MY RESUME • SCROLL TO SEE MY WORK •
          </textPath>
        </text>
      </svg>

      <span className="resume-badge__center">
        Resume
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path
            d="M8 2v9m0 0 3.5-3.5M8 11 4.5 7.5M2.5 13.5h11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  )
}

export default ResumeBadge
