"use client"

import { motion, useDragControls, useMotionValue } from "framer-motion"
import { useEffect, useRef, type RefObject } from "react"

export type Win = { id: string; title: string; w: number; h: number; x: number; y: number; min: boolean; max: boolean }

type Props = {
  win: Win
  z: number
  focused: boolean
  mobile: boolean
  bounds: RefObject<HTMLElement | null>
  onFocus: () => void
  onClose: () => void
  onMin: () => void
  onMax: () => void
  children: React.ReactNode
}

export function Window({ win, z, focused, mobile, bounds, onFocus, onClose, onMin, onMax, children }: Props) {
  const controls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const saved = useRef<[number, number]>([0, 0])
  const full = mobile || win.max

  const prev = useRef(false)
  useEffect(() => {
    if (full && !prev.current) {
      saved.current = [x.get(), y.get()]
      x.set(0)
      y.set(0)
    } else if (!full && prev.current) {
      x.set(saved.current[0])
      y.set(saved.current[1])
    }
    prev.current = full
  }, [full, x, y])
  const toggleMax = onMax

  return (
    <motion.div
      role="dialog"
      aria-label={win.title}
      aria-hidden={win.min}
      onPointerDown={onFocus}
      drag={!full}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      style={{
        x,
        y,
        zIndex: z,
        left: full ? 0 : win.x,
        top: full ? "calc(28px + env(safe-area-inset-top))" : win.y,
        width: full ? "100%" : win.w,
        height: full ? "calc(100% - 28px - 88px - env(safe-area-inset-top) - env(safe-area-inset-bottom))" : win.h,
        pointerEvents: win.min ? "none" : "auto",
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={win.min ? { opacity: 0, scale: 0.6, y: 200 } : { opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className={`absolute flex flex-col overflow-hidden bg-[#fbfbfd] text-neutral-900 ${
        full ? "rounded-none" : "rounded-xl"
      } ${focused ? "shadow-[0_30px_80px_-10px_rgba(0,0,0,.55)]" : "shadow-[0_12px_40px_-10px_rgba(0,0,0,.4)]"} ring-1 ring-black/15`}
    >
      <div
        onPointerDown={(e) => !full && controls.start(e)}
        onDoubleClick={() => !mobile && toggleMax()}
        className={`flex h-10 shrink-0 cursor-default select-none items-center gap-2 border-b border-black/5 pl-3.5 pr-3.5 ${
          focused ? "bg-[#ececf0]" : "bg-[#f4f4f6]"
        }`}
        style={{ touchAction: "none" }}
      >
        <div className="group flex items-center gap-2 max-md:gap-3" onPointerDown={(e) => e.stopPropagation()}>
          <Light color="#ff5f57" label="Close" onClick={onClose} on={focused} />
          <Light color="#febc2e" label="Minimize" onClick={onMin} on={focused} />
          {!mobile && <Light color="#28c840" label="Maximize" onClick={toggleMax} on={focused} />}
        </div>
        <span className={`flex-1 truncate pr-14 text-center text-[13px] font-medium ${focused ? "text-neutral-700" : "text-neutral-400"}`}>
          {win.title}
        </span>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </motion.div>
  )
}

const GLYPH: Record<string, React.ReactNode> = {
  Close: <path d="M3 3l6 6M9 3L3 9" />,
  Minimize: <path d="M2.5 6h7" />,
  Maximize: <path d="M3 3h4.2L3 7.2zM9 9H4.8L9 4.8z" fill="rgba(0,0,0,.55)" stroke="none" />,
}
const RING: Record<string, string> = { Close: "#e0443e", Minimize: "#d49a1c", Maximize: "#1fa92f" }

function Light({ color, label, onClick, on }: { color: string; label: string; onClick: () => void; on: boolean }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{ background: on ? color : "#d4d4d9", boxShadow: `inset 0 0 0 .5px ${on ? RING[label] : "#b8b8be"}` }}
      className="relative block h-3 w-3 shrink-0 rounded-full before:absolute before:-inset-1.5 before:content-[''] max-md:h-3.5 max-md:w-3.5"
    >
      <svg viewBox="0 0 12 12" className="absolute inset-0 h-full w-full stroke-black/55 opacity-0 group-hover:opacity-100" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {GLYPH[label]}
      </svg>
    </button>
  )
}
