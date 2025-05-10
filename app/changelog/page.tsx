import { changelogData } from "@/lib/changelog"
import ChangelogEntryComponent from "@/components/changelog-entry"

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Changelog</h1>

      <div className="relative">
        {/* Vertical timeline line for the first item */}
        <div className="absolute left-4 top-0 h-8 w-0.5 bg-survivor-green/30" />

        <div>
          {changelogData.map((entry, index) => (
            <ChangelogEntryComponent
              key={entry.version}
              entry={entry}
              isFirst={index === 0}
              isLast={index === changelogData.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}