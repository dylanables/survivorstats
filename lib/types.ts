// Contestant types
export interface Contestant {
    contestant_name: string
    age: string
    hometown: string
    city: string
    homestate: string
    profession: string
    num_season: string
    finish: string
    gender: string
    african_american: number
    asian_american: number
    latin_american: number
    poc: number
    jewish: number
    muslim: number
    lgbt: number
    state: string
    country: string
    num_appearance: number
    birthdate: string
    merge: number
    jury: number
    ftc: number
    votes_against: string
    num_boot: string
    tribe1: string
    tribe2: string
    tribe3: string
    quit: number
    evac: number
    ejected: number
    fmc: number
    num_jury_votes: string
    normalized_finish: string
  }
  
  // Season types
  export interface Season {
    num_season: string
    season: string
    merged_tribe: string
    num_merge: string
    day_merge: string
    num_jury: string
    num_ftc: number
    num_swaps: number
    num_contestants: number
    redemption_island: number
    edge_of_extinction: number
    num_days: string
    african_american: number
    asian_american: number
    latin_american: number
    poc: string
    lgbt: number
    jewish: number
    muslim: number
    num_quits: number
    num_evacs: number
    winner: string
  }
  
  // Tribe types
  export interface Tribe {
    num_season: string
    tribe: string
    iter_num: number
    num_contestants: string
    merge: number
    african_american: number
    asian_american: number
    latin_american: number
    poc: number
    jewish: number
    muslim: number
    lgbt: number
    male: number
    female: number
    non_binary: number
    color: string
  }
  