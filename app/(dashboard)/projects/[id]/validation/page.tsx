import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'clientes_conocidos',
    label: '¿Cuántos potenciales clientes conoces personalmente?',
    placeholder: 'ej: 5 amigos dueños de restaurantes, 12 contactos de LinkedIn en el rubro...',
  },
  {
    id: 'conversaciones',
    label: '¿Has hablado con alguno de ellos sobre este problema?',
    placeholder: '¿Qué te dijeron? ¿Cómo reaccionaron? Si no has hablado aún, escribe "no todavía"...',
  },
  {
    id: 'hipotesis_riesgosa',
    label: '¿Cuál es tu hipótesis más arriesgada? ¿Qué es lo que más temes que no sea cierto?',
    placeholder: 'ej: "Temo que los productores no quieran vender directo al consumidor porque prefieren al distribuidor"...',
  },
]

const OUTPUT_LABELS: Record<string, string> = {
  hypotheses: 'Hipótesis Críticas',
  interview_guide: 'Guía de Entrevistas',
  validation_channels: 'Canales de Validación en Chile',
}

export default async function ValidationPage({
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
    .eq('module_id', 'validation')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="validation"
      moduleName="Plan de Validación"
      wizardQuestions={WIZARD_QUESTIONS}
      outputLabels={OUTPUT_LABELS}
    />
  )
}
