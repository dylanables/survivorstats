import { fetchContestants, fetchSeasons, fetchTribes } from "./data"
import type { Contestant, Season, Tribe } from "./types"

// Simple in-memory cache
let contestantsCache: Contestant[] | null = null
let seasonsCache: Season[] | null = null
let tribesCache: Tribe[] | null = null
let lastFetchTime = {
  contestants: 0,
  seasons: 0,
  tribes: 0,
}

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

export async function getCachedContestants(): Promise<Contestant[]> {
  const now = Date.now()
  if (!contestantsCache || now - lastFetchTime.contestants > CACHE_EXPIRATION) {
    contestantsCache = await fetchContestants()
    lastFetchTime.contestants = now
  }
  return contestantsCache
}

export async function getCachedSeasons(): Promise<Season[]> {
  const now = Date.now()
  if (!seasonsCache || now - lastFetchTime.seasons > CACHE_EXPIRATION) {
    seasonsCache = await fetchSeasons()
    lastFetchTime.seasons = now
  }
  return seasonsCache
}

export async function getCachedTribes(): Promise<Tribe[]> {
  const now = Date.now()
  if (!tribesCache || now - lastFetchTime.tribes > CACHE_EXPIRATION) {
    tribesCache = await fetchTribes()
    lastFetchTime.tribes = now
  }
  return tribesCache
}

// Function to clear the cache (useful for admin functions or after data updates)
export function clearCache() {
  contestantsCache = null
  seasonsCache = null
  tribesCache = null
  lastFetchTime = {
    contestants: 0,
    seasons: 0,
    tribes: 0,
  }
}
