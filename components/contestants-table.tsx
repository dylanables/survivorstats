"use client"

import { useEffect, useState } from "react"
import { fetchContestants, fetchSeasons } from "@/lib/data"
import type { Contestant, Season } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import LoadingSpinner from "./loading-spinner"
import Link from "next/link"

export default function ContestantsTable() {
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [filteredContestants, setFilteredContestants] = useState<Contestant[]>([])
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
        const [contestantsData, seasonsData] = await Promise.all([fetchContestants(), fetchSeasons()])

        setContestants(contestantsData)
        setFilteredContestants(contestantsData)
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
    let result = [...contestants]

    // Apply season filter
    if (seasonFilter !== "all") {
      result = result.filter((contestant) => contestant.num_season === seasonFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (contestant) =>
          contestant.contestant_name.toLowerCase().includes(lowerSearchTerm) ||
          contestant.city.toLowerCase().includes(lowerSearchTerm) ||
          contestant.homestate.toLowerCase().includes(lowerSearchTerm) ||
          contestant.profession.toLowerCase().includes(lowerSearchTerm),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Contestant]
      const bValue = b[sortConfig.key as keyof Contestant]

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          return sortConfig.direction === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
        }

        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue === bValue) return 0

      return sortConfig.direction === "asc" ? (aValue < bValue ? -1 : 1) : aValue < bValue ? 1 : -1
    })

    setFilteredContestants(result)
    setCurrentPage(1)
  }, [contestants, searchTerm, seasonFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const totalPages = Math.ceil(filteredContestants.length / itemsPerPage)
  const paginatedContestants = filteredContestants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contestants..."
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
                onClick={() => handleSort("contestant_name")}
              >
                Name
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("num_season")}
              >
                Season
              </th>
              <th className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown" onClick={() => handleSort("age")}>
                Age
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("finish")}
              >
                Finish
              </th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Profession</th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-survivor-brown"
                onClick={() => handleSort("votes_against")}
              >
                Votes Against
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedContestants.map((contestant, index) => (
              <tr
                key={`${contestant.contestant_name}-${contestant.num_season}`}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4 border font-medium">
                  <Link
                    href={`/contestants/${encodeURIComponent(contestant.contestant_name)}`}
                    className="text-survivor-brown hover:underline"
                  >
                    {contestant.contestant_name}
                  </Link>
                </td>
                <td className="py-2 px-4 border">
                  <Link href={`/seasons/${contestant.num_season}`} className="text-survivor-green hover:underline">
                    {contestant.num_season}
                  </Link>
                </td>
                <td className="py-2 px-4 border">{contestant.age}</td>
                <td className="py-2 px-4 border">
                  {contestant.finish === "1" ? (
                    <span className="font-bold text-survivor-orange">Winner</span>
                  ) : (
                    contestant.finish
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {contestant.city}, {contestant.homestate}
                </td>
                <td className="py-2 px-4 border">{contestant.profession}</td>
                <td className="py-2 px-4 border">{contestant.votes_against}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredContestants.length)} of {filteredContestants.length}{" "}
            contestants
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
