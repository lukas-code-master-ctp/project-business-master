import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { NewProjectButton } from '@/components/dashboard/NewProjectButton'
import type { Project } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const list = (projects ?? []) as Project[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900">Mis proyectos</h1>
          <p className="font-outfit text-gray-500 mt-1">Tus ideas en construcción</p>
        </div>
        <NewProjectButton />
      </div>

      {list.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-outfit text-gray-400 text-lg mb-6">
            Aún no tienes proyectos. ¡Empieza ahora!
          </p>
          <NewProjectButton large />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
