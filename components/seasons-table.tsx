"use client"

import { useEffect, useState } from "react"
import { fetchSeasons } from "@/lib/data"
import type { Season } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import LoadingSpinner from "./loading-spinner"
import Link from "next/link"

export default function SeasonsTable() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [filteredSeasons, setFilteredSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "num_season",
    direction: "desc",
  })

  const itemsPerPage = 10

  useEffect(() => {
    async function loadData() {
      try {
        const seasonsData = await fetchSeasons()
        setSeasons(seasonsData)
        setFilteredSeasons(seasonsData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let result = [...seasons]

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (season) =>
          season.season.toLowerCase().includes(lowerSearchTerm) ||
          season.winner.toLowerCase().includes(lowerSearchTerm) ||
          season.merged_tribe.toLowerCase().includes(lowerSearchTerm),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Season]
      const bValue = b[sortConfig.key as keyof Season]

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          return sortConfig.direction === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
        }

        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue === bValue) return 0

      return sortConfig.direction === "asc" ? (aValue < bValue ? -1 : 1) : aValue < bValue ? 1 : -1
    })

    setFilteredSeasons(result)
    setCurrentPage(1)
  }, [seasons, searchTerm, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const totalPages = Math.ceil(filteredSeasons.length / itemsPerPage)
  const paginatedSeasons = filteredSeasons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search seasons..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-survivor-green text-white">
            <tr>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("num_season")}
              >
                Season #
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("season")}
              >
                Season Name
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("winner")}
              >
                Winner
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("num_contestants")}
              >
                Contestants
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("num_days")}
              >
                Days
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("merged_tribe")}
              >
                Merge Tribe
              </th>
              <th className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown" onClick={() => handleSort("poc")}>
                POC
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedSeasons.map((season, index) => (
              <tr key={season.num_season} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-2 px-4 border">{season.num_season}</td>
                <td className="py-2 px-4 border font-medium">
                  <Link href={`/seasons/${season.num_season}`} className="text-survivor-brown hover:underline">
                    {season.season}
                  </Link>
                </td>
                <td className="py-2 px-4 border">
                  <Link
                    href={`/contestants/${encodeURIComponent(season.winner)}`}
                    className="text-survivor-green hover:underline"
                  >
                    {season.winner}
                  </Link>
                </td>
                <td className="py-2 px-4 border">{season.num_contestants}</td>
                <td className="py-2 px-4 border">{season.num_days}</td>
                <td className="py-2 px-4 border">{season.merged_tribe}</td>
                <td className="py-2 px-4 border">{season.poc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredSeasons.length)} of {filteredSeasons.length} seasons
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
