"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { fetchContestants } from "@/lib/data"
import type { Contestant } from "@/lib/types"
import LoadingSpinner from "./loading-spinner"
import SeasonFilter from "./season-filter"

interface DemographicsChartProps {
  type: "gender" | "ethnicity",
}

export default function DemographicsChart({ type }: DemographicsChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [season, setSeason] = useState<string>("all")

  const COLORS = {
    gender: ["#D2691E", "#2D5F3E", "#4682B4"],
    ethnicity: ["#D2691E", "#2D5F3E", "#4682B4", "#A52A2A", "#6A5ACD", "#8B4513"],
  }

  useEffect(() => {
    async function loadData() {
      try {
        const contestants = await fetchContestants()
        const filteredContestants =
          season === "all" ? contestants : contestants.filter((c) => c.num_season === season)

        if (type === "gender") {
          const genderData = processGenderData(filteredContestants)
          setData(genderData)
        } else {
          const ethnicityData = processEthnicityData(filteredContestants)
          setData(ethnicityData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [type, season])

  const processGenderData = (contestants: Contestant[]) => {
    const genderCount = {
      Male: 0,
      Female: 0,
      "Non-Binary": 0,
    }

    contestants.forEach((contestant) => {
      if (contestant.gender === "M") genderCount.Male++
      else if (contestant.gender === "F") genderCount.Female++
      else if (contestant.gender === "N") genderCount["Non-Binary"]++
    })

    return Object.entries(genderCount).map(([name, value]) => ({ name, value }))
  }

  const processEthnicityData = (contestants: Contestant[]) => {
    const ethnicityCount = {
      "African American": 0,
      "Asian American": 0,
      "Latin American": 0,
      "Other POC": 0,
      White: 0,
    }

    contestants.forEach((contestant) => {
      if (contestant.african_american) ethnicityCount["African American"]++
      else if (contestant.asian_american) ethnicityCount["Asian American"]++
      else if (contestant.latin_american) ethnicityCount["Latin American"]++
      else if (contestant.poc) ethnicityCount["Other POC"]++
      else ethnicityCount["White"]++
    })

    return Object.entries(ethnicityCount)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
    <SeasonFilter setSeason={setSeason} />
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[type][index % COLORS[type].length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} contestants`, ""]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    </>
  )
}
