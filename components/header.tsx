"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e1e1e] shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Sandanu Hewage
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#home">Home</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#1e1e1e] shadow-md md:hidden">
            <nav className="flex flex-col items-center py-4 space-y-4">
              <NavLink href="#home" onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink href="#about" onClick={() => setIsMenuOpen(false)}>
                About
              </NavLink>
              <NavLink href="#skills" onClick={() => setIsMenuOpen(false)}>
                Skills
              </NavLink>
              <NavLink href="#projects" onClick={() => setIsMenuOpen(false)}>
                Projects
              </NavLink>
              <NavLink href="#contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} className="text-white hover:text-[#3498db] transition-colors duration-300" onClick={onClick}>
      {children}
    </Link>
  )
}
