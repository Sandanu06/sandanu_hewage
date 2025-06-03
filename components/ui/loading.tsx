"use client"

import { motion } from "framer-motion"

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/80 backdrop-blur-sm">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-16 w-16 rounded-full border-4 border-[#3498db] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#3498db] border-r-transparent"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  )
}

export function LoadingSpinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-[#3498db] border-t-transparent`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export function LoadingDots() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="h-2 w-2 rounded-full bg-[#3498db]"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
} 