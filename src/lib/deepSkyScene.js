// The deep sky behind the whole page: stars on many depth layers that drift past
// at different speeds as the guest scrolls, lean with the pointer, and flare where
// a button is pressed. Loaded lazily (see DeepSky.jsx) so it never delays the page.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

const NEAR = 60
const FAR = 620
const HALF_FOV_TAN = Math.tan((30 * Math.PI) / 180) // camera fov is 60°

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aSparkle;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uShift;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform vec2 uBurstPos;
  uniform float uBurstAge;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vSparkle;

  void main() {
    float depth = -position.z;
    // Wrap each star vertically inside its own depth slice, so the sky never runs out.
    float span = ${(2 * HALF_FOV_TAN * 1.3).toFixed(4)} * depth;
    vec3 p = position;
    p.y = mod(p.y + uShift + span * 0.5, span) - span * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.7 + 0.3 * sin(uTime * aSpeed + aPhase);

    // A press on a button sends a ripple of light through the stars around it.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 delta = (ndc - uBurstPos) * vec2(uAspect, 1.0);
    float ring = abs(length(delta) - uBurstAge * 1.6);
    float flare = exp(-ring * 9.0) * exp(-uBurstAge * 1.8) * step(0.0, uBurstAge);

    float size = aSize * (1.0 + flare * 2.2) * (300.0 / depth);
    gl_PointSize = clamp(size, 1.5, 48.0) * uPixelRatio;

    vColor = mix(aColor, vec3(1.0, 0.93, 0.55), flare);
    vAlpha = twinkle * (1.0 - smoothstep(${(FAR * 0.55).toFixed(1)}, ${FAR.toFixed(1)}, depth)) + flare;
    vSparkle = aSparkle;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uFade;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSparkle;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    // Round soft star, or the site's four-point sparkle for the bright ones.
    float disc = (1.0 - smoothstep(0.0, 0.5, r)) * 0.55 + exp(-r * 9.0) * 0.9;
    vec2 a = abs(c) * 2.0;
    float astroid = pow(a.x, 0.55) + pow(a.y, 0.55);
    float sparkle = (1.0 - smoothstep(0.55, 1.0, astroid)) + exp(-r * 14.0) * 0.8;
    float shape = mix(disc, sparkle, vSparkle);
    float alpha = shape * vAlpha * uFade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`

export function createDeepSky(canvas, { animate }) {
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(60, 1, 1, FAR + 50)

  const isSmall = window.innerWidth < 768
  const count = isSmall ? 1100 : 2200
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const speeds = new Float32Array(count)
  const sparkles = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const white = new Color('#fbfbff')
  const star = new Color('#ffe45e')
  const lavender = new Color('#d2c8f3')

  for (let i = 0; i < count; i++) {
    // More stars far away than near, like a real sky.
    const t = Math.pow(Math.random(), 0.85)
    const depth = NEAR + t * (FAR - NEAR)
    const halfHeight = HALF_FOV_TAN * depth
    positions[i * 3] = (Math.random() * 2 - 1) * halfHeight * 2.4
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * halfHeight * 1.3
    positions[i * 3 + 2] = -depth

    const bright = depth < 260 && Math.random() < 0.16
    sparkles[i] = bright ? 1 : 0
    sizes[i] = bright ? 8 + Math.random() * 7 : 2.4 + Math.random() * 3
    phases[i] = Math.random() * Math.PI * 2
    speeds[i] = 0.6 + Math.random() * 1.8

    const roll = Math.random()
    const color = bright || roll < 0.12 ? star : roll < 0.3 ? lavender : white
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new BufferAttribute(sizes, 1))
  geometry.setAttribute('aPhase', new BufferAttribute(phases, 1))
  geometry.setAttribute('aSpeed', new BufferAttribute(speeds, 1))
  geometry.setAttribute('aSparkle', new BufferAttribute(sparkles, 1))
  geometry.setAttribute('aColor', new BufferAttribute(colors, 3))

  const uniforms = {
    uTime: { value: 0 },
    uShift: { value: 0 },
    uPixelRatio: { value: 1 },
    uAspect: { value: 1 },
    uFade: { value: 1 },
    uBurstPos: { value: new Vector2(0, 0) },
    uBurstAge: { value: -1 },
  }
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  scene.add(new Points(geometry, material))

  const state = { shift: 0, pointerX: 0, pointerY: 0, camX: 0, camY: 0, burstAt: -1 }
  const startTime = performance.now()

  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    uniforms.uPixelRatio.value = renderer.getPixelRatio()
    uniforms.uAspect.value = camera.aspect
  }

  const targetShift = () => (window.scrollY / window.innerHeight) * 24

  const fadeForScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const progress = max > 0 ? window.scrollY / max : 0
    // The stars give way to the sunset at the bottom of the page.
    return 1 - smoothstep(0.86, 0.99, progress)
  }

  const render = (now) => {
    const time = (now - startTime) / 1000
    uniforms.uTime.value = animate ? time : 0
    if (animate) {
      state.shift += (targetShift() - state.shift) * 0.12
      state.camX += (state.pointerX * 5 - state.camX) * 0.05
      state.camY += (state.pointerY * 3.5 - state.camY) * 0.05
    } else {
      state.shift = targetShift()
    }
    uniforms.uShift.value = state.shift
    uniforms.uFade.value = fadeForScroll()
    uniforms.uBurstAge.value = state.burstAt < 0 ? -1 : time - state.burstAt
    camera.position.set(state.camX, state.camY, 0)
    renderer.render(scene, camera)
  }

  return {
    resize,
    render,
    setPointer(x, y) {
      state.pointerX = x
      state.pointerY = y
    },
    burst(clientX, clientY) {
      uniforms.uBurstPos.value.set((clientX / window.innerWidth) * 2 - 1, 1 - (clientY / window.innerHeight) * 2)
      state.burstAt = (performance.now() - startTime) / 1000
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}
