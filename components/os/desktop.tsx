"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion"
import { BatteryFull, Search, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { me, projects, socials } from "@/lib/data"
import { About, CV, Mail, ProjectView, Projects, Terminal, Trash, type AppId } from "./apps"
import { PdfFileIcon, FinderIcon, FolderIcon, MailIcon, SocialIcon, TerminalIcon, TrashIcon } from "./icons"
import { Window, type Win } from "./window"

const APPS: Record<string, { title: string; w: number; h: number; icon: React.ReactNode }> = {
  about: { title: "About Me", w: 460, h: 580, icon: <FinderIcon /> },
  projects: { title: "Projects", w: 720, h: 480, icon: <FolderIcon /> },
  terminal: { title: "Terminal", w: 560, h: 360, icon: <TerminalIcon /> },
  mail: { title: "New Message", w: 500, h: 440, icon: <MailIcon /> },
  cv: { title: "CV-Sandanu_Hewage.pdf", w: 620, h: 640, icon: <PdfFileIcon /> },
  trash: { title: "Trash", w: 360, h: 240, icon: <TrashIcon /> },
}
const DOCK: AppId[] = ["about", "projects", "terminal", "mail"]

// what macOS would call the frontmost app for each window
const appName = (id?: string) =>
  !id ? "Finder" : id.startsWith("project:") ? "Safari" : ({ terminal: "Terminal", mail: "Mail", cv: "Preview" } as Record<string, string>)[id] ?? "Finder"

const spec = (id: AppId) => {
  if (id.startsWith("project:")) {
    const p = projects.find((x) => x.id === id.slice(8))!
    return { title: p.title, w: 640, h: 520 }
  }
  return APPS[id]
}

export function Desktop() {
  const mobile = useIsMobile()
  const [wins, setWins] = useState<Win[]>([]) // order = z-order, last is front
  const [spot, setSpot] = useState(false)
  const root = useRef<HTMLElement>(null)
  const [toast, setToast] = useState("")

  const open = useCallback((id: AppId) => {
    setWins((ws) => {
      const ex = ws.find((w) => w.id === id)
      if (ex) return [...ws.filter((w) => w !== ex), { ...ex, min: false }]
      const s = spec(id)
      const w = Math.min(s.w, innerWidth - 24)
      const h = Math.min(s.h, innerHeight - 160)
      const n = ws.length % 6
      return [
        ...ws,
        { id, title: s.title, w, h, x: (innerWidth - w) / 2 + n * 28 - 60, y: Math.max(48, (innerHeight - h) / 2 - 30 + n * 28), min: false, max: false },
      ]
    })
  }, [])

  const patch = (id: string, p: Partial<Win>) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...p } : w)))
  const focus = (id: string) => setWins((ws) => (ws[ws.length - 1]?.id === id ? ws : [...ws.filter((w) => w.id !== id), ws.find((w) => w.id === id)!]))
  const front = [...wins].reverse().find((w) => !w.min)

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSpot((s) => !s)
      }
      if (e.key === "Escape") setSpot(false)
    }
    addEventListener("keydown", k)
    return () => removeEventListener("keydown", k)
  }, [])

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(""), 1800)
  }
  const fid = front?.id
  const closeFront = fid ? () => setWins((ws) => ws.filter((w) => w.id !== fid)) : undefined
  const menus: [string, Item[]][] = [
    [appName(fid), [{ label: `About ${appName(fid)}`, run: () => open("about") }, "-", { label: "Close Window", run: closeFront }]],
    ["File", [
      { label: "New Message", run: () => open("mail") },
      { label: "Open Résumé", run: () => open("cv") },
      { label: "Download Résumé", run: () => Object.assign(document.createElement("a"), { href: me.cv, download: "" }).click() },
      "-",
      { label: "Close Window", run: closeFront },
    ]],
    ["Edit", [
      { label: "Copy Email Address", run: () => navigator.clipboard?.writeText(me.email).then(() => flash("Email address copied"), () => flash(me.email)) },
      { label: "Find…", hint: "⌘K", run: () => setSpot(true) },
    ]],
    ["View", [
      { label: "Enter Full Screen", run: () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()) },
      { label: "Show Desktop", run: () => setWins((ws) => ws.map((w) => ({ ...w, min: true }))) },
    ]],
    ["Window", [
      { label: "Minimize", run: fid ? () => patch(fid, { min: true }) : undefined },
      { label: "Zoom", run: fid ? () => patch(fid, { max: !front!.max }) : undefined },
      ...(wins.length ? (["-", ...wins.map((w) => ({ label: w.title, run: () => open(w.id as AppId) }))] as Item[]) : []),
    ]],
    ["Help", [
      { label: "Try the Terminal", run: () => open("terminal") },
      { label: "Contact Sandanu", run: () => open("mail") },
      "-",
      { label: "Search anything", hint: "⌘K", run: () => setSpot(true) },
    ]],
  ]
  const apple: Item[] = [
    { label: "About This Portfolio", run: () => open("about") },
    { label: "Projects", run: () => open("projects") },
    { label: "Résumé…", run: () => open("cv") },
    "-",
    { label: "Contact…", run: () => open("mail") },
  ]

  const render = (id: string) => {
    if (id.startsWith("project:")) return <ProjectView id={id.slice(8)} />
    switch (id) {
      case "about": return <About open={open} />
      case "projects": return <Projects open={open} />
      case "trash": return <Trash />
      case "terminal": return <Terminal open={open} />
      case "mail": return <Mail />
      case "cv": return <CV />
    }
  }

  return (
    <main ref={root} className="fixed inset-0 select-none overflow-hidden bg-[#07070d]">
      <Wallpaper />
      <MenuBar menus={menus} apple={apple} onSearch={() => setSpot(true)} />
      <DesktopFile mobile={mobile} onOpen={() => open("cv")} />

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] px-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:px-16">
        <h1 className="text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[.95] tracking-tighter text-white">
          Sandanu
          <br />
          Hewage
        </h1>
        <p className="mt-4 text-sm text-white/70 lg:text-base">{me.role}</p>
        <div className="pointer-events-auto mt-5 flex gap-3 md:hidden">
          {socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="h-11 w-11 transition active:scale-90">
              <SocialIcon name={s.name} />
            </a>
          ))}
        </div>
      </div>

      {wins.map((w, i) => (
        <Window
          key={w.id}
          win={w}
          z={10 + i}
          focused={front?.id === w.id}
          mobile={mobile}
          bounds={root}
          onFocus={() => focus(w.id)}
          onClose={() => setWins((ws) => ws.filter((x) => x.id !== w.id))}
          onMin={() => patch(w.id, { min: true })}
          onMax={() => patch(w.id, { max: !w.max })}
        >
          {render(w.id)}
        </Window>
      ))}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-12 z-[110] -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <Dock wins={wins} open={open} base={mobile ? 46 : 48} />
      <AnimatePresence>{spot && <Spotlight close={() => setSpot(false)} open={open} />}</AnimatePresence>
    </main>
  )
}

function Wallpaper() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_70%_30%,#0538c8,#012aa8)]">
      <div className="absolute inset-x-0 top-0 aspect-square [mask-image:linear-gradient(to_bottom,black_62%,transparent)] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:aspect-square lg:[mask-image:linear-gradient(to_right,transparent,black_35%)]">
        <Image src="/me.jpg" alt="" fill priority sizes="(min-width:1024px) 100vh, 100vw" className="object-cover" />
      </div>
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
    </div>
  )
}

function Clock() {
  const [t, setT] = useState("")
  useEffect(() => {
    const f = () => setT(new Date().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", ""))
    f()
    const i = setInterval(f, 15000)
    return () => clearInterval(i)
  }, [])
  return <span suppressHydrationWarning>{t}</span>
}

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] fill-current" aria-hidden>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
)

type Item = { label: string; run?: () => void; hint?: string } | "-"

function Dropdown({ items, onPick, className }: { items: Item[]; onPick: () => void; className?: string }) {
  return (
    <div role="menu" className={cn("absolute top-full z-[70] mt-1 flex min-w-52 flex-col rounded-lg bg-neutral-800/85 p-1 text-[13px] shadow-2xl ring-1 ring-white/15 backdrop-blur-2xl", className)}>
      {items.map((it, i) =>
        it === "-" ? (
          <hr key={i} className="my-1 border-white/15" />
        ) : (
          <button
            key={i}
            role="menuitem"
            disabled={!it.run}
            onClick={() => {
              onPick()
              it.run?.()
            }}
            className="flex items-center justify-between gap-6 rounded px-2.5 py-0.5 text-left enabled:hover:bg-[#0a60d8] disabled:text-white/35"
          >
            {it.label}
            {it.hint && <span className="text-white/50">{it.hint}</span>}
          </button>
        ),
      )}
    </div>
  )
}

function MenuBar({ menus, apple, onSearch }: { menus: [string, Item[]][]; apple: Item[]; onSearch: () => void }) {
  const [cur, setCur] = useState<string | null>(null) // "" = Apple menu
  const close = () => setCur(null)
  const trig = (key: string, label: React.ReactNode, cls = "") => (
    <div key={key} className={cn("relative", cls)}>
      <button
        onClick={() => setCur(cur === key ? null : key)}
        onMouseEnter={() => cur !== null && setCur(key)}
        aria-expanded={cur === key}
        className={cn("rounded px-2.5 py-0.5", cur === key && "bg-white/20")}
      >
        {label}
      </button>
      {cur === key && <Dropdown items={key === "" ? apple : menus.find((m) => m[0] === key)![1]} onPick={close} className="left-0" />}
    </div>
  )
  return (
    <>
      {cur !== null && <div className="fixed inset-0 z-[59]" onPointerDown={close} />}
      <header className="absolute inset-x-0 top-0 z-[60] flex h-[calc(1.75rem+env(safe-area-inset-top))] items-center justify-between bg-black/20 px-3 pt-[env(safe-area-inset-top)] text-[13px] text-white backdrop-blur-2xl">
        <div className="flex items-center">
          {trig("", <AppleLogo />)}
          {menus.map(([name], i) => trig(name, name, cn(i === 0 ? "font-bold" : "hidden md:block")))}
        </div>
        <div className="flex items-center gap-3.5 text-white">
          <Wifi className="hidden h-4 w-4 sm:block" aria-hidden />
          <BatteryFull className="hidden h-[18px] w-[18px] sm:block" aria-hidden />
          <button onClick={onSearch} aria-label="Search (⌘K)" className="hover:opacity-80">
            <Search className="h-3.5 w-3.5" />
          </button>
          <Clock />
        </div>
      </header>
    </>
  )
}

function DesktopFile({ mobile, onOpen }: { mobile: boolean; onOpen: () => void }) {
  const [sel, setSel] = useState(false)
  return (
    <button
      onClick={() => (mobile ? onOpen() : setSel(true))}
      onDoubleClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      onBlur={() => setSel(false)}
      className="absolute right-3 top-[calc(2.5rem+env(safe-area-inset-top))] z-[1] flex w-24 flex-col items-center gap-1 rounded-lg p-1 outline-none"
    >
      <div className={cn("h-[60px] w-[60px] rounded-lg p-1 drop-shadow-lg", sel && "bg-white/20")}>
        <PdfFileIcon />
      </div>
      <span className={cn("rounded px-1.5 py-px text-center text-[11px] font-medium leading-tight text-white [overflow-wrap:anywhere] [text-shadow:0_1px_4px_rgba(0,0,0,.5)]", sel && "bg-[#0a60d8] [text-shadow:none]")}>
        CV-Sandanu_Hewage.pdf
      </span>
    </button>
  )
}

function Dock({ wins, open, base }: { wins: Win[]; open: (id: AppId) => void; base: number }) {
  const mx = useMotionValue(Infinity)
  const sep = <span className="mx-1 h-10 w-px self-center bg-white/25" />
  return (
    <nav
      onPointerMove={(e) => e.pointerType === "mouse" && mx.set(e.clientX)}
      onPointerLeave={() => mx.set(Infinity)}
      className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex h-[68px] max-w-[calc(100vw-16px)] -translate-x-1/2 items-end gap-1.5 rounded-[24px] bg-white/10 px-2 pb-2 ring-1 ring-white/25 backdrop-blur-2xl sm:gap-2 sm:px-2.5"
    >
      {DOCK.map((id) => (
        <DockIcon key={id} base={base} mx={mx} label={APPS[id].title.replace(/\.pdf$/, "")} running={wins.some((w) => w.id === id)} onClick={() => open(id)}>
          {APPS[id].icon}
        </DockIcon>
      ))}
      <span className="hidden md:contents">
        {sep}
        {socials.map((s) => (
          <DockIcon key={s.name} base={base} mx={mx} label={s.name} href={s.href}>
            <SocialIcon name={s.name} />
          </DockIcon>
        ))}
      </span>
      {sep}
      <DockIcon base={base} mx={mx} label="Trash" running={wins.some((w) => w.id === "trash")} onClick={() => open("trash")}>
        {APPS.trash.icon}
      </DockIcon>
    </nav>
  )
}

function DockIcon({ base, mx, label, running, onClick, href, children }: { base: number; mx: MotionValue<number>; label: string; running?: boolean; onClick?: () => void; href?: string; children: React.ReactNode }) {
  const el = useRef<HTMLElement>(null)
  const size = useSpring(
    useTransform(mx, (m) => {
      const r = el.current?.getBoundingClientRect()
      return base + 40 * Math.max(0, 1 - Math.abs(m - (r ? r.left + r.width / 2 : -999)) / 110)
    }),
    { stiffness: 400, damping: 28 },
  )
  const [bounce, setBounce] = useState(false)
  const Tag = (href ? motion.a : motion.button) as typeof motion.button
  return (
    <div className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs text-white opacity-0 backdrop-blur transition [@media(hover:hover)]:group-hover:opacity-100">{label}</span>
      <Tag
        ref={el as React.Ref<HTMLButtonElement>}
        aria-label={label}
        onClick={() => {
          if (onClick) setBounce(true)
          onClick?.()
        }}
        animate={{ y: bounce ? [0, -24, 0, -10, 0] : 0 }}
        transition={{ duration: 0.8 }}
        onAnimationComplete={() => setBounce(false)}
        {...(href ? ({ href, target: "_blank", rel: "noopener noreferrer" } as object) : {})}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.88 }}
        className="block drop-shadow-lg [&>div]:rounded-[22%] [&>svg]:h-full [&>svg]:w-full"
      >
        {children}
      </Tag>
      <span className={`mt-1 h-1 w-1 rounded-full bg-white/80 ${running ? "" : "opacity-0"}`} />
    </div>
  )
}

function Spotlight({ close, open }: { close: () => void; open: (id: AppId) => void }) {
  const [q, setQ] = useState("")
  const [i, setI] = useState(0)
  const items = useMemo(() => {
    const all = [
      ...[...DOCK, "cv" as AppId].map((id) => ({ label: APPS[id].title.replace(/\.pdf$/, ""), kind: "App", go: () => open(id) })),
      ...projects.map((p) => ({ label: p.title, kind: "Project", go: () => open(`project:${p.id}`) })),
      ...socials.map((s) => ({ label: s.name, kind: "Link", go: () => window.open(s.href, "_blank", "noopener") })),
    ]
    return all.filter((x) => x.label.toLowerCase().includes(q.toLowerCase())).slice(0, 7)
  }, [q, open])
  const pick = (n: number) => {
    items[n]?.go()
    close()
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex items-start justify-center bg-black/20 px-4 pt-[18vh] backdrop-blur-sm"
      onPointerDown={close}
    >
      <motion.div
        initial={{ scale: 0.96, y: -8 }}
        animate={{ scale: 1, y: 0 }}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white/85 shadow-2xl ring-1 ring-black/10 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Search className="h-5 w-5 text-neutral-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setI(0)
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") setI((n) => Math.min(n + 1, items.length - 1))
              if (e.key === "ArrowUp") setI((n) => Math.max(n - 1, 0))
              if (e.key === "Enter") pick(i)
            }}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
            className="flex-1 bg-transparent text-lg text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
        {items.length > 0 && (
          <ul className="border-t border-black/5 p-2">
            {items.map((x, n) => (
              <li key={x.label + x.kind}>
                <button onMouseEnter={() => setI(n)} onClick={() => pick(n)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-900 ${n === i ? "bg-[#0a84ff] text-white" : ""}`}>
                  {x.label}
                  <span className={`text-xs ${n === i ? "text-white/70" : "text-neutral-400"}`}>{x.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  )
}
