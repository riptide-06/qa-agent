"use client"
import { ArrowRight, FileText } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 border-b-4 border-white">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-12"
          >
            {/* Status badge */}
            <div className="inline-flex items-center border-2 border-white bg-white px-4 py-2 text-sm font-bold uppercase tracking-wider text-black">
              <span className="flex h-2 w-2 bg-black mr-3"></span>
              v2.0 Agent Live
            </div>

            {/* Main heading */}
            <h1 className="text-7xl md:text-8xl xl:text-9xl font-bold tracking-tighter leading-none uppercase">
              Break Your
              <br />
              Site Before
              <br />
              <span className="relative inline-block mt-2">
                Users Do
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white"></div>
              </span>
            </h1>

            {/* Description */}
            <div className="max-w-xl border-l-4 border-white pl-6">
              <p className="text-xl font-medium leading-relaxed text-muted-foreground">
                Autonomous QA agent that crawls, clicks, fills forms, and returns comprehensive bug reports. Zero script
                writing required.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="group h-14 px-8 bg-white text-black font-bold uppercase tracking-wider border-2 border-white transition-all hover:bg-black hover:text-white text-sm flex items-center gap-3">
                  Run QA Scan
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </button>
              </Link>
              <Link href="/report">
                <button className="h-14 px-8 bg-black text-white font-bold uppercase tracking-wider border-2 border-white transition-all hover:bg-white hover:text-black text-sm flex items-center gap-3">
                  <FileText className="h-5 w-5" strokeWidth={2.5} />
                  Sample Report
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-8 border-t-2 border-border">
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground mt-1">Dev Teams</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-4xl font-bold">10K+</div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground mt-1">Tests Run</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Info boxes */}
            <div className="border-2 border-white bg-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Live Status</div>
                <div className="h-3 w-3 bg-white"></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm font-mono">Navigation Tests</span>
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm font-mono">Form Validation</span>
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm font-mono">Security Checks</span>
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-mono">Error Detection</span>
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div className="border-2 border-white bg-white text-black p-6 space-y-3">
              <div className="text-xs uppercase tracking-widest font-bold">Key Features</div>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 bg-black flex-shrink-0"></span>
                  <span>Autonomous crawling and interaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 bg-black flex-shrink-0"></span>
                  <span>Comprehensive bug reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 bg-black flex-shrink-0"></span>
                  <span>Real-time monitoring dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 bg-black flex-shrink-0"></span>
                  <span>Zero configuration required</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
