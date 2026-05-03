import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    constructor(config: { apiKey: string }) {}
    messages = { create: mockCreate }
  },
}))

import { generateModuleOutput } from '@/lib/ai-orchestrator'

describe('generateModuleOutput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = 'test-key'
  })

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY
  })

  it('returns parsed JSON from Claude response', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify({ customer_segments: 'Familias urbanas', problem: 'Distribución opaca' }) }],
    })
    const result = await generateModuleOutput({
      moduleId: 'lean_canvas',
      idea: 'Marketplace de orgánicos',
      wizardAnswers: { sector: 'agtech' },
      previousOutputs: {},
    })
    expect(result).toEqual({ customer_segments: 'Familias urbanas', problem: 'Distribución opaca' })
  })

  it('parses JSON wrapped in markdown code blocks', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```json\n{"key": "value"}\n```' }],
    })
    const result = await generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} })
    expect(result).toEqual({ key: 'value' })
  })

  it('throws when ANTHROPIC_API_KEY is not set', async () => {
    delete process.env.ANTHROPIC_API_KEY
    await expect(
      generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} })
    ).rejects.toThrow('ANTHROPIC_API_KEY not configured')
  })

  it('throws when response has no text block', async () => {
    mockCreate.mockResolvedValue({ content: [] })
    await expect(generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} }))
      .rejects.toThrow('Claude returned no text content')
  })

  it('throws when response text is not valid JSON', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: 'Lo siento, no puedo.' }] })
    await expect(generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} }))
      .rejects.toThrow()
  })

  it('passes previous lean_canvas output to validation prompt', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: '{"hypotheses": []}' }] })
    await generateModuleOutput({
      moduleId: 'validation',
      idea: 'Test',
      wizardAnswers: { hipotesis: 'Mi hipótesis' },
      previousOutputs: { lean_canvas: { problem: 'Distribución opaca', customer_segments: 'Familias urbanas' } },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Distribución opaca')
  })

  it('passes lean_canvas and brand outputs to outreach prompt', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: '{"elevator_pitch": {}}' }] })
    await generateModuleOutput({
      moduleId: 'outreach',
      idea: 'Test',
      wizardAnswers: { canal: 'WhatsApp' },
      previousOutputs: {
        lean_canvas: { unique_value: 'Trazabilidad real' },
        brand: { positioning: 'El marketplace de confianza' },
      },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Trazabilidad real')
    expect(callArgs.messages[0].content).toContain('El marketplace de confianza')
  })

  it('routes website module and passes all previousOutputs', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"hero_headline": "El sabor del campo directo a tu mesa"}' }],
    })
    await generateModuleOutput({
      moduleId: 'website',
      idea: 'Marketplace orgánico',
      wizardAnswers: {},
      previousOutputs: {
        lean_canvas: { unique_value: 'Trazabilidad real' },
        brand: { positioning: 'Confianza del productor' },
        outreach: { elevator_pitch: { version_30s: 'Pitch corto' } },
      },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Trazabilidad real')
    expect(callArgs.messages[0].content).toContain('Confianza del productor')
  })

  it('routes mvp_requirements module and passes wizardAnswers', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"mvp_description": "Plataforma de trazabilidad"}' }],
    })
    await generateModuleOutput({
      moduleId: 'mvp_requirements',
      idea: 'Marketplace orgánico',
      wizardAnswers: { core_feature: 'Trazabilidad en tiempo real' },
      previousOutputs: { lean_canvas: { problem: 'Distribución opaca' } },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Trazabilidad en tiempo real')
  })

  it('routes ecosystem module and passes lean_canvas output', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"sector_overview": "Agtech en Chile crece un 20% anual"}' }],
    })
    await generateModuleOutput({
      moduleId: 'ecosystem',
      idea: 'Marketplace orgánico',
      wizardAnswers: {},
      previousOutputs: { lean_canvas: { customer_segments: 'Productores del Maule' } },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Productores del Maule')
  })
})
