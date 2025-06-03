"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Code2, Rocket, Lightbulb } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading"

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
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
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="about" className="py-16 md:py-24" suppressHydrationWarning>
      <div className="container mx-auto px-4" suppressHydrationWarning>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
          suppressHydrationWarning
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12 font-audyno"
          >
            About Me
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="space-y-6 text-gray-400"
            suppressHydrationWarning
          >
            <motion.p
              variants={itemVariants}
              className="text-lg"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              I'm a passionate full-stack developer with a keen eye for creating elegant solutions to complex problems.
              With expertise in modern web technologies and a strong foundation in software engineering principles,
              I strive to build applications that are not only functional but also delightful to use.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              My journey in tech has been driven by a constant desire to learn and innovate. I believe in writing
              clean, maintainable code and creating user experiences that make a difference. When I'm not coding,
              you can find me exploring new technologies, contributing to open-source projects, or sharing my
              knowledge with the developer community.
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4"
            suppressHydrationWarning
          >
            <HighlightCard
              icon={<Code2 className="h-8 w-8 text-[#3498db]" />}
              title="Clean Code"
              description="Writing maintainable and efficient code that scales"
            />
            <HighlightCard
              icon={<Rocket className="h-8 w-8 text-[#3498db]" />}
              title="Fast Delivery"
              description="Quick turnaround times without compromising quality"
            />
            <HighlightCard
              icon={<Lightbulb className="h-8 w-8 text-[#3498db]" />}
              title="Innovation"
              description="Creative solutions to complex problems"
            />
          </motion.div>
        </motion.div>
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
    <motion.div
      className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <motion.h3
          className="text-xl font-semibold mb-2 font-audyno"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-gray-400"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  )
}
