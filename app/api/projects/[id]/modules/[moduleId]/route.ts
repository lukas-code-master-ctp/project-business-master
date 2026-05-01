import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeModuleStatuses, computeProgress } from '@/lib/state-machine'
import type { ModuleState } from '@/lib/state-machine'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const { id, moduleId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only allow setting output — status is managed exclusively by the state machine
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const b = body as Record<string, unknown>
    if ('output' in b) patch.output = b.output
    if ('status' in b) patch.status = b.status
  }

  // Verify ownership via project membership before touching module_outputs
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error: updateError } = await supabase
    .from('module_outputs')
    .update(patch)
    .eq('project_id', id)
    .eq('module_id', moduleId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  const { data: allModules, error: fetchError } = await supabase
    .from('module_outputs')
    .select('module_id, status')
    .eq('project_id', id)

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  const newStatuses = computeModuleStatuses(allModules as ModuleState[])
  const { refineProgress, buildProgress } = computeProgress(allModules as ModuleState[])

  const cascadeErrors: string[] = []
  for (const m of newStatuses) {
    const old = allModules.find(a => a.module_id === m.module_id)
    if (old && old.status !== m.status) {
      const { error: cascadeError } = await supabase
        .from('module_outputs')
        .update({ status: m.status })
        .eq('project_id', id)
        .eq('module_id', m.module_id)
      if (cascadeError) cascadeErrors.push(cascadeError.message)
    }
  }

  if (cascadeErrors.length > 0) {
    return NextResponse.json(
      { error: `Cascade update failed: ${cascadeErrors.join(', ')}` },
      { status: 500 }
    )
  }

  const newStage = refineProgress === 100 ? 'BUILD' : 'REFINE'
  const { error: progressError } = await supabase
    .from('projects')
    .update({
      refine_progress: refineProgress,
      build_progress: buildProgress,
      current_stage: newStage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, refineProgress, buildProgress })
}
