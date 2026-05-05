import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ModulePageClient } from '@/components/modules/ModulePageClient'
import type { Project, ModuleOutput } from '@/lib/types'

const OUTPUT_LABELS: Record<string, string> = {
  hero_headline: 'Titular Principal',
  hero_subheadline: 'Subtítulo',
  hero_cta: 'Llamada a la Acción',
  about_section: 'Sección "Quiénes Somos"',
  features: 'Características',
  social_proof_placeholder: 'Testimonial Placeholder',
  cta_section: 'Segunda Llamada a la Acción',
  seo_keywords: 'Keywords SEO',
  meta_description: 'Meta Description',
  footer_tagline: 'Tagline del Footer',
}

export default async function WebsitePage({
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
    .eq('module_id', 'website')
    .single()

  if (moduleError || !moduleOutput) notFound()

  if (moduleOutput.status === 'locked') {
    redirect(`/projects/${id}`)
  }

  return (
    <ModulePageClient
      project={project as Project}
      moduleOutput={moduleOutput as ModuleOutput}
      moduleId="website"
      moduleName="Contenido Web"
      wizardQuestions={[]}
      outputLabels={OUTPUT_LABELS}
      phase="BUILD"
    />
  )
}
