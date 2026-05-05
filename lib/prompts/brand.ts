import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildBrandPrompts(
  idea: string,
  wizardAnswers: Record<string, unknown>,
  leanCanvasOutput: Record<string, unknown>
): { system: string; user: string } {
  const system = `Eres un estratega de marca especializado en startups latinoamericanas y el mercado chileno.
Creas identidades memorables, auténticas y culturalmente relevantes para Chile.
NUNCA propongas nombres en inglés si el mercado es local. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Lean Canvas: ${JSON.stringify(leanCanvasOutput, null, 2)}
Respuestas wizard: ${JSON.stringify(wizardAnswers, null, 2)}

Idea: ${idea}

Genera en JSON:
1. brand_elements: { vision, mission, values: [3], personality: [3 rasgos], tone_of_voice }
2. name_suggestions: 5 opciones con:
   { name, brand_fit_score (1-10), rationale, memorability (high/med/low),
     domain_hint (dominio .cl sugerido), trademark_risk (low/medium/high) }
3. positioning: propuesta de posicionamiento para mercado chileno (1 oración)
4. social_guidelines: { instagram_tone, whatsapp_tone, hashtag_suggestions: [5] }

Devuelve SOLO el JSON, sin explicaciones adicionales.`

  return { system, user }
}
