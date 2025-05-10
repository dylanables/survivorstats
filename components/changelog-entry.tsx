import type { ChangelogEntry } from "@/lib/changelog"
import { GitMerge } from "lucide-react"

interface ChangelogEntryProps {
  entry: ChangelogEntry
  isFirst: boolean
  isLast: boolean
}

export default function ChangelogEntryComponent({ entry, isFirst, isLast }: ChangelogEntryProps) {

  return (
    <div className="relative pl-12 pb-8">
      {/* Don't show the line after the last item */}
      {!isLast && <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-survivor-green/30" />}

      {/* Dot */}
      <div className={`${isFirst ? 'bg-survivor-orange' : 'bg-survivor-green'} absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md z-10`}>
        <span><GitMerge size={16} /></span>
      </div>

      <div className="mb-3">
        <h2 className="text-xl font-bold text-survivor-brown flex items-center">
          {entry.version}

        </h2>
        <p className="text-sm text-gray-500">{entry.date}</p>
      </div>

      <ul className="space-y-2 list-disc pl-5">
        {entry.changes.map((change, i) => (
          <li key={i} className="text-gray-800">
            {change}
          </li>
        ))}
      </ul>
    </div>
  )
}
