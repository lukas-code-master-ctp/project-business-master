import OpenAI from 'openai'
import type { ModuleId } from '@/lib/state-machine'
import { buildLeanCanvasPrompts } from '@/lib/prompts/lean-canvas'
import { buildValidationPrompts } from '@/lib/prompts/validation'
import { buildBrandPrompts } from '@/lib/prompts/brand'
import { buildOutreachPrompts } from '@/lib/prompts/outreach'
import { buildWebsitePrompts } from '@/lib/prompts/website'
import { buildMvpRequirementsPrompts } from '@/lib/prompts/mvp-requirements'
import { buildMvpBuilderPrompts } from '@/lib/prompts/mvp-builder'
import { buildBusinessToolkitPrompts } from '@/lib/prompts/business-toolkit'
import { buildEcosystemPrompts } from '@/lib/prompts/ecosystem'

export type RefineModuleId = Extract<ModuleId, 'lean_canvas' | 'validation' | 'brand' | 'outreach'>
export type SupportedModuleId = ModuleId

export interface GenerateParams {
  moduleId: SupportedModuleId
  idea: string
  wizardAnswers: Record<string, unknown>
  previousOutputs: Record<string, Record<string, unknown>>
}

// Default model — override via AI_MODEL env var to test others
// Recommended choices for quick comparison:
//   - anthropic/claude-3.5-sonnet       (best overall quality)
//   - openai/gpt-4o                     (strong alternative)
//   - google/gemini-2.0-flash-exp:free  (free during beta)
//   - deepseek/deepseek-chat            (ultra cheap, decent quality)
const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet'

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
    case 'website':
      return buildWebsitePrompts(idea, previousOutputs)
    case 'mvp_requirements':
      return buildMvpRequirementsPrompts(idea, wizardAnswers, previousOutputs)
    case 'mvp_builder':
      return buildMvpBuilderPrompts(idea, previousOutputs)
    case 'business_toolkit':
      return buildBusinessToolkitPrompts(idea, wizardAnswers, previousOutputs)
    case 'ecosystem':
      return buildEcosystemPrompts(idea, previousOutputs)
  }
}

function extractJson(text: string): Record<string, unknown> {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonString = codeBlockMatch ? codeBlockMatch[1] : text
  const parsed: unknown = JSON.parse(jsonString.trim())
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('AI response was not a JSON object')
  }
  return parsed as Record<string, unknown>
}

export async function generateModuleOutput(
  params: GenerateParams
): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured')
  }

  const model = process.env.AI_MODEL ?? DEFAULT_MODEL
  const { system, user } = buildPrompts(params)

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://emprendecl.app',
      'X-Title': 'EmprendeCL',
    },
  })

  const completion = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('AI returned no text content')
  }

  return extractJson(content)
}
