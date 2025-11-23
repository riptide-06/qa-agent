import Link from "next/link"
import { Terminal } from "lucide-react"

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-4 border-white bg-black">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center bg-white text-black transition-all group-hover:bg-muted">
            <Terminal className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tighter text-2xl uppercase">QA Agent™</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="#"
            className="text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-muted-foreground"
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-muted-foreground"
          >
            About
          </Link>
          <div className="h-10 w-px bg-border" />
          <Link
            href="#"
            className="border-2 border-white bg-white px-6 py-2 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  )
}
