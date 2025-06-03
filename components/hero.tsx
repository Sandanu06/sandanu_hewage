"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Sandanu Hewage
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300">Entrepreneur | Tech Enthusiast | Developer</h2>
            <p className="text-gray-400 max-w-lg">
              I'm a passionate innovator building solutions in tech and business. With expertise in AI, data analytics,
              and web development, I create impactful digital experiences that solve real problems.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-[#3498db] hover:bg-[#2980b9] text-white px-6 py-2 rounded-md transition-transform hover:scale-105"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white px-6 py-2 rounded-md transition-all duration-300"
                onClick={() => {
                  // Create a temporary link to download CV
                  const link = document.createElement("a")
                  link.href = "/cv/sandanu-hewage-cv.pdf" // You'll need to add your actual CV file
                  link.download = "Sandanu_Hewage_CV.pdf"
                  link.click()
                }}
              >
                Download CV <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#3498db] shadow-lg shadow-[#3498db]/20">
              <Image
                src="/placeholder.jpg?height=320&width=320"
                alt="Sandanu Hewage"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
