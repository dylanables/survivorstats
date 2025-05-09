"use client"

import type { Contestant } from "@/lib/types"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SeasonContestantsProps {
  contestants: Contestant[]
}

export default function SeasonContestants({ contestants }: SeasonContestantsProps) {
  // Sort contestants by finish (winners first)
  const sortedContestants = [...contestants].sort((a, b) => Number(a.finish) - Number(b.finish))

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-survivor-green text-white">
            <tr>
              <th className="py-2 px-4 border">Finish</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Age</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Starting Tribe</th>
              <th className="py-2 px-4 border">Votes Against</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedContestants.map((contestant, index) => (
              <tr
                key={`${contestant.contestant_name}-${contestant.num_season}`}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4 border text-center">
                  {contestant.finish === "1" ? <Badge className="bg-survivor-orange">Winner</Badge> : contestant.finish}
                </td>
                <td className="py-2 px-4 border font-medium">
                  <Link
                    href={`/contestants/${encodeURIComponent(contestant.contestant_name)}`}
                    className="text-survivor-brown hover:underline"
                  >
                    {contestant.contestant_name}
                  </Link>
                </td>
                <td className="py-2 px-4 border">{contestant.age}</td>
                <td className="py-2 px-4 border">
                  {contestant.city}, {contestant.homestate}
                </td>
                <td className="py-2 px-4 border">{contestant.tribe1}</td>
                <td className="py-2 px-4 border">{contestant.votes_against}</td>
                <td className="py-2 px-4 border">
                  {contestant.quit ? (
                    <Badge variant="outline" className="bg-red-100">
                      Quit
                    </Badge>
                  ) : contestant.evac ? (
                    <Badge variant="outline" className="bg-red-100">
                      Evacuated
                    </Badge>
                  ) : contestant.ejected ? (
                    <Badge variant="outline" className="bg-red-100">
                      Ejected
                    </Badge>
                  ) : contestant.jury ? (
                    <Badge variant="outline" className="bg-survivor-beige">
                      Jury
                    </Badge>
                  ) : contestant.merge ? (
                    <Badge variant="outline" className="bg-survivor-beige">
                      Made Merge
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">
                      Pre-Merge
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
