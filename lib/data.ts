export const me = {
  name: "Sandanu Hewage",
  role: "AI Developer",
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
]

export type Project = {
  id: string
  title: string
  description: string
  image: string
  link: string
  tags: string[]
  group: "Teczos" | "Personal"
  // desktop icon position, % of the viewport
  x: number
  y: number
}

export const projects: Project[] = [
  {
    id: "teczos",
    title: "Teczos Cloud",
    description: "A software agency delivering innovative solutions for businesses across various industries.",
    image: "/teczos.png",
    link: "https://teczos.cloud",
    tags: ["Agency", "Web"],
    group: "Teczos",
    x: 12, y: 10,
  },
  {
    id: "teczos-ai",
    title: "Teczos AI",
    description: "An AI agency powered by Teczos Cloud, transforming businesses with smart, practical AI solutions.",
    image: "/ai-teczos.png",
    link: "https://ai.teczos.cloud",
    tags: ["AI", "Agency"],
    group: "Teczos",
    x: 72, y: 8,
  },
  {
    id: "chairo",
    title: "Chairo Store",
    description: "An e-commerce platform specializing in unique products with a seamless shopping experience.",
    image: "/chairo.png",
    link: "https://chairo.store",
    tags: ["E-commerce", "Web"],
    group: "Personal",
    x: 84, y: 30,
  },
  {
    id: "pemitha",
    title: "Pemitha Hansana",
    description: "Portfolio website built for Pemitha Hansana.",
    image: "/pemitha.png",
    link: "https://pemitha.me",
    tags: ["Portfolio"],
    group: "Personal",
    x: 8, y: 34,
  },
  {
    id: "paws",
    title: "Pet Store System",
    description: "Pet store management system built with PHP and MongoDB.",
    image: "/pet-teczos.png",
    link: "https://paws-shop.teczos.cloud/",
    tags: ["PHP", "MongoDB"],
    group: "Teczos",
    x: 66, y: 56,
  },
  {
    id: "dfnc",
    title: "DFNC",
    description: "A website dedicated to a group of best friends.",
    image: "/dfnc.png",
    link: "https://dfnc.pemitha.me",
    tags: ["Web", "Community"],
    group: "Personal",
    x: 86, y: 58,
  },
]

export const skills = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "React"] },
  { group: "Backend & Cloud", items: ["Python", "PHP", "MongoDB", "Cloud"] },
  { group: "Craft", items: ["AI / ML", "Data Analytics", "Git"] },
]
