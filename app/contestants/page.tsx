import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ContestantsTable from "@/components/contestants-table"
import ContestantStats from "@/components/contestant-stats"
import LoadingSpinner from "@/components/loading-spinner"

export default function ContestantsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contestants</h1>
        <p className="text-muted-foreground">Explore data about Survivor contestants across all seasons.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LoadingSpinner />}>
          <ContestantStats />
        </Suspense>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contestants</CardTitle>
          <CardDescription>Browse and filter all Survivor contestants</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <ContestantsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
