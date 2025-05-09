import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SeasonsTable from "@/components/seasons-table"
import SeasonDemographics from "@/components/season-demographics"
import LoadingSpinner from "@/components/loading-spinner"

export default function SeasonsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Seasons</h1>
        <p className="text-muted-foreground">Explore data about all Survivor seasons.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Season Demographics</CardTitle>
          <CardDescription>Demographic breakdown across all seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SeasonDemographics />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Seasons</CardTitle>
          <CardDescription>Browse and compare all Survivor seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SeasonsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
