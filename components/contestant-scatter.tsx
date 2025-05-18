"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Label } from "recharts"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import type { Contestant, Season } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "./loading-spinner"
import SeasonFilter from "./season-filter"

interface ContestantScatterProps {
  type: "votesAgainstNormalizedFinish" | "other",
}

export default function ContestantScatter({ type }: ContestantScatterProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [season, setSeason] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      try {
        const contestants = await fetchContestants()
        const filteredContestants =
          season === "all" ? contestants : contestants.filter((c) => c.num_season === season)
        const processedData = processContestantData(filteredContestants, type)
        const sortedData = processedData?.sort((a,b) => a.votesAgainst - b.votesAgainst) || []
        setData(sortedData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [type, season])

  const processContestantData = (contestants: Contestant[], type: string) => {
    if (type === "votesAgainstNormalizedFinish") {
      return contestants.map((contestant) => ({
        contestant: contestant.contestant_name,
        season: contestant.num_season,
        votesAgainst: Number(contestant.votes_against),
        normalizedFinish: contestant.normalized_finish,
      }))
    }
  }

  const CustomTooltip = ({ active, payload, label } : {active: any, payload: any, label: any}) => {
    if (active && payload && payload.length) {
      console.log("Tooltip Payload:", payload)
      console.log("Tooltip Label:", label)
      return (
        <div className="m-0 leading-6 border border-[#f5f5f5] bg-white/80 p-2.5">
          <p className="border-b border-[#f5f5f5]">{payload[0].payload.contestant} - Season {payload[0].payload.season}</p>
          <p className="m-0">Votes Against: {payload[0].value}</p>
          <p className="m-0">Normalized Finish: {Math.round(payload[1].value * 100) / 100}</p>
          <p className="m-0 text-[#033e92] italic">{(payload[1].value > .75 && payload[0].value < 5) ? "Played under the radar by placing well without attracting a lot of votes." : (payload[1].value > .75 && payload[0].value > 10) ? "Played risky but it paid off." : ""}</p>
        </div>
      );
    }
  
    return null;
  };

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SeasonFilter setSeason={setSeason} />
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "votesAgainstNormalizedFinish" ? (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="votesAgainst" type="number">
                <Label value="Votes Against" offset={-5} position='insideBottom' />
              </XAxis>
              <YAxis dataKey="normalizedFinish" domain={[0, 1]}>
                <Label value="Normalized Finish" angle={270} position='insideLeft' style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
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
