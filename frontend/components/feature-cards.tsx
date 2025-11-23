"use client"

import { motion } from "framer-motion"
import { MousePointerClick, FileText, Zap, ShieldAlert } from "lucide-react"

const features = [
  {
    icon: MousePointerClick,
    title: "Clicks Navigation",
    description: "Agent explores sitemap, clicking menus and links like a real user.",
  },
  {
    icon: Zap,
    title: "Tests Forms",
    description: "Automatically fills inputs, submits forms, verifies validation logic.",
  },
  {
    icon: ShieldAlert,
    title: "Detects Errors",
    description: "Flags 404s, 500s, console errors, and broken layouts instantly.",
  },
  {
    icon: FileText,
    title: "Generates Reports",
    description: "Comprehensive breakdown with reproduction steps and screenshots.",
  },
]

export default function FeatureCards() {
  return (
    <section className="py-24 border-b-4 border-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-6">How It Works</h2>
          <div className="h-1 w-32 bg-white"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group border-2 border-white bg-card p-8 hover:bg-white hover:text-black transition-all"
            >
              <div className="mb-6 inline-flex items-center justify-center h-16 w-16 border-2 border-white bg-black text-white group-hover:bg-white group-hover:border-black group-hover:text-black transition-all">
                <feature.icon className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="mb-3 text-xl font-bold uppercase tracking-tight">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-black/70">
                {feature.description}
              </p>
              <div className="mt-6 h-0.5 w-12 bg-white group-hover:bg-black transition-all"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
