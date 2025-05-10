import type { Contestant, Season, Tribe } from "./types"
import { supabase } from "./supabase"

export async function fetchContestants(): Promise<Contestant[]> {
  const { data, error } = await supabase.from("contestants").select("*")

  if (error) {
    console.error("Error fetching contestants:", error)
    return []
  }

  // Process the data to ensure it matches your expected format
  return data.map(processContestantData)
}

export async function fetchSeasons(): Promise<Season[]> {
  const { data, error } = await supabase.from("seasons").select("*")

  if (error) {
    console.error("Error fetching seasons:", error)
    return []
  }

  return data
}

export async function fetchTribes(): Promise<Tribe[]> {
  const { data, error } = await supabase.from("tribes").select("*")

  if (error) {
    console.error("Error fetching tribes:", error)
    return []
  }

  return data
}

// Process contestant data to fix hometown format
function processContestantData(contestant: Record<string, any>): Contestant {
  try {
    // Handle hometown format "city, state" if it exists in your Supabase data
    if (contestant.hometown && typeof contestant.hometown === "string") {
      const hometownParts = contestant.hometown.split(",").map((part: string) => part.trim())
      contestant.city = hometownParts[0] || ""
      contestant.homestate = hometownParts[1] || ""
    } else {
      // If city and homestate are already separate fields in your Supabase table
      contestant.city = contestant.city || ""
      contestant.homestate = contestant.homestate || ""
    }
  } catch (error) {
    // Fallback for any parsing errors
    contestant.city = contestant.city || ""
    contestant.homestate = contestant.homestate || ""
    console.error("Error processing contestant data:", error)
  }

  return contestant as Contestant
}

// Data analysis functions
export function getSeasonWinners(contestants: Contestant[], seasons: Season[]): { season: string; winner: string }[] {
  return seasons.map((season) => ({
    season: season.season,
    winner: season.winner,
  }))
}

export function getDemographicStats(contestants: Contestant[]): Record<string, number> {
  const stats = {
    male: 0,
    female: 0,
    nonBinary: 0,
    africanAmerican: 0,
    asianAmerican: 0,
    latinAmerican: 0,
    poc: 0,
    jewish: 0,
    muslim: 0,
    lgbt: 0,
  }

  contestants.forEach((contestant) => {
    if (contestant.gender === "M") stats.male++
    else if (contestant.gender === "F") stats.female++
    else if (contestant.gender === "N") stats.nonBinary++

    if (contestant.african_american) stats.africanAmerican++
    if (contestant.asian_american) stats.asianAmerican++
    if (contestant.latin_american) stats.latinAmerican++
    if (contestant.poc) stats.poc++
    if (contestant.jewish) stats.jewish++
    if (contestant.muslim) stats.muslim++
    if (contestant.lgbt) stats.lgbt++
  })

  return stats
}

export function getContestantsByCountry(contestants: Contestant[]): Record<string, number> {
  const countryCount: Record<string, number> = {}

  contestants.forEach((contestant) => {
    const country = contestant.country || "Unknown"
    countryCount[country] = (countryCount[country] || 0) + 1
  })

  return countryCount
}

export function getAverageContestantAge(contestants: Contestant[]): number {
  const totalAge = contestants.reduce((sum, contestant) => {
    return sum + (Number.parseInt(contestant.age) || 0)
  }, 0)

  return totalAge / contestants.length
}

export function getSeasonDemographics(seasons: Season[]): any[] {
  return seasons.map((season) => ({
    season: season.season,
    africanAmerican: season.african_american,
    asianAmerican: season.asian_american,
    latinAmerican: season.latin_american,
    poc: Number.parseInt(season.poc as string),
    lgbt: season.lgbt,
  }))
}

export function getTribeComposition(tribes: Tribe[]): any[] {
  return tribes.map((tribe) => ({
    tribe: tribe.tribe,
    season: tribe.num_season,
    male: tribe.male,
    female: tribe.female,
    nonBinary: tribe.non_binary,
    total: Number.parseInt(tribe.num_contestants),
  }))
}

// Get tribes for a specific season
export function getTribesForSeason(tribes: Tribe[], seasonNumber: string): Tribe[] {
  return tribes.filter((tribe) => tribe.num_season === seasonNumber)
}

// Get contestants for a specific season
export function getContestantsForSeason(contestants: Contestant[], seasonNumber: string): Contestant[] {
  return contestants.filter((contestant) => contestant.num_season === seasonNumber)
}

// Get a specific contestant by name
export function getContestantByName(contestants: Contestant[], name: string): Contestant | undefined {
  return contestants.find(
    (contestant) => contestant.contestant_name.toLowerCase() === decodeURIComponent(name).toLowerCase(),
  )
}

// Get all seasons a contestant has appeared in
export function getContestantSeasons(contestants: Contestant[], name: string): Contestant[] {
  return contestants.filter((contestant) => contestant.contestant_name.toLowerCase() === name.toLowerCase())
}

// Get a specific season by number
export function getSeasonByNumber(seasons: Season[], number: string): Season | undefined {
  return seasons.find((season) => season.num_season === number)
}

// Get contestant statistics
export function getContestantStats(contestant: Contestant, allContestants: Contestant[]): any {
  const seasonRank =
    allContestants
      .filter((c) => c.num_season === contestant.num_season)
      .sort((a, b) => Number(b.finish) - Number(a.finish))
      .findIndex((c) => c.contestant_name === contestant.contestant_name) + 1

  return {
    daysPlayed: calculateDaysPlayed(contestant),
    totalVotesAgainst: contestant.votes_against,
    seasonRank,
    percentileFinish: (Number(contestant.normalized_finish) * 100).toFixed(1) + "%",
  }
}

// Calculate days played based on finish and season length
function calculateDaysPlayed(contestant: Contestant): number {
  // This is a simplified calculation - in a real app, you'd need more data
  // For now, we'll estimate based on finish position
  const totalContestants = 18 // Assuming average of 18 contestants
  const totalDays = 39 // Standard season length

  const finish = Number(contestant.finish)
  if (finish === 1) return totalDays

  // Rough estimation
  return Math.round((1 - (finish - 1) / totalContestants) * totalDays)
}

// Get season statistics
export function getSeasonStats(season: Season, contestants: Contestant[]): any {
  const seasonContestants = contestants.filter((c) => c.num_season === season.num_season)

  const avgAge = seasonContestants.reduce((sum, c) => sum + Number(c.age), 0) / seasonContestants.length

  const votesStats = seasonContestants.reduce(
    (stats, c) => {
      const votes = Number(c.votes_against)
      return {
        total: stats.total + votes,
        max: Math.max(stats.max, votes),
        maxName: votes > stats.max ? c.contestant_name : stats.maxName,
      }
    },
    { total: 0, max: 0, maxName: "" },
  )

  return {
    avgAge: Math.round(avgAge),
    totalVotes: votesStats.total,
    maxVotesAgainst: votesStats.max,
    maxVotesPlayer: votesStats.maxName,
  }
}
