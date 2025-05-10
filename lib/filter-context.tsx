"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { fetchSeasons } from "@/lib/data"
import type { Season } from "@/lib/types"

interface FilterContextType {
  selectedSeason: string
  setSelectedSeason: (season: string) => void
  showFilter: boolean
  setShowFilter: (show: boolean) => void
  seasons: Season[]
  isLoading: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedSeason, setSelectedSeason] = useState<string>("all")
  const [showFilter, setShowFilter] = useState<boolean>(true)
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

  return (
    <FilterContext.Provider
      value={{
        selectedSeason,
        setSelectedSeason,
        showFilter,
        setShowFilter,
        seasons,
        isLoading,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
