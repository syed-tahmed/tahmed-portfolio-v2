import './ToolIcon.css'

/*
 * Brand-style glyphs for the tools that orbit the photo.
 * Each one is drawn centred inside a 24x24 box.
 */
const icons = {
  figma: (
    <g>
      <path d="M9 2.5h3v4H9a2 2 0 1 1 0-4Z" fill="#F24E1E" />
      <path d="M12 2.5h3a2 2 0 1 1 0 4h-3v-4Z" fill="#F24E1E" fillOpacity="0.85" />
      <path d="M9 6.5h3v4H9a2 2 0 1 1 0-4Z" fill="#A259FF" />
      <circle cx="14" cy="8.5" r="2" fill="#1ABCFE" />
      <path d="M9 10.5h3v2a2 2 0 1 1-3-1.7v-.3Z" fill="#0ACF83" />
    </g>
  ),
  react: (
    <g fill="none" stroke="#61DAFB" strokeWidth="1.4">
      <circle cx="12" cy="12" r="1.9" fill="#61DAFB" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(120 12 12)" />
    </g>
  ),
  js: (
    <g>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#F0DB4F" />
      <path
        d="M11 8.5v5.9c0 1.4-.8 2.1-2.05 2.1-1.05 0-1.8-.55-2.15-1.45"
        fill="none"
        stroke="#111"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M13.4 14.9c.5.9 1.3 1.4 2.35 1.4 1.15 0 1.85-.6 1.85-1.4 0-.9-.65-1.25-1.8-1.75-1.45-.6-2.3-1.15-2.3-2.5 0-1.25 1-2.05 2.4-2.05 1 0 1.7.35 2.2 1.15"
        fill="none"
        stroke="#111"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </g>
  ),
  framer: <path d="M6.5 2h11v6.5h-5.5l5.5 5.5v8l-11-11V8.5h5.5L6.5 2Z" fill="#1B1B1B" />,
  /* 3D cube, drawn as three faces */
  cube: (
    <g>
      <path d="M12 3 3.5 7.7v8.6L12 21l8.5-4.7V7.7L12 3Z" fill="#1F1F23" />
      <path d="M12 3 3.5 7.7 12 12.4l8.5-4.7L12 3Z" fill="#3A3A42" />
      <path d="M12 12.4V21l8.5-4.7V7.7L12 12.4Z" fill="#111114" />
    </g>
  ),
  tailwind: (
    <path
      d="M12 6.8c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98.99 2.11 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.96 14.49 6.8 12 6.8ZM7 12.8c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98.99 2.11 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35-.98-.99-2.11-2.15-4.6-2.15Z"
      fill="#38BDF8"
    />
  ),
}

function ToolIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" className="tool-icon">
      {icons[name]}
    </svg>
  )
}

export default ToolIcon
