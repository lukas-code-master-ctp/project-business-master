import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'sector',
    label: '¿A qué sector pertenece tu idea?',
    placeholder: 'ej: agtech, retail, edtech, salud, fintech, turismo...',
  },
  {
    id: 'cliente',
    label: '¿Quién es tu cliente principal?',
    placeholder: 'ej: dueños de restaurantes en Santiago, madres con hijos de 2 a 10 años...',
  },
  {
    id: 'problema',
    label: '¿Qué problema concreto resuelves? ¿Por qué los clientes lo sufren hoy?',
    placeholder: 'Describe el dolor real que tu cliente siente actualmente...',
  },
]

const OUTPUT_LABELS: Record<string, string> = {
  customer_segments: 'Segmentos de Clientes',
  problem: 'Problema',
  unique_value: 'Propuesta de Valor Única',
  solution: 'Solución',
  channels: 'Canales',
  revenue_streams: 'Fuentes de Ingreso',
  cost_structure: 'Estructura de Costos',
  key_metrics: 'Métricas Clave',
  unfair_advantage: 'Ventaja Injusta',
  existing_alternatives: 'Alternativas Existentes',
  chile_context: 'Contexto Chile',
}

export default async function LeanCanvasPage({
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
    .eq('module_id', 'lean_canvas')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="lean_canvas"
      moduleName="Lean Canvas"
      wizardQuestions={WIZARD_QUESTIONS}
      outputLabels={OUTPUT_LABELS}
    />
  )
}
