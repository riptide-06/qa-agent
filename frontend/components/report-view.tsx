"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Download, Copy, AlertOctagon, AlertTriangle, Info, Loader2 } from "lucide-react"

export default function ReportView() {
  const searchParams = useSearchParams()
  const runId = searchParams.get('runId')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!runId) return;
    fetch(`http://localhost:8000/result/${runId}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [runId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    )
  }

  if (!data || !data.issues) {
    return <div className="text-center py-20 text-white">No report data found.</div>
  }

  const issues = data.issues.map((issue: any) => ({
    id: issue.id,
    severity: issue.severity,
    title: issue.type,
    path: issue.url,
    repro: issue.steps,
    expected: issue.expected,
    actual: issue.observed
  }));
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-white bg-card p-8 md:p-12"
      >
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">QA Report Generated</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Scan Result</h1>
            <div className="flex items-center gap-6 text-sm font-mono">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-white"></span>
                Completed
              </span>
              <span>|</span>
              <span>{issues.length} issues found</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t-2 border-border pt-6">
            <div className="border-2 border-white bg-white text-black px-4 py-2 font-bold uppercase text-sm">
              {data.summary?.high || 0} High
            </div>
            <div className="border-2 border-white px-4 py-2 font-bold uppercase text-sm">{data.summary?.medium || 0} Medium</div>
            <div className="border-2 border-border px-4 py-2 font-bold uppercase text-sm">{data.summary?.low || 0} Low</div>
          </div>

          <div className="flex items-center gap-4 border-t-2 border-border pt-6">
            <button className="h-12 px-6 bg-white text-black font-bold uppercase tracking-wider text-sm border-2 border-white transition-all hover:bg-black hover:text-white flex items-center gap-2">
              <Download className="h-4 w-4" strokeWidth={2.5} /> Download
            </button>
            <button className="h-12 px-6 bg-transparent text-white font-bold uppercase tracking-wider text-sm border-2 border-white transition-all hover:bg-white hover:text-black flex items-center gap-2">
              <Copy className="h-4 w-4" strokeWidth={2.5} /> Share
            </button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {issues.map((issue, index) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-2 border-white bg-card p-8 hover:bg-white hover:text-black group transition-all"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className={`h-12 w-12 border-2 flex items-center justify-center flex-shrink-0 ${issue.severity === "high"
                    ? "border-white bg-white text-black group-hover:bg-black group-hover:text-white"
                    : "border-white group-hover:border-black"
                    }`}
                >
                  {issue.severity === "high" ? (
                    <AlertOctagon className="h-6 w-6" strokeWidth={2.5} />
                  ) : issue.severity === "medium" ? (
                    <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
                  ) : (
                    <Info className="h-6 w-6" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{issue.title}</h3>
                    <span className="text-xs font-mono border border-border px-2 py-1 whitespace-nowrap group-hover:border-black">
                      {issue.path}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pl-16 border-t-2 border-border pt-6 group-hover:border-black">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-black">
                    Reproduction Steps
                  </h4>
                  <ol className="list-decimal list-inside text-sm space-y-2 font-medium">
                    {issue.repro.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 group-hover:text-black">
                      Expected
                    </h4>
                    <p className="text-sm font-medium">{issue.expected}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 group-hover:text-black">
                      Actual
                    </h4>
                    <p className="text-sm font-bold">{issue.actual}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
