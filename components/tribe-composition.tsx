"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchTribes, fetchSeasons } from "@/lib/data"
import type { Tribe, Season } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "./loading-spinner"

export default function TribeComposition() {
  const [data, setData] = useState<any[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      try {
        const [tribesData, seasonsData] = await Promise.all([fetchTribes(), fetchSeasons()])

        setSeasons(seasonsData)

        // Default to showing all seasons
        const processedData = processTribeData(tribesData, "all")
        setData(processedData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    async function updateData() {
      try {
        const tribes = await fetchTribes()
        const processedData = processTribeData(tribes, selectedSeason)
        setData(processedData)
      } catch (error) {
        console.error("Error updating data:", error)
      }
    }

    if (!loading) {
      updateData()
    }
  }, [selectedSeason, loading])

  const processTribeData = (tribes: Tribe[], seasonFilter: string) => {
    let filteredTribes = tribes

    if (seasonFilter !== "all") {
      filteredTribes = tribes.filter((tribe) => tribe.num_season === seasonFilter)
    }

    // Only include non-merge tribes for this visualization
    filteredTribes = filteredTribes.filter((tribe) => tribe.merge === 0)

    return filteredTribes.map((tribe) => ({
      tribe: tribe.tribe,
      season: `S${tribe.num_season}`,
      Male: tribe.male,
      Female: tribe.female,
      "Non-Binary": tribe.non_binary,
      POC: tribe.poc,
      LGBT: tribe.lgbt,
      total: Number.parseInt(tribe.num_contestants),
    }))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season.num_season} value={season.num_season}>
                {season.season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[500px]">
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
            <XAxis dataKey="tribe" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => {
                const item = data.find((d) => d.tribe === label)
                return `${item.tribe} (${item.season})`
              }}
            />
            <Legend />
            <Bar dataKey="Male" fill="#2D5F3E" />
            <Bar dataKey="Female" fill="#D2691E" />
            <Bar dataKey="Non-Binary" fill="#4682B4" />
            <Bar dataKey="POC" stackId="demographics" fill="#8B4513" />
            <Bar dataKey="LGBT" stackId="demographics" fill="#6A5ACD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
