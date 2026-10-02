import { useEffect, useRef, useState } from 'react'
import { robotBrain } from '../../data/site.js'
import RobotFace from '../ui/RobotFace.jsx'
import './RobotAssistant.css'

/*
 * Picks the answer whose keywords best match what the visitor typed.
 * The entry with the most matching words wins; none means the fallback.
 */
function findAnswer(question) {
  const text = question.toLowerCase()
  let best = null
  let bestScore = 0

  robotBrain.answers.forEach((entry) => {
    const score = entry.keywords.filter((word) => text.includes(word)).length
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  })

  return best ? best.reply : robotBrain.fallback
}

function RobotAssistant() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState('')
  const [thinking, setThinking] = useState(false)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  // The eyes drift a little towards the pointer
  useEffect(() => {
    const onMove = (event) => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      setLook({
        x: (dx / distance) * Math.min(3.5, distance / 60),
        y: (dy / distance) * Math.min(3.5, distance / 60),
      })
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // A short pause before the answer makes the robot feel like it is thinking
  const ask = (text) => {
    const asked = text.trim()
    if (!asked) return

    setQuestion('')
    setReply('')
    setThinking(true)

    setTimeout(() => {
      setReply(findAnswer(asked))
      setThinking(false)
    }, 700)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    ask(question)
  }

  const mood = hovered ? 'grin' : thinking ? 'thinking' : reply ? 'happy' : 'idle'

  return (
    <div className="robot" ref={rootRef}>
      {open && (
        <div className="robot__panel" role="dialog" aria-label="Ask about Tahmed">
          <button type="button" className="robot__close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>

          <div className="robot__bubble" aria-live="polite">
            {thinking ? (
              <span className="robot__typing" aria-label="Thinking">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <p>{reply || robotBrain.greeting}</p>
            )}
          </div>

          <ul className="robot__chips">
            {robotBrain.suggestions.map((item) => (
              <li key={item}>
                <button type="button" onClick={() => ask(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <form className="robot__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask me anything..."
              aria-label="Your question"
            />
            <button type="submit" disabled={!question.trim()} aria-label="Ask">
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <path d="M4 12h15m0 0-6-6m6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <div className="robot__dock">
        {!open && <span className="robot__hint">Ask me anything</span>}

        <button
          type="button"
          className={`robot__trigger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((value) => !value)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-label={open ? 'Close the assistant' : 'Ask about Tahmed'}
        >
          <RobotFace mood={mood} look={look} />
          {!open && <span className="robot__ping" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}

export default RobotAssistant
