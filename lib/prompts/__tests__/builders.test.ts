import { describe, it, expect } from 'vitest'
import { buildLeanCanvasPrompts } from '../lean-canvas'
import { buildValidationPrompts } from '../validation'
import { buildBrandPrompts } from '../brand'
import { buildOutreachPrompts } from '../outreach'

describe('buildLeanCanvasPrompts', () => {
  it('returns system and user strings', () => {
    const result = buildLeanCanvasPrompts('Marketplace orgánico', {})
    expect(typeof result.system).toBe('string')
    expect(typeof result.user).toBe('string')
  })

  it('includes idea in user prompt', () => {
    const { user } = buildLeanCanvasPrompts('Marketplace de productos orgánicos', {
      sector: 'agtech',
    })
    expect(user).toContain('Marketplace de productos orgánicos')
    expect(user).toContain('agtech')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildLeanCanvasPrompts('Test', {})
    expect(system).toContain('CONTEXTO CHILE')
    expect(system).toContain('CORFO')
  })
})

describe('buildValidationPrompts', () => {
  it('includes lean canvas output in user prompt', () => {
    const leanCanvas = { problem: 'Distribución opaca elimina márgenes' }
    const { user } = buildValidationPrompts(
      'Marketplace orgánico',
      { hipotesis: 'Clientes pagan por trazabilidad' },
      leanCanvas
    )
    expect(user).toContain('Distribución opaca elimina márgenes')
    expect(user).toContain('Clientes pagan por trazabilidad')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildValidationPrompts('Test', {}, {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})

describe('buildBrandPrompts', () => {
  it('includes lean canvas output in user prompt', () => {
    const leanCanvas = { unique_value: 'Trazabilidad real del productor' }
    const { user } = buildBrandPrompts(
      'Marketplace orgánico',
      { tono: 'cercano y auténtico' },
      leanCanvas
    )
    expect(user).toContain('Trazabilidad real del productor')
    expect(user).toContain('cercano y auténtico')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildBrandPrompts('Test', {}, {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})

describe('buildOutreachPrompts', () => {
  it('includes both lean canvas and brand outputs in user prompt', () => {
    const leanCanvas = { unique_value: 'Trazabilidad real' }
    const brand = { positioning: 'El marketplace de confianza para Chile' }
    const { user } = buildOutreachPrompts(
      'Marketplace orgánico',
      { canal: 'WhatsApp Business', nombre_marca: 'FundoFresh' },
      leanCanvas,
      brand
    )
    expect(user).toContain('Trazabilidad real')
    expect(user).toContain('El marketplace de confianza para Chile')
    expect(user).toContain('WhatsApp Business')
  })

  it('includes CHILE_CONTEXT in system prompt', () => {
    const { system } = buildOutreachPrompts('Test', {}, {}, {})
    expect(system).toContain('CONTEXTO CHILE')
  })
})
