import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContestants, fetchSeasons, fetchTribes } from "@/lib/data"
import SeasonProfile from "@/components/season-profile"
import SeasonContestants from "@/components/season-contestants"
import SeasonTribes from "@/components/season-tribes"
import LoadingSpinner from "@/components/loading-spinner"
import { notFound } from "next/navigation"

interface SeasonPageProps {
  params: {
    id: string
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { id } = params

  const seasons = await fetchSeasons()
  const season = seasons.find((s) => s.num_season === id)

  if (!season) {
    notFound()
  }

  const contestants = await fetchContestants()
  const tribes = await fetchTribes()

  const seasonContestants = contestants.filter((c) => c.num_season === id)
  const seasonTribes = tribes.filter((t) => t.num_season === id)

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{season.season}</h1>
        <p className="text-muted-foreground">
          {season.num_contestants} Contestants • {season.num_days} Days • Winner: {season.winner}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Season Overview</CardTitle>
            <CardDescription>Key information and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <SeasonProfile season={season} contestants={seasonContestants} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tribes</CardTitle>
            <CardDescription>Tribe composition and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <SeasonTribes tribes={seasonTribes} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contestants</CardTitle>
          <CardDescription>All contestants from this season</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SeasonContestants contestants={seasonContestants} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
