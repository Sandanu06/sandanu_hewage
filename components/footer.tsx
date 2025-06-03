import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#121212] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Link href="/" className="text-xl font-bold">
              Sandanu Hewage
            </Link>
          </div>

          <div className="flex space-x-6 mb-6">
            <a
              href="https://github.com/Sandanu06"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/sandanu-hewage-35761b295/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/sandanu_hewage?igsh=N2dhbTRqMWcxYXc1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <div className="text-gray-400 text-sm">© {new Date().getFullYear()} Sandanu Hewage. All rights reserved.
            
          </div>
        </div>
      </div>
    </footer>
  )
}
