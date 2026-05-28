import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('openai', () => ({
  default: class {
    constructor(_config: { apiKey: string; baseURL?: string }) {}
    chat = { completions: { create: mockCreate } }
  },
}))

import { generateModuleOutput } from '@/lib/ai-orchestrator'

function mockCompletion(text: string) {
  return {
    choices: [{ message: { content: text } }],
  }
}

describe('generateModuleOutput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENROUTER_API_KEY = 'test-key'
  })

  afterEach(() => {
    delete process.env.OPENROUTER_API_KEY
    delete process.env.AI_MODEL
  })

  it('returns parsed JSON from AI response', async () => {
    mockCreate.mockResolvedValue(
      mockCompletion(JSON.stringify({ customer_segments: 'Familias urbanas', problem: 'Distribución opaca' }))
    )
    const result = await generateModuleOutput({
      moduleId: 'lean_canvas',
      idea: 'Marketplace de orgánicos',
      wizardAnswers: { sector: 'agtech' },
      previousOutputs: {},
    })
    expect(result).toEqual({ customer_segments: 'Familias urbanas', problem: 'Distribución opaca' })
  })

  it('parses JSON wrapped in markdown code blocks', async () => {
    mockCreate.mockResolvedValue(mockCompletion('```json\n{"key": "value"}\n```'))
    const result = await generateModuleOutput({
      moduleId: 'lean_canvas',
      idea: 'Test',
      wizardAnswers: {},
      previousOutputs: {},
    })
    expect(result).toEqual({ key: 'value' })
  })

  it('throws when OPENROUTER_API_KEY is not set', async () => {
    delete process.env.OPENROUTER_API_KEY
    await expect(
      generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} })
    ).rejects.toThrow('OPENROUTER_API_KEY not configured')
  })

  it('throws when response has no content', async () => {
    mockCreate.mockResolvedValue({ choices: [{ message: { content: null } }] })
    await expect(
      generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} })
    ).rejects.toThrow('AI returned no text content')
  })

  it('throws when response content is not valid JSON', async () => {
    mockCreate.mockResolvedValue(mockCompletion('Lo siento, no puedo.'))
    await expect(
      generateModuleOutput({ moduleId: 'lean_canvas', idea: 'Test', wizardAnswers: {}, previousOutputs: {} })
    ).rejects.toThrow()
  })

  it('passes previous lean_canvas output to validation prompt', async () => {
    mockCreate.mockResolvedValue(mockCompletion('{"hypotheses": []}'))
    await generateModuleOutput({
      moduleId: 'validation',
      idea: 'Test',
      wizardAnswers: { hipotesis: 'Mi hipótesis' },
      previousOutputs: { lean_canvas: { problem: 'Distribución opaca', customer_segments: 'Familias urbanas' } },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[1].content).toContain('Distribución opaca')
  })

  it('passes lean_canvas and brand outputs to outreach prompt', async () => {
    mockCreate.mockResolvedValue(mockCompletion('{"elevator_pitch": {}}'))
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
    expect(callArgs.messages[1].content).toContain('Trazabilidad real')
    expect(callArgs.messages[1].content).toContain('El marketplace de confianza')
  })

  it('routes website module and passes all previousOutputs', async () => {
    mockCreate.mockResolvedValue(
      mockCompletion('{"hero_headline": "El sabor del campo directo a tu mesa"}')
    )
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
    expect(callArgs.messages[1].content).toContain('Trazabilidad real')
    expect(callArgs.messages[1].content).toContain('Confianza del productor')
  })

  it('routes mvp_requirements module and passes wizardAnswers', async () => {
    mockCreate.mockResolvedValue(mockCompletion('{"mvp_description": "Plataforma de trazabilidad"}'))
    await generateModuleOutput({
      moduleId: 'mvp_requirements',
      idea: 'Marketplace orgánico',
      wizardAnswers: { core_feature: 'Trazabilidad en tiempo real' },
      previousOutputs: { lean_canvas: { problem: 'Distribución opaca' } },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[1].content).toContain('Trazabilidad en tiempo real')
  })

  it('routes ecosystem module and passes lean_canvas output', async () => {
    mockCreate.mockResolvedValue(
      mockCompletion('{"sector_overview": "Agtech en Chile crece un 20% anual"}')
    )
    await generateModuleOutput({
      moduleId: 'ecosystem',
      idea: 'Marketplace orgánico',
      wizardAnswers: {},
      previousOutputs: { lean_canvas: { customer_segments: 'Productores del Maule' } },
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[1].content).toContain('Productores del Maule')
  })

  it('uses AI_MODEL env var when set', async () => {
    process.env.AI_MODEL = 'openai/gpt-4o'
    mockCreate.mockResolvedValue(mockCompletion('{"ok": true}'))
    await generateModuleOutput({
      moduleId: 'lean_canvas',
      idea: 'Test',
      wizardAnswers: {},
      previousOutputs: {},
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.model).toBe('openai/gpt-4o')
  })

  it('uses default model when AI_MODEL is not set', async () => {
    mockCreate.mockResolvedValue(mockCompletion('{"ok": true}'))
    await generateModuleOutput({
      moduleId: 'lean_canvas',
      idea: 'Test',
      wizardAnswers: {},
      previousOutputs: {},
    })
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.model).toBe('anthropic/claude-3.5-sonnet')
  })
})
