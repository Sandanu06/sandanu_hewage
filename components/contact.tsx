"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("https://formspree.io/f/mgvvqoyk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Thank you for your message! I'll get back to you soon.")
        setFormData({ name: "", email: "", message: "" })
      } else {
        alert("Oops! Something went wrong. Please try again later.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <section id="contact" className="py-16 bg-[#2a2a2a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Let's Connect</h2>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-300 text-lg mb-4">
              Interested in collaborating? Have a project in mind? Let's make it happen!
            </p>
            <div className="bg-[#1e1e1e] rounded-lg p-4 inline-block">
              <p className="text-[#3498db] font-semibold">🚀 Currently accepting new projects</p>
              <p className="text-sm text-gray-400">Response time: Within 24 hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-[#1e1e1e] border-gray-700 text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[#1e1e1e] border-gray-700 text-white"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-[#1e1e1e] border-gray-700 text-white min-h-[150px]"
                    placeholder="Your message here..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white transition-colors duration-300"
                >
                  Send Message
                </Button>
              </form>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-[#3498db] mr-3" />
                    <a href="mailto:me@example.com" className="text-gray-300 hover:text-white">
                      sandanumihisara06@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                <div className="flex space-x-4">
                  <SocialLink href="https://github.com/Sandanu06" icon={<Github />} label="GitHub" />
                  <SocialLink href="https://www.linkedin.com/in/sandanu-hewage-35761b295/" icon={<Linkedin />} label="LinkedIn" />
                  <SocialLink href="https://www.instagram.com/sandanu_hewage?igsh=N2dhbTRqMWcxYXc1" icon={<Instagram />} label="Instagram" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#1e1e1e] p-3 rounded-full text-gray-300 hover:text-white hover:bg-[#3498db] transition-colors duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  )
}
