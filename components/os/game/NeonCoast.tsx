"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { createAudio } from "./audio"
import { CAR_R, collideCars, pushOutOfBoxes, spawnCars, spawnPeds, syncCar, updateLoose, updatePeds, updateTraffic, type Ped } from "./entities"
import { type Car, makeCar, makePerson, pose } from "./models"
import { CELL, HALF, N, SAND, buildWorld } from "./world"

type Hud = { kmh: number; cash: number; coins: number; total: number; mode: "walk" | "drive"; hint: string; night: boolean; radio: boolean; msg: string }

const GAME_KEYS = new Set(["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "shift", "f", "e", "r", "t", "enter"])
const TALK = [
  "Nice ride!",
  "Beach is just west of here.",
  "Sandanu built this whole city. Check out his projects!",
  "I heard Teczos ships software for every kind of business.",
  "Coins all over town. Grab 'em.",
  "Best sunset in the world, right?",
  "Need AI for your business? Talk to Sandanu.",
  "Careful on the corners!",
]
const angDiff = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b))
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export function NeonCoast({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const mini = useRef<HTMLCanvasElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const down = useRef(new Set<string>())
  const pressed = useRef(new Set<string>())
  const pausedRef = useRef(paused)
  const activeRef = useRef(false)
  const [active, setActive] = useState(false)
  const [touch, setTouch] = useState(false)
  const [hud, setHud] = useState<Hud>({ kmh: 0, cash: 0, coins: 0, total: 0, mode: "drive", hint: "", night: false, radio: false, msg: "" })
  const [say, setSay] = useState("")
  pausedRef.current = paused

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const coarse = matchMedia("(pointer: coarse)").matches
    setTouch(coarse)
    const el = host.current!
    el.focus({ preventScroll: true })
    const renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.25 : 1.5))
    el.prepend(renderer.domElement)
    renderer.domElement.className = "absolute inset-0 h-full w-full"

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(62, 1, 0.5, 3000)
    const world = buildWorld(scene, coarse)
    const audio = createAudio()

    const hero = makeCar("#ff4f9a")
    hero.pos.set(CELL / 2, CELL / 2)
    syncCar(hero)
    scene.add(hero.group)
    const cars: Car[] = [hero, ...spawnCars(scene, coarse ? 14 : 26, coarse ? 8 : 16)]
    const peds: Ped[] = spawnPeds(scene, coarse ? 16 : 34)
    const man = makePerson("#19e0ff", "#1d2038", "#c98d5a", "#14100d")
    man.group.visible = false
    scene.add(man.group)

    // ---- game state ----
    let mode: "walk" | "drive" = "drive"
    let veh: Car | null = hero
    const player = { pos: new THREE.Vector2(), vel: new THREE.Vector2(), y: 0, vy: 0, yaw: 0, phase: 0 }
    let camYaw = 0
    let camPitch = 0.38
    let yawOff = 0
    let orbit = 0
    let shake = 0
    let cash = 0
    let got = 0
    let night = 0
    let radio = false
    let sayLeft = 0
    let sayPed: Ped | null = null
    let msgLeft = 0
    let msg = ""
    const camPos = new THREE.Vector3(CELL / 2, 6, CELL / 2 - 12)
    const tmp = new THREE.Vector3()
    const total = world.coins.length

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    const speak = (p: Ped, text: string, secs = 3) => {
      sayPed = p
      sayLeft = secs
      setSay(text)
    }
    const nearest = <T extends { pos: THREE.Vector2 }>(list: T[], r: number, from: THREE.Vector2) => {
      let best: T | null = null
      let bd = r
      for (const o of list) {
        const d = Math.hypot(o.pos.x - from.x, o.pos.y - from.y)
        if (d < bd) {
          bd = d
          best = o
        }
      }
      return best
    }

    const enter = (car: Car) => {
      veh = car
      car.ai = undefined
      mode = "drive"
      man.group.visible = false
      audio.door()
    }
    const exit = () => {
      if (!veh) return
      const h = veh.heading
      player.pos.set(veh.pos.x + Math.cos(h) * 3, veh.pos.y - Math.sin(h) * 3)
      player.vel.set(0, 0)
      player.yaw = h
      camYaw = h
      yawOff = 0
      player.y = 0
      veh = null
      mode = "walk"
      man.group.visible = true
      audio.door()
    }

    // ---- minimap ----
    const mctx = mini.current?.getContext("2d")
    const drawMini = (heading: number, from: THREE.Vector2, facing: number) => {
      if (!mctx) return
      const S = 0.3
      const a = S * Math.cos(heading)
      const b = -S * Math.sin(heading)
      const c = -S * Math.sin(heading)
      const d = -S * Math.cos(heading)
      mctx.setTransform(1, 0, 0, 1, 0, 0)
      mctx.clearRect(0, 0, 120, 120)
      mctx.fillStyle = "rgba(14,6,40,.74)"
      mctx.fillRect(0, 0, 120, 120)
      mctx.setTransform(a, b, c, d, 60 - (a * from.x + c * from.y), 60 - (b * from.x + d * from.y))
      mctx.fillStyle = "rgba(255,110,199,.75)"
      const ci = Math.floor((from.x + HALF) / CELL)
      const cj = Math.floor((from.y + HALF) / CELL)
      for (let i = Math.max(0, ci - 3); i <= Math.min(N - 1, ci + 3); i++)
        for (let j = Math.max(0, cj - 3); j <= Math.min(N - 1, cj + 3); j++) for (const [x, z, hw, hd] of world.boxes[i * N + j]) mctx.fillRect(x - hw, z - hd, hw * 2, hd * 2)
      mctx.fillStyle = "#ffd23f"
      for (const k of world.coins) if (!k.got) mctx.fillRect(k.x - 4, k.z - 4, 8, 8)
      mctx.fillStyle = "rgba(255,255,255,.8)"
      for (const k of cars) if (k !== veh && k.ai) mctx.fillRect(k.pos.x - 3, k.pos.y - 3, 6, 6)
      mctx.setTransform(1, 0, 0, 1, 0, 0)
      const fx = a * Math.sin(facing) + c * Math.cos(facing)
      const fy = b * Math.sin(facing) + d * Math.cos(facing)
      const l = Math.hypot(fx, fy) || 1
      const dx = fx / l
      const dy = fy / l
      mctx.fillStyle = "#7df9ff"
      mctx.beginPath()
      mctx.moveTo(60 + dx * 9, 60 + dy * 9)
      mctx.lineTo(60 - dx * 5 - dy * 5, 60 - dy * 5 + dx * 5)
      mctx.lineTo(60 - dx * 5 + dy * 5, 60 - dy * 5 - dx * 5)
      mctx.fill()
    }

    // ---- input from the page ----
    const onWheelLess = (e: Event) => e.preventDefault()
    el.addEventListener("contextmenu", onWheelLess)
    let drag: { x: number; y: number; id: number } | null = null
    const pd = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return
      drag = { x: e.clientX, y: e.clientY, id: e.pointerId }
      audio.start()
    }
    const pm = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag.x = e.clientX
      drag.y = e.clientY
      if (mode === "walk") camYaw -= dx * 0.006
      else yawOff = clamp(yawOff - dx * 0.006, -Math.PI, Math.PI)
      camPitch = clamp(camPitch + dy * 0.004, 0.08, 1.15)
    }
    const pu = () => (drag = null)
    el.addEventListener("pointerdown", pd)
    el.addEventListener("pointermove", pm)
    addEventListener("pointerup", pu)

    // ---- main loop ----
    let raf = 0
    let last = performance.now()
    let frame = 0
    let hudAt = 0
    let prevHud = ""
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (pausedRef.current) return
      const live = activeRef.current
      const k = down.current
      const up = k.has("w") || (mode === "drive" && k.has("arrowup"))
      const dn = k.has("s") || (mode === "drive" && k.has("arrowdown"))
      const lf = k.has("a") || (mode === "drive" && k.has("arrowleft"))
      const rt = k.has("d") || (mode === "drive" && k.has("arrowright"))

      // one-shot actions
      if (live)
        for (const a of pressed.current) {
          if (a === "f" || a === "enter") {
            if (mode === "drive") {
              if (veh) exit()
            } else {
              const c = nearest(cars, 5.5, player.pos)
              if (c) enter(c)
            }
          } else if (a === "e" && mode === "walk") {
            const p = nearest(peds.map((q) => ({ pos: q.pos, q })), 3.8, player.pos)
            if (p) {
              p.q.talk = 3.2
              speak(p.q, TALK[Math.floor(Math.random() * TALK.length)], 3.2)
            }
          } else if (a === "r") {
            radio = !radio
            audio.radio(radio)
          } else if (a === "t") night = night ? 0 : 1
          else if (a === " " && mode === "walk" && player.y === 0) player.vy = 6.5
        }
      pressed.current.clear()

      // ---- other cars ----
      for (const c of cars) {
        if (c === veh) continue
        if (c.ai) updateTraffic(c, dt, cars)
        else updateLoose(c, dt, world.boxes)
      }

      let focus = player.pos
      let facing = player.yaw
      let mapHeading = camYaw
      let speed = 0
      let hint = ""

      if (mode === "drive" && veh) {
        const h = veh.heading
        const fx = Math.sin(h)
        const fz = Math.cos(h)
        let vf = veh.vel.x * fx + veh.vel.y * fz
        let vl = veh.vel.x * fz - veh.vel.y * fx
        const brake = live && k.has(" ")
        if (live) {
          if (up) vf += (vf < 0 ? 50 : 26) * dt
          if (dn) vf -= (vf > 0.5 ? 48 : 14) * dt
        }
        if (!(live && (up || dn))) vf -= Math.sign(vf) * Math.min(Math.abs(vf), (2 + Math.abs(vf) * 0.2) * dt)
        vf = clamp(vf, -14, 46)
        vl *= Math.exp(-(brake ? 1.4 : 7) * dt)
        const steer = live ? (lf ? 1 : 0) - (rt ? 1 : 0) : 0
        veh.heading += steer * clamp(vf / 9, -1, 1) * (brake ? 2.7 : 1.9) * dt
        const nfx = Math.sin(veh.heading)
        const nfz = Math.cos(veh.heading)
        veh.vel.set(nfx * vf + nfz * vl, nfz * vf - nfx * vl)
        veh.pos.addScaledVector(veh.vel, dt)
        const hit = Math.max(pushOutOfBoxes(veh.pos, veh.vel, CAR_R, world.boxes), collideCars(cars, veh))
        if (hit > 3) {
          shake = Math.max(shake, Math.min(1, hit / 20))
          if (hit > 6) audio.thud()
        }
        veh.group.rotation.z = clamp(-vl * 0.012, -0.08, 0.08)
        veh.spin += (vf * dt) / 0.43
        veh.wheels.forEach((w, i) => {
          w.rotation.order = "YXZ"
          w.rotation.x = veh!.spin
          if (i < 2) w.rotation.y = steer * 0.45
        })
        speed = veh.vel.length()
        focus = veh.pos
        facing = veh.heading
        mapHeading = veh.heading
        hint = "F · Get out"
        audio.engine(speed, live)
      } else {
        // ---- on foot ----
        const run = live && k.has("shift")
        const lookL = k.has("arrowleft")
        const lookR = k.has("arrowright")
        if (live) camYaw += ((lookL ? 1 : 0) - (lookR ? 1 : 0)) * 2 * dt
        const fwd = live ? (up ? 1 : 0) - (dn ? 1 : 0) : 0
        const str = live ? (rt ? 1 : 0) - (lf ? 1 : 0) : 0
        const cfx = Math.sin(camYaw)
        const cfz = Math.cos(camYaw)
        let dx = cfx * fwd - Math.cos(camYaw) * str
        let dz = cfz * fwd + Math.sin(camYaw) * str
        const len = Math.hypot(dx, dz)
        if (len > 0) {
          dx /= len
          dz /= len
        }
        const sp = run ? 8 : 4
        player.vel.x += (dx * sp - player.vel.x) * (1 - Math.exp(-12 * dt))
        player.vel.y += (dz * sp - player.vel.y) * (1 - Math.exp(-12 * dt))
        player.pos.addScaledVector(player.vel, dt)
        pushOutOfBoxes(player.pos, player.vel, 0.55, world.boxes, 0)
        for (const c of cars) {
          const ddx = player.pos.x - c.pos.x
          const ddz = player.pos.y - c.pos.y
          const d = Math.hypot(ddx, ddz)
          if (d < CAR_R + 0.4 && d > 1e-4) {
            player.pos.x += (ddx / d) * (CAR_R + 0.4 - d)
            player.pos.y += (ddz / d) * (CAR_R + 0.4 - d)
          }
        }
        const v = player.vel.length()
        if (v > 0.4) player.yaw += angDiff(Math.atan2(player.vel.x, player.vel.y), player.yaw) * (1 - Math.exp(-12 * dt))
        player.phase += dt * v * 2.3
        pose(man, player.phase, clamp(v / 4, 0, 1.2))
        player.vy -= 18 * dt
        player.y = Math.max(0, player.y + player.vy * dt)
        if (player.y === 0) player.vy = 0
        man.group.position.set(player.pos.x, player.y, player.pos.y)
        man.group.rotation.y = player.yaw
        speed = v
        mapHeading = camYaw
        audio.engine(0, false)
        const c = nearest(cars, 5.5, player.pos)
        const p = nearest(peds.map((q) => ({ pos: q.pos, q })), 3.8, player.pos)
        hint = c ? "F · Get in car" : p ? "E · Talk" : ""
      }

      // world bounds (city on the east, beach on the west, ocean beyond)
      const lim = HALF - 8
      const west = -(HALF + SAND - 6)
      const pos = mode === "drive" && veh ? veh.pos : player.pos
      pos.x = clamp(pos.x, west, lim)
      pos.y = clamp(pos.y, -lim, lim)

      collideCars(cars, veh)
      for (const c of cars) syncCar(c)
      updatePeds(peds, dt, pos, cars, (p) => {
        if (sayLeft <= 0) speak(p, ["Hey! Watch it!", "Whoa!", "Careful!"][Math.floor(Math.random() * 3)], 1.6)
      })

      // coins
      for (const c of world.coins) {
        if (c.got || Math.hypot(c.x - pos.x, c.z - pos.y) > 3.4) continue
        c.got = true
        c.mesh.visible = false
        cash += 100
        got++
        audio.coin()
        if (got === total) {
          msg = `City cleared! $${cash}`
          msgLeft = 6
        }
      }

      // ---- camera ----
      if (mode === "drive" && veh) {
        yawOff *= drag ? 1 : Math.exp(-2.5 * dt)
        const ang = live ? veh.heading + yawOff : (orbit += dt * 0.25)
        const back = 11 + speed * 0.07
        tmp.set(veh.pos.x - Math.sin(ang) * back, 5 + speed * 0.025 + (camPitch - 0.38) * 8, veh.pos.y - Math.cos(ang) * back)
        camPos.lerp(tmp, 1 - Math.exp(-(live ? 7 : 3) * dt))
        camera.position.set(camPos.x + (Math.random() - 0.5) * shake, camPos.y + (Math.random() - 0.5) * shake, camPos.z)
        camera.lookAt(veh.pos.x + Math.sin(veh.heading) * 6, 1.6, veh.pos.y + Math.cos(veh.heading) * 6)
        const fov = 62 + Math.min(speed, 46) * 0.4
        if (Math.abs(camera.fov - fov) > 0.1) {
          camera.fov = fov
          camera.updateProjectionMatrix()
        }
      } else {
        const d = 6.5
        tmp.set(player.pos.x - Math.sin(camYaw) * Math.cos(camPitch) * d, Math.max(0.6, player.y + 1.6 + Math.sin(camPitch) * d), player.pos.y - Math.cos(camYaw) * Math.cos(camPitch) * d)
        camPos.lerp(tmp, 1 - Math.exp(-14 * dt))
        camera.position.copy(camPos)
        camera.lookAt(player.pos.x, player.y + 1.4, player.pos.y)
        if (camera.fov !== 62) {
          camera.fov = 62
          camera.updateProjectionMatrix()
        }
      }
      shake *= Math.exp(-6 * dt)
      world.update(dt, now, camera, night)

      // speech bubble follows the speaker
      if (sayLeft > 0) {
        sayLeft -= dt
        if (sayLeft <= 0) setSay("")
      }
      const b = bubble.current
      if (b) {
        if (sayLeft > 0 && sayPed) {
          tmp.set(sayPed.pos.x + sayPed.off.x, 2.3, sayPed.pos.y + sayPed.off.y).project(camera)
          const w = el.clientWidth
          const h = el.clientHeight
          b.style.opacity = tmp.z < 1 ? "1" : "0"
          b.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%, -100%)`
        } else b.style.opacity = "0"
      }
      if (msgLeft > 0) {
        msgLeft -= dt
        if (msgLeft <= 0) msg = ""
      }

      renderer.render(scene, camera)
      if (++frame % 3 === 0) drawMini(mapHeading, focus, facing)
      if (now - hudAt > 120) {
        hudAt = now
        const next: Hud = { kmh: Math.round(speed * 3.6), cash, coins: got, total, mode, hint, night: night > 0, radio, msg }
        const s = JSON.stringify(next)
        if (s !== prevHud) {
          prevHud = s
          setHud(next)
        }
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener("contextmenu", onWheelLess)
      el.removeEventListener("pointerdown", pd)
      el.removeEventListener("pointermove", pm)
      removeEventListener("pointerup", pu)
      audio.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  // ---- keyboard / touch plumbing ----
  const norm = (key: string) => (key === " " ? " " : key.toLowerCase())
  const press = (key: string, on: boolean) => {
    if (on) {
      if (!down.current.has(key)) pressed.current.add(key)
      down.current.add(key)
    } else down.current.delete(key)
  }
  const onKey = (on: boolean) => (e: React.KeyboardEvent) => {
    const key = norm(e.key)
    if (!GAME_KEYS.has(key)) return
    e.preventDefault()
    press(key, on)
  }
  const hold = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setActive(true)
      press(key, true)
    },
    onPointerUp: () => press(key, false),
    onPointerLeave: () => press(key, false),
    onPointerCancel: () => press(key, false),
  })
  const tap = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setActive(true)
      press(key, true)
      press(key, false)
    },
  })

  const btn = "touch-none select-none rounded-2xl bg-white/20 text-white backdrop-blur active:bg-white/45"
  const chip = "pointer-events-auto rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"

  return (
    <div
      ref={host}
      tabIndex={0}
      role="application"
      aria-label="Neon Coast, an open-world driving and walking game. WASD or arrow keys to move, F to get in or out of a car, E to talk."
      onKeyDown={onKey(true)}
      onKeyUp={onKey(false)}
      onFocus={() => setActive(true)}
      onBlur={() => {
        setActive(false)
        down.current.clear()
      }}
      onPointerDown={(e) => (e.currentTarget as HTMLElement).focus()}
      className="relative h-full w-full select-none overflow-hidden bg-[#12063a] outline-none"
    >
      {/* HUD */}
      <div className="pointer-events-none absolute left-3 top-14 text-white sm:top-3">
        <div className="text-2xl font-black italic leading-none [text-shadow:0_0_12px_#ff4fa3]">${hud.cash}</div>
        <div className="mt-1 text-[11px] font-medium opacity-80">
          Cash {hud.coins}/{hud.total} · {hud.mode === "drive" ? "Driving" : "On foot"}
        </div>
      </div>
      <canvas ref={mini} width={120} height={120} className="pointer-events-none absolute right-3 top-3 h-[104px] w-[104px] rounded-full ring-2 ring-[#ff6ec7]/70 sm:h-[120px] sm:w-[120px]" />
      <div className="pointer-events-none absolute right-3 top-[124px] flex flex-col items-end gap-1 sm:top-[140px]">
        <button {...tap("r")} className={chip}>
          R · Radio {hud.radio ? "on" : "off"}
        </button>
        <button {...tap("t")} className={chip}>
          T · {hud.night ? "Night" : "Sunset"}
        </button>
      </div>
      {hud.mode === "drive" && (
        <div className="pointer-events-none absolute bottom-4 left-4 text-white" style={touch ? { bottom: 100 } : undefined}>
          <div className="text-4xl font-black italic leading-none tracking-tight [text-shadow:0_0_14px_#ff4fa3]">
            {hud.kmh}
            <span className="ml-1 text-sm font-semibold not-italic opacity-80">km/h</span>
          </div>
        </div>
      )}
      {hud.hint && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8" style={touch ? { bottom: 104 } : undefined}>
          <button {...tap(hud.hint.startsWith("E") ? "e" : "f")} className="rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur">
            {hud.hint}
          </button>
        </div>
      )}
      {hud.msg && <div className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-3xl font-black italic text-white [text-shadow:0_0_20px_#ff4fa3]">{hud.msg}</div>}
      <div ref={bubble} className="pointer-events-none absolute left-0 top-0 max-w-[220px] rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-[13px] font-medium text-neutral-900 opacity-0 shadow-lg transition-opacity">
        {say}
      </div>

      {!active && !touch && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30 text-center text-white backdrop-blur-[2px]">
          <div>
            <div className="text-5xl font-black italic tracking-tight [text-shadow:0_0_24px_#ff4fa3] sm:text-6xl">NEON COAST</div>
            <div className="mt-1 text-sm opacity-90">Click to play · drive, walk, explore</div>
            <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-x-6 gap-y-1 text-left text-xs opacity-90">
              <span>WASD / arrows · move</span>
              <span>Space · handbrake / jump</span>
              <span>Shift · run</span>
              <span>F · get in / out of a car</span>
              <span>E · talk to people</span>
              <span>R radio · T day/night</span>
              <span>Drag · look around</span>
              <span>Collect the gold coins</span>
            </div>
          </div>
        </div>
      )}

      {/* touch controls */}
      {touch && (
        <>
          {hud.mode === "walk" ? (
            <div className="absolute bottom-3 left-3 grid grid-cols-3 gap-1.5">
              <span />
              <button aria-label="Forward" {...hold("w")} className={`${btn} h-14 w-14`}>▲</button>
              <span />
              <button aria-label="Left" {...hold("a")} className={`${btn} h-14 w-14`}>◀</button>
              <button aria-label="Back" {...hold("s")} className={`${btn} h-14 w-14`}>▼</button>
              <button aria-label="Right" {...hold("d")} className={`${btn} h-14 w-14`}>▶</button>
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button aria-label="Steer left" {...hold("a")} className={`${btn} h-16 w-16 text-2xl`}>◀</button>
              <button aria-label="Steer right" {...hold("d")} className={`${btn} h-16 w-16 text-2xl`}>▶</button>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {hud.mode === "walk" ? (
              <>
                <button aria-label="Run" {...hold("shift")} className={`${btn} h-16 w-16 text-xs font-bold`}>RUN</button>
                <button aria-label="Jump" {...tap(" ")} className={`${btn} h-16 w-16 text-xs font-bold`}>JUMP</button>
              </>
            ) : (
              <>
                <button aria-label="Brake" {...hold("s")} className={`${btn} h-16 w-16 text-xs font-bold`}>BRK</button>
                <button aria-label="Gas" {...hold("w")} className="h-16 w-16 touch-none select-none rounded-2xl bg-[#ff4fa3]/70 text-xs font-bold text-white backdrop-blur active:bg-[#ff4fa3]">GAS</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
