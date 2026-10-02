import { useEffect, useState } from 'react'
import RobotFace from './RobotFace.jsx'
import './PeekRobot.css'

// One of these is picked each time the robot pops up
const greetings = ['Hi there', 'Hello', 'Hey you', 'Psst...']

/*
 * A small robot that peeks over the corner of the hero photo,
 * waves, says hello, then ducks back down.
 */
function PeekRobot() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [greeting, setGreeting] = useState(greetings[0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let timer

    // Peeks for about four and a half seconds, then hides for eight
    const cycle = (show) => {
      if (show) setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
      setVisible(show)
      timer = setTimeout(() => cycle(!show), show ? 4500 : 8000)
    }

    timer = setTimeout(() => cycle(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const show = () => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    setVisible(true)
  }

  return (
    <div className={`peek ${visible ? 'is-up' : ''}`}>
      <span className="peek__bubble" aria-hidden="true">
        {greeting}
      </span>

      <button
        type="button"
        className="peek__robot"
        onClick={show}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        aria-label="Say hello"
        tabIndex={-1}
      >
        <RobotFace mood={hovered ? 'grin' : 'wave'} />
      </button>
    </div>
  )
}

export default PeekRobot
