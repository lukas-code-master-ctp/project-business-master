import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StagesRow } from '@/components/project/StagesRow'
import { ModuleList } from '@/components/project/ModuleList'
import { BuildPreview } from '@/components/project/BuildPreview'
import type { ProjectWithModules } from '@/lib/types'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*, module_outputs(*)')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const project = data as ProjectWithModules

  return (
    <div className="p-8">
      <div className="mb-8">
        <span className="font-mono text-xs text-gray-400">Proyecto</span>
        <h1 className="font-syne font-bold text-3xl text-gray-900 mt-1">{project.name}</h1>
        <p className="font-outfit text-gray-500 mt-2 max-w-2xl">{project.idea}</p>
      </div>

      <StagesRow
        refineProgress={project.refine_progress}
        buildProgress={project.build_progress}
        currentStage={project.current_stage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-syne font-bold text-xl text-gray-900 mb-4">REFINE</h2>
          <ModuleList
            projectId={id}
            modules={project.module_outputs}
            stage="REFINE"
          />
        </div>
        <div>
          <h2
            className={`font-syne font-bold text-xl mb-4 ${
              project.refine_progress < 100 ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            BUILD
          </h2>
          {project.refine_progress < 100 ? (
            <BuildPreview />
          ) : (
            <ModuleList
              projectId={id}
              modules={project.module_outputs}
              stage="BUILD"
            />
          )}
        </div>
      </div>
    </div>
  )
}
