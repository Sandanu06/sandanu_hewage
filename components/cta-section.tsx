"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const handleDownloadCV = () => {
    try {
      const link = document.createElement("a")
      link.href = "/Sandanu_Hewage_CV.pdf"
      link.download = "Sandanu_Hewage_CV.pdf"
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading CV:", error)
    }
  }

  const handleContactScroll = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="py-16 bg-gradient-to-r from-[#1a2634] to-[#2c3e50] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-[#3498db] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-[#2ecc71] rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#3498db] rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Next Project?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's collaborate and bring your ideas to life. Whether you need a full-stack developer, AI consultant, or a
            tech entrepreneur for your venture, I'm here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <CTACard
              icon={<MessageCircle className="h-8 w-8" />}
              title="Free Consultation"
              description="30-minute discovery call to discuss your project needs"
            />
            <CTACard
              icon={<ArrowRight className="h-8 w-8" />}
              title="Quick Response"
              description="Get a response within 24 hours for all inquiries"
            />
            <CTACard
              icon={<Download className="h-8 w-8" />}
              title="Detailed Proposal"
              description="Comprehensive project proposal with timeline and costs"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-[#3498db] hover:bg-[#2980b9] text-white px-8 py-3 rounded-md transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={handleContactScroll}
            >
              <Mail className="mr-2 h-5 w-5" />
              Start a Conversation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#2ecc71] text-[#2ecc71] hover:bg-[#2ecc71] hover:text-white px-8 py-3 rounded-md transition-all duration-300 hover:scale-105"
              onClick={handleDownloadCV}
            >
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>Available for freelance projects • Open to full-time opportunities • Remote & On-site</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTACard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#1e1e1e]/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:border-[#3498db]/50 transition-all duration-300">
      <div className="text-[#3498db] mb-3 flex justify-center">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
