// Tiny WebAudio synth: engine hum, pickup blips and a synthwave "radio". No audio files.
export function createAudio() {
  let ctx: AudioContext | null = null
  let master: GainNode
  let engine: OscillatorNode
  let engineGain: GainNode
  let radioTimer = 0
  let step = 0

  const start = () => {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume()
      return
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
    engine = ctx.createOscillator()
    engine.type = "sawtooth"
    engine.frequency.value = 40
    engineGain = ctx.createGain()
    engineGain.gain.value = 0
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 380
    engine.connect(lp).connect(engineGain).connect(master)
    engine.start()
  }

  const tone = (freq: number, type: OscillatorType, dur: number, vol: number, when = 0, cutoff = 2400) => {
    if (!ctx) return
    const t = ctx.currentTime + when
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = "lowpass"
    f.frequency.value = cutoff
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(f).connect(g).connect(master)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  const ROOTS = [55, 43.65, 65.41, 49] // A F C G
  const ARP = [1, 1.5, 2, 3, 2, 1.5, 2, 1.5]

  return {
    start,
    // speed in m/s, on = player is driving
    engine(speed: number, on: boolean) {
      if (!ctx) return
      engineGain.gain.setTargetAtTime(on ? 0.05 + Math.min(speed, 40) * 0.0012 : 0, ctx.currentTime, 0.08)
      engine.frequency.setTargetAtTime(38 + speed * 3.2, ctx.currentTime, 0.08)
    },
    coin() {
      tone(988, "square", 0.09, 0.12)
      tone(1319, "square", 0.16, 0.12, 0.08)
    },
    thud() {
      tone(70, "triangle", 0.2, 0.25, 0, 300)
    },
    door() {
      tone(140, "square", 0.08, 0.1, 0, 600)
      tone(95, "square", 0.1, 0.1, 0.07, 500)
    },
    radio(on: boolean) {
      clearInterval(radioTimer)
      if (!on || !ctx) return
      step = 0
      radioTimer = window.setInterval(() => {
        const root = ROOTS[Math.floor(step / 8) % 4]
        if (step % 2 === 0) tone(root, "sawtooth", 0.4, 0.16, 0, 420)
        tone(root * 4 * ARP[step % 8], "square", 0.18, 0.05, 0, 1800)
        if (step % 4 === 2) tone(180, "triangle", 0.12, 0.1, 0, 500)
        step++
      }, 135)
    },
    dispose() {
      clearInterval(radioTimer)
      ctx?.close().catch(() => {})
      ctx = null
    },
  }
}
