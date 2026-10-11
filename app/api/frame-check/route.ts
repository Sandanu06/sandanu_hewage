import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Tells the in-app browser whether a site allows being shown in a frame on this origin.
// It only ever returns a boolean, but it still fetches arbitrary URLs, so it refuses
// private/loopback addresses (also after redirects), limits redirects and time, and
// is rate limited per client.

const isPrivate = (ip: string) => {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase()
    if (v.startsWith("::ffff:")) return isPrivate(v.slice(7))
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb")
  }
  const [a, b] = ip.split(".").map(Number)
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224
}

async function safeUrl(raw: string): Promise<URL | null> {
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null
  if (u.username || u.password || (u.port && u.port !== "80" && u.port !== "443")) return null
  try {
    const addrs = await lookup(u.hostname, { all: true })
    if (!addrs.length || addrs.some((a) => isPrivate(a.address))) return null
  } catch {
    return null
  }
  return u
}

// does the page's frame-ancestors list allow `origin`?
const ancestorsAllow = (csp: string, origin: string) => {
  const m = csp.match(/(?:^|[;,])\s*frame-ancestors\s+([^;,]*)/i)
  if (!m) return true
  const host = new URL(origin).host
  return m[1]
    .trim()
    .split(/\s+/)
    .some((t) => {
      t = t.replace(/^'|'$/g, "")
      if (t === "*" || t === origin || t === "https:" && origin.startsWith("https:")) return true
      const h = t.replace(/^https?:\/\//, "").replace(/\/$/, "")
      return h === host || (h.startsWith("*.") && host.endsWith(h.slice(1)))
    })
}

const hits = new Map<string, number[]>()

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local"
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  if (recent.length >= 40) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  hits.set(ip, [...recent, now])

  const origin = new URL(req.url).origin
  let url = await safeUrl(new URL(req.url).searchParams.get("url") ?? "")
  if (!url) return NextResponse.json({ embeddable: false, reason: "invalid" })

  try {
    for (let hop = 0; hop < 5 && url; hop++) {
      const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(7000), headers: { "user-agent": "Mozilla/5.0 (compatible; PortfolioFrameCheck/1.0)" } })
      res.body?.cancel().catch(() => {})
      const loc = res.headers.get("location")
      if (res.status >= 300 && res.status < 400 && loc) {
        url = await safeUrl(new URL(loc, url).toString())
        continue
      }
      const xfo = res.headers.get("x-frame-options")
      const csp = res.headers.get("content-security-policy") ?? ""
      // browsers let CSP frame-ancestors win over X-Frame-Options when both are present
      const embeddable = /frame-ancestors/i.test(csp) ? ancestorsAllow(csp, origin) : !xfo
      return NextResponse.json({ embeddable })
    }
  } catch {
    // unreachable or timed out
  }
  return NextResponse.json({ embeddable: false, reason: "unreachable" })
}
