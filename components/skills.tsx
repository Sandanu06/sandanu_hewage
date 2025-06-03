import type React from "react"
import { Braces, Database, FileCode, Github, Globe, LayoutGrid, Server, Terminal, Wand2 } from "lucide-react"

export function Skills() {
  return (
    <section id="skills" className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Skills</h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <SkillBadge icon={<Globe />} name="HTML" />
            <SkillBadge icon={<LayoutGrid />} name="CSS" />
            <SkillBadge icon={<Braces />} name="JavaScript" />
            <SkillBadge icon={<FileCode />} name="React" />
            <SkillBadge icon={<Server />} name="Cloud" />
            <SkillBadge icon={<Terminal />} name="Python" />
            <SkillBadge icon={<Github />} name="Git" />
            <SkillBadge icon={<Wand2 />} name="AI/ML" />
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillBadge({ icon, name }: { icon: React.ReactNode; name: string }) {
  return (
    <div className="bg-[#1e1e1e] rounded-full p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#2a2a2a] transition-all duration-300 hover:scale-105 aspect-square">
      <div className="text-[#3498db] mb-2">{icon}</div>
      <span className="font-medium">{name}</span>
    </div>
  )
}
