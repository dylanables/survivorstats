import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ComparisonTool from "@/components/comparison-tool"
import LoadingSpinner from "@/components/loading-spinner"

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Comparison Tool</h1>
        <p className="text-muted-foreground">Compare contestants or seasons side by side</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Tool</CardTitle>
          <CardDescription>Select contestants or seasons to compare</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <ComparisonTool />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
