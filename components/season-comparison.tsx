"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchSeasons } from "@/lib/data"
import type { Season } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "./loading-spinner"

export default function SeasonComparison() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState<string>("demographics")

  useEffect(() => {
    async function loadData() {
      try {
        const seasons = await fetchSeasons()
        const processedData = processSeasonData(seasons, metric)
        setData(processedData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [metric])

  const processSeasonData = (seasons: Season[], metricType: string) => {
    if (metricType === "demographics") {
      return seasons.map((season) => ({
        season: `S${season.num_season}`,
        "African American": season.african_american,
        "Asian American": season.asian_american,
        "Latin American": season.latin_american,
        "Total POC": Number.parseInt(season.poc as string),
        LGBT: season.lgbt,
      }))
    } else if (metricType === "structure") {
      return seasons.map((season) => ({
        season: `S${season.num_season}`,
        Contestants: season.num_contestants,
        Merge: Number.parseInt(season.num_merge),
        Jury: Number.parseInt(season.num_jury),
        FTC: season.num_ftc,
        Days: Number.parseInt(season.num_days),
      }))
    } else {
      return seasons.map((season) => ({
        season: `S${season.num_season}`,
        Quits: season.num_quits,
        Evacuations: season.num_evacs,
        Swaps: season.num_swaps,
        "Redemption Island": season.redemption_island,
        "Edge of Extinction": season.edge_of_extinction,
      }))
    }
  }

  const handleMetricChange = (value: string) => {
    setMetric(value)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={metric} onValueChange={handleMetricChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demographics">Demographics</SelectItem>
            <SelectItem value="structure">Season Structure</SelectItem>
            <SelectItem value="twists">Twists & Events</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            <Tooltip />
            <Legend />
            {metric === "demographics" && (
              <>
                <Bar dataKey="African American" fill="#8B4513" />
                <Bar dataKey="Asian American" fill="#F0E68C" />
                <Bar dataKey="Latin American" fill="#A52A2A" />
                <Bar dataKey="Total POC" fill="#6A5ACD" />
                <Bar dataKey="LGBT" fill="#4682B4" />
              </>
            )}
            {metric === "structure" && (
              <>
                <Bar dataKey="Contestants" fill="#2D5F3E" />
                <Bar dataKey="Merge" fill="#D2691E" />
                <Bar dataKey="Jury" fill="#F0E68C" />
                <Bar dataKey="FTC" fill="#A52A2A" />
                <Bar dataKey="Days" fill="#4682B4" />
              </>
            )}
            {metric === "twists" && (
              <>
                <Bar dataKey="Quits" fill="#A52A2A" />
                <Bar dataKey="Evacuations" fill="#D2691E" />
                <Bar dataKey="Swaps" fill="#F0E68C" />
                <Bar dataKey="Redemption Island" fill="#2D5F3E" />
                <Bar dataKey="Edge of Extinction" fill="#6A5ACD" />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
