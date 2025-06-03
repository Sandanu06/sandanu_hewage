"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

interface NotificationProps {
  message: string
  type?: "success" | "error"
  isVisible: boolean
  onClose: () => void
}

export function Notification({ message, type = "success", isVisible, onClose }: NotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-6 py-4 shadow-lg ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {type === "success" ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <XCircle className="h-6 w-6" />
          )}
          <p className="font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 