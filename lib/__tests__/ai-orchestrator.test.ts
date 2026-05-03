import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn(() => ({
    messages: { create: mockCreate },
  })),
}))

import { generateModuleOutput } from '@/lib/ai-orchestrator'

describe('generateModuleOutput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
})
