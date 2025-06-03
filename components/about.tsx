"use client"

import type React from "react"
import { Code, Database, Lightbulb, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function About() {
  return (
    <section id="about" className="py-16 bg-[#1a2634]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Me</h2>

        <div className="max-w-3xl mx-auto">
          <p className="text-gray-300 text-lg text-center mb-10">
            As a tech enthusiast and entrepreneur, I've founded ventures like Tezcos Cloud and Chairo Store. With a
            background in Computer Science, I specialize in AI, data analytics, and web development. My passion lies in
            creating innovative solutions that leverage cutting-edge technology to solve real-world problems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <HighlightCard
              icon={<Lightbulb className="h-10 w-10 text-[#3498db]" />}
              title="AI & Machine Learning Enthusiast"
              description="Passionate about developing intelligent systems that learn and adapt."
            />
            <HighlightCard
              icon={<Database className="h-10 w-10 text-[#3498db]" />}
              title="Data Analytics Expert"
              description="Transforming raw data into actionable insights and business intelligence."
            />
            <HighlightCard
              icon={<Code className="h-10 w-10 text-[#3498db]" />}
              title="Full-Stack Developer"
              description="Building end-to-end web applications with modern technologies."
            />
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white px-8 py-3 rounded-md transition-all duration-300"
              onClick={() => {
                const link = document.createElement("a")
                link.href = "/cv/sandanu-hewage-cv.pdf"
                link.download = "Sandanu_Hewage_CV.pdf"
                link.click()
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download My Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function HighlightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}
