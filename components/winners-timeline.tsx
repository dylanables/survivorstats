"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from "recharts"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import type { Contestant, Season } from "@/lib/types"
import LoadingSpinner from "./loading-spinner"

export default function WinnersTimeline() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [contestants, seasons] = await Promise.all([fetchContestants(), fetchSeasons()])

        const winnersData = processWinnersData(contestants, seasons)
        console.log("winnersData", winnersData)
        setData(winnersData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const processWinnersData = (contestants: Contestant[], seasons: Season[]) => {
    return seasons.map((season) => {
      const winner = contestants.find((c) => c.num_season === season.num_season && c.finish === "1")

      return {
        season: `S${season.num_season}`,
        seasonName: season.season,
        winner: season.winner,
        age: winner ? Number.parseInt(winner.age) : 0,
      }
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, name === "age" ? "Age" : "Jury Votes"]}
              labelFormatter={(label) => {
                const item = data.find((d) => d.season === label)
                return `${item.seasonName}: ${item.winner}`
              }}
            />
            <Bar dataKey="age" fill="#8B4513" name="Age" />
            <Bar dataKey="juryVotes" fill="#2D5F3E" name="Jury Votes" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
