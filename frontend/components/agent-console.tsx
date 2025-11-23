"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Terminal, ShieldCheck, AlertTriangle, Globe } from "lucide-react"

export default function AgentConsole() {
  const [activeNode, setActiveNode] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Glow effect behind console */}
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-50 blur-2xl" />

      {/* Console Window */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="ml-4 flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1 text-xs text-muted-foreground border border-slate-800 font-mono">
              <Globe className="h-3 w-3" />
              <span>agent-scan://target-site.com</span>
            </div>
          </div>
          <div className="text-xs font-mono text-primary animate-pulse">● LIVE SCAN</div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 grid gap-6 relative min-h-[300px]">
          {/* Radar Scan Line */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-10"
            animate={{ top: ["-100%", "100%"] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }}
            style={{ height: "50%", opacity: 0.3 }}
          />
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-primary/50 shadow-[0_0_10px_rgba(56,189,248,0.5)] z-20"
            animate={{ top: ["0%", "100%"] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }}
          />

          {/* Node Grid Visualization */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Navigation", icon: Globe, status: "secure" },
              { label: "Forms", icon: Terminal, status: "analyzing" },
              { label: "Security", icon: ShieldCheck, status: "secure" },
              { label: "Errors", icon: AlertTriangle, status: "warning" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`p-4 rounded-lg border ${activeNode === i ? "border-primary/50 bg-primary/5" : "border-slate-800 bg-slate-900/50"} transition-colors`}
                animate={{
                  scale: activeNode === i ? 1.02 : 1,
                  boxShadow: activeNode === i ? "0 0 15px rgba(56,189,248,0.1)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <item.icon className={`h-5 w-5 ${activeNode === i ? "text-primary" : "text-slate-500"}`} />
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.status === "secure"
                        ? "bg-green-500"
                        : item.status === "warning"
                          ? "bg-orange-500"
                          : "bg-primary animate-pulse"
                    }`}
                  />
                </div>
                <div className="text-sm font-medium text-slate-200">{item.label}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {activeNode === i ? "Scanning..." : item.status === "secure" ? "Passed" : "Issues Found"}
                </div>

                {/* Simulated Terminal Text */}
                {activeNode === i && (
                  <div className="mt-3 space-y-1">
                    <div className="h-1.5 w-3/4 rounded-full bg-slate-700/50" />
                    <div className="h-1.5 w-1/2 rounded-full bg-slate-700/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Log Output */}
          <div className="mt-auto font-mono text-xs text-slate-400 space-y-1 p-3 rounded bg-slate-950 border border-slate-900">
            <div className="flex gap-2">
              <span className="text-slate-600">00:01</span>
              <span className="text-green-400">✓</span>
              <span>GET /index.html 200 OK</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-600">00:02</span>
              <span className="text-primary">ℹ</span>
              <span>Found 14 interactive elements</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-600">00:03</span>
              <span className="text-yellow-400">⚠</span>
              <span>Injecting test payload...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
