import type { ModuleId } from '@/lib/state-machine'

export interface Project {
  id: string
  user_id: string
  name: string
  idea: string
  current_stage: 'REFINE' | 'BUILD'
  refine_progress: number
  build_progress: number
  created_at: string
  updated_at: string
}

export interface ModuleOutput {
  id: string
  project_id: string
  module_id: ModuleId
  status: 'locked' | 'available' | 'completed'
  output: Record<string, unknown> | null
  updated_at: string
}

export interface ProjectWithModules extends Project {
  module_outputs: ModuleOutput[]
}

export interface WizardQuestion {
  id: string
  label: string
  placeholder: string
}
