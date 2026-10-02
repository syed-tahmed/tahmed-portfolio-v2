import { useRef } from 'react'

type FontConfig = {
  fontSize?: string
  fontFamily?: string
  fontWeight?: number | string
  lineHeight?: string
  letterSpacing?: string
}

type GlassConfig = {
  blur?: number
  refraction?: number
  tint?: string
  grain?: number
}

type CursorConfig = {
  hover?: number
  damping?: number
}

type FrostedTypeBandProps = {
  items: { text: string }[]
  font?: FontConfig
  textColor?: string
  speed?: number
  distance?: number
  tilt?: number
  gap?: number
  fade?: number
  glass?: GlassConfig
  cursor?: CursorConfig
  style?: React.CSSProperties
}

function FrostedTypeBand({
  items,
  font = {},
  textColor = '#ffffff',
  speed = 55,
  distance = 720,
  tilt = 0,
  gap = 110,
  fade = 28,
  glass = {},
  style = {},
}: FrostedTypeBandProps) {
  const ref = useRef<HTMLDivElement>(null)

  const {
    fontSize = '18px',
    fontFamily = 'Inter, system-ui, sans-serif',
    fontWeight = 700,
    lineHeight = '1.5em',
    letterSpacing = '0.08em',
  } = font

  const {
    blur = 45,
    tint = 'rgba(30, 45, 80, 0.32)',
    grain = 2,
  } = glass

  const duration = Math.max(12, distance / Math.max(speed, 1))

  const repeatedItems = [...items, ...items, ...items, ...items]

  return (
    <div
      ref={ref}
      className="frosted-type-band"
      style={{
        ...style,
        '--ftb-blur': `${blur}px`,
        '--ftb-tint': tint,
        '--ftb-grain': grain,
        '--ftb-duration': `${duration}s`,
        '--ftb-gap': `${gap}px`,
        '--ftb-color': textColor,
        '--ftb-size': fontSize,
        '--ftb-family': fontFamily,
        '--ftb-weight': fontWeight,
        '--ftb-line': lineHeight,
        '--ftb-spacing': letterSpacing,
        '--ftb-tilt': `${tilt}deg`,
        '--ftb-fade': `${fade}%`,
      } as React.CSSProperties}
    >
      <div className="frosted-type-band__glow frosted-type-band__glow--one" />
      <div className="frosted-type-band__glow frosted-type-band__glow--two" />

      <div className="frosted-type-band__glass">
        <div className="frosted-type-band__grain" />

        <div className="frosted-type-band__rows">
          {[0, 1, 2, 3].map((row) => (
            <div
              className={`frosted-type-band__row frosted-type-band__row--${row}`}
              key={row}
            >
              <div className="frosted-type-band__track">
                {repeatedItems.map((item, index) => (
                  <span
                    className="frosted-type-band__item"
                    key={`${row}-${index}`}
                  >
                    {item.text}
                    <span className="frosted-type-band__dot">✦</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="frosted-type-band__fade" />

        <div className="frosted-type-band__center">
          <span>SELECTED SERVICES</span>
          <i />
          <span>DESIGN • BUILD • CREATE</span>
        </div>
      </div>

      <style>{`
        .frosted-type-band {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(80, 110, 255, 0.10),
              transparent 48%
            ),
            rgba(5, 8, 20, 0.35);
        }

        .frosted-type-band__glass {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: inherit;
          background: var(--ftb-tint);
          backdrop-filter: blur(var(--ftb-blur));
          -webkit-backdrop-filter: blur(var(--ftb-blur));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.10),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04),
            0 30px 100px rgba(0, 0, 0, 0.25);
        }

        .frosted-type-band__grain {
          position: absolute;
          inset: -50%;
          z-index: 5;
          pointer-events: none;
          opacity: calc(var(--ftb-grain) / 100);
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
          transform: rotate(8deg);
        }

        .frosted-type-band__glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.24;
          pointer-events: none;
        }

        .frosted-type-band__glow--one {
          top: -120px;
          left: 8%;
          background: rgba(80, 100, 255, 0.55);
          animation: ftbGlowOne 8s ease-in-out infinite alternate;
        }

        .frosted-type-band__glow--two {
          right: 5%;
          bottom: -160px;
          background: rgba(150, 70, 255, 0.38);
          animation: ftbGlowTwo 10s ease-in-out infinite alternate;
        }

        .frosted-type-band__rows {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 22px;
          transform: rotate(var(--ftb-tilt));
        }

        .frosted-type-band__row {
          width: max-content;
          white-space: nowrap;
          opacity: 0.76;
        }

        .frosted-type-band__track {
          display: flex;
          width: max-content;
          gap: var(--ftb-gap);
          animation: ftbMove var(--ftb-duration) linear infinite;
        }

        .frosted-type-band__row--1 .frosted-type-band__track,
        .frosted-type-band__row--3 .frosted-type-band__track {
          animation-direction: reverse;
          animation-duration: calc(var(--ftb-duration) * 1.18);
        }

        .frosted-type-band__row--1 {
          opacity: 0.30;
          transform: scale(0.82);
          filter: blur(1px);
        }

        .frosted-type-band__row--2 {
          opacity: 0.48;
          transform: scale(0.92);
        }

        .frosted-type-band__row--3 {
          opacity: 0.22;
          transform: scale(0.76);
          filter: blur(1.5px);
        }

        .frosted-type-band__item {
          display: inline-flex;
          align-items: center;
          gap: var(--ftb-gap);
          color: var(--ftb-color);
          font-family: var(--ftb-family);
          font-size: var(--ftb-size);
          font-weight: var(--ftb-weight);
          line-height: var(--ftb-line);
          letter-spacing: var(--ftb-spacing);
          text-shadow: 0 0 24px rgba(255, 255, 255, 0.15);
        }

        .frosted-type-band__dot {
          display: inline-block;
          font-size: 10px;
          opacity: 0.55;
        }

        .frosted-type-band__fade {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              rgba(5, 8, 20, 0.92) 0%,
              transparent var(--ftb-fade),
              transparent calc(100% - var(--ftb-fade)),
              rgba(5, 8, 20, 0.92) 100%
            ),
            linear-gradient(
              180deg,
              rgba(5, 8, 20, 0.65),
              transparent 25%,
              transparent 75%,
              rgba(5, 8, 20, 0.65)
            );
        }

        .frosted-type-band__center {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 8;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 18px;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.055);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.25),
            inset 0 1px rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.78);
          font-family: var(--ftb-family);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          white-space: nowrap;
        }

        .frosted-type-band__center i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
        }

        @keyframes ftbMove {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes ftbGlowOne {
          from {
            transform: translate3d(-20px, 20px, 0) scale(1);
          }
          to {
            transform: translate3d(180px, 80px, 0) scale(1.35);
          }
        }

        @keyframes ftbGlowTwo {
          from {
            transform: translate3d(40px, 40px, 0) scale(1);
          }
          to {
            transform: translate3d(-160px, -80px, 0) scale(1.3);
          }
        }

        @media (max-width: 768px) {
          .frosted-type-band {
            border-radius: 22px;
          }

          .frosted-type-band__center {
            font-size: 8px;
            gap: 9px;
            padding: 10px 13px;
          }

          .frosted-type-band__rows {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default FrostedTypeBand
