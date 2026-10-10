"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ArrowUpRight, Check, Download } from "lucide-react"
import { me, projects, skills, socials } from "@/lib/data"

export type AppId = "about" | "projects" | "terminal" | "mail" | "cv" | "trash" | `project:${string}`

export function About({ open }: { open: (id: AppId) => void }) {
  return (
    <div className="flex h-full flex-col items-center gap-5 overflow-auto p-8 text-center sm:p-10">
      <Image src="/me.jpg" alt={me.name} width={96} height={96} className="h-24 w-24 shrink-0 rounded-full object-cover object-[50%_25%] shadow-lg ring-1 ring-black/10" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{me.name}</h1>
        <p className="mt-1 text-sm text-neutral-500">{me.role}</p>
      </div>
      <div className="max-w-md space-y-3 text-[15px] leading-relaxed text-neutral-600">
        {me.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="flex max-w-md flex-wrap justify-center gap-1.5">
        {skills.flatMap((g) => g.items).map((s) => (
          <span key={s} className="rounded-full bg-black/[.05] px-3 py-1 text-xs font-medium text-neutral-700">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        <Btn onClick={() => open("projects")}>See my work</Btn>
        <Btn onClick={() => open("mail")} ghost>
          Get in touch
        </Btn>
      </div>
    </div>
  )
}

function Btn({ children, ghost, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { ghost?: boolean }) {
  return (
    <button
      {...p}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
        ghost ? "bg-black/5 text-neutral-800 hover:bg-black/10" : "bg-[#0a84ff] text-white hover:bg-[#0077ed]"
      }`}
    />
  )
}

const TABS = ["All", "Teczos", "Personal"] as const

export function Projects({ open }: { open: (id: AppId) => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All")
  return (
    <div className="h-full overflow-auto p-4 sm:p-6">
      <div role="tablist" className="mx-auto mb-5 flex w-fit rounded-full bg-black/5 p-0.5">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition", tab === t ? "bg-white shadow-sm" : "text-neutral-500")}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {projects.filter((p) => tab === "All" || p.group === tab).map((p) => (
          <button key={p.id} onClick={() => open(`project:${p.id}`)} className="group text-left">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 shadow-sm ring-1 ring-black/5 transition group-hover:shadow-lg group-active:scale-[.98]">
              <Image src={p.image} alt={p.title} fill sizes="240px" className="object-cover object-top" />
            </div>
            <div className="mt-2 text-sm font-medium">{p.title}</div>
            <div className="text-xs text-neutral-500">{[p.group, ...p.tags].join(" · ")}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ProjectView({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id)
  if (!p) return null
  return (
    <div className="h-full overflow-auto">
      <div className="relative aspect-[16/8] w-full bg-neutral-100">
        <Image src={p.image} alt={p.title} fill sizes="720px" className="object-cover object-top" />
      </div>
      <div className="space-y-3 p-6">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-neutral-600">
              {t}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{p.title}</h2>
        <p className="text-[15px] leading-relaxed text-neutral-600">{p.description}</p>
        <a
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-[#0a84ff] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#0077ed] active:scale-95"
        >
          Visit site <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

export function Trash() {
  return (
    <div className="grid h-full place-items-center p-8 text-center">
      <div>
        <p className="font-medium">Trash is empty</p>
        <p className="mt-1 text-sm text-neutral-500">Good ideas don't get thrown away.</p>
      </div>
    </div>
  )
}

export function Mail() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error)
      setStatus("sent")
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.")
      setStatus("error")
    }
  }
  if (status === "sent")
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div>
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white">
            <Check />
          </div>
          <p className="font-medium">Message sent</p>
          <p className="text-sm text-neutral-500">I'll get back to you soon.</p>
        </div>
      </div>
    )
  const field = "w-full border-b border-black/10 bg-transparent px-1 py-2.5 text-base outline-none focus:border-[#0a84ff] sm:text-sm"
  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-1 overflow-auto p-5">
      <div className="mb-1 text-xs text-neutral-500">
        To: <span className="text-neutral-800">{me.email}</span>
      </div>
      <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
      <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="Your email" className={field} />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <textarea name="message" required maxLength={5000} placeholder="Say hello…" rows={6} className={`${field} min-h-32 flex-1 resize-none`} />
      {status === "error" && <p role="alert" className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3 text-xs text-neutral-500">
          {socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">
              {s.name}
            </a>
          ))}
        </div>
        <button
          disabled={status === "sending"}
          className="rounded-full bg-[#0a84ff] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#0077ed] active:scale-95 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  )
}

export function CV() {
  return (
    <div className="flex h-full flex-col">
      <iframe src={`${me.cv}#toolbar=0`} title="CV" className="min-h-0 flex-1 bg-white" />
      <a
        href={me.cv}
        download
        className="flex items-center justify-center gap-1.5 border-t border-black/5 py-2 text-sm font-medium text-[#0a84ff] hover:bg-black/[.03]"
      >
        <Download className="h-4 w-4" /> Download CV
      </a>
    </div>
  )
}

const run = (cmd: string, open: (id: AppId) => void): string[] => {
  const [c, arg] = cmd.trim().toLowerCase().split(/\s+/)
  switch (c) {
    case "":
      return []
    case "help":
      return ["about  projects  contact  cv  whoami  open <app>  clear"]
    case "whoami":
      return [me.name, me.role]
    case "about":
    case "projects":
    case "cv":
      open(c)
      return [`opening ${c}…`]
    case "contact":
      open("mail")
      return ["opening mail…"]
    case "open": {
      const m = { about: "about", projects: "projects", cv: "cv", mail: "mail", contact: "mail" }[arg as string]
      if (!m) return [`open: unknown app '${arg ?? ""}'`]
      open(m as AppId)
      return [`opening ${arg}…`]
    }
    case "ls":
      return projects.map((p) => p.id)
    case "sudo":
      return ["nice try."]
    default:
      return [`command not found: ${c}. try 'help'`]
  }
}

export function Terminal({ open }: { open: (id: AppId) => void }) {
  const [lines, setLines] = useState<string[]>(["Welcome. Type 'help' to get started."])
  const [v, setV] = useState("")
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" })
  }, [lines])
  return (
    <div
      className="h-full overflow-auto bg-[#1c1c1e] p-4 font-mono text-base sm:text-[13px] leading-6 text-neutral-200"
      onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {l}
        </div>
      ))}
      <form
        className="flex"
        onSubmit={(e) => {
          e.preventDefault()
          if (v.trim().toLowerCase() === "clear") setLines([])
          else setLines((l) => [...l, `~ % ${v}`, ...run(v, open)])
          setV("")
        }}
      >
        <span className="mr-2 text-emerald-400">~ %</span>
        <input
          autoFocus={innerWidth >= 768}
          value={v}
          onChange={(e) => setV(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent outline-none"
        />
      </form>
      <div ref={end} />
    </div>
  )
}
