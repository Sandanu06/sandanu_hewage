import * as THREE from "three"
import { palmGeometries } from "./models"

export const CELL = 80 // one city block + the road around it
export const ROAD = 22
export const BLOCK = CELL - ROAD
export const N = 17 // blocks per side
export const HALF = (N * CELL) / 2
export const SAND = 90 // beach west of the city; the ocean starts after it
export const roadLine = (i: number) => -HALF + i * CELL
export const cellOf = (v: number) => Math.min(N - 1, Math.max(0, Math.floor((v + HALF) / CELL)))
export const rng = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

export type Box = [number, number, number, number] // x, z, half width, half depth

const PALETTE = ["#ff6ec7", "#7df9ff", "#ffd166", "#b388ff", "#fff1e6", "#5ef0c0", "#ff9770", "#8ecbff"]
const NEON = ["#ff2d95", "#26e6ff", "#ffe14d", "#a35bff", "#3dffa8"]

export const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = false) => {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  draw(c.getContext("2d")!)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  return t
}

export type Coin = { mesh: THREE.Mesh; x: number; z: number; got: boolean }

export function buildWorld(scene: THREE.Scene, low: boolean) {
  const rand = rng(11)
  const uNight = { value: 0 }

  // ---- sky, fog, lights ----
  const sky = document.createElement("canvas")
  sky.width = 4
  sky.height = 256
  const skyTex = new THREE.CanvasTexture(sky)
  skyTex.colorSpace = THREE.SRGBColorSpace
  const mix = (a: string, b: string, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), t).getStyle()
  let painted = -1
  const paintSky = (n: number) => {
    const c = sky.getContext("2d")!
    const g = c.createLinearGradient(0, 0, 0, 256)
    g.addColorStop(0, mix("#1a0a4d", "#02020c", n))
    g.addColorStop(0.5, mix("#7a30c9", "#150a3a", n))
    g.addColorStop(0.8, mix("#ff4fa3", "#4a1a78", n))
    g.addColorStop(1, mix("#ffb36b", "#8a2f9a", n))
    c.fillStyle = g
    c.fillRect(0, 0, 4, 256)
    skyTex.needsUpdate = true
    painted = n
  }
  paintSky(0)
  scene.background = skyTex
  scene.fog = new THREE.Fog("#ff7ab6", 140, 760)
  const hemi = new THREE.HemisphereLight("#ffb8e0", "#2a1055", 1.15)
  const sunLight = new THREE.DirectionalLight("#ffb070", 1.5)
  sunLight.position.set(-400, 130, -150)
  scene.add(hemi, sunLight)

  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(170, 48),
    new THREE.MeshBasicMaterial({
      map: canvasTex(256, 256, (c) => {
        const g = c.createLinearGradient(0, 0, 0, 256)
        g.addColorStop(0, "#ffe66d")
        g.addColorStop(1, "#ff3d8b")
        c.fillStyle = g
        c.fillRect(0, 0, 256, 256)
        c.globalCompositeOperation = "destination-out"
        for (let i = 0; i < 6; i++) c.fillRect(0, 120 + i * 24, 256, 3 + i * 2.4)
      }),
      transparent: true,
      fog: false,
      depthWrite: false,
    }),
  )
  scene.add(sunDisc)

  // ---- ground: roads, sidewalks, beach, ocean ----
  const base = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), new THREE.MeshLambertMaterial({ color: "#1a0d3d" }))
  base.rotation.x = -Math.PI / 2
  base.position.y = -0.3
  scene.add(base)
  const roadTex = canvasTex(
    512,
    512,
    (c) => {
      const s = 512 / CELL
      c.fillStyle = "#2b2436"
      c.fillRect(0, 0, 512, 512)
      c.fillStyle = "#9a8cb5"
      c.fillRect((ROAD / 2) * s, (ROAD / 2) * s, BLOCK * s, BLOCK * s)
      c.fillStyle = "#7d6f95"
      c.fillRect((ROAD / 2 + 1.5) * s, (ROAD / 2 + 1.5) * s, (BLOCK - 3) * s, (BLOCK - 3) * s)
      c.fillStyle = "#f4e9ff"
      for (let d = 2; d < 512; d += 40) {
        c.fillRect(0, d, 6, 20)
        c.fillRect(506, d, 6, 20)
        c.fillRect(d, 0, 20, 6)
        c.fillRect(d, 506, 20, 6)
      }
      c.fillStyle = "rgba(255,255,255,.75)" // crosswalks
      for (let k = 0; k < 7; k++) {
        c.fillRect(70 + k * 10, 60, 5, 28)
        c.fillRect(70 + k * 10, 424, 5, 28)
        c.fillRect(60, 70 + k * 10, 28, 5)
        c.fillRect(424, 70 + k * 10, 28, 5)
      }
    },
    true,
  )
  roadTex.repeat.set(N, N)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(N * CELL, N * CELL), new THREE.MeshLambertMaterial({ map: roadTex }))
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  const sand = new THREE.Mesh(new THREE.PlaneGeometry(SAND, N * CELL), new THREE.MeshLambertMaterial({ color: "#f2d7a6" }))
  sand.rotation.x = -Math.PI / 2
  sand.position.set(-HALF - SAND / 2, 0.01, 0)
  scene.add(sand)
  const waveTex = canvasTex(
    256,
    256,
    (c) => {
      c.fillStyle = "#1c9fd8"
      c.fillRect(0, 0, 256, 256)
      c.strokeStyle = "rgba(255,255,255,.28)"
      c.lineWidth = 3
      for (let y = 8; y < 256; y += 32) {
        c.beginPath()
        for (let x = 0; x <= 256; x += 8) c.lineTo(x, y + Math.sin(x / 20 + y) * 4)
        c.stroke()
      }
    },
    true,
  )
  waveTex.repeat.set(30, 30)
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshPhongMaterial({ map: waveTex, shininess: 90, specular: 0xffb0d0 }))
  ocean.rotation.x = -Math.PI / 2
  ocean.position.set(-HALF - SAND - 2000, 0.02, 0)
  scene.add(ocean)

  // ---- buildings ----
  const boxes: Box[][] = Array.from({ length: N * N }, () => [])
  const bList: { x: number; z: number; w: number; d: number; h: number; c: string }[] = []
  const signs: { x: number; y: number; z: number; w: number; ry: number; c: string }[] = []
  const palms: [number, number, number][] = []
  const lamps: [number, number][] = []
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const cx = -HALF + CELL / 2 + i * CELL
      const cz = -HALF + CELL / 2 + j * CELL
      const downtown = 1 - Math.min(1, Math.hypot(cx, cz) / (HALF * 0.9))
      const mode = rand()
      const slots =
        mode < 0.08 ? [] : mode < 0.4 ? [[0, 0, 42, 42]] : mode < 0.7 ? [[-12, 0, 22, 42], [13, 0, 20, 42]] : [[-12, -12, 22, 20], [12, -12, 20, 20], [-12, 12, 22, 20], [12, 12, 20, 20]]
      for (const [ox, oz, w, d] of slots) {
        const tall = rand() < 0.06 + downtown * 0.2
        const h = 9 + rand() * 20 * (1 - downtown * 0.3) + downtown * rand() * 60 + (tall ? 30 : 0)
        bList.push({ x: cx + ox, z: cz + oz, w, d, h, c: PALETTE[Math.floor(rand() * PALETTE.length)] })
        boxes[i * N + j].push([cx + ox, cz + oz, w / 2, d / 2])
        if (rand() < 0.35) {
          const front = rand() < 0.5 ? 1 : -1
          signs.push({ x: cx + ox, y: 6 + rand() * Math.min(h - 8, 24), z: cz + oz + front * (d / 2 + 0.15), w: 5 + rand() * 5, ry: front > 0 ? 0 : Math.PI, c: NEON[Math.floor(rand() * NEON.length)] })
        }
      }
      for (let k = 0; k < (low ? 4 : 8); k++) {
        const t = (k / (low ? 4 : 8)) * 4
        const e = BLOCK / 2 - 1.5
        const s = t % 1
        const side = Math.floor(t)
        const [px, pz] = side === 0 ? [-e + s * 2 * e, -e] : side === 1 ? [e, -e + s * 2 * e] : side === 2 ? [e - s * 2 * e, e] : [-e, e - s * 2 * e]
        palms.push([cx + px, cz + pz, 0.8 + rand() * 0.5])
      }
    }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if ((i + j) % 2 === 0) lamps.push([roadLine(i) + 13, roadLine(j) + 13])

  const bMat = new THREE.MeshLambertMaterial()
  bMat.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = uNight
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vW;\nvarying vec3 vN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvec4 wp = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\nwp = instanceMatrix * wp;\n#endif\nvW = (modelMatrix * wp).xyz;\nvN = mat3(modelMatrix) * normal;")
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float uNight;\nvarying vec3 vW;\nvarying vec3 vN;\nfloat hh(vec2 p){return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);}",
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        if (abs(vN.y) < 0.5 && vW.y > 2.5) {
          float u = abs(vN.x) > 0.5 ? vW.z : vW.x;
          vec2 g = vec2(u / 3.2, vW.y / 3.6);
          vec2 f = fract(g);
          float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.22, f.y) * step(f.y, 0.78);
          float lit = step(0.62 - uNight * 0.3, hh(floor(g) + floor(vW.xz * 0.05)));
          diffuseColor.rgb *= mix(1.0, 0.3, win * (1.0 - lit));
          totalEmissiveRadiance += win * lit * vec3(1.0, 0.82, 0.45) * (0.55 + uNight * 0.7);
        }`,
      )
  }
  const bMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), bMat, bList.length)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  bList.forEach((b, n) => {
    m4.compose(new THREE.Vector3(b.x, b.h / 2, b.z), q, new THREE.Vector3(b.w, b.h, b.d))
    bMesh.setMatrixAt(n, m4)
    bMesh.setColorAt(n, new THREE.Color(b.c).multiplyScalar(0.85))
  })
  scene.add(bMesh)

  const signMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.3), new THREE.MeshBasicMaterial(), signs.length)
  signs.forEach((s, n) => {
    m4.compose(new THREE.Vector3(s.x, s.y, s.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, s.ry, 0)), new THREE.Vector3(s.w, 1.6, 1))
    signMesh.setMatrixAt(n, m4)
    signMesh.setColorAt(n, new THREE.Color(s.c))
  })
  scene.add(signMesh)

  const pg = palmGeometries()
  const trunk = new THREE.InstancedMesh(pg.trunk, new THREE.MeshLambertMaterial({ color: "#8a5a34" }), palms.length)
  const crown = new THREE.InstancedMesh(pg.crown, new THREE.MeshLambertMaterial({ color: "#26d98a", side: THREE.DoubleSide }), palms.length)
  palms.forEach(([x, z, s], n) => {
    m4.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand() * 6.28, 0)), new THREE.Vector3(s, s, s))
    trunk.setMatrixAt(n, m4)
    crown.setMatrixAt(n, m4)
  })
  scene.add(trunk, crown)

  const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.16, 9, 5).translate(0, 4.5, 0), new THREE.MeshLambertMaterial({ color: "#3b3350" }), lamps.length)
  const lampHead = new THREE.InstancedMesh(new THREE.SphereGeometry(0.55, 8, 6).translate(0, 9.2, 0), new THREE.MeshBasicMaterial({ color: "#ffd9a0" }), lamps.length)
  lamps.forEach(([x, z], n) => {
    m4.makeTranslation(x, 0, z)
    pole.setMatrixAt(n, m4)
    lampHead.setMatrixAt(n, m4)
  })
  scene.add(pole, lampHead)

  // ---- collectible cash ----
  const coinGeo = new THREE.CylinderGeometry(1, 1, 0.22, 18).rotateX(Math.PI / 2)
  const coinMat = new THREE.MeshPhongMaterial({ color: "#ffd23f", emissive: "#c98a00", shininess: 120 })
  const coins: Coin[] = []
  for (let n = 0; n < 30; n++) {
    const i = 1 + Math.floor(rand() * (N - 2))
    const j = 1 + Math.floor(rand() * (N - 2))
    const x = roadLine(i) + (rand() < 0.5 ? 0 : (rand() - 0.5) * 8)
    const z = roadLine(j) + (rand() - 0.5) * (rand() < 0.5 ? 60 : 0)
    const mesh = new THREE.Mesh(coinGeo, coinMat)
    mesh.position.set(x, 1.6, z)
    mesh.scale.setScalar(0.9)
    scene.add(mesh)
    coins.push({ mesh, x, z, got: false })
  }

  const nightNow = { v: 0 }
  const fogDay = new THREE.Color("#ff7ab6")
  const fogNight = new THREE.Color("#2a0f52")
  return {
    boxes,
    coins,
    uNight,
    update(dt: number, now: number, cam: THREE.Camera, nightTarget: number) {
      nightNow.v += (nightTarget - nightNow.v) * (1 - Math.exp(-1.5 * dt))
      const n = nightNow.v
      uNight.value = n
      if (Math.abs(n - painted) > 0.03) paintSky(n)
      hemi.intensity = 1.15 - 0.8 * n
      sunLight.intensity = 1.5 - 1.35 * n
      ;(scene.fog as THREE.Fog).color.copy(fogDay).lerp(fogNight, n)
      sunDisc.position.set(cam.position.x - 1150, 150 - n * 260, cam.position.z - 150)
      sunDisc.lookAt(cam.position)
      waveTex.offset.set(now / 40000, now / 25000)
      coins.forEach((c, k) => {
        if (c.got) return
        c.mesh.rotation.y = now / 400 + k
        c.mesh.position.y = 1.6 + Math.sin(now / 350 + k) * 0.25
      })
    },
  }
}

export type World = ReturnType<typeof buildWorld>
