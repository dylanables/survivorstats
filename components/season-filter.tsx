"use client"

import { useFilter } from "@/lib/filter-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SeasonFilterProps {
  className?: string
}

export default function SeasonFilter({ className = "" }: SeasonFilterProps) {
  const { selectedSeason, setSelectedSeason, seasons, isLoading } = useFilter()

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Select value={selectedSeason} onValueChange={setSelectedSeason} disabled={isLoading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
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
