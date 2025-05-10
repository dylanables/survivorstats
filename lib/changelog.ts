export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

export const changelogData: ChangelogEntry[] = [
  {
    version: "v1.2",
    date: "May 10, 2025",
    changes: [
      "Added Supabase integration for data storage",
      "Added changelog page to track updates",
      "Implemented data caching for improved performance",
      "Optimized data loading with server components",
      "Enhanced mobile responsiveness across all pages",
    ],
  },
  {
    version: "v1.1",
    date: "May 10, 2025",
    changes: [
      "Added contestant detail pages",
      "Added season detail pages",
      "Implemented comparison tool for contestants and seasons",
      "Fixed hometown parsing for contestant data",
      "Resolved hydration errors in chart components",
      "Enhanced data visualization with interactive charts",
      "Improved filtering options for contestants and seasons",
    ],
  },
  {
    version: "v1.0",
    date: "May 10, 2025",
    changes: [
      "Initial release of Survivor Stats Dashboard",
      "Basic statistics for contestants, seasons, and tribes",
      "Demographics visualization",
      "Winners timeline",
    ],
  },
]
