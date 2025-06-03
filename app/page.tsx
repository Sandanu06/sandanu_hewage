import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CTASection } from "@/components/cta-section"
import { FloatingCTA } from "@/components/floating-cta"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CTASection />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}
