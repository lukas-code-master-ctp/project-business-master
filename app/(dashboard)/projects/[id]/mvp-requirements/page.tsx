import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'core_feature',
    label: '¿Cuál es la funcionalidad principal que debe tener tu MVP?',
    placeholder: 'ej: sistema de reservas online, marketplace de compra-venta, app de seguimiento...',
  },
  {
    id: 'target_users',
    label: '¿Quiénes son los primeros usuarios que probarán el MVP?',
    placeholder: 'ej: 20 dueños de restaurants en Providencia, 50 mamás de un colegio específico...',
  },
  {
    id: 'build_timeline',
    label: '¿En cuánto tiempo necesitas tener el MVP listo?',
    placeholder: 'ej: 4 semanas, 2 meses, antes del 15 de julio...',
  },
]

const OUTPUT_LABELS: Record<string, string> = {
  mvp_description: 'Descripción del MVP',
  core_hypothesis: 'Hipótesis Central',
  user_stories: 'User Stories',
  must_have_features: 'Features Obligatorios',
  nice_to_have_features: 'Features Opcionales',
  out_of_scope: 'Fuera de Alcance',
  technical_stack: 'Stack Tecnológico',
  timeline_estimate: 'Estimación de Tiempo',
  budget_estimate_clp: 'Presupuesto Estimado (CLP)',
  success_metrics: 'Métricas de Éxito',
}

export default async function MvpRequirementsPage({
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
    .eq('module_id', 'mvp_requirements')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="mvp_requirements"
      moduleName="Requisitos del MVP"
      wizardQuestions={WIZARD_QUESTIONS}
      outputLabels={OUTPUT_LABELS}
      phase="BUILD"
    />
  )
}
