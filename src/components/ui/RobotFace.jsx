import './RobotFace.css'

/*
 * The assistant's face. The pupils follow the pointer and the
 * expression changes with the mood: idle, happy, grin or thinking.
 */
function RobotFace({ mood = 'idle', look = { x: 0, y: 0 } }) {
  return (
    <svg className={`robot-face robot-face--${mood}`} viewBox="0 0 120 130" aria-hidden="true">
      <defs>
        <linearGradient id="robot-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfcce9" />
        </linearGradient>
        <radialGradient id="robot-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#8cf24a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8cf24a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft green glow behind the head */}
      <ellipse className="robot-face__glow" cx="60" cy="56" rx="54" ry="44" fill="url(#robot-glow)" />

      {/* Antenna */}
      <line x1="60" y1="6" x2="60" y2="18" stroke="#c3c0e0" strokeWidth="3" strokeLinecap="round" />
      <circle className="robot-face__antenna" cx="60" cy="6" r="4.5" fill="#8cf24a" />

      {/* Head */}
      <rect x="14" y="18" width="92" height="74" rx="26" fill="url(#robot-shell)" stroke="#c3c0e0" strokeWidth="1.5" />

      {/* Ears */}
      <rect x="6" y="46" width="8" height="20" rx="4" fill="#cfcce8" />
      <rect x="106" y="46" width="8" height="20" rx="4" fill="#cfcce8" />

      {/* Dark screen */}
      <rect x="26" y="32" width="68" height="46" rx="17" fill="#15141f" />

      {/* Eyes drift towards the pointer */}
      <g className="robot-face__eyes" transform={`translate(${look.x} ${look.y})`}>
        <ellipse className="robot-face__eye" cx="46" cy="53" rx="6.5" ry="9" fill="#8cf24a" />
        <ellipse className="robot-face__eye" cx="74" cy="53" rx="6.5" ry="9" fill="#8cf24a" />
        {/* Curved happy eyes, shown only when grinning */}
        <path className="robot-face__eye-curve" d="M39 55 Q46 47 53 55" fill="none" stroke="#8cf24a" strokeWidth="3.2" strokeLinecap="round" />
        <path className="robot-face__eye-curve" d="M67 55 Q74 47 81 55" fill="none" stroke="#8cf24a" strokeWidth="3.2" strokeLinecap="round" />
      </g>

      {/* Mouth */}
      <path className="robot-face__mouth" d="M52 67 Q60 72 68 67" fill="none" stroke="#8cf24a" strokeWidth="2.6" strokeLinecap="round" />

      {/* Cheeks appear when happy */}
      <circle className="robot-face__cheek" cx="34" cy="66" r="4" fill="#ff8fb1" />
      <circle className="robot-face__cheek" cx="86" cy="66" r="4" fill="#ff8fb1" />

      {/* Body */}
      <rect x="26" y="90" width="68" height="30" rx="14" fill="#ebe9f8" stroke="#c3c0e0" strokeWidth="1.5" />
      <rect x="42" y="98" width="10" height="16" rx="5" fill="#d3d0ea" />
      <rect x="68" y="98" width="10" height="16" rx="5" fill="#d3d0ea" />

      {/* Waving arm, only while grinning */}
      <g className="robot-face__arm">
        <rect x="96" y="92" width="8" height="22" rx="4" fill="#d3d0ea" />
      </g>
    </svg>
  )
}

export default RobotFace
