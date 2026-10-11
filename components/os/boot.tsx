"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

// Startup screen, shown once per browser session.
export function Boot() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    let seen = false
    try {
      seen = !!sessionStorage.getItem("booted")
      sessionStorage.setItem("booted", "1")
    } catch {}
    const quick = seen || matchMedia("(prefers-reduced-motion: reduce)").matches
    const t = setTimeout(() => setOn(false), quick ? 0 : 2000)
    return () => clearTimeout(t)
  }, [])
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] grid place-items-center bg-[#050510]"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <Image src="/logo-mark.png" alt="" width={88} height={88} priority />
            </motion.div>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full rounded-full bg-white" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.7, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
