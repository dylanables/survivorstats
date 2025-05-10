"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContestants } from "@/lib/data"
import { Clock, MapPin, User } from "lucide-react"

export default function ContestantStats() {
  const [stats, setStats] = useState({
    oldestContestant: { name: "", age: 0 },
    youngestContestant: { name: "", age: 100 },
    mostAppearances: { name: "", count: 0 },
    mostCommonState: { state: "", count: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const contestants = await fetchContestants()

        // Calculate stats
        const stateCounts: Record<string, number> = {}
        const appearanceCounts: Record<string, number> = {}

        let oldest = { name: "", age: 0 }
        let youngest = { name: "", age: 100 }

        contestants.forEach((contestant) => {
          const age = Number.parseInt(contestant.age)

          // Track oldest and youngest
          if (age > oldest.age) {
            oldest = { name: contestant.contestant_name, age }
          }
          if (age < youngest.age && age > 0) {
            youngest = { name: contestant.contestant_name, age }
          }

          // Track state counts
          if (contestant.state) {
            stateCounts[contestant.state] = (stateCounts[contestant.state] || 0) + 1
          }

          // Track appearance counts
          appearanceCounts[contestant.contestant_name] = (appearanceCounts[contestant.contestant_name] || 0) + 1
        })

        // Find most common state
        let mostCommonState = { state: "", count: 0 }
        Object.entries(stateCounts).forEach(([state, count]) => {
          if (count > mostCommonState.count) {
            mostCommonState = { state, count }
          }
        })

        // Find contestant with most appearances
        let mostAppearances = { name: "", count: 0 }
        Object.entries(appearanceCounts).forEach(([name, count]) => {
          if (count > mostAppearances.count) {
            mostAppearances = { name, count }
          }
        })

        setStats({
          oldestContestant: oldest,
          youngestContestant: youngest,
          mostAppearances,
          mostCommonState,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <div>Loading stats...</div>
  }

  return (
    <>
      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oldest Contestant</CardTitle>
          <Clock className="h-4 w-4 text-survivor-brown" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.oldestContestant.age}</div>
          <p className="text-xs text-muted-foreground">{stats.oldestContestant.name}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Youngest Contestant</CardTitle>
          <Clock className="h-4 w-4 text-survivor-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.youngestContestant.age}</div>
          <p className="text-xs text-muted-foreground">{stats.youngestContestant.name}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Appearances</CardTitle>
          <User className="h-4 w-4 text-survivor-orange" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mostAppearances.count}</div>
          <p className="text-xs text-muted-foreground">{stats.mostAppearances.name}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Common State</CardTitle>
          <MapPin className="h-4 w-4 text-survivor-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mostCommonState.state}</div>
          <p className="text-xs text-muted-foreground">{stats.mostCommonState.count} contestants</p>
        </CardContent>
      </Card>
    </>
  )
}
