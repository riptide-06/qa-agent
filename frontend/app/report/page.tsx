import { Suspense } from "react"
import ReportView from "@/components/report-view"

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Suspense fallback={<div>Loading report...</div>}>
        <ReportView />
      </Suspense>
    </div>
  )
}
