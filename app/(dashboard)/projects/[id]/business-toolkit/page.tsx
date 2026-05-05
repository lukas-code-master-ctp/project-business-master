import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'months_to_revenue',
    label: '¿En cuántos meses esperas tener tus primeros ingresos?',
    placeholder: 'ej: 2 meses, 3 meses, ya tengo algunos clientes pagando...',
  },
  {
    id: 'initial_investment_clp',
    label: '¿Con cuánto capital inicial cuentas o puedes conseguir?',
    placeholder: 'ej: $500.000 CLP propios, $2.000.000 CLP con apoyo familiar, postulando a SERCOTEC...',
  },
  {
    id: 'business_model',
    label: '¿Cómo planeas ganar dinero principalmente?',
    placeholder: 'ej: suscripción mensual, comisión por transacción, venta directa, freemium...',
  },
]

const OUTPUT_LABELS: Record<string, string> = {
  pricing_strategy: 'Estrategia de Precios',
  revenue_model: 'Modelo de Ingresos',
  monthly_projections: 'Proyecciones Mensuales',
  go_to_market_plan: 'Plan Go-to-Market',
  funding_sources: 'Fuentes de Financiamiento',
  legal_checklist: 'Checklist Legal',
  kpis: 'KPIs Clave',
  break_even_estimate: 'Punto de Equilibrio',
}

export default async function BusinessToolkitPage({
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
    .eq('module_id', 'business_toolkit')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="business_toolkit"
      moduleName="Kit de Negocios"
      wizardQuestions={WIZARD_QUESTIONS}
      outputLabels={OUTPUT_LABELS}
      phase="BUILD"
    />
  )
}
