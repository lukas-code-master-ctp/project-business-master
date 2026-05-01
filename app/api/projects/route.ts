import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInitialModules } from '@/lib/state-machine'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const name = body?.name?.trim()
  const idea = body?.idea?.trim()

  if (!name || !idea) {
    return NextResponse.json({ error: 'name and idea are required' }, { status: 400 })
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ user_id: user.id, name, idea })
    .select()
    .single()

  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 500 })

  const modules = getInitialModules().map(m => ({
    project_id: project.id,
    module_id: m.module_id,
    status: m.status,
  }))

  const { error: modulesError } = await supabase.from('module_outputs').insert(modules)
  if (modulesError) return NextResponse.json({ error: modulesError.message }, { status: 500 })

  return NextResponse.json(project, { status: 201 })
}
