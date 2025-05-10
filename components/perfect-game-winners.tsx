"use client"

import { useEffect, useState } from "react"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Shield, Calendar } from "lucide-react"
import LoadingSpinner from "./loading-spinner"
import Link from "next/link"

interface PerfectGameWinner {
  name: string
  season: string
  seasonNumber: string
  age: number
  gender: string
  profession: string
  location: string
  juryVotes: number
  totalJury: number
}

export default function PerfectGameWinners() {
  const [winners, setWinners] = useState<PerfectGameWinner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [contestants, seasons] = await Promise.all([fetchContestants(), fetchSeasons()])

        // Find winners with perfect games (no votes against)
        const perfectGameWinners: PerfectGameWinner[] = []

        contestants.forEach((contestant) => {
          // Check if they won (finish = 1) and had zero votes against them
          if (contestant.finish === "1" && contestant.votes_against === "0") {
            const season = seasons.find((s) => s.num_season === contestant.num_season)

            if (season) {
              perfectGameWinners.push({
                name: contestant.contestant_name,
                season: season.season,
                seasonNumber: contestant.num_season,
                juryVotes: Number.parseInt(contestant.num_jury_votes || "0"),
                totalJury: Number.parseInt(season.num_jury || "0"),
              })
            }
          }
        })

        // Sort by season number (descending)
        perfectGameWinners.sort((a, b) => Number.parseInt(b.seasonNumber) - Number.parseInt(a.seasonNumber))

        setWinners(perfectGameWinners)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (winners.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>No perfect game winners found in the data.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {winners.map((winner) => (
          <Card
            key={`${winner.name}-${winner.seasonNumber}`}
            className="overflow-hidden border-survivor-beige hover:shadow-lg transition-shadow"
          >
            <div className="h-2 bg-survivor-orange w-full"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-survivor-brown">
                  <Link href={`/contestants/${encodeURIComponent(winner.name)}`} className="hover:underline">
                    {winner.name}
                  </Link>
                </CardTitle>
                <Badge className="bg-survivor-orange">Perfect Game</Badge>
              </div>
              <CardDescription>
                <Link href={`/seasons/${winner.seasonNumber}`} className="hover:underline flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {winner.season} (Season {winner.seasonNumber})
                </Link>
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-survivor-beige bg-opacity-30 pt-3 pb-3 flex justify-between">
              <div className="flex items-center gap-1 text-sm">
                <Trophy className="h-4 w-4 text-survivor-orange" />
                <span className="font-medium">
                  {winner.juryVotes}/{winner.totalJury} jury votes
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Shield className="h-4 w-4 text-survivor-green" />
                <span className="font-medium">0 votes against</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-survivor-orange" />
            What is a "Perfect Game"?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            In Survivor, a "Perfect Game" is achieved when a contestant wins the season without ever having a vote cast
            against them throughout the entire game, and then receives all jury votes at the Final Tribal Council. This
            is considered one of the most impressive feats in Survivor, as it demonstrates complete strategic, social,
            and physical dominance.
          </p>
          <p className="text-gray-700 mt-4">
            Some fans define a Perfect Game more strictly (requiring unanimous jury votes), while others use the broader
            definition of simply never receiving votes against. This visualization uses the broader definition: winners
            who never had a vote cast against them during their winning season.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
