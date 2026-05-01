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
    .eq('user_id', user.id)
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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const b = body as Record<string, unknown>
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  const idea = typeof b.idea === 'string' ? b.idea.trim() : ''

  if (!name || !idea) {
    return NextResponse.json({ error: 'name and idea are required' }, { status: 400 })
  }
  if (name.length > 200 || idea.length > 2000) {
    return NextResponse.json({ error: 'name or idea exceeds maximum length' }, { status: 400 })
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
