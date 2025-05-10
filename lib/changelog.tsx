import Link from "next/link"

export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

export const changelogData: ChangelogEntry[] = [
  {
    version: "v1.0",
    date: "May 10, 2025",
    changes: [
      "Initial release of Survivor Stats Dashboard",
      "Imported basic data for contestants, seasons, and tribes (source: kaggle.com/datasets/justinveiner/survivor-cbs-dataset)",
    ],
  },
]
