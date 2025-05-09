import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContestants } from "@/lib/data"
import ContestantProfile from "@/components/contestant-profile"
import ContestantPerformance from "@/components/contestant-performance"
import LoadingSpinner from "@/components/loading-spinner"
import { notFound } from "next/navigation"

interface ContestantPageProps {
  params: {
    name: string
  }
}

export default async function ContestantPage({ params }: ContestantPageProps) {
  const { name } = params
  const decodedName = decodeURIComponent(name)

  const contestants = await fetchContestants()
  const contestant = contestants.find((c) => c.contestant_name.toLowerCase() === decodedName.toLowerCase())

  if (!contestant) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{contestant.contestant_name}</h1>
        <p className="text-muted-foreground">
          Season {contestant.num_season} • {contestant.finish === "1" ? "Winner" : `Placed ${contestant.finish}`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contestant Profile</CardTitle>
            <CardDescription>Personal information and background</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <ContestantProfile contestant={contestant} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Performance</CardTitle>
            <CardDescription>Statistics and game achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <ContestantPerformance contestant={contestant} allContestants={contestants} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Season Journey</CardTitle>
          <CardDescription>Contestant's path through the game</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <Suspense fallback={<LoadingSpinner />}>
            <ContestantPerformance contestant={contestant} allContestants={contestants} detailed />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
