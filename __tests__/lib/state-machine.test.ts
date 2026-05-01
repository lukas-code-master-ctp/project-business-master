import { describe, it, expect } from 'vitest'
import {
  computeProgress,
  computeModuleStatuses,
  getInitialModules,
  type ModuleState,
} from '@/lib/state-machine'

describe('getInitialModules', () => {
  it('returns 9 modules', () => {
    expect(getInitialModules()).toHaveLength(9)
  })

  it('sets lean_canvas as available', () => {
    const modules = getInitialModules()
    expect(modules.find(m => m.module_id === 'lean_canvas')?.status).toBe('available')
  })

  it('locks all other modules', () => {
    const modules = getInitialModules()
    const others = modules.filter(m => m.module_id !== 'lean_canvas')
    expect(others.every(m => m.status === 'locked')).toBe(true)
  })
})

describe('computeProgress', () => {
  it('returns 0/0 with initial modules', () => {
    expect(computeProgress(getInitialModules())).toEqual({
      refineProgress: 0,
      buildProgress: 0,
    })
  })

  it('returns refineProgress 25 when lean_canvas completed', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'available' },
      { module_id: 'brand', status: 'locked' },
      { module_id: 'outreach', status: 'locked' },
      { module_id: 'website', status: 'locked' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    expect(computeProgress(modules)).toEqual({ refineProgress: 25, buildProgress: 0 })
  })

  it('returns refineProgress 100 when all REFINE modules completed', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'completed' },
      { module_id: 'brand', status: 'completed' },
      { module_id: 'outreach', status: 'completed' },
      { module_id: 'website', status: 'locked' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    expect(computeProgress(modules)).toEqual({ refineProgress: 100, buildProgress: 0 })
  })

  it('returns buildProgress 40 when 2 of 5 BUILD modules completed', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'completed' },
      { module_id: 'brand', status: 'completed' },
      { module_id: 'outreach', status: 'completed' },
      { module_id: 'website', status: 'completed' },
      { module_id: 'mvp_requirements', status: 'completed' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    expect(computeProgress(modules)).toEqual({ refineProgress: 100, buildProgress: 40 })
  })
})

describe('computeModuleStatuses', () => {
  it('unlocks validation when lean_canvas completed', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'locked' },
      { module_id: 'brand', status: 'locked' },
      { module_id: 'outreach', status: 'locked' },
      { module_id: 'website', status: 'locked' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    const result = computeModuleStatuses(modules)
    expect(result.find(m => m.module_id === 'validation')?.status).toBe('available')
    expect(result.find(m => m.module_id === 'brand')?.status).toBe('locked')
  })

  it('does not unlock BUILD modules when REFINE is incomplete', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'completed' },
      { module_id: 'brand', status: 'completed' },
      { module_id: 'outreach', status: 'available' },
      { module_id: 'website', status: 'locked' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    const result = computeModuleStatuses(modules)
    expect(result.find(m => m.module_id === 'website')?.status).toBe('locked')
  })

  it('unlocks website when all REFINE modules completed', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'completed' },
      { module_id: 'brand', status: 'completed' },
      { module_id: 'outreach', status: 'completed' },
      { module_id: 'website', status: 'locked' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    const result = computeModuleStatuses(modules)
    expect(result.find(m => m.module_id === 'website')?.status).toBe('available')
    expect(result.find(m => m.module_id === 'mvp_requirements')?.status).toBe('locked')
  })

  it('preserves completed status', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'completed' },
      { module_id: 'brand', status: 'locked' },
      { module_id: 'outreach', status: 'locked' },
      { module_id: 'website', status: 'locked' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    const result = computeModuleStatuses(modules)
    expect(result.find(m => m.module_id === 'lean_canvas')?.status).toBe('completed')
    expect(result.find(m => m.module_id === 'validation')?.status).toBe('completed')
  })

  it('unlocks BUILD chain sequentially after REFINE complete', () => {
    const modules: ModuleState[] = [
      { module_id: 'lean_canvas', status: 'completed' },
      { module_id: 'validation', status: 'completed' },
      { module_id: 'brand', status: 'completed' },
      { module_id: 'outreach', status: 'completed' },
      { module_id: 'website', status: 'completed' },
      { module_id: 'mvp_requirements', status: 'locked' },
      { module_id: 'mvp_builder', status: 'locked' },
      { module_id: 'business_toolkit', status: 'locked' },
      { module_id: 'ecosystem', status: 'locked' },
    ]
    const result = computeModuleStatuses(modules)
    expect(result.find(m => m.module_id === 'mvp_requirements')?.status).toBe('available')
    expect(result.find(m => m.module_id === 'mvp_builder')?.status).toBe('locked')
  })
})
