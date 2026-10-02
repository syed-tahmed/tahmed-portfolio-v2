import './ServiceIcon.css'

/*
 * Simple line icons drawn as SVG, one per service.
 * No image files needed, and they stay sharp at any size.
 */
const icons = {
  uiux: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="10" width="32" height="26" rx="4" />
      <path d="M8 18h32" />
      <path d="M18 26h10" />
      <path d="M18 31h6" />
      <circle cx="12.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="33" cy="29" r="4" />
    </g>
  ),
  web: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17 12 24l7 7" />
      <path d="M29 17l7 7-7 7" />
      <path d="M26 13 22 35" />
    </g>
  ),
  brand: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="7" />
      <path d="M24 8v5M24 35v5M8 24h5M35 24h5" />
      <path d="M13 13l3.5 3.5M31.5 31.5 35 35M35 13l-3.5 3.5M16.5 31.5 13 35" />
    </g>
  ),
}

function ServiceIcon({ name }) {
  return (
    <span className={`service-icon service-icon--${name}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" width="48" height="48">
        {icons[name]}
      </svg>
    </span>
  )
}

export default ServiceIcon
