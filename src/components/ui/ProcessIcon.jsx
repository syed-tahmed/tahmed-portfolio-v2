import './ProcessIcon.css'

/*
 * One line icon per process step.
 */
const paths = {
  discovery: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM16 16l4 4',
  strategy: 'M4 18h4V9H4v9Zm6 0h4V4h-4v14Zm6 0h4v-6h-4v6Z',
  direction: 'M12 3v18M3 12h18M6.5 6.5 12 12l5.5-5.5',
  design: 'M15.5 4.5 19 8l-9 9-4 1 1-4 8.5-9.5ZM4 20h8',
  development: 'M9 7 4 12l5 5M15 7l5 5-5 5',
  delivery: 'M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7ZM4 8.5 12 13l8-4.5M12 13v7',
}

function ProcessIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="process-icon">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default ProcessIcon
