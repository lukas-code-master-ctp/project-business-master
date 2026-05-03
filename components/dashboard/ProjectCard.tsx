import Link from 'next/link'
import type { Project } from '@/lib/types'

export function ProjectCard({ project }: { project: Project }) {
  const progress =
    project.current_stage === 'REFINE'
      ? project.refine_progress
      : project.build_progress
  const stageLabel =
    project.current_stage === 'REFINE' ? 'Refinamiento' : 'Construcción'

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="bg-card rounded-2xl p-6 border border-surface group-hover:border-blue/30 group-hover:shadow-md transition-all">
        <h3 className="font-syne font-bold text-gray-900 text-lg mb-1">{project.name}</h3>
        <p className="text-sm text-gray-500 font-outfit mb-4 line-clamp-2">{project.idea}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-surface rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #003ef3, #0490ff)',
              }}
            />
          </div>
          <span className="text-xs font-mono text-gray-400">{progress}%</span>
          <span className="text-xs font-outfit text-gray-500 bg-surface px-2 py-0.5 rounded-full">
            {stageLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
