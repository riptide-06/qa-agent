import HeroSection from "@/components/hero-section"
import FeatureCards from "@/components/feature-cards"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureCards />

      <footer className="py-12 border-t-4 border-white mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Copyright</div>
              <p className="font-bold">© 2025 QA Agent™</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Contact</div>
              <p className="font-mono text-sm">hello@qaagent.dev</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Location</div>
              <p className="font-medium">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
