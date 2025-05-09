"use client"

import type { Season, Contestant } from "@/lib/types"
import { getSeasonStats } from "@/lib/data"
import { CalendarDays, Users, Award, Flag } from "lucide-react"
import Link from "next/link"

interface SeasonProfileProps {
  season: Season
  contestants: Contestant[]
}

export default function SeasonProfile({ season, contestants }: SeasonProfileProps) {
  const stats = getSeasonStats(season, contestants)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Season Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>Length: {season.num_days} days</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Contestants: {season.num_contestants}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>
              Winner:
              <Link
                href={`/contestants/${encodeURIComponent(season.winner)}`}
                className="ml-1 text-survivor-green hover:underline"
              >
                {season.winner}
              </Link>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span>Merge Tribe: {season.merged_tribe}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Game Structure</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-survivor-beige rounded-md">
            <div className="text-2xl font-bold text-survivor-brown">{season.num_merge}</div>
            <p className="text-sm text-muted-foreground">Merge Size</p>
          </div>

          <div className="p-4 bg-survivor-beige rounded-md">
            <div className="text-2xl font-bold text-survivor-brown">{season.day_merge}</div>
            <p className="text-sm text-muted-foreground">Merge Day</p>
          </div>

          <div className="p-4 bg-survivor-beige rounded-md">
            <div className="text-2xl font-bold text-survivor-brown">{season.num_jury}</div>
            <p className="text-sm text-muted-foreground">Jury Size</p>
          </div>

          <div className="p-4 bg-survivor-beige rounded-md">
            <div className="text-2xl font-bold text-survivor-brown">{season.num_ftc}</div>
            <p className="text-sm text-muted-foreground">Final Tribal Size</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Season Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-survivor-beige rounded-md">
            <div className="text-2xl font-bold text-survivor-brown">{stats.avgAge}</div>
            <p className="text-sm text-muted-foreground">Average Age</p>
          </div>

          <div className="p-4 bg-survivor-beige rounded-md">
            <div className="text-2xl font-bold text-survivor-brown">{stats.totalVotes}</div>
            <p className="text-sm text-muted-foreground">Total Votes Cast</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Season Twists</h3>
        <div className="flex flex-wrap gap-2">
          {season.redemption_island ? (
            <div className="px-3 py-1 bg-survivor-brown text-white rounded-full text-sm">Redemption Island</div>
          ) : null}

          {season.edge_of_extinction ? (
            <div className="px-3 py-1 bg-survivor-brown text-white rounded-full text-sm">Edge of Extinction</div>
          ) : null}

          {season.num_swaps > 0 ? (
            <div className="px-3 py-1 bg-survivor-brown text-white rounded-full text-sm">
              {season.num_swaps} Tribe Swap{season.num_swaps > 1 ? "s" : ""}
            </div>
          ) : null}

          {season.num_quits > 0 ? (
            <div className="px-3 py-1 bg-survivor-brown text-white rounded-full text-sm">
              {season.num_quits} Quit{season.num_quits > 1 ? "s" : ""}
            </div>
          ) : null}

          {season.num_evacs > 0 ? (
            <div className="px-3 py-1 bg-survivor-brown text-white rounded-full text-sm">
              {season.num_evacs} Medical Evacuation{season.num_evacs > 1 ? "s" : ""}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
