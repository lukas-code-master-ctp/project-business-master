import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { Project, ModuleOutput } from '@/lib/types'

const OUTPUT_LABELS: Record<string, string> = {
  tech_recommendation: 'Stack Recomendado',
  setup_steps: 'Pasos de Configuración',
  database_schema: 'Esquema de Base de Datos',
  api_endpoints: 'Endpoints API',
  landing_page_html: 'HTML Landing Page',
  deployment_guide: 'Guía de Deployment',
  estimated_cost_clp: 'Costo Mensual Estimado (CLP)',
}

export default async function MvpBuilderPage({
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
    .eq('module_id', 'mvp_builder')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="mvp_builder"
      moduleName="Constructor de MVP"
      wizardQuestions={[]}
      outputLabels={OUTPUT_LABELS}
      phase="BUILD"
    />
  )
}
