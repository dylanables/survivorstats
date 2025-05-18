"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import type { Contestant, Season } from "@/lib/types"
import LoadingSpinner from "./loading-spinner"
import Link from "next/link"
import { Badge } from "./ui/badge"

export default function WinnersTable() {
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
        numAppearances: winner ? winner.num_appearance : 1,
        votesAgainst: winner ? Number.parseInt(winner.votes_against) : 0,
        juryVotes: winner ? Number.parseInt(winner.num_jury_votes) : 0,
        jury: Number(season.num_jury),
        ftc: Number(season.num_ftc),
      }
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
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
              <td className="py-2 px-4 border">
                <Link href={`/seasons/${encodeURIComponent(item.seasonName)}`} className="hover:underline">
                  {item.seasonName}
                </Link>
              </td>
              <td className="py-2 px-4 border font-medium">
                <Link href={`/contestants/${encodeURIComponent(item.winner)}`} className="hover:underline">
                  {item.winner}
                </Link>
              </td>
              <td className="py-2 px-4 border">{item.age}</td>
              <td className="py-2 px-4 border">{item.gender}</td>
              <td className="py-2 px-4 border">
                {item.votesAgainst}{" "}
                {
                (item.votesAgainst == 0) &&
                <Badge className="bg-survivor-orange">Perfect Game</Badge>
                }
              </td>
              <td className="py-2 px-4 border">
                <>
                {item.juryVotes} / {item.jury}{" "}
                {
                  (item.juryVotes == item.jury) &&
                  <Badge className="bg-survivor-yellow">Unanimous Jury</Badge>
                }
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
