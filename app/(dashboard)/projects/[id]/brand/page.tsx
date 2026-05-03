import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'tono',
    label: '¿Qué tono quieres proyectar en redes?',
    placeholder: 'ej: cercano y divertido, profesional y confiable, atrevido y disruptivo, cálido y auténtico...',
  },
  {
    id: 'referente',
    label: '¿Qué marca admiras como referente? (puede ser chilena o internacional)',
    placeholder: 'ej: Jumbo por su cercanía, Cornershop por su tecnología, Patagonia por sus valores...',
  },
  {
    id: 'no_quiero',
    label: '¿Qué adjetivos NO quieres que describan tu marca?',
    placeholder: 'ej: corporativa, aburrida, genérica, ostentosa, fría...',
  },
  {
    id: 'nombre_inicial',
    label: '¿Tienes algún nombre en mente? (si no tienes, escribe "ninguno")',
    placeholder: 'ej: FundoFresh, AgroTrace, ninguno...',
  },
]

const OUTPUT_LABELS: Record<string, string> = {
  brand_elements: 'Elementos de Marca',
  name_suggestions: 'Sugerencias de Nombre',
  positioning: 'Posicionamiento',
  social_guidelines: 'Guías para Redes Sociales',
}

export default async function BrandPage({
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
    .eq('module_id', 'brand')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="brand"
      moduleName="Identidad de Marca"
      wizardQuestions={WIZARD_QUESTIONS}
      outputLabels={OUTPUT_LABELS}
    />
  )
}
