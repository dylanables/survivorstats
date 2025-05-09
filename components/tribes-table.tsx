"use client"

import { useEffect, useState } from "react"
import { fetchTribes, fetchSeasons } from "@/lib/data"
import type { Tribe, Season } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import LoadingSpinner from "./loading-spinner"

export default function TribesTable() {
  const [tribes, setTribes] = useState<Tribe[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [filteredTribes, setFilteredTribes] = useState<Tribe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [seasonFilter, setSeasonFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "num_season",
    direction: "desc",
  })

  const itemsPerPage = 20

  useEffect(() => {
    async function loadData() {
      try {
        const [tribesData, seasonsData] = await Promise.all([fetchTribes(), fetchSeasons()])

        setTribes(tribesData)
        setFilteredTribes(tribesData)
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
    let result = [...tribes]

    // Apply season filter
    if (seasonFilter !== "all") {
      result = result.filter((tribe) => tribe.num_season === seasonFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (tribe) =>
          tribe.tribe.toLowerCase().includes(lowerSearchTerm) || tribe.color.toLowerCase().includes(lowerSearchTerm),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Tribe]
      const bValue = b[sortConfig.key as keyof Tribe]

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          return sortConfig.direction === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
        }

        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue === bValue) return 0

      return sortConfig.direction === "asc" ? (aValue < bValue ? -1 : 1) : aValue < bValue ? 1 : -1
    })

    setFilteredTribes(result)
    setCurrentPage(1)
  }, [tribes, searchTerm, seasonFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const totalPages = Math.ceil(filteredTribes.length / itemsPerPage)
  const paginatedTribes = filteredTribes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getTribeColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      Red: "bg-red-500",
      Blue: "bg-blue-500",
      Green: "bg-green-500",
      Yellow: "bg-yellow-400",
      Orange: "bg-orange-500",
      Purple: "bg-purple-500",
      Black: "bg-gray-800",
      White: "bg-gray-200",
      Pink: "bg-pink-400",
      Brown: "bg-amber-700",
      Teal: "bg-teal-500",
      Cyan: "bg-cyan-500",
    }

    return colorMap[color] || "bg-gray-400"
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tribes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={seasonFilter} onValueChange={setSeasonFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by season" />
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-survivor-green text-white">
            <tr>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("tribe")}
              >
                Tribe Name
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("num_season")}
              >
                Season
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("color")}
              >
                Color
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("num_contestants")}
              >
                Members
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("male")}
              >
                Male
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("female")}
              >
                Female
              </th>
              <th className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown" onClick={() => handleSort("poc")}>
                POC
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("merge")}
              >
                Merge
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTribes.map((tribe, index) => (
              <tr
                key={`${tribe.tribe}-${tribe.num_season}-${tribe.iter_num}`}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4 border font-medium">{tribe.tribe}</td>
                <td className="py-2 px-4 border">{tribe.num_season}</td>
                <td className="py-2 px-4 border">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${getTribeColorStyle(tribe.color)}`}></div>
                    {tribe.color}
                  </div>
                </td>
                <td className="py-2 px-4 border">{tribe.num_contestants}</td>
                <td className="py-2 px-4 border">{tribe.male}</td>
                <td className="py-2 px-4 border">{tribe.female}</td>
                <td className="py-2 px-4 border">{tribe.poc}</td>
                <td className="py-2 px-4 border">{tribe.merge ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTribes.length)} of {filteredTribes.length} tribes
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
