"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetchContestants } from "@/lib/data"
import type { Contestant } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "./loading-spinner"

export default function AgeBarChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"age" | "count">("age")
  const [groupBy, setGroupBy] = useState<"individual" | "range">("range")

  useEffect(() => {
    async function loadData() {
      try {
        const contestants = await fetchContestants()
        processContestantAges(contestants)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Re-process data when sort or group options change
    if (!loading) {
      const contestants = data.length > 0 ? data[0].rawContestants : []
      if (contestants.length > 0) {
        processContestantAges(contestants)
      }
    }
  }, [sortBy, groupBy, loading])

  const processContestantAges = (contestants: Contestant[]) => {
    // Filter out invalid ages
    const validContestants = contestants.filter(
      (contestant) => contestant.age && !isNaN(Number(contestant.age)) && Number(contestant.age) > 0,
    )

    if (groupBy === "range") {
      // Group ages into ranges
      const ageRanges: Record<string, number> = {
        "18-20": 0,
        "21-25": 0,
        "26-30": 0,
        "31-35": 0,
        "36-40": 0,
        "41-45": 0,
        "46-50": 0,
        "51-55": 0,
        "56-60": 0,
        "61+": 0,
      }

      validContestants.forEach((contestant) => {
        const age = Number(contestant.age)
        if (age <= 20) ageRanges["18-20"]++
        else if (age <= 25) ageRanges["21-25"]++
        else if (age <= 30) ageRanges["26-30"]++
        else if (age <= 35) ageRanges["31-35"]++
        else if (age <= 40) ageRanges["36-40"]++
        else if (age <= 45) ageRanges["41-45"]++
        else if (age <= 50) ageRanges["46-50"]++
        else if (age <= 55) ageRanges["51-55"]++
        else if (age <= 60) ageRanges["56-60"]++
        else ageRanges["61+"]++
      })

      // Convert to array for chart
      const chartData = Object.entries(ageRanges).map(([range, count]) => ({
        name: range,
        count,
        rawContestants: validContestants,
      }))

      // Sort if needed
      if (sortBy === "count") {
        chartData.sort((a, b) => b.count - a.count)
      }

      setData(chartData)
    } else {
      // Individual ages
      const ageCount: Record<string, number> = {}

      validContestants.forEach((contestant) => {
        const age = contestant.age
        ageCount[age] = (ageCount[age] || 0) + 1
      })

      // Convert to array for chart
      const chartData = Object.entries(ageCount).map(([age, count]) => ({
        name: age,
        count,
        rawContestants: validContestants,
      }))

      // Sort by age or count
      if (sortBy === "age") {
        chartData.sort((a, b) => Number(a.name) - Number(b.name))
      } else {
        chartData.sort((a, b) => b.count - a.count)
      }

      setData(chartData)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as "individual" | "range")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="range">Age Ranges</SelectItem>
            <SelectItem value="individual">Individual Ages</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "age" | "count")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="age">Sort by Age</SelectItem>
            <SelectItem value="count">Sort by Count</SelectItem>
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
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              label={{ value: "Age", position: "insideBottom", offset: -10 }}
            />
            <YAxis label={{ value: "Number of Contestants", angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value) => [`${value} contestants`, "Count"]}
              labelFormatter={(label) => `Age: ${label}`}
            />
            <Bar
              dataKey="count"
              fill="#8B4513"
              name="Contestants"
              // Add a gradient fill for visual appeal
              background={{ fill: "#eee" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Based on {data[0]?.rawContestants.length || 0} contestants with valid age data
      </div>
    </div>
  )
}