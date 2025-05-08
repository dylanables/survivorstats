import type { Contestant, Season, Tribe } from "./types"

export async function fetchContestants(): Promise<Contestant[]> {
  const response = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/contestants-Cq2cgR0IDa0z4RHHEoM20MprGmmOle.csv",
  )
  const text = await response.text()
  return parseCSV<Contestant>(text, processContestantData)
}

export async function fetchSeasons(): Promise<Season[]> {
  const response = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seasons-yxTWJJtVFO7k8UwI7BSahBdmfMofsI.csv",
  )
  const text = await response.text()
  return parseCSV<Season>(text)
}

export async function fetchTribes(): Promise<Tribe[]> {
  const response = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tribes-meEsotSPJbIz9yArK03qBpC7B0QUR0.csv",
  )
  const text = await response.text()
  return parseCSV<Tribe>(text)
}

function parseCSV<T>(csv: string, postProcess?: (entry: Record<string, any>) => Record<string, any>): T[] {
  const lines = csv.split("\n")
  const headers = lines[0].split(",")

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",")
      const entry: Record<string, any> = {}

      headers.forEach((header, index) => {
        const value = values[index]?.trim()

        if (value === undefined || value === "") {
          entry[header] = null
        } else if (!isNaN(Number(value))) {
          entry[header] = Number(value)
        } else {
          entry[header] = value
        }
      })

      // Apply post-processing if provided
      if (postProcess) {
        return postProcess(entry) as T
      }

      return entry as T
    })
}

// Process contestant data to fix hometown format
function processContestantData(contestant: Record<string, any>): Record<string, any> {
  // Handle hometown format "city, state"
  if (contestant.hometown && typeof contestant.hometown === "string") {
    const hometownParts = contestant.hometown.split(",").map((part: string) => part.trim())
    contestant.city = hometownParts[0] || ""
    contestant.homestate = hometownParts[1] || ""
  } else {
    contestant.city = ""
    contestant.homestate = ""
  }

  return contestant
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
