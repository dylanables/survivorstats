"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContestants, fetchSeasons, fetchTribes } from "@/lib/data"
import { Users, Calendar, Flag, Award } from "lucide-react"

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalContestants: 0,
    totalSeasons: 0,
    totalTribes: 0,
    averageAge: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [contestants, seasons, tribes] = await Promise.all([fetchContestants(), fetchSeasons(), fetchTribes()])

        // Calculate stats
        const uniqueContestants = new Set(contestants.map((c) => c.contestant_name))
        const totalAge = contestants.reduce((sum, contestant) => {
          return sum + (Number.parseInt(contestant.age) || 0)
        }, 0)
        const averageAge = Math.round(totalAge / contestants.length)

        setStats({
          totalContestants: uniqueContestants.size,
          totalSeasons: seasons.length,
          totalTribes: new Set(tribes.map((t) => t.tribe)).size,
          averageAge,
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contestants</CardTitle>
          <Users className="h-4 w-4 text-survivor-brown" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContestants}</div>
          <p className="text-xs text-muted-foreground">Unique players across all seasons</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Seasons</CardTitle>
          <Calendar className="h-4 w-4 text-survivor-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSeasons}</div>
          <p className="text-xs text-muted-foreground">Seasons of Survivor analyzed</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tribes</CardTitle>
          <Flag className="h-4 w-4 text-survivor-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTribes}</div>
          <p className="text-xs text-muted-foreground">Unique tribes across all seasons</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Age</CardTitle>
          <Award className="h-4 w-4 text-survivor-orange" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageAge}</div>
          <p className="text-xs text-muted-foreground">Average contestant age</p>
        </CardContent>
      </Card>
    </div>
  )
}
