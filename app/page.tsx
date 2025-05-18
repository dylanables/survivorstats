import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardStats from "@/components/dashboard-stats"
import DemographicsChart from "@/components/demographics-chart"
import WinnersTimeline from "@/components/winners-timeline"
import SeasonComparisonChart from "@/components/season-comparison-chart"
import LoadingSpinner from "@/components/loading-spinner"
import SeasonProfile from "@/components/season-profile"
import DemographicsSection from "@/components/demographics-section"
import SeasonPage from "./seasons/[id]/page"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import { notFound } from "next/navigation"
import PerfectGameWinners from "@/components/perfect-game-winners"
import ContestantScatter from "@/components/contestant-scatter"

export default async function Home() {

  const current_season = "43"

  const seasons = await fetchSeasons()
  const season = seasons.find((s) => s.num_season === current_season)

  if (!season) {
    notFound()
  }

  const contestants = await fetchContestants()
  const seasonContestants = contestants.filter((c) => c.num_season === current_season)


  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Survivor Stats Dashboard</h1>
        <p className="text-muted-foreground">Explore statistics and data visualizations from the TV show Survivor.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-survivor-beige">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="current_season">Current Season</TabsTrigger>
          <TabsTrigger value="winners">Winners</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardStats />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Contestant Demographics</CardTitle>
                <CardDescription>Breakdown of contestant demographics across all seasons</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <DemographicsChart type="gender" />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Play Style</CardTitle>
                <CardDescription>Plot of votes cast against each contestant and their normalized finish. Indicates whether the contestant played under the radar or choatic.</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <ContestantScatter type="votesAgainstNormalizedFinish" />
                </Suspense>
              </CardContent>
            </Card>
          </div>

            <div>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Season Comparison</CardTitle>
                <CardDescription>Compare key metrics across different seasons</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <SeasonComparisonChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <DemographicsSection />
        </TabsContent>

        <TabsContent value="current_season" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Season</CardTitle>
                <CardDescription>Gender breakdown of contestants</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <SeasonProfile season={season} contestants={seasonContestants} />
                </Suspense>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="winners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Winners Timeline</CardTitle>
              <CardDescription>Timeline of Survivor winners across all seasons</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <WinnersTimeline />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Perfect Game Winners</CardTitle>
              <CardDescription>Winners who did not have a vote against them</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <PerfectGameWinners />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
