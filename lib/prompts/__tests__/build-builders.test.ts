import { describe, it, expect } from 'vitest'
import { buildWebsitePrompts } from '../website'
import { buildMvpRequirementsPrompts } from '../mvp-requirements'
import { buildMvpBuilderPrompts } from '../mvp-builder'
import { buildBusinessToolkitPrompts } from '../business-toolkit'
import { buildEcosystemPrompts } from '../ecosystem'

describe('buildWebsitePrompts', () => {
  it('returns system and user strings', () => {
    const result = buildWebsitePrompts('Marketplace orgánico', {})
    expect(typeof result.system).toBe('string')
    expect(typeof result.user).toBe('string')
  })

  it('includes idea and previousOutputs in user prompt', () => {
    const previousOutputs = {
      lean_canvas: { unique_value: 'Trazabilidad real del productor' },
      brand: { positioning: 'El marketplace de confianza' },
      outreach: { elevator_pitch: { version_30s: 'Pitch rápido' } },
    }
    const { user } = buildWebsitePrompts('Marketplace orgánico chileno', previousOutputs)
    expect(user).toContain('Marketplace orgánico chileno')
    expect(user).toContain('Trazabilidad real del productor')
    expect(user).toContain('El marketplace de confianza')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildWebsitePrompts('Test', {})
    expect(system).toContain('CONTEXTO CHILE')
    expect(system).toContain('CORFO')
  })
})

describe('buildMvpRequirementsPrompts', () => {
  it('returns system and user strings', () => {
    const result = buildMvpRequirementsPrompts('Marketplace orgánico', {}, {})
    expect(typeof result.system).toBe('string')
    expect(typeof result.user).toBe('string')
  })

  it('includes idea, wizardAnswers and previousOutputs in user prompt', () => {
    const previousOutputs = {
      lean_canvas: { problem: 'Distribución opaca elimina márgenes' },
    }
    const wizardAnswers = { core_feature: 'Trazabilidad en tiempo real' }
    const { user } = buildMvpRequirementsPrompts(
      'Marketplace orgánico chileno',
      wizardAnswers,
      previousOutputs
    )
    expect(user).toContain('Marketplace orgánico chileno')
    expect(user).toContain('Trazabilidad en tiempo real')
    expect(user).toContain('Distribución opaca elimina márgenes')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildMvpRequirementsPrompts('Test', {}, {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})

describe('buildMvpBuilderPrompts', () => {
  it('returns system and user strings', () => {
    const result = buildMvpBuilderPrompts('Marketplace orgánico', {})
    expect(typeof result.system).toBe('string')
    expect(typeof result.user).toBe('string')
  })

  it('includes idea and mvp_requirements output in user prompt', () => {
    const previousOutputs = {
      mvp_requirements: { mvp_description: 'Plataforma de trazabilidad agrícola' },
    }
    const { user } = buildMvpBuilderPrompts('Marketplace orgánico chileno', previousOutputs)
    expect(user).toContain('Marketplace orgánico chileno')
    expect(user).toContain('Plataforma de trazabilidad agrícola')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildMvpBuilderPrompts('Test', {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})

describe('buildBusinessToolkitPrompts', () => {
  it('returns system and user strings', () => {
    const result = buildBusinessToolkitPrompts('Marketplace orgánico', {}, {})
    expect(typeof result.system).toBe('string')
    expect(typeof result.user).toBe('string')
  })

  it('includes idea, wizardAnswers and previousOutputs in user prompt', () => {
    const previousOutputs = {
      lean_canvas: { revenue_streams: 'Suscripción mensual por trazabilidad' },
      validation: { validated_hypotheses: ['Clientes pagan por trazabilidad'] },
    }
    const wizardAnswers = { months_to_revenue: '3', initial_investment_clp: '5000000' }
    const { user } = buildBusinessToolkitPrompts(
      'Marketplace orgánico chileno',
      wizardAnswers,
      previousOutputs
    )
    expect(user).toContain('Marketplace orgánico chileno')
    expect(user).toContain('Suscripción mensual por trazabilidad')
    expect(user).toContain('5000000')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildBusinessToolkitPrompts('Test', {}, {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})

describe('buildEcosystemPrompts', () => {
  it('returns system and user strings', () => {
    const result = buildEcosystemPrompts('Marketplace orgánico', {})
    expect(typeof result.system).toBe('string')
    expect(typeof result.user).toBe('string')
  })

  it('includes idea and lean_canvas output in user prompt', () => {
    const previousOutputs = {
      lean_canvas: { customer_segments: 'Productores agrícolas del Maule' },
    }
    const { user } = buildEcosystemPrompts('Marketplace orgánico chileno', previousOutputs)
    expect(user).toContain('Marketplace orgánico chileno')
    expect(user).toContain('Productores agrícolas del Maule')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildEcosystemPrompts('Test', {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})
