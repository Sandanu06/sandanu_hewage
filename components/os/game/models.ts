import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"

// ---------- shared helpers ----------
const mats = new Map<string, THREE.Material>()
export const phong = (color: string, shininess = 70) => {
  const k = `p${color}${shininess}`
  if (!mats.has(k)) mats.set(k, new THREE.MeshPhongMaterial({ color, shininess, specular: 0x555555 }))
  return mats.get(k) as THREE.MeshPhongMaterial
}
export const basic = (color: string) => {
  const k = `b${color}`
  if (!mats.has(k)) mats.set(k, new THREE.MeshBasicMaterial({ color }))
  return mats.get(k) as THREE.MeshBasicMaterial
}

const ni = (g: THREE.BufferGeometry) => (g.index ? g.toNonIndexed() : g)
const box = (w: number, h: number, d: number, x = 0, y = 0, z = 0) => ni(new THREE.BoxGeometry(w, h, d).translate(x, y, z))

// extrude a side profile (x = along the car, y = up) across the car's width
const side = (pts: [number, number][], width: number, bevel = 0) => {
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: width, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 4 })
  g.rotateY(-Math.PI / 2)
  g.translate(width / 2, 0, 0)
  return g.index ? g.toNonIndexed() : g
}

// ---------- cars ----------
export type Car = {
  group: THREE.Group
  paint: THREE.MeshPhongMaterial
  wheels: THREE.Group[]
  pos: THREE.Vector2
  vel: THREE.Vector2
  heading: number
  spin: number
  ai?: { dx: number; dz: number; speed: number; wait: number }
}

let carParts: { paint: THREE.BufferGeometry; glass: THREE.BufferGeometry; lights: THREE.BufferGeometry; tail: THREE.BufferGeometry; tire: THREE.BufferGeometry; rim: THREE.BufferGeometry } | null = null

const parts = () => {
  if (carParts) return carParts
  const paint = mergeGeometries([
    side(
      [
        [-2.2, 0.35],
        [-2.2, 0.92],
        [-1.5, 1.02],
        [1.1, 1.0],
        [2.2, 0.76],
        [2.2, 0.35],
      ],
      1.9,
      0.07,
    ),
    box(1.72, 0.08, 1.3, 0, 1.54, -0.2), // roof
    box(1.9, 0.07, 0.55, 0, 1.15, -2.0), // spoiler wing
    box(0.08, 0.22, 0.2, -0.7, 1.04, -1.95),
    box(0.08, 0.22, 0.2, 0.7, 1.04, -1.95),
    box(1.95, 0.07, 0.45, 0, 0.37, 2.1), // splitter
  ])!
  const glass = side(
    [
      [-1.35, 1.0],
      [-0.85, 1.5],
      [0.45, 1.5],
      [1.05, 1.0],
    ],
    1.7,
  )
  const lights = mergeGeometries([box(0.5, 0.14, 0.1, -0.7, 0.72, 2.21), box(0.5, 0.14, 0.1, 0.7, 0.72, 2.21)])!
  const tail = box(1.6, 0.1, 0.1, 0, 0.86, -2.22)
  const tire = new THREE.CylinderGeometry(0.43, 0.43, 0.34, 16).rotateZ(Math.PI / 2)
  const rim = new THREE.CylinderGeometry(0.27, 0.27, 0.36, 10).rotateZ(Math.PI / 2)
  carParts = { paint, glass, lights, tail, tire, rim }
  return carParts
}

const shadowMat = new THREE.MeshBasicMaterial({ color: "#000", transparent: true, opacity: 0.4, depthWrite: false })
const shadowGeo = new THREE.PlaneGeometry(2.6, 5.2).rotateX(-Math.PI / 2)
const glowGeo = new THREE.PlaneGeometry(2.7, 5.3).rotateX(-Math.PI / 2)

export const CAR_COLORS = ["#ff4f9a", "#27d3ff", "#ffd23f", "#f5f0ff", "#9b5cff", "#2ee6a6", "#ff7a45", "#e8334a"]

export function makeCar(color: string): Car {
  const p = parts()
  const group = new THREE.Group()
  const paint = new THREE.MeshPhongMaterial({ color, shininess: 110, specular: 0x888888 })
  group.add(new THREE.Mesh(p.paint, paint))
  group.add(new THREE.Mesh(p.glass, phong("#0b1220", 140)))
  group.add(new THREE.Mesh(p.lights, basic("#fff4c0")))
  group.add(new THREE.Mesh(p.tail, basic("#ff2442")))
  const wheels = [
    [-1, 1.45],
    [1, 1.45],
    [-1, -1.45],
    [1, -1.45],
  ].map(([sx, z]) => {
    const w = new THREE.Group()
    w.add(new THREE.Mesh(p.tire, phong("#121214", 20)), new THREE.Mesh(p.rim, phong("#cfd3da", 120)))
    w.position.set(sx * 0.98, 0.43, z)
    group.add(w)
    return w
  })
  const sh = new THREE.Mesh(shadowGeo, shadowMat)
  sh.position.y = 0.03
  const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: "#7df9ff", transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }))
  glow.position.y = 0.06
  group.add(sh, glow)
  return { group, paint, wheels, pos: new THREE.Vector2(), vel: new THREE.Vector2(), heading: 0, spin: 0 }
}

// ---------- people ----------
export type Person = { group: THREE.Group; armL: THREE.Group; armR: THREE.Group; legL: THREE.Group; legR: THREE.Group }

const bodyGeo = {
  torso: new THREE.BoxGeometry(0.52, 0.62, 0.28),
  head: new THREE.SphereGeometry(0.17, 12, 10),
  hair: new THREE.SphereGeometry(0.185, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55),
  arm: new THREE.BoxGeometry(0.14, 0.58, 0.14).translate(0, -0.27, 0),
  leg: new THREE.BoxGeometry(0.18, 0.82, 0.18).translate(0, -0.4, 0),
  shoe: new THREE.BoxGeometry(0.19, 0.1, 0.28).translate(0, -0.84, 0.04),
  shadow: new THREE.CircleGeometry(0.45, 12).rotateX(-Math.PI / 2),
}

export function makePerson(shirt: string, pants: string, skin: string, hair: string): Person {
  const group = new THREE.Group()
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = group) => {
    const o = new THREE.Mesh(g, m)
    o.position.set(x, y, z)
    parent.add(o)
    return o
  }
  mesh(bodyGeo.torso, phong(shirt, 30), 0, 1.2, 0)
  mesh(bodyGeo.head, phong(skin, 20), 0, 1.7, 0)
  mesh(bodyGeo.hair, phong(hair, 10), 0, 1.72, -0.01)
  const pivot = (x: number, y: number) => {
    const g = new THREE.Group()
    g.position.set(x, y, 0)
    group.add(g)
    return g
  }
  const armL = pivot(-0.34, 1.48)
  const armR = pivot(0.34, 1.48)
  const legL = pivot(-0.13, 0.86)
  const legR = pivot(0.13, 0.86)
  mesh(bodyGeo.arm, phong(shirt, 30), 0, 0, 0, armL)
  mesh(bodyGeo.arm, phong(shirt, 30), 0, 0, 0, armR)
  mesh(bodyGeo.leg, phong(pants, 20), 0, 0, 0, legL)
  mesh(bodyGeo.leg, phong(pants, 20), 0, 0, 0, legR)
  mesh(bodyGeo.shoe, phong("#f4f4f4", 40), 0, 0, 0, legL)
  mesh(bodyGeo.shoe, phong("#f4f4f4", 40), 0, 0, 0, legR)
  const sh = mesh(bodyGeo.shadow, shadowMat, 0, 0.03, 0)
  sh.renderOrder = 1
  return { group, armL, armR, legL, legR }
}

// walk-cycle pose; `t` is a phase, `amt` 0..1 how much they are moving
export function pose(p: Person, t: number, amt: number) {
  const s = Math.sin(t) * 0.9 * amt
  p.legL.rotation.x = s
  p.legR.rotation.x = -s
  p.armL.rotation.x = -s * 0.8
  p.armR.rotation.x = s * 0.8
}

// ---------- palm trees ----------
export function palmGeometries() {
  const trunk = new THREE.CylinderGeometry(0.22, 0.38, 8, 6).translate(0, 4, 0)
  const fronds: THREE.BufferGeometry[] = []
  for (let k = 0; k < 8; k++) {
    const f = new THREE.BoxGeometry(0.7, 0.06, 3.6).translate(0, 0, 1.8)
    f.rotateX(0.5)
    f.rotateY((k / 8) * Math.PI * 2)
    f.translate(0, 8, 0)
    fronds.push(ni(f))
  }
  fronds.push(ni(new THREE.SphereGeometry(0.5, 6, 5).translate(0, 8, 0)))
  return { trunk, crown: mergeGeometries(fronds)! }
}
