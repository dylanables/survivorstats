"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Contestant } from "@/lib/types"
import { getContestantStats } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

interface ContestantPerformanceProps {
  contestant: Contestant
  allContestants: Contestant[]
  detailed?: boolean
}

export default function ContestantPerformance({
  contestant,
  allContestants,
  detailed = false,
}: ContestantPerformanceProps) {
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Calculate contestant stats
    const contestantStats = getContestantStats(contestant, allContestants)
    setStats(contestantStats)

    // Prepare chart data
    if (detailed) {
      const data = [
        {
          name: "Finish",
          value: Number(contestant.normalized_finish) * 100,
          fill: "#2D5F3E",
        },
        {
          name: "Merge",
          value: contestant.merge ? 100 : 0,
          fill: "#D2691E",
        },
        {
          name: "Jury",
          value: contestant.jury ? 100 : 0,
          fill: "#8B4513",
        },
        {
          name: "FTC",
          value: contestant.ftc ? 100 : 0,
          fill: "#F0E68C",
        },
      ]
      setChartData(data)
    }
  }, [contestant, allContestants, detailed])

  if (!stats) {
    return <div>Loading stats...</div>
  }

  if (detailed) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Game Milestones</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Made Merge</span>
                <span>{contestant.merge ? "Yes" : "No"}</span>
              </div>
              <Progress value={contestant.merge ? 100 : 0} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Made Jury</span>
                <span>{contestant.jury ? "Yes" : "No"}</span>
              </div>
              <Progress value={contestant.jury ? 100 : 0} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Made Final Tribal</span>
                <span>{contestant.ftc ? "Yes" : "No"}</span>
              </div>
              <Progress value={contestant.ftc ? 100 : 0} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Won Season</span>
                <span>{contestant.finish === "1" ? "Yes" : "No"}</span>
              </div>
              <Progress value={contestant.finish === "1" ? 100 : 0} className="h-2" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Game Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Bar dataKey="value" name="Achievement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {contestant.quit || contestant.evac || contestant.ejected ? (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Exit Information</h3>
            <div className="p-4 bg-survivor-beige rounded-md">
              {contestant.quit ? (
                <p className="text-survivor-brown">This contestant quit the game.</p>
              ) : contestant.evac ? (
                <p className="text-survivor-brown">This contestant was medically evacuated.</p>
              ) : contestant.ejected ? (
                <p className="text-survivor-brown">This contestant was ejected from the game.</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-survivor-beige rounded-md">
          <div className="text-2xl font-bold text-survivor-brown">{stats.daysPlayed}</div>
          <p className="text-sm text-muted-foreground">Days Played</p>
        </div>

        <div className="p-4 bg-survivor-beige rounded-md">
          <div className="text-2xl font-bold text-survivor-brown">{stats.totalVotesAgainst}</div>
          <p className="text-sm text-muted-foreground">Votes Against</p>
        </div>

        <div className="p-4 bg-survivor-beige rounded-md">
          <div className="text-2xl font-bold text-survivor-brown">{stats.seasonRank}</div>
          <p className="text-sm text-muted-foreground">Season Rank</p>
        </div>

        <div className="p-4 bg-survivor-beige rounded-md">
          <div className="text-2xl font-bold text-survivor-brown">{stats.percentileFinish}</div>
          <p className="text-sm text-muted-foreground">Percentile Finish</p>
        </div>
      </div>

      {contestant.jury_votes ? (
        <div className="p-4 bg-survivor-beige rounded-md">
          <div className="text-xl font-bold text-survivor-brown">Jury Votes: {contestant.num_jury_votes}</div>
          {contestant.finish === "1" ? (
            <p className="text-sm text-muted-foreground">Winner of Season {contestant.num_season}</p>
          ) : null}
        </div>
      ) : null}

      {contestant.fmc ? (
        <div className="p-4 bg-survivor-beige rounded-md">
          <p className="text-sm text-survivor-brown">Lost in a Fire Making Challenge</p>
        </div>
      ) : null}
    </div>
  )
}
