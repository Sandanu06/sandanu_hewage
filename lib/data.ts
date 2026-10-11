export const me = {
  name: "Sandanu Hewage",
  role: "AI Developer & Full Stack Developer",
  email: "sandanuhewage1@gmail.com",
  bio: [
    "I'm an AI developer building practical solutions in tech and business. With a background in machine learning, data analytics and full-stack web development, I turn real problems into products that work.",
    "I care about elegant, maintainable code and interfaces that feel effortless. I run Teczos Cloud, a software agency, and ship products from storefronts to AI tooling.",
  ],
  cv: "/CV-Sandanu_Hewage.pdf",
}

export const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/sandanu-hewage-35761b295/" },
  { name: "GitHub", href: "https://github.com/Sandanu06" },
  { name: "Instagram", href: "https://www.instagram.com/sandanu_hewage?igsh=N2dhbTRqMWcxYXc1" },
  { name: "X", href: "https://x.com/Sandanu06" },
  { name: "YouTube", href: "http://www.youtube.com/@sandanumihisara4323" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=100073367975431&mibextid=ZbWKwL" },
  { name: "Telegram", href: "https://t.me/sandanu06" },
  { name: "Discord", href: "https://discord.com/invite/uDkKBnUB" },
  { name: "Medium", href: "https://medium.com/@sandanumihisara06" },
  { name: "Reddit", href: "https://www.reddit.com/user/Sandanu_Hewage/" },
  { name: "Spotify", href: "https://open.spotify.com/user/31wzhe563h5m7bspirq45xiiivfu" },
  { name: "Steam", href: "https://steamcommunity.com/profiles/76561199321509656" },
  { name: "Google Cloud Skills", href: "https://www.cloudskillsboost.google/public_profiles/69bec604-d9fb-4b7f-8eaf-43e3ed27ce1b" },
  { name: "Google Developer", href: "https://g.dev/sandanuhewage" },
]

// shown in the dock; everything else lives in the Connect app
export const dockSocials = socials.slice(0, 3)

export type Project = {
  id: string
  title: string
  description: string
  image: string
  link: string
  tags: string[]
  icon?: string
}

export const projects: Project[] = [
  {
    id: "teczos",
    title: "Teczos",
    description: "Software products and engineering for ambitious teams: POS, ERP, bookings, scanning, bookkeeping and AI agents, built to work together.",
    image: "/projects/teczos-com.png",
    link: "https://teczos.com",
    tags: ["Company", "Web"],
    icon: "/dock/teczos.png",
  },
  {
    id: "one",
    title: "Teczos One",
    description: "Invoicing and CRM platform. Run your whole business in one place.",
    image: "/projects/one.png",
    link: "https://one.teczos.com",
    tags: ["Invoicing", "CRM"],
    icon: "/dock/teczos-one.png",
  },
  {
    id: "scan",
    title: "Teczos Scan",
    description: "Scan QR codes and barcodes quickly and reliably, built for stock, tickets and checkouts.",
    image: "/projects/scan.png",
    link: "https://scan.teczos.com",
    tags: ["QR", "Barcode"],
  },
  {
    id: "pos",
    title: "Teczos POS",
    description: "A point-of-sale system for fast, modern retail checkouts.",
    image: "/projects/pos.png",
    link: "https://pos.teczos.com",
    tags: ["POS", "Retail"],
  },
  {
    id: "bookkeep",
    title: "Teczos Bookkeep",
    description: "A bookkeeping system that keeps your accounts simple and accurate.",
    image: "/projects/bookkeep.png",
    link: "https://bookkeep.teczos.com",
    tags: ["Accounting"],
  },
  {
    id: "bms",
    title: "Teczos BMS",
    description: "A business management system that brings everything into one platform.",
    image: "/projects/bms.png",
    link: "https://bms.teczos.com",
    tags: ["ERP", "All-in-one"],
  },
]

export function webInfo(url: string) {
  const project = projects.find((p) => p.link === url)
  const social = socials.find((s) => s.href === url)
  let host = url
  try {
    host = new URL(url).hostname.replace(/^www\./, "")
  } catch {}
  return { url, host, project, social, title: project?.title ?? social?.name ?? host }
}

export const skills = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "React"] },
  { group: "Backend & Cloud", items: ["Python", "PHP", "MongoDB", "Cloud"] },
  { group: "Craft", items: ["AI / ML", "Data Analytics", "Git"] },
]
