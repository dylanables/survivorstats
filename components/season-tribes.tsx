"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Tribe } from "@/lib/types"

interface SeasonTribesProps {
  tribes: Tribe[]
}

export default function SeasonTribes({ tribes }: SeasonTribesProps) {
  const [tribeData, setTribeData] = useState<any[]>([])

  useEffect(() => {
    // Process tribe data for visualization
    const processedTribes = tribes.map((tribe) => ({
      name: tribe.tribe,
      color: tribe.color,
      members: Number(tribe.num_contestants),
      male: tribe.male,
      female: tribe.female,
      nonBinary: tribe.non_binary,
      poc: tribe.poc,
      merge: tribe.merge,
    }))

    setTribeData(processedTribes)
  }, [tribes])

  const getTribeColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      Red: "#e53e3e",
      Blue: "#3182ce",
      Green: "#38a169",
      Yellow: "#ecc94b",
      Orange: "#dd6b20",
      Purple: "#805ad5",
      Black: "#2d3748",
      White: "#e2e8f0",
      Pink: "#ed64a6",
      Brown: "#8b4513",
      Teal: "#319795",
      Cyan: "#0bc5ea",
    }

    return colorMap[color] || "#a0aec0"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tribe Breakdown</h3>
        <div className="grid gap-4">
          {tribeData.map((tribe) => (
            <div key={tribe.name} className="p-4 border rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getTribeColorStyle(tribe.color) }}
                ></div>
                <h4 className="font-medium">{tribe.name} Tribe</h4>
                {tribe.merge ? <Badge className="ml-auto bg-survivor-green">Merge Tribe</Badge> : null}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Members: {tribe.members}</div>
                <div>Male: {tribe.male}</div>
                <div>Female: {tribe.female}</div>
                <div>POC: {tribe.poc}</div>
                {tribe.nonBinary > 0 ? <div>Non-Binary: {tribe.nonBinary}</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Gender Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tribeData
                  .filter((t) => !t.merge)
                  .map((tribe) => ({
                    name: tribe.name,
                    value: tribe.members,
                    color: getTribeColorStyle(tribe.color),
                  }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {tribeData
                  .filter((t) => !t.merge)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} members`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
