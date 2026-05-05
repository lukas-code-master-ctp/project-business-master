import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { Project, ModuleOutput } from '@/lib/types'

const OUTPUT_LABELS: Record<string, string> = {
  sector_overview: 'Panorama del Sector',
  accelerators: 'Aceleradoras',
  investors: 'Inversores',
  grants: 'Fondos y Subsidios',
  strategic_partners: 'Socios Estratégicos',
  communities: 'Comunidades',
  events: 'Eventos',
}

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) notFound()

  const { data: moduleOutput, error: moduleError } = await supabase
    .from('module_outputs')
    .select('*')
    .eq('project_id', id)
    .eq('module_id', 'ecosystem')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="ecosystem"
      moduleName="Mapa del Ecosistema"
      wizardQuestions={[]}
      outputLabels={OUTPUT_LABELS}
      phase="BUILD"
    />
  )
}
