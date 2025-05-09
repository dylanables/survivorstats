"use client"

import { Badge } from "@/components/ui/badge"
import type { Contestant } from "@/lib/types"
import { CalendarDays, MapPin, Briefcase, Flag, Award, Users } from "lucide-react"
import Link from "next/link"

interface ContestantProfileProps {
  contestant: Contestant
}

export default function ContestantProfile({ contestant }: ContestantProfileProps) {
  // Calculate age from birthdate if available
  const calculateAge = () => {
    if (!contestant.birthdate) return contestant.age

    // Use a fixed date for both server and client to avoid hydration errors
    const today = new Date("2024-05-08") // Use a fixed date instead of new Date()
    const birthDate = new Date(contestant.birthdate)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age.toString()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>Age: {calculateAge()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              From: {contestant.city}, {contestant.homestate}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>Profession: {contestant.profession}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span>Country: {contestant.country}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Demographics</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-survivor-beige">
            {contestant.gender === "M" ? "Male" : contestant.gender === "F" ? "Female" : "Non-Binary"}
          </Badge>

          {contestant.african_american ? (
            <Badge variant="outline" className="bg-survivor-beige">
              African American
            </Badge>
          ) : null}

          {contestant.asian_american ? (
            <Badge variant="outline" className="bg-survivor-beige">
              Asian American
            </Badge>
          ) : null}

          {contestant.latin_american ? (
            <Badge variant="outline" className="bg-survivor-beige">
              Latin American
            </Badge>
          ) : null}

          {contestant.poc &&
          !contestant.african_american &&
          !contestant.asian_american &&
          !contestant.latin_american ? (
            <Badge variant="outline" className="bg-survivor-beige">
              POC
            </Badge>
          ) : null}

          {contestant.jewish ? (
            <Badge variant="outline" className="bg-survivor-beige">
              Jewish
            </Badge>
          ) : null}

          {contestant.muslim ? (
            <Badge variant="outline" className="bg-survivor-beige">
              Muslim
            </Badge>
          ) : null}

          {contestant.lgbt ? (
            <Badge variant="outline" className="bg-survivor-beige">
              LGBTQ+
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Survivor Career</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>Appearances: {contestant.num_appearance}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              Season:
              <Link href={`/seasons/${contestant.num_season}`} className="ml-1 text-survivor-green hover:underline">
                {contestant.num_season}
              </Link>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span>Starting Tribe: {contestant.tribe1}</span>
          </div>

          {contestant.tribe2 ? (
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span>Second Tribe: {contestant.tribe2}</span>
            </div>
          ) : null}

          {contestant.tribe3 ? (
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span>Third Tribe: {contestant.tribe3}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
