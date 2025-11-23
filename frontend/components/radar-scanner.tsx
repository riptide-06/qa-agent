"use client"

import { motion } from "framer-motion"

export default function RadarScanner() {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-950/50">
      <div className="relative h-48 w-48 rounded-full border border-slate-800 bg-slate-900/30 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(30,41,59,0.5)_50%)]" />
        <div className="absolute inset-0 border-[0.5px] border-slate-800 rounded-full scale-[0.66]" />
        <div className="absolute inset-0 border-[0.5px] border-slate-800 rounded-full scale-[0.33]" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-800" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800" />

        {/* Scanner Line */}
        <motion.div
          className="absolute inset-0 origin-center bg-gradient-to-tr from-transparent via-primary/20 to-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)" }} // Roughly half circle or sector
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-primary origin-left shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Blips */}
        <motion.div
          className="absolute top-1/3 left-1/3 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.2 }}
        />
      </div>
      <div className="mt-4 text-center">
        <div className="text-xs font-mono text-primary animate-pulse">SCANNING ACTIVE</div>
        <div className="text-xs text-slate-500 mt-1">Target: 192.168.1.X</div>
      </div>
    </div>
  )
}
