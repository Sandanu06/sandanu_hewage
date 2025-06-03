"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" suppressHydrationWarning>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-tr from-[#232526] via-[#414345] to-[#232526] bg-[length:400%_400%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        suppressHydrationWarning
      />
      <div className="container mx-auto px-4" suppressHydrationWarning>
        <motion.div
          className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          suppressHydrationWarning
        >
          <motion.div
            className="md:w-5/12 flex justify-center order-2 md:order-1"
            variants={imageVariants}
            suppressHydrationWarning
          >
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#3498db] shadow-lg shadow-[#3498db]/20"
              animate={floatingAnimation}
              suppressHydrationWarning
            >
              <Image
                src="/placeholder.jpg?height=320&width=320"
                alt="Sandanu Hewage"
                fill
                className="object-cover"
                priority
              />
              {/* Animated glowing border */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(52, 152, 219, 0.4)",
                    "0 0 0 20px rgba(52, 152, 219, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                suppressHydrationWarning
              />
            </motion.div>
          </motion.div>
          <motion.div 
            className="md:w-7/12 space-y-8 order-1 md:order-2" 
            variants={itemVariants} 
            suppressHydrationWarning
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-4 font-audyno"
            >
              Hi, I'm <span className="text-[#3498db]">Sandanu</span>
            </motion.h1>
            <motion.h2
              variants={itemVariants}
              className="text-2xl md:text-3xl text-gray-400 mb-6 font-audyno"
            >
              Full Stack Developer & AI Researcher
            </motion.h2>
            <motion.p
              className="text-gray-400 max-w-lg text-lg"
              variants={itemVariants}
            >
              I'm a passionate innovator building solutions in tech and business. With expertise in AI, data analytics,
              and web development, I create impactful digital experiences that solve real problems.
            </motion.p>
            <motion.div
              className="pt-4 flex flex-col sm:flex-row gap-6"
              variants={itemVariants}
              suppressHydrationWarning
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white px-8 py-3 rounded-md transition-transform hover:scale-105 text-lg"
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white px-8 py-3 rounded-md transition-all duration-300 text-lg"
                  onClick={handleDownloadCV}
                >
                  Download CV <Download className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
