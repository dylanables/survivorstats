"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Label } from "recharts"
import { fetchSeasons } from "@/lib/data"
import type { Season } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "./loading-spinner"

const testData = [
  {
    season: "S1",
    africanAmerican: 2,
    asianAmerican: 1,
    latinAmerican: 0,
    totalPOC: 3,
    lgbt: 1,
  },
  {
    season: "S2",
    africanAmerican: 3,
    asianAmerican: 2,
    latinAmerican: 1,
    totalPOC: 6,
    lgbt: 2,
  },
  {
    season: "S3",
    africanAmerican: 1,
    asianAmerican: 3,
    latinAmerican: 2,
    totalPOC: 6,
    lgbt: 3,
  },
]

export default function SeasonComparisonChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState<string>("demographics")

  console.log("Metric:", metric)

  useEffect(() => {
    async function loadData() {
      try {
        const seasons = await fetchSeasons()
        const processedData = processSeasonData(seasons, metric)
        console.log("Processed Data:", processedData)
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
        africanAmerican: season.african_american,
        asianAmerican: season.asian_american,
        latinAmerican: season.latin_american,
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
            <SelectItem value="underRadar">Under the Radar Players</SelectItem>
            <SelectItem value="merge">Merges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {metric === "demographics" ? (
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
            <XAxis dataKey="season" angle={-45} textAnchor="end" height={60} interval={0}>
              <Label value="Seasons" position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value="# of Contestants" angle={270} position='insideLeft' style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey="africanAmerican" name="African American" fill="#D72638" stackId="race" />
            <Bar dataKey="asianAmerican" name="Asian American" fill="#3F88C5" stackId="race" />
            <Bar dataKey="latinAmerican" name="Latin American" fill="#F49D37" stackId="race" />
          </BarChart>
          ) : (metric === "underRadar") ? (
            <ScatterChart>
              <XAxis dataKey="votes_against" />
              <YAxis dataKey="normalized_finish" domain={[0, 1]} />
              <Tooltip />
              <Scatter data={data} fill="#82ca9d" />
            </ScatterChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No data available for this metric.</p>
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
