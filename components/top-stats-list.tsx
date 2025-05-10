"use client"

import { useEffect, useState } from "react"
import { fetchContestants } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Briefcase } from "lucide-react"
import LoadingSpinner from "./loading-spinner"
import Link from "next/link"

interface TopProfession {
  profession: string
  count: number
}

interface TopWinner {
  name: string
  wins: number
  seasons: string[]
}

interface TopStatsListProps {
  type: "profession" | "winner"
  count?: number
}

export default function TopStatsList({ type, count = 5 }: TopStatsListProps) {
  const [topProfessions, setTopProfessions] = useState<TopProfession[]>([])
  const [topWinners, setTopWinners] = useState<TopWinner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const contestants = await fetchContestants()

        // Process top professions
        if (type === "profession") {
          const professionCounts: Record<string, number> = {}

          contestants.forEach((contestant) => {
            if (contestant.profession && contestant.profession.trim() !== "") {
              // Normalize profession names (remove extra spaces, make lowercase)
              const normalizedProfession = contestant.profession.trim().toLowerCase()

              // Skip generic or empty professions
              if (normalizedProfession === "n/a" || normalizedProfession === "unknown") {
                return
              }

              professionCounts[normalizedProfession] = (professionCounts[normalizedProfession] || 0) + 1
            }
          })

          // Sort and get top N professions
          const sortedProfessions = Object.entries(professionCounts)
            .map(([profession, count]) => ({
              profession: profession.charAt(0).toUpperCase() + profession.slice(1), // Capitalize first letter
              count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, count)

          setTopProfessions(sortedProfessions)
        }

        // Process top winners
        if (type === "winner") {
          const winnerCounts: Record<string, { count: number; seasons: string[] }> = {}

          contestants.forEach((contestant) => {
            if (contestant.finish === "1") {
              if (!winnerCounts[contestant.contestant_name]) {
                winnerCounts[contestant.contestant_name] = { count: 0, seasons: [] }
              }
              winnerCounts[contestant.contestant_name].count += 1
              winnerCounts[contestant.contestant_name].seasons.push(contestant.num_season)
            }
          })

          // Sort and get top N winners
          const sortedWinners = Object.entries(winnerCounts)
            .map(([name, data]) => ({
              name,
              wins: data.count,
              seasons: data.seasons,
            }))
            .sort((a, b) => b.wins - a.wins)
            .slice(0, count)

          setTopWinners(sortedWinners)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [type, count])

  if (loading) {
    return <LoadingSpinner />
  }

  // Render based on type
  if (type === "profession") {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-survivor-brown" />
            Top {count} Professions
          </CardTitle>
          <CardDescription>Most common contestant occupations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProfessions.map((profession, index) => (
              <div key={profession.profession} className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-survivor-beige text-survivor-brown font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{profession.profession}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-survivor-brown">{profession.count}</div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-survivor-brown"
                    style={{
                      width: `${(profession.count / topProfessions[0].count) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Winner type
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-survivor-orange" />
          Top {count} Winners
        </CardTitle>
        <CardDescription>Contestants with the most wins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topWinners.map((winner, index) => (
            <div key={winner.name} className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-survivor-beige text-survivor-orange font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <Link
                      href={`/contestants/${encodeURIComponent(winner.name)}`}
                      className="font-medium hover:underline text-survivor-brown"
                    >
                      {winner.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Seasons: {winner.seasons.join(", ")}</p>
                  </div>
                </div>
                <div className="font-semibold text-survivor-orange">
                  {winner.wins} {winner.wins === 1 ? "win" : "wins"}
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-survivor-orange"
                  style={{
                    width: `${(winner.wins / topWinners[0].wins) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
