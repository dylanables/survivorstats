"use client"

import { useFilter } from "@/lib/filter-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { fetchSeasons } from "@/lib/data"
import { Season } from "@/lib/types"

interface SeasonFilterProps {
  className?: string
  setSeason?: (season: string) => void
}

export default function SeasonFilter({ className = "", setSeason }: SeasonFilterProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("all")
  const [seasons, setSeasons] = useState<Season[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadSeasons() {
      try {
        const seasonsData = await fetchSeasons()
        setSeasons(seasonsData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading seasons for filter:", error)
        setIsLoading(false)
      }
    }

    loadSeasons()
  }, [])

  useEffect(() => {
    setSeason && setSeason(selectedSeason)
  }, [selectedSeason])

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Select value={selectedSeason} onValueChange={setSelectedSeason} disabled={isLoading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season.num_season} value={season.num_season}>
                {season.season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
