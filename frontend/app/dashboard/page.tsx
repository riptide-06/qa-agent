import RunDashboard from "@/components/run-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Initialize Agent Scan</h1>
        <p className="text-muted-foreground">Configure your target and launch the autonomous exploration agent.</p>
      </div>
      <RunDashboard />
    </div>
  )
}
