import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateModuleOutput, type RefineModuleId } from '@/lib/ai-orchestrator'

const VALID_REFINE_MODULES = new Set<string>([
  'lean_canvas',
  'validation',
  'brand',
  'outreach',
])

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  const { module: moduleId } = await params

  if (!VALID_REFINE_MODULES.has(moduleId)) {
    return NextResponse.json({ error: 'Módulo no válido' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = (await request.json()) as {
    projectId?: string
    wizardAnswers?: Record<string, unknown>
  }

  if (!body.projectId || !body.wizardAnswers) {
    return NextResponse.json(
      { error: 'projectId y wizardAnswers son requeridos' },
      { status: 400 }
    )
  }

  // Ownership check — defense-in-depth alongside RLS
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, idea')
    .eq('id', body.projectId)
    .eq('user_id', user.id)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
  }

  // Fetch completed module outputs for context injection
  const { data: moduleOutputs } = await supabase
    .from('module_outputs')
    .select('module_id, output')
    .eq('project_id', body.projectId)
    .eq('status', 'completed')

  const previousOutputs: Record<string, Record<string, unknown>> = {}
  for (const mo of moduleOutputs ?? []) {
    if (mo.output) {
      previousOutputs[mo.module_id] = mo.output as Record<string, unknown>
    }
  }

  try {
    const output = await generateModuleOutput({
      moduleId: moduleId as RefineModuleId,
      idea: project.idea,
      wizardAnswers: body.wizardAnswers,
      previousOutputs,
    })
    return NextResponse.json({ output })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error generando output'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
