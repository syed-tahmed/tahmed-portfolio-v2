/*
 * Brand marks for the tools strip, drawn as SVG so they stay sharp.
 */
const logos = {
  figma: (
    <g>
      <path d="M9 2.5h3v4H9a2 2 0 1 1 0-4Z" fill="#F24E1E" />
      <path d="M12 2.5h3a2 2 0 1 1 0 4h-3v-4Z" fill="#FF7262" />
      <path d="M9 6.5h3v4H9a2 2 0 1 1 0-4Z" fill="#A259FF" />
      <circle cx="14" cy="8.5" r="2" fill="#1ABCFE" />
      <path d="M9 10.5h3v2a2 2 0 1 1-3-1.7v-.3Z" fill="#0ACF83" />
    </g>
  ),
  framer: <path d="M6.5 2h11v6.5h-5.5l5.5 5.5v8l-11-11V8.5h5.5L6.5 2Z" fill="#1B1B1B" />,
  webflow: (
    <g>
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#325AFF" />
      <path d="M6 8.5h2.2l1.3 4.4 1.4-4.4h1.9l1.4 4.4 1.3-4.4H18l-2.7 7h-2l-1.3-4.1L10.7 15.5h-2L6 8.5Z" fill="#fff" />
    </g>
  ),
  notion: (
    <g>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="#fff" stroke="#1B1B1B" strokeWidth="1.6" />
      <path d="M8 8.5v7M8 8.5l8 7M16 8.5v7" fill="none" stroke="#1B1B1B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  slack: (
    <g>
      <path d="M6.2 14.3a1.9 1.9 0 1 1-1.9-1.9h1.9v1.9Zm1 0a1.9 1.9 0 0 1 3.8 0v4.8a1.9 1.9 0 1 1-3.8 0v-4.8Z" fill="#E01E5A" />
      <path d="M9.1 6.2a1.9 1.9 0 1 1 1.9-1.9v1.9H9.1Zm0 1a1.9 1.9 0 0 1 0 3.8H4.3a1.9 1.9 0 1 1 0-3.8h4.8Z" fill="#36C5F0" />
      <path d="M17.8 9.1a1.9 1.9 0 1 1 1.9 1.9h-1.9V9.1Zm-1 0a1.9 1.9 0 1 1-3.8 0V4.3a1.9 1.9 0 1 1 3.8 0v4.8Z" fill="#2EB67D" />
      <path d="M14.9 17.8a1.9 1.9 0 1 1-1.9 1.9v-1.9h1.9Zm0-1a1.9 1.9 0 0 1 0-3.8h4.8a1.9 1.9 0 1 1 0 3.8h-4.8Z" fill="#ECB22E" />
    </g>
  ),
  trello: (
    <g>
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#1868DB" />
      <rect x="5.5" y="5.5" width="5" height="11" rx="1.2" fill="#fff" />
      <rect x="13" y="5.5" width="5" height="7" rx="1.2" fill="#fff" />
    </g>
  ),
  behance: (
    <g>
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#1E51F5" />
      <path d="M4.8 7.2h4.1c1.5 0 2.4.7 2.4 1.9 0 .8-.4 1.3-1.1 1.6.9.3 1.4.9 1.4 1.9 0 1.4-1 2.2-2.7 2.2H4.8V7.2Zm3.7 3c.6 0 1-.3 1-.8s-.4-.8-1-.8H6.6v1.6h1.9Zm.2 3.2c.7 0 1.1-.3 1.1-.9s-.4-.9-1.1-.9H6.6v1.8h2.1Z" fill="#fff" />
      <path d="M13.6 7.6h4.6v1.2h-4.6z" fill="#fff" />
      <path d="M15.9 10c1.7 0 2.8 1.2 2.8 2.9v.4h-4.1c.1.7.6 1.1 1.4 1.1.5 0 .9-.2 1.1-.6h1.5c-.3 1.1-1.3 1.8-2.6 1.8-1.8 0-2.9-1.2-2.9-2.8s1.1-2.8 2.8-2.8Zm-1.3 2.3h2.6c-.1-.7-.6-1.1-1.3-1.1s-1.2.4-1.3 1.1Z" fill="#fff" />
    </g>
  ),
  cursor: (
    <g>
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" fill="#1B1B1B" />
      <path d="M4.6 7.4h14.8L12 18.6 4.6 7.4Z" fill="#fff" />
      <path d="M12 12v6.6L4.6 7.4 12 12Z" fill="#1B1B1B" />
    </g>
  ),
  claude: (
    <g>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#D97757" />
      <g fill="#FAF0EA">
        <path d="M11.4 5.5h1.2l.5 5.4-1.1.2-.6-5.6ZM11.4 18.5h1.2l.6-5.6-1.1-.2-.7 5.8ZM5.5 11.4v1.2l5.4.5.2-1.1-5.6-.6ZM18.5 11.4v1.2l-5.6.6-.2-1.1 5.8-.7Z" />
        <path d="m7.2 6.4.9-.8 3.5 4.1-.8.8-3.6-4.1ZM16.8 17.6l-.9.8-3.6-4.1.8-.8 3.7 4.1ZM6.4 16.8l.8.9 4.1-3.6-.8-.8-4.1 3.5ZM17.6 7.2l-.8-.9-4.1 3.6.8.8 4.1-3.5Z" />
      </g>
    </g>
  ),
}

function ToolLogo({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      {logos[name]}
    </svg>
  )
}

export default ToolLogo
