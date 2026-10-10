import { Github, Instagram, Linkedin } from "lucide-react"

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

export const FinderIcon = () => (
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="fn-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#62c6fb" />
        <stop offset="1" stopColor="#2e97ec" />
      </linearGradient>
      <linearGradient id="fn-r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#c9e6fd" />
      </linearGradient>
      <clipPath id="fn-c">
        <rect x="3" y="3" width="94" height="94" rx="22" />
      </clipPath>
    </defs>
    <g clipPath="url(#fn-c)">
      <rect x="3" y="3" width="47" height="94" fill="url(#fn-l)" />
      <rect x="50" y="3" width="47" height="94" fill="url(#fn-r)" />
    </g>
    <path d="M50 3c-3 14-6 30-3 44 1 5 4 9 9 10" fill="none" stroke="#13335c" strokeWidth="3" strokeLinecap="round" />
    <path d="M33 26v15M67 26v15" stroke="#13335c" strokeWidth="5" strokeLinecap="round" />
    <path d="M24 64c15 13 37 13 52 0" fill="none" stroke="#13335c" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
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

export const MailIcon = () => (
  <svg viewBox="0 0 100 100">
    <Sq id="ml" from="#6fd0ff" to="#1a73f0" stroke="#fff" />
    <rect x="21" y="29" width="58" height="42" rx="6" fill="#fff" />
    <path d="M23 33l27 21 27-21" fill="none" stroke="#2a86f4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const TerminalIcon = () => (
  <svg viewBox="0 0 100 100">
    <Sq id="tm" from="#3a3a3e" to="#0b0b0c" stroke="#fff" />
    <path d="M26 38l16 12-16 12" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 66h24" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
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

export const TrashIcon = () => (
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="tr" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#f1f4f8" stopOpacity=".95" />
        <stop offset=".5" stopColor="#cfd6df" stopOpacity=".85" />
        <stop offset="1" stopColor="#aeb7c3" stopOpacity=".95" />
      </linearGradient>
    </defs>
    <path d="M22 24h56l-6 64a5 5 0 0 1-5 5H33a5 5 0 0 1-5-5Z" fill="url(#tr)" stroke="#fff" strokeOpacity=".6" />
    <g stroke="#8a95a3" strokeOpacity=".55" strokeWidth="1.5">
      <path d="M38 34l2 52M50 34v54M62 34l-2 52" />
      <path d="M31 48h38M32 62h36M33 76h34" />
    </g>
    <ellipse cx="50" cy="24" rx="28" ry="6.5" fill="#f6f8fb" stroke="#aeb7c3" />
    <ellipse cx="50" cy="24" rx="22" ry="4" fill="#dfe4ea" />
  </svg>
)

const SOCIAL: Record<string, { bg: string; icon: React.ReactNode }> = {
  LinkedIn: { bg: "bg-[#0a66c2]", icon: <Linkedin fill="currentColor" strokeWidth={0} /> },
  GitHub: { bg: "bg-gradient-to-b from-[#2b2b2f] to-black", icon: <Github /> },
  Instagram: { bg: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]", icon: <Instagram /> },
}

export const SocialIcon = ({ name }: { name: string }) => (
  <div className={`grid h-full w-full place-items-center rounded-[22%] text-white ring-1 ring-white/25 [&>svg]:h-1/2 [&>svg]:w-1/2 ${SOCIAL[name].bg}`}>
    {SOCIAL[name].icon}
  </div>
)
