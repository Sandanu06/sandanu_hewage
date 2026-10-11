import * as THREE from "three"
import { CAR_COLORS, type Car, type Person, makeCar, makePerson, pose } from "./models"
import { BLOCK, type Box, CELL, HALF, N, cellOf, roadLine } from "./world"

export const LANE = 4.5
export const CAR_R = 2.1
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const angDiff = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b))

export const syncCar = (c: Car) => {
  c.group.position.set(c.pos.x, 0, c.pos.y)
  c.group.rotation.y = c.heading
}

// circle vs. every building box near `pos`; returns how hard it hit (m/s along the normal)
export function pushOutOfBoxes(pos: THREE.Vector2, vel: THREE.Vector2 | null, r: number, boxes: Box[][], bounce = 1.35) {
  let impact = 0
  const ci = cellOf(pos.x)
  const cj = cellOf(pos.y)
  for (let i = Math.max(0, ci - 1); i <= Math.min(N - 1, ci + 1); i++)
    for (let j = Math.max(0, cj - 1); j <= Math.min(N - 1, cj + 1); j++)
      for (const [bx, bz, hw, hd] of boxes[i * N + j]) {
        const px = clamp(pos.x, bx - hw, bx + hw)
        const pz = clamp(pos.y, bz - hd, bz + hd)
        let dx = pos.x - px
        let dz = pos.y - pz
        const dist = Math.hypot(dx, dz)
        if (dist >= r) continue
        if (dist < 1e-4) {
          dx = 1
          dz = 0
        } else {
          dx /= dist
          dz /= dist
        }
        pos.x += dx * (r - dist)
        pos.y += dz * (r - dist)
        if (vel) {
          const vn = vel.x * dx + vel.y * dz
          if (vn < 0) {
            vel.x -= dx * vn * bounce
            vel.y -= dz * vn * bounce
            impact = Math.max(impact, -vn)
          }
        }
      }
  return impact
}

// ---------- cars ----------
export function spawnCars(scene: THREE.Scene, parkedN: number, trafficN: number) {
  const cars: Car[] = []
  const color = () => CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
  const road = () => 1 + Math.floor(Math.random() * (N - 1)) // an inner road line index
  for (let k = 0; k < parkedN; k++) {
    const c = makeCar(color())
    const along = roadLine(Math.floor(Math.random() * N)) + CELL / 2 + (Math.random() - 0.5) * 36
    const edge = (Math.random() < 0.5 ? -1 : 1) * 8.4
    if (Math.random() < 0.5) {
      c.pos.set(roadLine(road()) + edge, along)
      c.heading = Math.random() < 0.5 ? 0 : Math.PI
    } else {
      c.pos.set(along, roadLine(road()) + edge)
      c.heading = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2
    }
    syncCar(c)
    scene.add(c.group)
    cars.push(c)
  }
  for (let k = 0; k < trafficN; k++) {
    const c = makeCar(color())
    const vertical = Math.random() < 0.5
    const sign = Math.random() < 0.5 ? 1 : -1
    const i = 2 + Math.floor(Math.random() * (N - 3))
    const along = (Math.random() - 0.5) * (HALF * 1.5)
    if (vertical) {
      c.pos.set(roadLine(i) + (sign > 0 ? LANE : -LANE), along)
      c.ai = { dx: 0, dz: sign, speed: 9 + Math.random() * 6, wait: 0 }
      c.heading = sign > 0 ? 0 : Math.PI
    } else {
      c.pos.set(along, roadLine(i) + (sign > 0 ? -LANE : LANE))
      c.ai = { dx: sign, dz: 0, speed: 9 + Math.random() * 6, wait: 0 }
      c.heading = sign > 0 ? Math.PI / 2 : -Math.PI / 2
    }
    syncCar(c)
    scene.add(c.group)
    cars.push(c)
  }
  return cars
}

export function updateTraffic(car: Car, dt: number, cars: Car[]) {
  const ai = car.ai!
  const alongZ = ai.dz !== 0
  let latErr: number
  if (alongZ) latErr = roadLine(Math.round((car.pos.x + HALF) / CELL)) + (ai.dz > 0 ? LANE : -LANE) - car.pos.x
  else latErr = roadLine(Math.round((car.pos.y + HALF) / CELL)) + (ai.dx > 0 ? -LANE : LANE) - car.pos.y

  let target = ai.speed
  for (const o of cars) {
    if (o === car) continue
    const dx = o.pos.x - car.pos.x
    const dz = o.pos.y - car.pos.y
    const fwd = dx * ai.dx + dz * ai.dz
    if (fwd > 0 && fwd < 16 && Math.abs(alongZ ? dx : dz) < 3.4) target = Math.min(target, Math.max(0, (fwd - 6.5) * 1.6))
  }
  const cur = car.vel.length()
  const v = cur + (target - cur) * (1 - Math.exp(-3 * dt))
  const lat = clamp(latErr * 2, -4, 4)
  const prev = alongZ ? car.pos.y : car.pos.x
  car.vel.set(ai.dx * v + (alongZ ? lat : 0), ai.dz * v + (alongZ ? 0 : lat))
  car.pos.addScaledVector(car.vel, dt)
  const now = alongZ ? car.pos.y : car.pos.x

  // passing a road centre line: sometimes turn; turn around at the edge of the city
  if (Math.floor((prev + HALF) / CELL) !== Math.floor((now + HALF) / CELL)) {
    const r = Math.random()
    if (r < 0.32) {
      const s = Math.random() < 0.5 ? 1 : -1
      ;[ai.dx, ai.dz] = alongZ ? [s, 0] : [0, s]
    }
  }
  const lim = HALF - CELL * 1.2
  if ((ai.dx > 0 && car.pos.x > lim) || (ai.dx < 0 && car.pos.x < -lim)) ai.dx = -ai.dx
  if ((ai.dz > 0 && car.pos.y > lim) || (ai.dz < 0 && car.pos.y < -lim)) ai.dz = -ai.dz

  if (car.vel.lengthSq() > 0.5) car.heading += angDiff(Math.atan2(car.vel.x, car.vel.y), car.heading) * (1 - Math.exp(-6 * dt))
  car.spin += (v * dt) / 0.43
}

// parked / abandoned cars just roll to a stop
export function updateLoose(car: Car, dt: number, boxes: Box[][]) {
  if (car.vel.lengthSq() < 0.01) return
  car.vel.multiplyScalar(Math.exp(-2.5 * dt))
  car.pos.addScaledVector(car.vel, dt)
  pushOutOfBoxes(car.pos, car.vel, CAR_R, boxes)
}

// returns the hardest hit involving `player` (for camera shake / sound)
export function collideCars(cars: Car[], player: Car | null) {
  let hit = 0
  for (let i = 0; i < cars.length; i++)
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i]
      const b = cars[j]
      const dx = a.pos.x - b.pos.x
      const dz = a.pos.y - b.pos.y
      if (Math.abs(dx) > CAR_R * 2 || Math.abs(dz) > CAR_R * 2) continue
      const d = Math.hypot(dx, dz)
      if (d >= CAR_R * 1.8) continue
      const nx = d > 1e-4 ? dx / d : 1
      const nz = d > 1e-4 ? dz / d : 0
      const push = (CAR_R * 1.8 - d) / 2
      a.pos.x += nx * push
      a.pos.y += nz * push
      b.pos.x -= nx * push
      b.pos.y -= nz * push
      const vn = (a.vel.x - b.vel.x) * nx + (a.vel.y - b.vel.y) * nz
      if (vn < 0) {
        const imp = -(1 + 0.3) * vn * 0.5
        a.vel.x += nx * imp
        a.vel.y += nz * imp
        b.vel.x -= nx * imp
        b.vel.y -= nz * imp
        if (a === player || b === player) hit = Math.max(hit, -vn)
      }
    }
  return hit
}

// ---------- pedestrians ----------
export type Ped = {
  person: Person
  cx: number
  cz: number
  s: number
  dir: 1 | -1
  speed: number
  phase: number
  talk: number
  pos: THREE.Vector2
  off: THREE.Vector2
  yaw: number
  lines: number
}

const SHIRTS = ["#ff4f9a", "#27d3ff", "#ffd23f", "#f5f0ff", "#9b5cff", "#2ee6a6", "#ff7a45", "#222233"]
const PANTS = ["#2a2f4a", "#3b3b48", "#6a5acd", "#1f1f2b", "#8a7a6a"]
const SKINS = ["#f2c9a0", "#d9a273", "#a8744a", "#7a4e2d", "#f7d9bd"]
const HAIRS = ["#1a1410", "#3a2414", "#c9a36a", "#7a2c1d", "#d8d8e0"]
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
const RING = BLOCK / 2 - 3

const perim = (s: number, h: number, out: THREE.Vector2) => {
  const L = 2 * h
  const t = ((s % (4 * L)) + 4 * L) % (4 * L)
  const side = Math.floor(t / L)
  const u = t - side * L
  if (side === 0) out.set(-h + u, -h)
  else if (side === 1) out.set(h, -h + u)
  else if (side === 2) out.set(h - u, h)
  else out.set(-h, h - u)
}

export function spawnPeds(scene: THREE.Scene, n: number) {
  const peds: Ped[] = []
  for (let k = 0; k < n; k++) {
    const person = makePerson(pick(SHIRTS), pick(PANTS), pick(SKINS), pick(HAIRS))
    const ped: Ped = {
      person,
      cx: roadLine(Math.floor(Math.random() * N)) + CELL / 2,
      cz: roadLine(Math.floor(Math.random() * N)) + CELL / 2,
      s: Math.random() * 8 * RING,
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: 1.2 + Math.random() * 0.9,
      phase: Math.random() * 6,
      talk: 0,
      pos: new THREE.Vector2(),
      off: new THREE.Vector2(),
      yaw: 0,
      lines: 0,
    }
    perim(ped.s, RING, ped.pos)
    ped.pos.x += ped.cx
    ped.pos.y += ped.cz
    scene.add(person.group)
    peds.push(ped)
  }
  return peds
}

const tmp = new THREE.Vector2()
export function updatePeds(peds: Ped[], dt: number, player: THREE.Vector2, cars: Car[], onYelp: (p: Ped) => void) {
  for (const p of peds) {
    if (p.talk > 0) {
      p.talk -= dt
      p.yaw += angDiff(Math.atan2(player.x - (p.pos.x + p.off.x), player.y - (p.pos.y + p.off.y)), p.yaw) * (1 - Math.exp(-8 * dt))
      pose(p.person, p.phase, 0)
    } else {
      p.s += p.dir * p.speed * dt
      const before = tmp.copy(p.pos)
      perim(p.s, RING, p.pos)
      p.pos.x += p.cx
      p.pos.y += p.cz
      const dx = p.pos.x - before.x
      const dz = p.pos.y - before.y
      if (dx * dx + dz * dz > 1e-8) p.yaw += angDiff(Math.atan2(dx, dz), p.yaw) * (1 - Math.exp(-10 * dt))
      p.phase += dt * p.speed * 6
      pose(p.person, p.phase, 1)
    }
    p.off.multiplyScalar(Math.exp(-3 * dt))
    for (const c of cars) {
      const dx = p.pos.x + p.off.x - c.pos.x
      const dz = p.pos.y + p.off.y - c.pos.y
      if (Math.abs(dx) > 3 || Math.abs(dz) > 3) continue
      const d = Math.hypot(dx, dz)
      if (d < 2.8 && c.vel.lengthSq() > 4) {
        if (p.off.lengthSq() < 0.5) onYelp(p)
        p.off.x += (dx / (d || 1)) * 4 * dt * 6
        p.off.y += (dz / (d || 1)) * 4 * dt * 6
      }
    }
    p.person.group.position.set(p.pos.x + p.off.x, 0, p.pos.y + p.off.y)
    p.person.group.rotation.y = p.yaw
  }
}
