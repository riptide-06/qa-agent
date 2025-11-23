"use client"

import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

type Log = {
  id: number
  message: string
  type: "info" | "success" | "warning"
  time: string
}

const steps: Log[] = [
  { id: 1, message: "Connected to target host", type: "success", time: "00:01" },
  { id: 2, message: "Scanning navigation structure", type: "info", time: "00:03" },
  { id: 3, message: "Visited /pricing page", type: "success", time: "00:08" },
  { id: 4, message: "Form input detected on /contact", type: "info", time: "00:12" },
  { id: 5, message: "Slow response on /api/users (>500ms)", type: "warning", time: "00:15" },
]

export default function AgentTimeline() {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []

    steps.forEach((step, index) => {
      const id = setTimeout(() => {
        setLogs((prev) => [step, ...prev])
      }, index * 1500)
      timeoutIds.push(id)
    })

    return () => timeoutIds.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative border-l border-slate-800 ml-3 space-y-6 h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {logs.map((log) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative pl-6"
        >
          <span
            className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 ${
              log.type === "success"
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                : log.type === "warning"
                  ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  : "bg-blue-500"
            }`}
          />
          <div className="flex items-start justify-between rounded-md border border-slate-800 bg-slate-900/50 p-3 text-sm">
            <div className="flex gap-3">
              {log.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              ) : log.type === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
              ) : (
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
              )}
              <span className="text-slate-300">{log.message}</span>
            </div>
            <span className="font-mono text-xs text-slate-500">{log.time}</span>
          </div>
        </motion.div>
      ))}
      {logs.length === 0 && (
        <div className="pl-6 text-sm text-slate-600 animate-pulse">Initializing agent protocol...</div>
      )}
    </div>
  )
}
