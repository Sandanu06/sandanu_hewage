"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, PhoneCall } from "lucide-react"

export function FloatingCTA() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const phoneNumber = "+94701565452"

  useEffect(() => {
    setMounted(true)
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setIsExpanded(false)
      }
    }

    toggleVisibility() // Check initial scroll position
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && isVisible && (
        <div className="bg-[#1e1e1e] rounded-lg p-4 shadow-xl border border-gray-700 mb-2 max-w-xs animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-sm">Let's work together!</h4>
            <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Ready to discuss your project? Get in touch for a free consultation.
          </p>
          <div className="space-y-2">
            <Button 
              size="sm" 
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" 
              onClick={() => window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button 
              size="sm" 
              className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white"
              onClick={() => window.open(`tel:${phoneNumber}`, '_blank')}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      )}

      {isVisible && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-12 h-12 bg-[#3498db] hover:bg-[#2980b9] shadow-lg flex items-center justify-center animate-in fade-in slide-in-from-bottom-5"
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <PhoneCall className="h-6 w-6" />
          )}
        </Button>
      )}
    </div>
  )
}
