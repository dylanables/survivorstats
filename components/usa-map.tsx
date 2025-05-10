"use client"

import { useEffect, useState } from "react"
import { fetchContestants } from "@/lib/data"
import type { Contestant } from "@/lib/types"
import LoadingSpinner from "./loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usStatesData } from "@/lib/us-states-data"

interface StateData {
  name: string
  abbreviation: string
  count: number
  contestants: string[]
}

export default function USMapVisualization() {
  const [stateData, setStateData] = useState<Record<string, StateData>>({})
  const [loading, setLoading] = useState(true)
  const [maxCount, setMaxCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const contestants = await fetchContestants()
        processContestantsByState(contestants)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const processContestantsByState = (contestants: Contestant[]) => {
    // Initialize state data with all US states
    const initialStateData: Record<string, StateData> = {}

    // Initialize with all states (even those with 0 contestants)
    usStatesData.forEach((state) => {
      initialStateData[state.abbreviation] = {
        name: state.name,
        abbreviation: state.abbreviation,
        count: 0,
        contestants: [],
      }
    })

    // Count contestants by state
    let highestCount = 0

    contestants.forEach((contestant) => {
      // Skip if no state data
      if (!contestant.homestate) return

      // Normalize state abbreviation (handle both "CA" and "California" formats)
      let stateAbbr = contestant.homestate.trim()

      // If it's a full state name, convert to abbreviation
      if (stateAbbr.length > 2) {
        const matchedState = usStatesData.find((state) => state.name.toLowerCase() === stateAbbr.toLowerCase())
        if (matchedState) {
          stateAbbr = matchedState.abbreviation
        } else {
          // Skip if we can't identify the state
          return
        }
      }

      // Make sure it's uppercase
      stateAbbr = stateAbbr.toUpperCase()

      // Skip if not a valid US state
      if (!initialStateData[stateAbbr]) return

      // Increment count and add contestant name
      initialStateData[stateAbbr].count++
      initialStateData[stateAbbr].contestants.push(contestant.contestant_name)

      // Track highest count for color scaling
      if (initialStateData[stateAbbr].count > highestCount) {
        highestCount = initialStateData[stateAbbr].count
      }
    })

    setStateData(initialStateData)
    setMaxCount(highestCount)
  }

  // Function to determine fill color based on contestant count
  const getStateColor = (stateAbbr: string) => {
    const count = stateData[stateAbbr]?.count || 0

    if (count === 0) return "#f5f5f5" // Light gray for states with no contestants

    // Calculate color intensity based on count relative to max count
    const intensity = Math.max(0.2, Math.min(0.9, count / maxCount))

    // Use the survivor-brown color with varying opacity
    return `rgba(139, 69, 19, ${intensity})`
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contestant Distribution by State</CardTitle>
        <CardDescription>Darker colors indicate more contestants from that state</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative">
            <svg
              viewBox="0 0 960 600"
              className="w-full h-auto"
              aria-label="Map of United States showing Survivor contestant distribution"
            >
              {usStatesData.map((state) => {
                const stateDataForState = stateData[state.abbreviation] || { count: 0, contestants: [] }
                return (
                  <Tooltip key={state.abbreviation}>
                    <TooltipTrigger asChild>
                      <path
                        d={state.path}
                        fill={getStateColor(state.abbreviation)}
                        stroke="#ffffff"
                        strokeWidth="1"
                        aria-label={`${state.name}: ${stateDataForState.count || 0} contestants`}
                        className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-survivor-brown"
                        tabIndex={0}
                        role="button"
                        onClick={() => {
                          // Keep tooltip open on click
                          setTimeout(() => {
                            const element = document.querySelector(`[data-state="${state.abbreviation}"]`)
                            if (element instanceof HTMLElement) {
                              element.focus()
                            }
                          }, 10)
                        }}
                        data-state={state.abbreviation}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white p-3 shadow-lg rounded-md border border-survivor-beige">
                      <div className="font-bold text-survivor-brown text-lg">{state.name}</div>
                      <div className="text-md font-semibold">{stateDataForState.count || 0} contestants</div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-2 rounded-md border shadow-sm">
              <div className="text-xs font-semibold mb-1">Contestants</div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-[#f5f5f5] border"></div>
                <span className="text-xs">0</span>
                <div className="w-16 h-4 bg-gradient-to-r from-[rgba(139,69,19,0.2)] to-[rgba(139,69,19,0.9)]"></div>
                <span className="text-xs">{maxCount}</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
