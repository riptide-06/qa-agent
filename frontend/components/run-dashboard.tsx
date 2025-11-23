"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import AgentTimeline from "@/components/agent-timeline"
import RadarScanner from "@/components/radar-scanner"
import Link from "next/link"

export default function RunDashboard() {
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle")
  const [url, setUrl] = useState("")
  const [progress, setProgress] = useState(0)
  const [runId, setRunId] = useState<string | null>(null)
  const [resultSummary, setResultSummary] = useState<any>(null)
  const router = useRouter()

  const handleRun = async () => {
    if (!url) return
    setStatus("running")
    setProgress(0)

    try {
      const res = await fetch('http://localhost:8000/run-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, siteType: 'marketing' }),
      });
      if (!res.ok) throw new Error('Failed to start');
      const data = await res.json();
      setRunId(data.runId);
    } catch (e) {
      console.error(e);
      setStatus("idle");
      alert("Failed to start test. Is backend running?");
    }
  }

  // Poll for progress
  useEffect(() => {
    if (status === "running" && runId) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8000/result/${runId}`);
          const data = await res.json();

          if (data.status === 'completed') {
            setStatus("completed");
            setResultSummary(data.summary);
            setProgress(100);
            clearInterval(interval);
          } else if (data.status === 'error') {
            setStatus("idle");
            alert("Agent run failed");
            clearInterval(interval);
          } else {
            // Fake progress increment while running
            setProgress(p => Math.min(p + 1, 90));
          }
        } catch (e) {
          console.error(e);
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [status, runId])

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="border-4 border-white bg-card p-8 md:p-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
          {[1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex flex-col items-center gap-2 ${(step === 1 && status === "idle") ||
                  (step === 2 && status === "running") ||
                  (step === 3 && status === "completed")
                  ? ""
                  : "opacity-40"
                  }`}
              >
                <div
                  className={`h-12 w-12 border-2 flex items-center justify-center font-bold text-lg transition-all ${(step === 1 && status === "idle") ||
                    (step === 2 && status === "running") ||
                    (step === 3 && status === "completed")
                    ? "border-white bg-white text-black"
                    : "border-border bg-transparent"
                    }`}
                >
                  {step}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {step === 1 ? "Target" : step === 2 ? "Explore" : "Report"}
                </span>
              </div>
              {idx < 2 && <div className="h-0.5 w-16 md:w-32 bg-border mx-4"></div>}
            </div>
          ))}
        </div>

        {status === "idle" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-[1fr_250px]">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest">Website URL</label>
                <Input
                  placeholder="https://your-app.com"
                  className="h-14 bg-background border-2 border-border text-lg font-mono focus-visible:ring-0 focus-visible:border-white"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest">Site Type</label>
                <Select defaultValue="auto">
                  <SelectTrigger className="h-14 bg-background border-2 border-border font-mono">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-2 border-white">
                    <SelectItem value="auto">Auto Detect</SelectItem>
                    <SelectItem value="saas">SaaS Dashboard</SelectItem>
                    <SelectItem value="ecom">E-commerce</SelectItem>
                    <SelectItem value="marketing">Marketing Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-16 text-base font-bold uppercase tracking-wider bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all"
              onClick={handleRun}
              disabled={!url}
            >
              <Play className="mr-3 h-5 w-5" strokeWidth={2.5} />
              Launch QA Agent
            </Button>
            <p className="text-center text-xs uppercase tracking-wider text-muted-foreground border-t-2 border-border pt-6">
              Agent will explore up to 20 steps and generate detailed report
            </p>
          </motion.div>
        ) : status === "running" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center justify-between border-b-2 border-border pb-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
                  Agent Running
                </h3>
                <p className="text-sm font-mono text-muted-foreground">{url}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold font-mono">{progress}%</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Est. 12s</div>
              </div>
            </div>

            <div className="h-4 w-full border-2 border-border bg-background overflow-hidden">
              <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>

            <div className="grid md:grid-cols-[1fr_300px] gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest border-b-2 border-border pb-2">
                  Live Activity Log
                </h4>
                <AgentTimeline />
              </div>
              <div className="hidden md:block">
                <RadarScanner />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-8"
          >
            <div className="inline-flex h-24 w-24 items-center justify-center border-4 border-white bg-white text-black mb-4">
              <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold uppercase tracking-tight">Scan Complete</h2>
              <p className="text-muted-foreground font-medium">Found {resultSummary?.issues || 0} potential issues</p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-6">
              <Link href={`/report?runId=${runId}`}>
                <button className="h-14 px-8 bg-white text-black font-bold uppercase tracking-wider border-2 border-white transition-all hover:bg-black hover:text-white">
                  View Full Report
                </button>
              </Link>
              <button
                className="h-14 px-8 bg-transparent text-white font-bold uppercase tracking-wider border-2 border-white transition-all hover:bg-white hover:text-black"
                onClick={() => setStatus("idle")}
              >
                Run New Scan
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
