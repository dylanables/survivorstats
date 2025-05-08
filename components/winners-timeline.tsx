"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
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
        gender: winner ? (winner.gender === "M" ? "Male" : winner.gender === "F" ? "Female" : "Non-Binary") : "Unknown",
        votesAgainst: winner ? Number.parseInt(winner.votes_against) : 0,
        juryVotes: winner ? Number.parseInt(winner.num_jury_votes) : 0,
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
          <BarChart
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
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-survivor-green text-white">
            <tr>
              <th className="py-2 px-4 border">Season</th>
              <th className="py-2 px-4 border">Winner</th>
              <th className="py-2 px-4 border">Age</th>
              <th className="py-2 px-4 border">Gender</th>
              <th className="py-2 px-4 border">Votes Against</th>
              <th className="py-2 px-4 border">Jury Votes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-2 px-4 border">{item.seasonName}</td>
                <td className="py-2 px-4 border font-medium">{item.winner}</td>
                <td className="py-2 px-4 border">{item.age}</td>
                <td className="py-2 px-4 border">{item.gender}</td>
                <td className="py-2 px-4 border">{item.votesAgainst}</td>
                <td className="py-2 px-4 border">{item.juryVotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
