import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function Projects() {
  return (
    <section id="projects" className="py-16 bg-[#1a2634]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">My Personal Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard
            title="Teczos Cloud"
            description="A software agency delivering innovative solutions for businesses across various industries."
            imageSrc="/teczos.png?height=200&width=350"
            link="https://teczos.cloud"
          />
          <ProjectCard
            title="Chairo Store"
            description="An e-commerce platform specializing in unique products with a seamless shopping experience."
            imageSrc="/chairo.png?height=200&width=350"
            link="https://chairo.store"
          />
          <ProjectCard
            title="Teczos AI"
            description="An AI agency powered by Teczos Cloud — transforming businesses with smart, practical AI solutions."
            imageSrc="/ai-teczos.png?height=200&width=350"
            link="https://ai.teczos.cloud"
          />
          <ProjectCard
            title="Portfolio Site for Pemitha Hansana"
            description="Portfolio web project for Pemitha Hansana"
            imageSrc="/pemitha.png?height=200&width=350"
            link="https://pemitha.me"
          />
          <ProjectCard
            title="Pet Store Management System"
            description="Made using PHP and Mongodb for Database."
            imageSrc="/pet-teczos.png?height=200&width=350"
            link="https://paws-shop.teczos.cloud/"
          />
          <ProjectCard
            title="DFNC Site"
            description="Web Site dedicated for a group of Best Friends."
            imageSrc="/dfnc.png?height=200&width=350"
            link="https://dfnc.pemitha.me"
          />
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  title,
  description,
  imageSrc,
  link,
}: {
  title: string
  description: string
  imageSrc: string
  link: string
}) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
      <div className="relative h-48 w-full">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <Button className="bg-[#3498db] hover:bg-[#2980b9] text-white transition-colors duration-300" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Project <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
