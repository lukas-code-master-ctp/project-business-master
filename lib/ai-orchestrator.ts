import Anthropic from '@anthropic-ai/sdk'
import type { ModuleId } from '@/lib/state-machine'
import { buildLeanCanvasPrompts } from '@/lib/prompts/lean-canvas'
import { buildValidationPrompts } from '@/lib/prompts/validation'
import { buildBrandPrompts } from '@/lib/prompts/brand'
import { buildOutreachPrompts } from '@/lib/prompts/outreach'

export type RefineModuleId = Extract<ModuleId, 'lean_canvas' | 'validation' | 'brand' | 'outreach'>

export interface GenerateParams {
  moduleId: RefineModuleId
  idea: string
  wizardAnswers: Record<string, unknown>
  previousOutputs: Record<string, Record<string, unknown>>
}

function buildPrompts(params: GenerateParams): { system: string; user: string } {
  const { moduleId, idea, wizardAnswers, previousOutputs } = params
  const leanCanvas = previousOutputs['lean_canvas'] ?? {}
  const brand = previousOutputs['brand'] ?? {}

  switch (moduleId) {
    case 'lean_canvas':
      return buildLeanCanvasPrompts(idea, wizardAnswers)
    case 'validation':
      return buildValidationPrompts(idea, wizardAnswers, leanCanvas)
    case 'brand':
      return buildBrandPrompts(idea, wizardAnswers, leanCanvas)
    case 'outreach':
      return buildOutreachPrompts(idea, wizardAnswers, leanCanvas, brand)
  }
}

function extractJson(text: string): Record<string, unknown> {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonString = codeBlockMatch ? codeBlockMatch[1] : text
  const parsed: unknown = JSON.parse(jsonString.trim())
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Claude response was not a JSON object')
  }
  return parsed as Record<string, unknown>
}

export async function generateModuleOutput(params: GenerateParams): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const { system, user } = buildPrompts(params)
  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: user }],
  })

  const textBlock = message.content.find(block => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude returned no text content')
  }

  return extractJson(textBlock.text)
}
