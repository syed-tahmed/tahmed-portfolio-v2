import { useEffect, useRef } from 'react'
import './WaveField.css'

/*
 * A 3D field of glowing dots that rolls like the sea, drawn with WebGL.
 * Every dot is a point on a grid; the vertex shader lifts it into waves
 * and projects it through a simple camera.
 *
 * progressRef (0 to 1) comes from the scroll. As it grows, the camera
 * flies forward into the field, dips lower and tilts down.
 */

const FIELD_W = 3600
const FIELD_D = 7000
const CAM_Z0 = 700
const FOV = 60
const DPR_CAP = 1.5
const MAX_COLORS = 8
const CAM_Y_FULL = 550
const CAM_REF_AREA = 1200 * 800

const VERT = `
precision highp float;
attribute vec2 aGrid;
attribute vec2 aSeed;
uniform vec2 uRes;
uniform float uFocal, uTime, uAmp, uScatter, uFreq, uFlow, uDepth;
uniform float uCamY, uCamZ, uPitch, uDot, uColorCount, uCurR, uCurS, uHover;
uniform vec2 uDir, uJit;
uniform vec3 uColors[8];
uniform vec3 uCursor;
varying vec3 vCol;
varying float vA;
varying float vHot;

vec3 pickColor(float sel) {
  float idx = floor(sel * uColorCount);
  vec3 c = uColors[0];
  for (int i = 1; i < 8; i++) {
    if (float(i) >= uColorCount) break;
    if (float(i) == idx) c = uColors[i];
  }
  return c;
}

float surf(vec2 q) {
  return sin(q.x) * 0.55 + sin(q.x * 0.55 + q.y * 1.15) * 0.30 + sin(q.y * 0.75) * 0.22;
}

void main() {
  vec2 w = aGrid + (aSeed - 0.5) * uJit;
  w.y = uCamZ + mod(w.y - uFlow - uCamZ, uDepth);

  float h3 = fract(sin(dot(aSeed, vec2(91.37, 47.13))) * 12345.678);
  float h = surf(w * uFreq - uDir * uTime) * uAmp + (h3 - 0.5) * uScatter;

  float cd = length(w - uCursor.xy);
  float g = exp(-(cd * cd) / (uCurR * uCurR)) * uCursor.z;
  h += g * uCurS;
  float g2 = g * g; g2 = g2 * g2; g2 = g2 * g2;

  vec3 p = vec3(w.x, h - uCamY, w.y - uCamZ);
  float c = cos(uPitch);
  float s = sin(uPitch);
  float ry = p.y * c + p.z * s;
  float rz = -p.y * s + p.z * c;

  if (rz < 40.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    gl_PointSize = 0.0;
    vCol = uColors[0];
    vA = 0.0;
    vHot = 0.0;
    return;
  }

  gl_Position = vec4((p.x * uFocal / rz) / (uRes.x * 0.5), (ry * uFocal / rz) / (uRes.y * 0.5), 0.0, 1.0);
  float rad = max(uDot * uFocal / rz, 0.55);
  gl_PointSize = clamp(rad * 2.0 * (1.0 + g2 * uHover * 0.2), 1.0, 220.0);

  float bri = 0.28 + h3 * 0.72;
  vec2 bq = w * vec2(0.004, 0.0032) - uDir * uTime * 0.3;
  float band = sin(bq.x) + sin(bq.y);
  vCol = pickColor(fract((band + 2.0) * 0.25 + (aSeed.y - 0.5) * 0.55));

  float lum = dot(vCol, vec3(0.299, 0.587, 0.114));
  vHot = (0.25 + 0.75 * lum) * bri * bri * 0.7 + g2 * uHover * 0.55;
  float fog = (1.0 - smoothstep(2800.0, 6400.0, rz)) * smoothstep(70.0, 240.0, rz);
  vA = bri * fog * (1.0 + g2 * uHover * 0.55);
}
`

const FRAG = `
precision highp float;
varying vec3 vCol;
varying float vA;
varying float vHot;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float a = (1.0 - smoothstep(0.9, 1.0, d)) * vA;
  vec3 col = vCol + vec3(1.0) * pow(1.0 - d, 10.0) * vHot * 0.9;
  gl_FragColor = vec4(col * a, a);
}
`

// "#5A4AE0" -> [0.35, 0.29, 0.88]
const toRgb = (hex) => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}

// Repeatable random numbers, so the field looks the same every visit
const seeded = (a) => () => {
  a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const DEFAULT_COLORS = ['#5A4AE0', '#E2456D', '#F2D98A']

function WaveField({
  progressRef,
  colors = DEFAULT_COLORS,
  density = 110,
  dotSize = 2,
  waveHeight = 200,
  waveLength = 2070,
  waveSpeed = 250,
}) {
  const hostRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true })
    if (!gl) return undefined

    // ----- Compile the two shaders into one program -----
    const shader = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined
    gl.useProgram(prog)

    const U = (name) => gl.getUniformLocation(prog, name)
    const aGrid = gl.getAttribLocation(prog, 'aGrid')
    const aSeed = gl.getAttribLocation(prog, 'aSeed')

    // ----- Build the grid of dots once -----
    const cols = density
    const rows = density * 2
    const count = cols * rows
    const spacingX = FIELD_W / (cols - 1)
    const spacingZ = FIELD_D / (rows - 1)
    const grid = new Float32Array(count * 2)
    const seed = new Float32Array(count * 2)
    const rnd = seeded(0x5eed)
    for (let r = 0, i = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1, i += 1) {
        grid[i * 2] = -FIELD_W / 2 + (c + 0.5) * spacingX
        grid[i * 2 + 1] = r * spacingZ
        seed[i * 2] = rnd()
        seed[i * 2 + 1] = rnd()
      }
    }

    const gridBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf)
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aGrid)
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0)

    const seedBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf)
    gl.bufferData(gl.ARRAY_BUFFER, seed, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aSeed)
    gl.vertexAttribPointer(aSeed, 2, gl.FLOAT, false, 0, 0)

    const palette = new Float32Array(MAX_COLORS * 3)
    colors.slice(0, MAX_COLORS).forEach((hex, i) => palette.set(toRgb(hex), i * 3))
    gl.uniform3fv(U('uColors[0]'), palette)
    gl.uniform1f(U('uColorCount'), Math.min(colors.length, MAX_COLORS))

    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)

    // ----- Size the canvas to its box -----
    let dpr = 1
    let areaScale = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const cssW = host.clientWidth
      const cssH = host.clientHeight
      areaScale = Math.min(2.5, Math.max(0.5, Math.sqrt((cssW * cssH) / CAM_REF_AREA)))
      canvas.width = Math.max(1, Math.round(cssW * dpr))
      canvas.height = Math.max(1, Math.round(cssH * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    // ----- The cursor lifts a bump in the field -----
    const pointer = { x: 0, y: 0, active: 0, target: 0 }
    const onMove = (event) => {
      const rect = host.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.target = 1
    }
    const onLeave = () => {
      pointer.target = 0
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    // ----- Draw every frame -----
    let frame
    let last = performance.now()
    let phase = 0
    let flow = 0
    let depth = 0

    const draw = (now) => {
      frame = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      // Ease towards the scroll position, so the camera never jerks
      const target = progressRef?.current ?? 0
      depth += (target - depth) * (1 - Math.exp(-dt * 4))
      pointer.active += (pointer.target - pointer.active) * (1 - Math.exp(-dt * 6))

      phase += dt * (waveSpeed / 100)
      flow = (flow + dt * waveSpeed * 1.6) % FIELD_D

      // The scroll flies the camera forward, lower, and tilts it down
      const pitch = ((12 + depth * 16) * Math.PI) / 180
      const camY = 0.5 * CAM_Y_FULL * areaScale * (1 - depth * 0.45)
      const travel = depth * FIELD_D * 0.55

      const focal = canvas.height / (2 * Math.tan(((FOV / 2) * Math.PI) / 180))

      // Where the pointer meets the ground, in field coordinates
      let hitX = 0
      let hitZ = -1e6
      if (pointer.active > 0.01) {
        const px = pointer.x * dpr - canvas.width / 2
        const py = -(pointer.y * dpr - canvas.height / 2)
        const dy = py / focal
        const wy = dy * Math.cos(pitch) - Math.sin(pitch)
        const wz = dy * Math.sin(pitch) + Math.cos(pitch)
        if (wy < -1e-4) {
          const t = -camY / wy
          hitX = (px / focal) * t
          hitZ = CAM_Z0 + wz * t
        }
      }

      gl.uniform2f(U('uRes'), canvas.width, canvas.height)
      gl.uniform1f(U('uFocal'), focal)
      gl.uniform1f(U('uTime'), phase)
      gl.uniform1f(U('uAmp'), waveHeight)
      gl.uniform1f(U('uScatter'), 108)
      gl.uniform1f(U('uFreq'), (Math.PI * 2) / waveLength)
      gl.uniform2f(U('uDir'), 0, -1)
      gl.uniform1f(U('uFlow'), (flow + travel) % FIELD_D)
      gl.uniform1f(U('uDepth'), FIELD_D)
      gl.uniform1f(U('uCamY'), camY)
      gl.uniform1f(U('uCamZ'), CAM_Z0)
      gl.uniform1f(U('uPitch'), pitch)
      gl.uniform1f(U('uDot'), dotSize)
      gl.uniform2f(U('uJit'), spacingX * 0.25, spacingZ * 0.7)
      gl.uniform3f(U('uCursor'), hitX, hitZ, pointer.active)
      gl.uniform1f(U('uCurR'), 0.25 * (FIELD_W / 2))
      gl.uniform1f(U('uCurS'), 45)
      gl.uniform1f(U('uHover'), 1)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, count)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [progressRef, colors, density, dotSize, waveHeight, waveLength, waveSpeed])

  return (
    <div className="wave-field" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default WaveField
