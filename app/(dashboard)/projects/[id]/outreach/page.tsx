import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'nombre_marca',
    label: '¿Cuál es el nombre de marca que elegiste?',
    placeholder: 'ej: FundoFresh, AgroTrace, CampoDirecto...',
  },
  {
    id: 'canal_adquisicion',
    label: '¿Cuál será tu canal principal de adquisición de clientes?',
    placeholder: 'ej: WhatsApp Business con productores, Instagram para consumidores, ferias locales, LinkedIn para B2B...',
  },
  {
    id: 'perfil_cliente',
    label: '¿A quién le harás el pitch primero? Describe el perfil.',
    placeholder: 'ej: Dueños de restaurantes en Providencia, 35-50 años, preocupados por calidad e historia del producto...',
  },
]

const OUTPUT_LABELS: Record<string, string> = {
  elevator_pitch: 'Elevator Pitch',
  whatsapp_messages: 'Mensajes WhatsApp',
  landing_copy: 'Copy para Landing Page',
  cold_email: 'Email Frío',
}

export default async function OutreachPage({
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
    .eq('module_id', 'outreach')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="outreach"
      moduleName="Kit de Outreach"
      wizardQuestions={WIZARD_QUESTIONS}
      outputLabels={OUTPUT_LABELS}
    />
  )
}
