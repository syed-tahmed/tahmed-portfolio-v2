import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import './ContactJourney.css'

gsap.registerPlugin(ScrollTrigger)

const LEN = 320
const FOG_A = [0.8, 0.83, 0.84] /* cool morning haze */
const FOG_B = [0.92, 0.83, 0.68] /* golden hour haze */
const FOG_DENSITY = 0.0075
const CHAPTERS = [
  { label: 'Begin', title: 'Leave the portfolio behind', body: 'Every project here started with a conversation. Scroll to follow the light.' },
  { label: 'Venture', title: 'Into unfamiliar ground', body: 'New briefs, new problems, better questions. This is where the best work begins.' },
  { label: 'Discover', title: 'Something is waiting ahead', body: 'One person, careful craft and clear communication from the first message.' },
  { label: 'Contact', title: 'Let me know if you want to talk about a potential collaboration.', body: 'I am available for freelance work.' },
]
const CHAPTER_TARGET = [0.08, 0.4, 0.68, 0.96]

/* Colors are plain display values (no sRGB conversion) so the terrain shader,
   sky shader and lit objects all share one consistent tone. */
const rgb = (r, g, b) => new THREE.Color().setRGB(r, g, b)

/* ---------- terrain maths ---------- */
const pathX = (z) => Math.sin(z * 0.028) * 13 + Math.sin(z * 0.011 + 1) * 18
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s) }
const vn = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x, y) => { let s = 0, a = 0.5; for (let i = 0; i < 5; i++) { s += a * vn(x, y); x = x * 2.03 + 11; y = y * 2.03 + 7; a *= 0.5 } return s }
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const height = (x, z) => {
  const d = Math.abs(x - pathX(z))
  return -1 + smooth(3, 22, d) * (16 + fbm(x * 0.06, z * 0.06) * 22) + fbm(x * 0.25, z * 0.25) * 2.2 * smooth(2, 10, d)
}
const forestAt = (x, z) => fbm(x * 0.045 + 9, z * 0.045)

/* natural palette */
const PAL = {
  meadow: [0.37, 0.5, 0.2],
  dry: [0.56, 0.54, 0.3],
  forest: [0.2, 0.31, 0.13],
  rock: [0.5, 0.46, 0.41],
  dark: [0.34, 0.31, 0.29],
  snow: [0.94, 0.96, 0.99],
}
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

function buildTerrain(wSeg, lSeg) {
  const L = LEN + 300
  const g = new THREE.PlaneGeometry(240, L, wSeg, lSeg)
  g.rotateX(-Math.PI / 2)
  g.translate(0, 0, -255)
  const p = g.attributes.position, n = p.count
  const col = new Float32Array(n * 3), side = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = p.getX(i), z = p.getZ(i)
    p.setY(i, height(x, z))
    side[i] = x - pathX(z)
  }
  g.computeVertexNormals()
  const nrm = g.attributes.normal
  for (let i = 0; i < n; i++) {
    const x = p.getX(i), z = p.getZ(i), h = p.getY(i)
    const slope = 1 - nrm.getY(i)
    const n1 = fbm(x * 0.045, z * 0.045)
    const m = fbm(x * 0.16 + 5, z * 0.16)
    let c = mix3(PAL.meadow, PAL.dry, smooth(0.4, 0.7, n1))
    const forestTint = smooth(0.38, 0.58, forestAt(x, z)) * smooth(1.5, 6, h) * (1 - smooth(13, 19, h))
    c = mix3(c, PAL.forest, forestTint * 0.75)
    const rockT = Math.max(smooth(0.14, 0.36, slope), smooth(15, 24, h + (m - 0.5) * 6))
    c = mix3(c, mix3(PAL.rock, PAL.dark, smooth(0.35, 0.65, m)), rockT)
    const snow = smooth(28, 33, h + (m - 0.5) * 6) * (1 - smooth(0.4, 0.65, slope) * 0.75)
    c = mix3(c, PAL.snow, snow)
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]
  }
  g.setAttribute('aCol', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aS', new THREE.BufferAttribute(side, 1))
  return g
}

/* ---------- wind: sway + travelling gusts injected into lit materials ---------- */
function addSway(mat, uTime, amp, off, key) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
        float sph = instanceMatrix[3].x * .21 + instanceMatrix[3].z * .17;
        float gust = .45 + .9 * smoothstep(-.3, 1., sin(uTime * .85 + instanceMatrix[3].z * .07 + instanceMatrix[3].x * .025));
        #else
        float sph = 0.;
        float gust = 1.;
        #endif
        float sw = max(position.y + ${off.toFixed(2)}, 0.) * ${amp.toFixed(3)} * gust;
        transformed.x += sin(uTime * 1.3 + sph) * sw + sin(uTime * 2.7 + sph * 1.9) * sw * .35 + sw * gust * .3;
        transformed.z += cos(uTime * 1.1 + sph * 1.3) * sw * .6;`)
  }
  mat.customProgramCacheKey = () => key
  return mat
}

/* round soft points instead of squares */
function roundPoints(mat, key) {
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <clipping_planes_fragment>',
      '#include <clipping_planes_fragment>\nif (length(gl_PointCoord - vec2(.5)) > .5) discard;')
  }
  mat.customProgramCacheKey = () => key
  return mat
}

/* ---------- forest (instanced pines + broadleaf, swaying) ---------- */
const TIERS = [[1.5, 2.2, 3.1], [3.0, 1.75, 2.8], [4.4, 1.15, 2.5]]

function buildForest(candidates, uTime) {
  const pines = [], leafy = []
  for (let i = 0; i < candidates; i++) {
    const z = 30 - Math.random() * (LEN + 170)
    const x = pathX(z) + (Math.random() - 0.5) * 220
    const d = Math.abs(x - pathX(z))
    if (d < 5.5) continue
    const dens = Math.max(smooth(0.38, 0.58, forestAt(x, z)), 0.05)
    if (Math.random() > dens * 0.95) continue
    const h = height(x, z)
    if (h > 19 - fbm(x * 0.1, z * 0.1) * 3) continue
    if (Math.abs(height(x + 1.5, z) - h) / 1.5 > 0.8) continue
    const conifer = Math.random() < 0.45 + smooth(4, 16, h) * 0.5
    const t = { x, y: h - 0.35, z, s: 0.75 + Math.random() * 0.9, r: Math.random() * Math.PI * 2, k: Math.random(), k2: Math.random() }
    ;(conifer ? pines : leafy).push(t)
  }

  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.28, 2.2, 6)
  trunkGeo.translate(0, 1.1, 0)
  const coneGeo = new THREE.ConeGeometry(1, 1, 7)
  coneGeo.translate(0, 0.5, 0)
  const crownGeo = new THREE.IcosahedronGeometry(1, 1)
  const barkMat = addSway(new THREE.MeshLambertMaterial({ color: rgb(0.3, 0.23, 0.17) }), uTime, 0.012, 0, 'sway-bark')
  const pineMat = addSway(new THREE.MeshLambertMaterial({ color: rgb(1, 1, 1), flatShading: true }), uTime, 0.05, 0, 'sway-pine')
  const crownMat = addSway(new THREE.MeshLambertMaterial({ color: rgb(1, 1, 1), flatShading: true }), uTime, 0.035, 1, 'sway-crown')

  const total = pines.length + leafy.length
  const trunks = new THREE.InstancedMesh(trunkGeo, barkMat, Math.max(1, total))
  const tiers = TIERS.map(() => new THREE.InstancedMesh(coneGeo, pineMat, Math.max(1, pines.length)))
  const crowns = new THREE.InstancedMesh(crownGeo, crownMat, Math.max(1, leafy.length))
  trunks.count = total
  tiers.forEach((m) => { m.count = pines.length })
  crowns.count = leafy.length

  const dummy = new THREE.Object3D()
  const col = new THREE.Color()

  pines.forEach((t, i) => {
    dummy.position.set(t.x, t.y, t.z)
    dummy.rotation.set(0, t.r, 0)
    dummy.scale.set(t.s * 0.9, t.s * 1.2, t.s * 0.9)
    dummy.updateMatrix()
    trunks.setMatrixAt(i, dummy.matrix)
    TIERS.forEach(([ty, r, h], k) => {
      dummy.position.set(t.x, t.y + ty * t.s, t.z)
      dummy.scale.set(r * t.s, h * t.s, r * t.s)
      dummy.updateMatrix()
      tiers[k].setMatrixAt(i, dummy.matrix)
      col.setHSL(0.31 + t.k * 0.05, 0.32 + t.k2 * 0.15, 0.15 + t.k * 0.08 + k * 0.02)
      tiers[k].setColorAt(i, col)
    })
  })

  leafy.forEach((t, j) => {
    const i = pines.length + j
    dummy.position.set(t.x, t.y, t.z)
    dummy.rotation.set(0, t.r, 0)
    dummy.scale.set(t.s * 1.1, t.s * 1.5, t.s * 1.1)
    dummy.updateMatrix()
    trunks.setMatrixAt(i, dummy.matrix)
    dummy.position.set(t.x, t.y + 3.4 * t.s, t.z)
    dummy.rotation.set(0, t.r, 0)
    dummy.scale.set(2.2 * t.s, 1.9 * t.s, 2.2 * t.s)
    dummy.updateMatrix()
    crowns.setMatrixAt(j, dummy.matrix)
    if (t.k < 0.15) col.setHSL(0.08 + t.k2 * 0.05, 0.6, 0.32)
    else col.setHSL(0.22 + t.k2 * 0.07, 0.38 + t.k * 0.2, 0.24 + t.k2 * 0.1)
    crowns.setColorAt(j, col)
  })

  const all = [trunks, ...tiers, crowns]
  const group = new THREE.Group()
  all.forEach((m) => {
    m.frustumCulled = false
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    group.add(m)
  })
  const dispose = () => {
    all.forEach((m) => m.dispose && m.dispose())
    ;[trunkGeo, coneGeo, crownGeo, barkMat, pineMat, crownMat].forEach((o) => o.dispose())
  }
  return { group, dispose }
}

/* ---------- meadow: wind-swept grass tufts + wildflowers ---------- */
function makeTuftGeometry() {
  const pos = [], col = [], nor = []
  for (let b = 0; b < 7; b++) {
    const a = Math.random() * Math.PI, w = 0.05 + Math.random() * 0.04
    const hgt = 0.55 + Math.random() * 0.55
    const ox = (Math.random() - 0.5) * 0.3, oz = (Math.random() - 0.5) * 0.3
    const lean = (Math.random() - 0.5) * 0.35, la = Math.random() * Math.PI * 2
    const cx = Math.cos(a), sz = Math.sin(a)
    pos.push(ox - w * cx, 0, oz - w * sz, ox + w * cx, 0, oz + w * sz, ox + Math.cos(la) * lean, hgt, oz + Math.sin(la) * lean)
    col.push(0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 1, 1, 1)
    nor.push(0, 1, 0, 0, 1, 0, 0, 1, 0)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  return g
}

const FLOWERS = [[0.98, 0.97, 0.92], [0.98, 0.82, 0.25], [0.62, 0.45, 0.78], [0.95, 0.55, 0.65], [0.95, 0.5, 0.2]]

function buildMeadow(grassCount, flowerCount, uTime) {
  const spots = []
  for (let i = 0; i < grassCount; i++) {
    const z = 25 - Math.random() * (LEN + 30)
    const off = 2.6 + Math.pow(Math.random(), 1.6) * 16
    const x = pathX(z) + (Math.random() < 0.5 ? -1 : 1) * off
    const h = height(x, z)
    if (h > 9) continue
    spots.push({ x, y: h - 0.05, z, s: 0.7 + Math.random() * 1.0, r: Math.random() * Math.PI * 2, k: Math.random(), k2: Math.random() })
  }
  const tuftGeo = makeTuftGeometry()
  const grassMat = addSway(new THREE.MeshLambertMaterial({ color: rgb(1, 1, 1), vertexColors: true, side: THREE.DoubleSide }), uTime, 0.3, 0, 'sway-grass')
  const grass = new THREE.InstancedMesh(tuftGeo, grassMat, Math.max(1, spots.length))
  grass.count = spots.length
  const dummy = new THREE.Object3D()
  const col = new THREE.Color()
  spots.forEach((t, i) => {
    dummy.position.set(t.x, t.y, t.z)
    dummy.rotation.set(0, t.r, 0)
    dummy.scale.set(t.s * 1.2, t.s, t.s * 1.2)
    dummy.updateMatrix()
    grass.setMatrixAt(i, dummy.matrix)
    if (t.k < 0.22) col.setHSL(0.13 + t.k2 * 0.03, 0.45, 0.42)
    else col.setHSL(0.19 + t.k2 * 0.06, 0.4 + t.k * 0.15, 0.3 + t.k2 * 0.1)
    grass.setColorAt(i, col)
  })
  grass.frustumCulled = false
  grass.instanceMatrix.needsUpdate = true
  if (grass.instanceColor) grass.instanceColor.needsUpdate = true

  const fp = [], fc = []
  for (let i = 0; i < flowerCount; i++) {
    const z = 25 - Math.random() * (LEN + 30)
    const off = 2.6 + Math.pow(Math.random(), 1.4) * 14
    const x = pathX(z) + (Math.random() < 0.5 ? -1 : 1) * off
    const h = height(x, z)
    if (h > 8) continue
    fp.push(x, h + 0.35 + Math.random() * 0.45, z)
    const c = FLOWERS[Math.floor(Math.random() * FLOWERS.length)]
    fc.push(c[0], c[1], c[2])
  }
  const fGeo = new THREE.BufferGeometry()
  fGeo.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3))
  fGeo.setAttribute('color', new THREE.Float32BufferAttribute(fc, 3))
  const fMat = roundPoints(new THREE.PointsMaterial({ size: 0.2, vertexColors: true }), 'round-flower')
  const flowers = new THREE.Points(fGeo, fMat)
  flowers.frustumCulled = false

  const group = new THREE.Group()
  group.add(grass, flowers)
  const dispose = () => { grass.dispose && grass.dispose(); ;[tuftGeo, grassMat, fGeo, fMat].forEach((o) => o.dispose()) }
  return { group, dispose }
}

/* ---------- birds ---------- */
const BIRD_VS = `
uniform float uTime;
void main(){
  vec3 p=position;
  float ph=modelMatrix[3].x*.6+modelMatrix[3].z*.35;
  p.y+=abs(position.x)*sin(uTime*8.+ph)*.9;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`
const BIRD_FS = `void main(){ gl_FragColor=vec4(.16,.18,.2,.85); }`

function buildBirds(uTime) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, -0.35, 0, 0, 0.3, -1.3, 0, 0.1,
    0, 0, -0.35, 0, 0, 0.3, 1.3, 0, 0.1,
  ], 3))
  const mat = new THREE.ShaderMaterial({
    vertexShader: BIRD_VS, fragmentShader: BIRD_FS, uniforms: { uTime },
    side: THREE.DoubleSide, transparent: true, depthWrite: false,
  })
  const group = new THREE.Group()
  const list = []
  for (let i = 0; i < 7; i++) {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.y = -Math.PI / 2
    mesh.scale.setScalar(1.3 + (i % 3) * 0.25)
    mesh.frustumCulled = false
    group.add(mesh)
    list.push({ mesh, d: 45 + i * 9, y: 8 + (i % 4) * 4.5, sp: 4.5 + (i % 3) * 1.3, off: i * 27 })
  }
  return { group, list, dispose: () => { geo.dispose(); mat.dispose() } }
}

/* ---------- butterflies: real wing flaps, wandering over the meadow ---------- */
const FLY_VS = `
uniform float uTime; uniform float uPh;
varying float vX;
void main(){
  vec3 p=position;
  float ax=abs(position.x);
  float a=sin(uTime*15.+uPh)*1.05+.3;
  p.x=sign(position.x)*ax*cos(a);
  p.y=ax*sin(a);
  vX=ax;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`
const FLY_FS = `
uniform vec3 uCol;
varying float vX;
void main(){
  vec3 c=mix(uCol*.5,uCol,smoothstep(0.,.3,vX));
  c=mix(c,vec3(.07,.06,.05),smoothstep(.42,.56,vX)*.65);
  gl_FragColor=vec4(c,1.);
}`
const BUTTERFLY_COLS = [[1, 0.56, 0.16], [0.98, 0.97, 0.9], [1, 0.86, 0.32], [0.5, 0.64, 0.98], [1, 0.56, 0.16], [0.98, 0.97, 0.9]]

function buildButterflies(uTime, count) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0.18, 0, 0, -0.18, -0.55, 0, 0.32,
    0, 0, -0.18, -0.45, 0, -0.34, -0.55, 0, 0.32,
    0, 0, 0.18, 0.55, 0, 0.32, 0, 0, -0.18,
    0, 0, -0.18, 0.55, 0, 0.32, 0.45, 0, -0.34,
  ], 3))
  const mats = []
  const list = []
  const group = new THREE.Group()
  for (let i = 0; i < count; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: FLY_VS, fragmentShader: FLY_FS, side: THREE.DoubleSide,
      uniforms: { uTime, uPh: { value: Math.random() * 6.28 }, uCol: { value: rgb(...BUTTERFLY_COLS[i % BUTTERFLY_COLS.length]) } },
    })
    mats.push(mat)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.scale.setScalar(0.55 + Math.random() * 0.25)
    mesh.frustumCulled = false
    group.add(mesh)
    list.push({ mesh, d: 7 + i * 3.2 + Math.random() * 2, side: i % 2 ? 1 : -1, s: 0.5 + Math.random() * 0.5, o: Math.random() * 10, w: 2 + Math.random() * 3 })
  }
  return { group, list, dispose: () => { geo.dispose(); mats.forEach((m) => m.dispose()) } }
}

/* ---------- shaders ---------- */
const NOISE_GLSL = `
float hash21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),u.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),u.x),u.y);
}
float fbm2(vec2 p){ float s=0.,a=.5; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+vec2(11.,7.); a*=.5; } return s; }
`
const TERRAIN_VS = `
attribute vec3 aCol; attribute float aS;
varying vec3 vCol; varying float vS; varying float vDepth; varying vec3 vN; varying vec3 vW;
void main(){
  vCol=aCol; vS=aS; vN=normal; vW=position;
  vec4 mv=modelViewMatrix*vec4(position,1.);
  vDepth=-mv.z; gl_Position=projectionMatrix*mv;
}`
const TERRAIN_FS = `
uniform vec3 uFog; uniform float uDens; uniform vec3 uSun; uniform vec3 uSunCol; uniform float uTime;
varying vec3 vCol; varying float vS; varying float vDepth; varying vec3 vN; varying vec3 vW;
${NOISE_GLSL}
void main(){
  vec3 n=normalize(vN);
  float sun=max(dot(n,uSun),0.);
  float hemi=.5+.5*n.y;
  vec3 light=uSunCol*sun*.62+mix(vec3(.30,.28,.24),vec3(.44,.50,.60),hemi)*.9;

  float n1=vnoise(vW.xz*1.4), n2=vnoise(vW.xz*7.);
  vec3 base=vCol*(.88+.24*n1)*(.94+.12*n2);

  float d=abs(vS);
  float edge=(vnoise(vW.xz*.9)-.5)*.9;
  float road=1.-smoothstep(1.4,2.2,d+edge);
  float verge=smoothstep(1.8,2.4,d+edge)*(1.-smoothstep(2.6,4.5,d+edge));
  base*=1.-verge*.18;

  vec3 dirt=mix(vec3(.50,.40,.29),vec3(.60,.50,.37),n1);
  float rut=1.-smoothstep(0.,.32,abs(d-.85));
  dirt*=1.-.28*rut;
  dirt=mix(dirt,vec3(.36,.42,.22),(1.-smoothstep(.1,.5,d))*.35*n2);
  dirt*=.9+.2*n2;

  vec3 col=mix(base,dirt,road)*light;

  /* soft cloud shadows drifting across the hills */
  float cs=smoothstep(.46,.7,fbm2(vW.xz*.011+vec2(uTime*.010,uTime*.005)));
  col*=1.-cs*.22;

  /* drifting valley mist */
  float mist=(1.-smoothstep(-1.,7.,vW.y))*(.55+.45*vnoise(vW.xz*.045+vec2(uTime*.03,0.)))*smoothstep(12.,70.,vDepth)*.45;
  col=mix(col,uFog,mist);

  float f=1.-exp(-pow(vDepth*uDens,2.));
  gl_FragColor=vec4(mix(col,uFog,f),1.);
}`
const SKY_VS = `
varying vec3 vDir;
void main(){ vDir=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`
const SKY_FS = `
uniform float uTime; uniform vec3 uHor; uniform vec3 uSunDir; uniform float uWarm;
varying vec3 vDir;
${NOISE_GLSL}
void main(){
  vec3 d=normalize(vDir);
  float h=max(d.y,0.);
  vec3 mid=mix(vec3(.62,.77,.90),vec3(.74,.78,.86),uWarm*.5);
  vec3 zen=mix(vec3(.30,.50,.80),vec3(.34,.50,.76),uWarm);
  vec3 col=mix(uHor,mid,smoothstep(0.,.16,h));
  col=mix(col,zen,smoothstep(.14,.75,h));
  float s=max(dot(d,uSunDir),0.);
  col+=vec3(1.,.78,.45)*pow(s,5.)*(.18+.38*uWarm)*(1.-smoothstep(0.,.5,h)*.4);
  col+=vec3(1.,.9,.7)*pow(s,60.)*(.35+.55*uWarm);
  vec2 uv=d.xz/(h+.28)*1.6; uv.x+=uTime*.015;
  float c=fbm2(uv*1.1);
  float cl=smoothstep(.52,.82,c)*smoothstep(.03,.22,h);
  vec3 cloud=mix(vec3(.97,.95,.92),vec3(1.,.88,.7),uWarm*s);
  col=mix(col,cloud*(.85+.15*s),cl*.6);

  /* two layers of distant mountain ranges, softened by haze */
  float az=atan(d.x,-d.z);
  float r1=.05+.085*fbm2(vec2(az*1.7+3.,1.7))+.018*vnoise(vec2(az*14.,2.));
  float r2=.025+.05*fbm2(vec2(az*2.9+17.,5.3))+.012*vnoise(vec2(az*22.,9.));
  vec3 farCol=mix(uHor,vec3(.50,.58,.70),.38-.18*uWarm)*(1.+.14*pow(s,3.));
  vec3 nearCol=mix(uHor,vec3(.36,.44,.46),.5-.2*uWarm);
  farCol=mix(uHor,farCol,.45+.55*smoothstep(0.,.07,d.y));
  float aa=.003;
  col=mix(col,farCol,1.-smoothstep(r1-aa,r1+aa,d.y));
  col=mix(col,nearCol,1.-smoothstep(r2-aa,r2+aa,d.y));
  gl_FragColor=vec4(col,1.);
}`

/* pollen by day that turns into glowing fireflies at golden hour */
const MOTE_VS = `
uniform float uTime; uniform float uPx;
attribute float aSeed;
varying float vA; varying float vSeed;
void main(){
  vec3 p=position;
  float t=uTime*(.18+aSeed*.3)+aSeed*40.;
  p.x+=sin(t)*1.3+sin(t*.43+1.7)*.7;
  p.y+=sin(t*.71+aSeed*6.)*.7;
  p.z+=cos(t*.57)*1.1;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mv;
  float dep=-mv.z;
  gl_PointSize=min(uPx*(.7+aSeed*1.1)*(52./max(dep,1.)),48.*uPx);
  vA=(1.-smoothstep(22.,85.,dep))*smoothstep(.6,2.5,dep);
  vSeed=aSeed;
}`
const MOTE_FS = `
uniform float uTime; uniform float uWarm;
varying float vA; varying float vSeed;
void main(){
  float r=length(gl_PointCoord-vec2(.5))*2.;
  if(r>1.) discard;
  float core=pow(1.-r,2.2);
  float tw=.5+.5*sin(uTime*(1.2+vSeed*2.6)+vSeed*31.);
  vec3 col=mix(vec3(1.,.98,.9),vec3(1.,.8,.38),uWarm);
  float a=core*vA*mix(.35,.25+.85*tw,uWarm);
  gl_FragColor=vec4(col,a);
}`

export default function ContactJourney() {
  const root = useRef(null)
  const stage = useRef(null)
  const canvas = useRef(null)
  const fill = useRef(null)
  const knob = useRef(null)
  const dist = useRef(null)
  const goRef = useRef(() => {})

  useEffect(() => {
    const el = root.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 700px)').matches

    const setChapter = (idx) => {
      el.querySelectorAll('[data-ch]').forEach((n) => n.classList.toggle('is-active', +n.dataset.ch === idx))
      el.querySelectorAll('[data-nav]').forEach((n) => {
        const i = +n.dataset.nav
        n.classList.toggle('is-active', i === idx)
        n.classList.toggle('is-done', i < idx)
        if (i === idx) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current')
      })
      const live = el.querySelector('[data-live]')
      if (live) live.textContent = CHAPTERS[idx].title
    }
    setChapter(0)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: !small, powerPreference: 'high-performance' })
    } catch (e) {
      el.classList.add('cj--static')
      setChapter(3)
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setClearColor(rgb(...FOG_A))

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(rgb(...FOG_A), FOG_DENSITY)
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 420)
    const U = { uTime: { value: 0 } }
    const SUN = new THREE.Vector3(-0.45, 0.75, 0.25).normalize()
    const fogNow = new THREE.Color()

    /* lights */
    const hemi = new THREE.HemisphereLight(rgb(0.74, 0.83, 0.94), rgb(0.42, 0.36, 0.27), 1.4)
    const key = new THREE.DirectionalLight(rgb(1, 0.94, 0.82), 2.4)
    key.position.copy(SUN).multiplyScalar(100)
    scene.add(hemi, key)

    /* sky */
    const skyGeo = new THREE.SphereGeometry(380, 32, 16)
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false,
      uniforms: {
        uTime: U.uTime,
        uHor: { value: rgb(...FOG_A) },
        uSunDir: { value: new THREE.Vector3(-0.25, 0.25, -0.93).normalize() },
        uWarm: { value: 0 },
      },
    })
    const sky = new THREE.Mesh(skyGeo, skyMat)
    sky.renderOrder = -1
    sky.frustumCulled = false
    scene.add(sky)

    /* terrain + road */
    const tGeo = buildTerrain(small ? 120 : 190, small ? 230 : 360)
    const tMat = new THREE.ShaderMaterial({
      vertexShader: TERRAIN_VS, fragmentShader: TERRAIN_FS,
      uniforms: {
        uFog: { value: rgb(...FOG_A) }, uDens: { value: FOG_DENSITY }, uSun: { value: SUN },
        uSunCol: { value: new THREE.Vector3(1, 0.94, 0.82) }, uTime: U.uTime,
      },
    })
    scene.add(new THREE.Mesh(tGeo, tMat))

    /* life: trees, grass, flowers, birds, butterflies */
    const forest = buildForest(small ? 2800 : 7000, U.uTime)
    const meadow = buildMeadow(small ? 3500 : 9000, small ? 350 : 700, U.uTime)
    const birds = buildBirds(U.uTime)
    const flies = buildButterflies(U.uTime, small ? 4 : 7)
    birds.group.visible = !reduce
    flies.group.visible = !reduce
    scene.add(forest.group, meadow.group, birds.group, flies.group)

    /* floating pollen -> fireflies */
    const COUNT = small ? 260 : 700
    const pp = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const z = -Math.random() * LEN
      pp[i * 3] = pathX(z) + (Math.random() - 0.5) * 20
      pp[i * 3 + 1] = -0.4 + Math.random() * 9
      pp[i * 3 + 2] = z
      seeds[i] = Math.random()
    }
    const dGeo = new THREE.BufferGeometry()
    dGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    dGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    const dMat = new THREE.ShaderMaterial({
      vertexShader: MOTE_VS, fragmentShader: MOTE_FS,
      uniforms: { uTime: U.uTime, uWarm: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const motes = new THREE.Points(dGeo, dMat)
    motes.frustumCulled = false
    scene.add(motes)

    const prog = { cur: 0, target: 0 }
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0, visible = true, last = -1, st = null

    const draw = (time) => {
      const p = prog.cur
      const w = smooth(0.12, 1, p)

      /* morning haze -> golden hour as you travel */
      fogNow.setRGB(
        FOG_A[0] + (FOG_B[0] - FOG_A[0]) * w,
        FOG_A[1] + (FOG_B[1] - FOG_A[1]) * w,
        FOG_A[2] + (FOG_B[2] - FOG_A[2]) * w,
      )
      scene.fog.color.copy(fogNow)
      tMat.uniforms.uFog.value.copy(fogNow)
      skyMat.uniforms.uHor.value.copy(fogNow)
      skyMat.uniforms.uWarm.value = w
      dMat.uniforms.uWarm.value = w
      tMat.uniforms.uSunCol.value.set(1, 0.94 - 0.1 * w, 0.82 - 0.2 * w)
      key.color.setRGB(1, 0.94 - 0.1 * w, 0.82 - 0.2 * w)

      /* camera */
      const z = -p * (LEN - 40)
      const lift = (1 - smooth(0, 0.22, p)) * 6.5
      camera.position.set(pathX(z) + mouse.x * 1.4, 3.1 + lift + Math.sin(time * 0.4) * 0.08 - mouse.y * 0.7, z)
      const lz = z - 18
      camera.lookAt(pathX(lz) + mouse.x * 2.2, 1.6, lz)
      const spd = reduce ? 0 : Math.min(Math.abs(prog.target - prog.cur) * 160, 5)
      camera.fov += (58 + spd - camera.fov) * 0.1
      camera.updateProjectionMatrix()
      sky.position.copy(camera.position)

      if (!reduce) {
        /* birds cross the sky */
        birds.list.forEach((b, i) => {
          const rx = ((time * b.sp + b.off) % 170) - 85
          b.mesh.position.set(camera.position.x + rx, camera.position.y + b.y + Math.sin(time * 0.6 + i) * 1.6, camera.position.z - b.d)
          b.mesh.rotation.z = Math.cos(time * 0.6 + i) * 0.12
        })
        /* butterflies wander beside the path just ahead of you */
        flies.list.forEach((b) => {
          const t = time * b.s + b.o
          const bz = camera.position.z - b.d + Math.sin(t * 0.7) * 2.2
          const bx = pathX(bz) + b.side * (b.w + Math.sin(t * 1.1) * 1.4)
          const by = height(bx, bz) + 0.9 + Math.sin(t * 2.3) * 0.35 + Math.abs(Math.sin(t * 5.1)) * 0.15
          b.mesh.position.set(bx, by, bz)
          b.mesh.rotation.set(Math.sin(t * 3) * 0.15, Math.sin(t * 0.9) * 1.2, Math.sin(t * 1.7) * 0.2)
        })
      }

      U.uTime.value = reduce ? 0 : time
      renderer.render(scene, camera)
    }

    const resize = () => {
      const w = stage.current.clientWidth, h = stage.current.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      draw(0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(stage.current)

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(el)

    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5
      mouse.ty = e.clientY / window.innerHeight - 0.5
    }

    const clock = new THREE.Clock()
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      prog.cur += (prog.target - prog.cur) * 0.05
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      draw(clock.getElapsedTime())
      if (fill.current) fill.current.style.transform = `scaleX(${prog.cur.toFixed(4)})`
      if (knob.current) knob.current.style.left = `${(prog.cur * 100).toFixed(2)}%`
      if (dist.current) dist.current.textContent = String(Math.round(prog.cur * LEN)).padStart(3, '0')
      el.style.setProperty('--warm', smooth(0.12, 1, prog.cur).toFixed(3))
      el.style.setProperty('--mx', mouse.x.toFixed(3))
      el.style.setProperty('--my', mouse.y.toFixed(3))
    }

    /* chapter nav: click to travel */
    goRef.current = (i) => {
      if (!st) return
      const y = st.start + (st.end - st.start) * CHAPTER_TARGET[i]
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    const ctx = gsap.context(() => {
      if (reduce) {
        prog.cur = prog.target = 0.62
        el.classList.add('cj--static')
        setChapter(3)
        draw(0)
        return
      }
      gsap.fromTo(stage.current,
        { clipPath: 'inset(14% 10% 14% 10% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } })

      st = ScrollTrigger.create({
        trigger: el, start: 'top top', end: small ? '+=320%' : '+=420%',
        pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          prog.target = self.progress
          const p = self.progress
          const idx = p >= 0.8 ? 3 : p >= 0.55 ? 2 : p >= 0.28 ? 1 : 0
          if (idx !== last) { last = idx; setChapter(idx) }
        },
      })
      window.addEventListener('pointermove', onMove, { passive: true })
      frame()
    }, el)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect(); io.disconnect(); ctx.revert()
      forest.dispose(); meadow.dispose(); birds.dispose(); flies.dispose()
      ;[tGeo, skyGeo, dGeo, tMat, skyMat, dMat].forEach((o) => o.dispose())
      renderer.dispose()
    }
  }, [])

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--bx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--by', `${e.clientY - r.top}px`)
  }

  return (
    <section className="cj" ref={root} aria-label="Contact">
      <div className="cj-stage" ref={stage}>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="cj-sun" aria-hidden="true" />
        <div className="cj-vignette" aria-hidden="true" />
        <div className="cj-grain" aria-hidden="true" />
        <div className="cj-frame" aria-hidden="true" />

        <nav className="cj-nav" aria-label="Journey chapters">
          {CHAPTERS.map((c, i) => (
            <button type="button" key={c.label} data-nav={i} onClick={() => goRef.current(i)}>
              <span className="cj-dot" aria-hidden="true" />
              <span className="cj-nl">{c.label}</span>
            </button>
          ))}
        </nav>

        <div className="cj-text">
          {CHAPTERS.map((c, i) => (
            <div key={c.label} data-ch={i} className={'cj-ch' + (i === 3 ? ' cj-ch--final' : '')}>
              <div className="cj-card">
                <div className="cj-eyebrow">
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <i aria-hidden="true" />
                  <span>{c.label}</span>
                </div>
                <h2>
                  {c.title.split(' ').map((w, j) => (
                    <span className="cj-w" key={j} style={{ '--i': j }}><span>{w}</span></span>
                  ))}
                </h2>
                <p>{c.body}</p>
                {i === 3 && (
                  <Link to="/contact" className="cj-btn" onPointerMove={spot}>
                    <span className="cj-btn-t">Contact me</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="cj-bar" aria-hidden="true">
          <span className="cj-bar-l"><span className="cj-mouse"><i /></span>Scroll to travel</span>
          <div className="cj-track">
            <div className="cj-fill" ref={fill} />
            <div className="cj-knob" ref={knob} />
          </div>
          <span className="cj-bar-r"><b ref={dist}>000</b> m</span>
        </div>

        <span className="cj-sr" aria-live="polite" data-live />
      </div>
    </section>
  )
}
