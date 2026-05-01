export type ModuleId =
  | 'lean_canvas'
  | 'validation'
  | 'brand'
  | 'outreach'
  | 'website'
  | 'mvp_requirements'
  | 'mvp_builder'
  | 'business_toolkit'
  | 'ecosystem'

export type ModuleStatus = 'locked' | 'available' | 'completed'

export interface ModuleState {
  module_id: ModuleId
  status: ModuleStatus
}

const REFINE_MODULES: ModuleId[] = ['lean_canvas', 'validation', 'brand', 'outreach']
const BUILD_MODULES: ModuleId[] = [
  'website',
  'mvp_requirements',
  'mvp_builder',
  'business_toolkit',
  'ecosystem',
]

const UNLOCK_RULES: Record<ModuleId, ModuleId | null> = {
  lean_canvas: null,
  validation: 'lean_canvas',
  brand: 'validation',
  outreach: 'brand',
  website: 'outreach',
  mvp_requirements: 'website',
  mvp_builder: 'mvp_requirements',
  business_toolkit: 'mvp_builder',
  ecosystem: 'business_toolkit',
}

export function computeProgress(modules: ModuleState[]): {
  refineProgress: number
  buildProgress: number
} {
  const statusMap = new Map(modules.map(m => [m.module_id, m.status]))
  const completedRefine = REFINE_MODULES.filter(
    id => statusMap.get(id) === 'completed'
  ).length
  const completedBuild = BUILD_MODULES.filter(
    id => statusMap.get(id) === 'completed'
  ).length
  return {
    refineProgress: Math.round((completedRefine / REFINE_MODULES.length) * 100),
    buildProgress: Math.round((completedBuild / BUILD_MODULES.length) * 100),
  }
}

export function computeModuleStatuses(modules: ModuleState[]): ModuleState[] {
  const statusMap = new Map(modules.map(m => [m.module_id, m.status]))
  const refineComplete = REFINE_MODULES.every(id => statusMap.get(id) === 'completed')

  return [...REFINE_MODULES, ...BUILD_MODULES].map(moduleId => {
    const current = statusMap.get(moduleId) ?? 'locked'

    if (current === 'completed') {
      return { module_id: moduleId, status: 'completed' }
    }

    if (BUILD_MODULES.includes(moduleId) && !refineComplete) {
      return { module_id: moduleId, status: 'locked' }
    }

    const prereq = UNLOCK_RULES[moduleId]
    if (prereq === null || statusMap.get(prereq) === 'completed') {
      return { module_id: moduleId, status: 'available' }
    }

    return { module_id: moduleId, status: 'locked' }
  })
}

export function getInitialModules(): ModuleState[] {
  return [...REFINE_MODULES, ...BUILD_MODULES].map(module_id => ({
    module_id,
    status: module_id === 'lean_canvas' ? 'available' : 'locked',
  }))
}
