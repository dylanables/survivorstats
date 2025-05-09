"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchSeasons } from "@/lib/data"
import type { Season } from "@/lib/types"
import LoadingSpinner from "./loading-spinner"

export default function SeasonDemographics() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const seasons = await fetchSeasons()
        const processedData = processSeasonData(seasons)
        setData(processedData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const processSeasonData = (seasons: Season[]) => {
    return seasons.map((season) => ({
      season: `S${season.num_season}`,
      "African American": season.african_american,
      "Asian American": season.asian_american,
      "Latin American": season.latin_american,
      "Total POC": Number.parseInt(season.poc as string),
      LGBT: season.lgbt,
    }))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
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
          <XAxis dataKey="season" angle={-45} textAnchor="end" height={60} interval={0} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="African American" fill="#8B4513" />
          <Bar dataKey="Asian American" fill="#F0E68C" />
          <Bar dataKey="Latin American" fill="#A52A2A" />
          <Bar dataKey="Total POC" fill="#6A5ACD" />
          <Bar dataKey="LGBT" fill="#4682B4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
