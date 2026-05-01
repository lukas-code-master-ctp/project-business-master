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

  const body = await request.json() // { status?, output? }

  const { error: updateError } = await supabase
    .from('module_outputs')
    .update({ ...body, updated_at: new Date().toISOString() })
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

  for (const m of newStatuses) {
    const old = allModules.find(a => a.module_id === m.module_id)
    if (old && old.status !== m.status) {
      await supabase
        .from('module_outputs')
        .update({ status: m.status })
        .eq('project_id', id)
        .eq('module_id', m.module_id)
    }
  }

  const newStage = refineProgress === 100 ? 'BUILD' : 'REFINE'
  await supabase
    .from('projects')
    .update({
      refine_progress: refineProgress,
      build_progress: buildProgress,
      current_stage: newStage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  return NextResponse.json({ success: true, refineProgress, buildProgress })
}
