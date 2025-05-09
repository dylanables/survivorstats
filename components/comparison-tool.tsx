"use client"

import { useEffect, useState } from "react"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import type { Contestant, Season } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "./loading-spinner"
import { X } from "lucide-react"

export default function ComparisonTool() {
  const [loading, setLoading] = useState(true)
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedContestants, setSelectedContestants] = useState<string[]>([])
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [comparisonType, setComparisonType] = useState<"contestants" | "seasons">("contestants")
  const [comparisonMetric, setComparisonMetric] = useState<string>("finish")

  useEffect(() => {
    async function loadData() {
      try {
        const [contestantsData, seasonsData] = await Promise.all([fetchContestants(), fetchSeasons()])
        setContestants(contestantsData)
        setSeasons(seasonsData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (comparisonType === "contestants" && selectedContestants.length > 0) {
      generateContestantComparison()
    } else if (comparisonType === "seasons" && selectedSeasons.length > 0) {
      generateSeasonComparison()
    }
  }, [selectedContestants, selectedSeasons, comparisonMetric, comparisonType])

  const generateContestantComparison = () => {
    const selectedContestantData = contestants.filter((c) => selectedContestants.includes(c.contestant_name))

    let data: any[] = []

    if (comparisonMetric === "finish") {
      data = selectedContestantData.map((c) => ({
        name: c.contestant_name,
        value: Number(c.finish),
        season: c.num_season,
      }))
    } else if (comparisonMetric === "votesAgainst") {
      data = selectedContestantData.map((c) => ({
        name: c.contestant_name,
        value: Number(c.votes_against),
        season: c.num_season,
      }))
    } else if (comparisonMetric === "normalizedFinish") {
      data = selectedContestantData.map((c) => ({
        name: c.contestant_name,
        value: Number(c.normalized_finish) * 100,
        season: c.num_season,
      }))
    } else if (comparisonMetric === "age") {
      data = selectedContestantData.map((c) => ({
        name: c.contestant_name,
        value: Number(c.age),
        season: c.num_season,
      }))
    }

    setComparisonData(data)
  }

  const generateSeasonComparison = () => {
    const selectedSeasonData = seasons.filter((s) => selectedSeasons.includes(s.num_season))

    let data: any[] = []

    if (comparisonMetric === "contestants") {
      data = selectedSeasonData.map((s) => ({
        name: `S${s.num_season}`,
        value: Number(s.num_contestants),
      }))
    } else if (comparisonMetric === "days") {
      data = selectedSeasonData.map((s) => ({
        name: `S${s.num_season}`,
        value: Number(s.num_days),
      }))
    } else if (comparisonMetric === "merge") {
      data = selectedSeasonData.map((s) => ({
        name: `S${s.num_season}`,
        value: Number(s.num_merge),
      }))
    } else if (comparisonMetric === "jury") {
      data = selectedSeasonData.map((s) => ({
        name: `S${s.num_season}`,
        value: Number(s.num_jury),
      }))
    } else if (comparisonMetric === "demographics") {
      data = selectedSeasonData.map((s) => ({
        name: `S${s.num_season}`,
        "African American": s.african_american,
        "Asian American": s.asian_american,
        "Latin American": s.latin_american,
        "Total POC": Number(s.poc),
        LGBT: s.lgbt,
      }))
    }

    setComparisonData(data)
  }

  const handleContestantSelect = (value: string) => {
    if (value && !selectedContestants.includes(value)) {
      setSelectedContestants([...selectedContestants, value])
    }
  }

  const handleSeasonSelect = (value: string) => {
    if (value && !selectedSeasons.includes(value)) {
      setSelectedSeasons([...selectedSeasons, value])
    }
  }

  const removeContestant = (name: string) => {
    setSelectedContestants(selectedContestants.filter((c) => c !== name))
  }

  const removeSeason = (id: string) => {
    setSelectedSeasons(selectedSeasons.filter((s) => s !== id))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="contestants" onValueChange={(value) => setComparisonType(value as "contestants" | "seasons")}>
        <TabsList className="bg-survivor-beige">
          <TabsTrigger value="contestants">Compare Contestants</TabsTrigger>
          <TabsTrigger value="seasons">Compare Seasons</TabsTrigger>
        </TabsList>

        <TabsContent value="contestants" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select onValueChange={handleContestantSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contestant" />
                </SelectTrigger>
                <SelectContent>
                  {contestants
                    .filter((c, i, self) => self.findIndex((s) => s.contestant_name === c.contestant_name) === i)
                    .map((contestant) => (
                      <SelectItem
                        key={contestant.contestant_name}
                        value={contestant.contestant_name}
                        disabled={selectedContestants.includes(contestant.contestant_name)}
                      >
                        {contestant.contestant_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={comparisonMetric} onValueChange={setComparisonMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finish">Finish Position</SelectItem>
                <SelectItem value="votesAgainst">Votes Against</SelectItem>
                <SelectItem value="normalizedFinish">Percentile Finish</SelectItem>
                <SelectItem value="age">Age</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedContestants.map((name) => (
              <div key={name} className="flex items-center bg-survivor-beige px-3 py-1 rounded-full">
                <span className="text-sm">{name}</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1" onClick={() => removeContestant(name)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {selectedContestants.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name, props) => [
                          value + (comparisonMetric === "normalizedFinish" ? "%" : ""),
                          comparisonMetric === "finish"
                            ? "Finish Position"
                            : comparisonMetric === "votesAgainst"
                              ? "Votes Against"
                              : comparisonMetric === "normalizedFinish"
                                ? "Percentile Finish"
                                : "Age",
                        ]}
                        labelFormatter={(label) => {
                          const item = comparisonData.find((d) => d.name === label)
                          return `${label} (Season ${item.season})`
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#2D5F3E"
                        name={
                          comparisonMetric === "finish"
                            ? "Finish Position"
                            : comparisonMetric === "votesAgainst"
                              ? "Votes Against"
                              : comparisonMetric === "normalizedFinish"
                                ? "Percentile Finish"
                                : "Age"
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seasons" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select onValueChange={handleSeasonSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem
                      key={season.num_season}
                      value={season.num_season}
                      disabled={selectedSeasons.includes(season.num_season)}
                    >
                      {season.season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={comparisonMetric} onValueChange={setComparisonMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contestants">Number of Contestants</SelectItem>
                <SelectItem value="days">Season Length (Days)</SelectItem>
                <SelectItem value="merge">Merge Size</SelectItem>
                <SelectItem value="jury">Jury Size</SelectItem>
                <SelectItem value="demographics">Demographics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedSeasons.map((id) => {
              const season = seasons.find((s) => s.num_season === id)
              return (
                <div key={id} className="flex items-center bg-survivor-beige px-3 py-1 rounded-full">
                  <span className="text-sm">{season?.season || `Season ${id}`}</span>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1" onClick={() => removeSeason(id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>

          {selectedSeasons.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {comparisonMetric === "demographics" ? (
                      <BarChart
                        data={comparisonData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="African American" fill="#8B4513" />
                        <Bar dataKey="Asian American" fill="#F0E68C" />
                        <Bar dataKey="Latin American" fill="#A52A2A" />
                        <Bar dataKey="Total POC" fill="#6A5ACD" />
                        <Bar dataKey="LGBT" fill="#4682B4" />
                      </BarChart>
                    ) : (
                      <BarChart
                        data={comparisonData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            value,
                            comparisonMetric === "contestants"
                              ? "Contestants"
                              : comparisonMetric === "days"
                                ? "Days"
                                : comparisonMetric === "merge"
                                  ? "Merge Size"
                                  : "Jury Size",
                          ]}
                        />
                        <Bar
                          dataKey="value"
                          fill="#2D5F3E"
                          name={
                            comparisonMetric === "contestants"
                              ? "Contestants"
                              : comparisonMetric === "days"
                                ? "Days"
                                : comparisonMetric === "merge"
                                  ? "Merge Size"
                                  : "Jury Size"
                          }
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
