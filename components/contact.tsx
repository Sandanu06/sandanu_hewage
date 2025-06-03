"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Notification } from "@/components/ui/notification"
import { LoadingSpinner } from "@/components/ui/loading"
import { useForm, ValidationError } from '@formspree/react'

export function Contact() {
  const [state, handleSubmit] = useForm("mgvvqoyk")
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await handleSubmit(e)
      
      if (state.succeeded) {
        setNotification({
          isVisible: true,
          message: "Thank you for your message! I'll get back to you soon.",
          type: "success",
        })
      }
    } catch (error) {
      setNotification({
        isVisible: true,
        message: "Something went wrong. Please try again later.",
        type: "error",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="contact" className="py-16 bg-[#1a2634]" suppressHydrationWarning>
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
            Get in Touch
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
            suppressHydrationWarning
          >
            <motion.p
              variants={itemVariants}
              className="text-gray-400 mb-4"
            >
              Have a project in mind or want to discuss potential opportunities?
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="bg-[#1e1e1e] rounded-lg p-4 inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[#3498db]">Let's create something amazing together!</p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            suppressHydrationWarning
          >
            <motion.div variants={itemVariants}>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {state.submitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center py-8"
                    >
                      <LoadingSpinner size="large" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full px-4 py-2 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200"
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full px-4 py-2 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200"
                        />
                        <ValidationError 
                          prefix="Email" 
                          field="email"
                          errors={state.errors}
                          className="text-red-500 text-sm mt-1"
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          className="w-full px-4 py-2 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200"
                        />
                        <ValidationError 
                          prefix="Message" 
                          field="message"
                          errors={state.errors}
                          className="text-red-500 text-sm mt-1"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Button
                          type="submit"
                          disabled={state.submitting}
                          className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white px-6 py-2 rounded-md transition-all duration-300 relative overflow-hidden group"
                        >
                          <motion.span
                            className="relative z-10"
                            animate={state.submitting ? { opacity: 0 } : { opacity: 1 }}
                          >
                            {state.submitting ? "Sending..." : "Send Message"}
                          </motion.span>
                          {state.submitting && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <LoadingSpinner size="small" />
                            </motion.div>
                          )}
                          <motion.div
                            className="absolute inset-0 bg-[#2980b9]"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-center space-y-8"
              suppressHydrationWarning
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 font-audyno">Contact Information</h3>
                <div className="space-y-4">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mail className="h-5 w-5 text-[#3498db]" />
                    <a href="mailto:contact@example.com" className="text-gray-300 hover:text-white transition-colors">
                      sandanumihisara06@gmail.com
                    </a>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Phone className="h-5 w-5 text-[#3498db]" />
                    <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">
                      +94 70 156 5452
                    </a>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="h-5 w-5 text-[#3498db]" />
                    <span className="text-gray-300">Colombo, Sri Lanka</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 font-audyno">Follow Me</h3>
                <div className="flex space-x-4">
                  <SocialLink
                    href="https://github.com/Sandanu06"
                    icon={<Github className="h-6 w-6" />}
                    label="GitHub"
                  />
                  <SocialLink
                    href="https://www.linkedin.com/in/sandanu-hewage-35761b295/"
                    icon={<Linkedin className="h-6 w-6" />}
                    label="LinkedIn"
                  />
                  <SocialLink
                    href="https://www.instagram.com/sandanu_hewage?igsh=N2dhbTRqMWcxYXc1"
                    icon={<Instagram className="h-6 w-6" />}
                    label="Instagram"
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
      />
    </section>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#1e1e1e] p-3 rounded-full text-gray-300 hover:text-white hover:bg-[#3498db] transition-colors duration-300"
      aria-label={label}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {icon}
    </motion.a>
  )
}
