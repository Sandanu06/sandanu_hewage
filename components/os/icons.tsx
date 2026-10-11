import { Linkedin } from "lucide-react"
import { siDiscord, siFacebook, siGithub, siGooglecloud, siGoogle, siInstagram, siMedium, siReddit, siSpotify, siSteam, siTelegram, siX, siYoutube, siTailwindcss, siWikipedia, siYcombinator, siApple, siMdnwebdocs, siReact, siHuggingface } from "simple-icons"

// macOS-style app icons, drawn as SVG on a 100x100 grid.
const Sq = ({ id, from, to, stroke }: { id: string; from: string; to: string; stroke?: string }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="94" height="94" rx="22" fill={`url(#${id})`} stroke={stroke} strokeOpacity=".35" />
  </>
)

export const FolderIcon = () => (
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="fo-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#56b9f7" />
        <stop offset="1" stopColor="#2a8fe0" />
      </linearGradient>
      <linearGradient id="fo-f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fdcff" />
        <stop offset="1" stopColor="#47b4f5" />
      </linearGradient>
    </defs>
    <path d="M6 22a8 8 0 0 1 8-8h22l8 8h42a8 8 0 0 1 8 8v52a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8Z" fill="url(#fo-b)" />
    <rect x="6" y="32" width="88" height="56" rx="8" fill="url(#fo-f)" />
    <rect x="6" y="32" width="88" height="2" fill="#fff" opacity=".45" />
  </svg>
)

export const PdfFileIcon = () => (
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e4e5ea" />
      </linearGradient>
    </defs>
    <path d="M22 6h40l22 22v62a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Z" fill="url(#pf)" stroke="#c8c9d0" />
    <path d="M62 6v17a5 5 0 0 0 5 5h17Z" fill="#d5d6dc" />
    <rect x="17" y="62" width="50" height="22" rx="4" fill="#e5412f" />
    <text x="42" y="78" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="Helvetica, Arial, sans-serif" fill="#fff">PDF</text>
    <rect x="28" y="34" width="38" height="3.5" rx="1.75" fill="#c4c5cc" />
    <rect x="28" y="43" width="38" height="3.5" rx="1.75" fill="#c4c5cc" />
    <rect x="28" y="52" width="26" height="3.5" rx="1.75" fill="#c4c5cc" />
  </svg>
)

type Brand = { bg: string; path?: string }
const g = (i: { path: string }, bg: string): Brand => ({ bg, path: i.path })
const BRAND: Record<string, Brand> = {
  LinkedIn: { bg: "#0a66c2" },
  GitHub: g(siGithub, "linear-gradient(#2b2b2f,#000)"),
  Instagram: g(siInstagram, "linear-gradient(45deg,#feda75,#fa7e1e 30%,#d62976 60%,#4f5bd5)"),
  X: g(siX, "#000"),
  YouTube: g(siYoutube, "#ff0000"),
  Facebook: g(siFacebook, "#1877f2"),
  Telegram: g(siTelegram, "#26a5e4"),
  Discord: g(siDiscord, "#5865f2"),
  Medium: g(siMedium, "#000"),
  Reddit: g(siReddit, "#ff4500"),
  Spotify: g(siSpotify, "#1db954"),
  Steam: g(siSteam, "linear-gradient(#1b2838,#0b1118)"),
  "Google Cloud Skills": g(siGooglecloud, "#4285f4"),
  "Google Developer": g(siGoogle, "#34a853"),
  Tailwind: g(siTailwindcss, "#0b1120"),
  Wikipedia: g(siWikipedia, "#ffffff"),
  "Hacker News": g(siYcombinator, "#ff6600"),
  Apple: g(siApple, "#f2f2f4"),
  MDN: g(siMdnwebdocs, "#0b0b0b"),
  React: g(siReact, "#14202b"),
  "Hugging Face": g(siHuggingface, "#ffcc4d"),
}

export const Img = ({ name }: { name: string }) => <img src={`/dock/${name}.png`} alt="" draggable={false} className="h-full w-full object-contain" />

const LIGHT = new Set(["Wikipedia", "Apple", "Hugging Face"])

export const SocialIcon = ({ name }: { name: string }) => {
  if (name === "LinkedIn") return <Img name="linkedin" />
  const b = BRAND[name]
  return (
    <div style={{ background: b.bg }} className={`grid h-full w-full place-items-center rounded-[22%] ring-1 ring-white/25 [&>svg]:h-1/2 [&>svg]:w-1/2 ${LIGHT.has(name) ? "text-neutral-900" : name === "Tailwind" ? "text-[#38bdf8]" : name === "React" ? "text-[#61dafb]" : "text-white"}`}>
      {b.path ? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={b.path} />
        </svg>
      ) : (
        <Linkedin fill="currentColor" strokeWidth={0} />
      )}
    </div>
  )
}

export const ConnectIcon = () => (
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="cn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2f2f6" />
        <stop offset="1" stopColor="#b9bac4" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="94" height="94" rx="22" fill="url(#cn)" stroke="#fff" strokeOpacity=".6" />
    {["#ff5f57", "#febc2e", "#28c840", "#0a84ff", "#af52de", "#ff375f", "#30b0c7", "#ff9f0a", "#5e5ce6"].map((c, i) => (
      <rect key={c} x={22 + (i % 3) * 22} y={22 + Math.floor(i / 3) * 22} width="16" height="16" rx="4.5" fill={c} />
    ))}
  </svg>
)

export const SafariIcon = () => (
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3fd7ff" />
        <stop offset="1" stopColor="#0a63f2" />
      </linearGradient>
      <radialGradient id="sf2" cx="50%" cy="40%" r="60%">
        <stop offset="0" stopColor="#7be4ff" />
        <stop offset="1" stopColor="#1b86f5" />
      </radialGradient>
    </defs>
    <rect x="3" y="3" width="94" height="94" rx="22" fill="url(#sf)" />
    <rect x="3.5" y="3.5" width="93" height="93" rx="21.5" fill="none" stroke="#fff" strokeOpacity=".35" />
    <circle cx="50" cy="50" r="36" fill="url(#sf2)" stroke="#fff" strokeWidth="3" />
    {Array.from({ length: 36 }, (_, i) => {
      const a = (i * 10 * Math.PI) / 180
      const long = i % 3 === 0
      const r1 = long ? 30.5 : 32.5
      const f = (v: number) => +v.toFixed(2)
      return <line key={i} x1={f(50 + Math.sin(a) * r1)} y1={f(50 - Math.cos(a) * r1)} x2={f(50 + Math.sin(a) * 34)} y2={f(50 - Math.cos(a) * 34)} stroke="#fff" strokeOpacity={long ? 0.95 : 0.6} strokeWidth={long ? 1.6 : 1} />
    })}
    <g transform="rotate(45 50 50)">
      <path d="M50 22 58 50H42Z" fill="#ff3b30" />
      <path d="M50 78 42 50H58Z" fill="#fff" />
    </g>
    <circle cx="50" cy="50" r="2.4" fill="#fff" />
  </svg>
)

export const AppleLogo = ({ className = "h-[15px] w-[15px] fill-current" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
)
