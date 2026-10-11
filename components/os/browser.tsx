"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Lock, Plus, RotateCw, Search, Share, X } from "lucide-react"
import { projects, webInfo } from "@/lib/data"
import { Img, SocialIcon } from "./icons"
import { useWin } from "./window"

// three.js is large, so the game only loads when its page is opened
const NeonCoast = dynamic(() => import("./game/NeonCoast").then((m) => m.NeonCoast), { ssr: false })

const GAME = "about:neon-coast"

type Tab = { id: number; hist: (string | null)[]; i: number; reload: number }

// what the user typed -> a URL, a domain, or a Bing search
const toUrl = (input: string) => {
  const v = input.trim()
  if (!v) return null
  if (v.toLowerCase() === GAME) return GAME
  if (/^https?:\/\//i.test(v)) return v
  if (/^[^\s/]+\.[a-z]{2,}(\/\S*)?$/i.test(v)) return `https://${v}`
  return `https://www.bing.com/search?q=${encodeURIComponent(v)}`
}

const label = (u: string | null) => (!u ? "Start Page" : u === GAME ? "Neon Coast" : webInfo(u).title)

const FAVORITES: { name: string; url: string; icon: React.ReactNode }[] = [
  { name: "Teczos", url: "https://teczos.com", icon: <Img name="teczos" /> },
  { name: "Teczos One", url: "https://one.teczos.com", icon: <Img name="teczos-one" /> },
  { name: "Apple", url: "https://www.apple.com", icon: <SocialIcon name="Apple" /> },
  { name: "Wikipedia", url: "https://en.wikipedia.org", icon: <SocialIcon name="Wikipedia" /> },
  { name: "Bing", url: "https://www.bing.com", icon: <Tile bg="#2b7de9">B</Tile> },
  { name: "Google", url: "https://www.google.com", icon: <Tile bg="#4285f4">G</Tile> },
  { name: "GitHub", url: "https://github.com/Sandanu06", icon: <SocialIcon name="GitHub" /> },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/sandanu-hewage-35761b295/", icon: <SocialIcon name="LinkedIn" /> },
  { name: "X", url: "https://x.com/Sandanu06", icon: <SocialIcon name="X" /> },
  { name: "YouTube", url: "http://www.youtube.com/@sandanumihisara4323", icon: <SocialIcon name="YouTube" /> },
  { name: "Reddit", url: "https://www.reddit.com/user/Sandanu_Hewage/", icon: <SocialIcon name="Reddit" /> },
  { name: "Hacker News", url: "https://news.ycombinator.com", icon: <SocialIcon name="Hacker News" /> },
  { name: "Tailwind", url: "https://tailwindcss.com", icon: <SocialIcon name="Tailwind" /> },
  { name: "React", url: "https://react.dev", icon: <SocialIcon name="React" /> },
  { name: "MDN", url: "https://developer.mozilla.org", icon: <SocialIcon name="MDN" /> },
  { name: "Hugging Face", url: "https://huggingface.co", icon: <SocialIcon name="Hugging Face" /> },
]

function Tile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div style={{ background: bg }} className="grid h-full w-full place-items-center rounded-[22%] text-[44px] font-medium leading-none text-white ring-1 ring-white/20">
      {children}
    </div>
  )
}

const OpenLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-[#0a84ff] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#0077ed] active:scale-95">
    {children} <ArrowUpRight className="h-4 w-4" />
  </a>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
    {children}
  </section>
)

function StartPage({ onGo }: { onGo: (u: string) => void }) {
  return (
    <div
      className="h-full overflow-auto bg-[#161618] text-white"
      style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,.028) 0 2px, transparent 2px 15px), radial-gradient(90% 60% at 20% 0%, rgba(80,80,100,.25), transparent)" }}
    >
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-10">
        <Section title="Favorites">
          <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 lg:grid-cols-8">
            {FAVORITES.map((f) => (
              <button key={f.url} onClick={() => onGo(f.url)} className="group flex flex-col items-center gap-2 outline-none">
                <div className="h-[62px] w-[62px] shadow-lg transition group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[#0a84ff] group-active:scale-95 sm:h-[76px] sm:w-[76px]">{f.icon}</div>
                <span className="max-w-full truncate text-[12px] text-white/85">{f.name}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Play">
          <button
            onClick={() => onGo(GAME)}
            className="group relative flex h-40 w-full items-end overflow-hidden rounded-2xl p-6 text-left ring-1 ring-white/10 transition hover:ring-white/30 active:scale-[.995]"
            style={{ backgroundImage: "linear-gradient(115deg,#12063a 0%,#6a2bb8 45%,#ff4fa3 80%,#ffb36b 100%)" }}
          >
            <div className="absolute -right-6 -top-10 h-44 w-44 rounded-full bg-gradient-to-b from-[#ffe66d] to-[#ff3d8b] opacity-90 transition group-hover:scale-105" />
            <div className="relative">
              <div className="text-3xl font-black italic tracking-tight">NEON COAST</div>
              <div className="mt-1 max-w-md text-sm text-white/85">An open-world city to drive and walk around. Jump in a car, talk to people, collect the coins.</div>
            </div>
            <span className="relative ml-auto rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900">Play</span>
          </button>
        </Section>

        <Section title="Reading List">
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <button key={p.id} onClick={() => onGo(p.link)} className="flex items-center gap-3 rounded-xl bg-white/[.07] p-3 text-left transition hover:bg-white/[.12] active:scale-[.99]">
                <div className="relative aspect-[67/30] w-24 shrink-0 overflow-hidden rounded-md bg-black/30">
                  <Image src={p.image} alt="" fill sizes="96px" className="object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{p.title}</div>
                  <div className="line-clamp-2 text-xs text-white/60">{p.description}</div>
                </div>
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

type Frame = "checking" | "ok" | "blocked"

function Page({ url, reload, paused, onGo }: { url: string | null; reload: number; paused: boolean; onGo: (u: string) => void }) {
  const [frame, setFrame] = useState<Frame>("checking")
  const external = !!url && url !== GAME
  useEffect(() => {
    if (!external) return
    setFrame("checking")
    const ctl = new AbortController()
    fetch(`/api/frame-check?url=${encodeURIComponent(url!)}`, { signal: ctl.signal })
      .then((r) => r.json())
      .then((d) => setFrame(d.embeddable ? "ok" : "blocked"))
      .catch((e) => e.name !== "AbortError" && setFrame("blocked"))
    return () => ctl.abort()
  }, [url, external])

  if (!url) return <StartPage onGo={onGo} />
  if (url === GAME) return <NeonCoast paused={paused} />
  if (frame === "ok") return <iframe key={reload} src={url} title={label(url)} className="absolute inset-0 h-full w-full border-0 bg-white" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads" referrerPolicy="no-referrer" />
  if (frame === "checking") return <div className="grid h-full place-items-center text-sm text-white/50">Loading {webInfo(url).host}…</div>
  return <Blocked url={url} />
}

// `initial` null = a new Safari window on the start page
export function Browser({ initial }: { initial: string | null }) {
  const win = useWin()
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, hist: [initial], i: 0, reload: 0 }])
  const [active, setActive] = useState(1)
  const nextId = useRef(2)
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const tab = tabs.find((t) => t.id === active) ?? tabs[0]
  const url = tab.hist[tab.i]
  const upd = (fn: (t: Tab) => Tab) => setTabs((ts) => ts.map((t) => (t.id === tab.id ? fn(t) : t)))
  const go = (u: string | null) => upd((t) => ({ ...t, hist: [...t.hist.slice(0, t.i + 1), u], i: t.i + 1 }))

  useEffect(() => setInput(url === GAME ? GAME : (url ?? "")), [url, active])

  const newTab = () => {
    const id = nextId.current++
    setTabs((ts) => [...ts, { id, hist: [null], i: 0, reload: 0 }])
    setActive(id)
    setTimeout(() => inputRef.current?.focus(), 50)
  }
  const closeTab = (id: number) => {
    if (tabs.length === 1) return setTabs([{ id, hist: [null], i: 0, reload: 0 }])
    const idx = tabs.findIndex((t) => t.id === id)
    const rest = tabs.filter((t) => t.id !== id)
    setTabs(rest)
    if (id === active) setActive(rest[Math.min(idx, rest.length - 1)].id)
  }

  const btn = "grid h-8 w-8 place-items-center rounded-md text-white/70 enabled:hover:bg-white/10 enabled:hover:text-white disabled:opacity-30"
  return (
    <div className="flex h-full flex-col bg-[#161618] text-white">
      <form
        className="flex h-12 shrink-0 items-center gap-1 bg-[#2a2a2c] pl-[78px] pr-3 max-md:pl-[66px]"
        onPointerDown={(e) => e.target === e.currentTarget && win.startDrag(e)}
        onDoubleClick={(e) => e.target === e.currentTarget && win.toggleMax()}
        onSubmit={(e) => {
          e.preventDefault()
          const u = toUrl(input)
          if (u) {
            go(u)
            inputRef.current?.blur()
          }
        }}
        style={{ touchAction: "none" }}
      >
        <button type="button" aria-label="Back" disabled={tab.i === 0} onClick={() => upd((t) => ({ ...t, i: t.i - 1 }))} className={btn}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Forward" disabled={tab.i >= tab.hist.length - 1} onClick={() => upd((t) => ({ ...t, i: t.i + 1 }))} className={btn}>
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="mx-2 flex h-8 min-w-0 max-w-2xl flex-1 items-center gap-2 rounded-lg bg-black/35 px-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#0a84ff]/80 md:mx-auto">
          {url ? <Lock className="h-3 w-3 shrink-0 text-white/40" /> : <Search className="h-3.5 w-3.5 shrink-0 text-white/40" />}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Search or enter website name"
            aria-label="Address"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40 sm:text-[13px]"
          />
          <button type="button" aria-label="Reload" disabled={!url} onClick={() => upd((t) => ({ ...t, reload: t.reload + 1 }))} className="text-white/50 enabled:hover:text-white disabled:opacity-30">
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Copy link"
          title="Copy link"
          disabled={!url || url === GAME}
          onClick={() => navigator.clipboard?.writeText(url!).then(() => (setCopied(true), setTimeout(() => setCopied(false), 1500)))}
          className={btn}
        >
          {copied ? <Check className="h-4 w-4" /> : <Share className="h-4 w-4" />}
        </button>
        <button type="button" aria-label="New tab" title="New tab" onClick={newTab} className={btn}>
          <Plus className="h-[18px] w-[18px]" />
        </button>
      </form>

      {tabs.length > 1 && (
        <div role="tablist" className="flex h-9 shrink-0 gap-1 overflow-x-auto bg-[#2a2a2c] px-2 pb-1">
          {tabs.map((t) => (
            <div
              key={t.id}
              role="tab"
              aria-selected={t.id === active}
              onClick={() => setActive(t.id)}
              className={`group flex min-w-0 max-w-[240px] flex-1 cursor-default items-center gap-1 rounded-md px-2.5 text-[12px] ${t.id === active ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/8"}`}
            >
              <span className="min-w-0 flex-1 truncate text-center">{label(t.hist[t.i])}</span>
              <button aria-label="Close tab" onClick={(e) => (e.stopPropagation(), closeTab(t.id))} className="grid h-4 w-4 shrink-0 place-items-center rounded text-white/60 opacity-0 hover:bg-white/15 group-hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative min-h-0 flex-1">
        {tabs.map((t) => (
          <div key={t.id} className={`absolute inset-0 ${t.id === active ? "" : "hidden"}`}>
            <Page url={t.hist[t.i]} reload={t.reload} paused={win.min || t.id !== active} onGo={(u) => (setActive(t.id), setTabs((ts) => ts.map((x) => (x.id === t.id ? { ...x, hist: [...x.hist.slice(0, x.i + 1), u], i: x.i + 1 } : x))))} />
          </div>
        ))}
      </div>
    </div>
  )
}

// shown when the site refuses to be framed
function Blocked({ url }: { url: string }) {
  const { project, social, host, title } = webInfo(url)
  if (project)
    return (
      <div className="h-full overflow-auto bg-[#161618]">
        <div className="mx-auto max-w-3xl space-y-5 p-5 sm:p-8">
          <div className="relative aspect-[67/30] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-white/10">
            <Image src={project.image} alt={project.title} fill sizes="768px" className="object-cover object-top" />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
            <p className="text-[15px] leading-relaxed text-white/65">{project.description}</p>
            <OpenLink href={url}>Visit {host}</OpenLink>
          </div>
        </div>
      </div>
    )
  return (
    <div className="grid h-full place-items-center overflow-auto bg-[#161618] p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        {social && (
          <div className="h-20 w-20 shadow-lg">
            <SocialIcon name={social.name} />
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-xs text-sm text-white/55">{host} doesn't allow itself to be shown inside another site.</p>
        <OpenLink href={url}>Open {social?.name ?? host}</OpenLink>
      </div>
    </div>
  )
}
