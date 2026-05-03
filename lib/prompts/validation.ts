import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildValidationPrompts(
  idea: string,
  wizardAnswers: Record<string, string>,
  leanCanvasOutput: Record<string, unknown>
): { system: string; user: string } {
  const system = `Eres un experto en customer discovery y validación de startups en el mercado chileno.
Generas marcos de validación rigurosos, específicos y ejecutables.
NUNCA uses hipótesis genéricas. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Lean Canvas previo: ${JSON.stringify(leanCanvasOutput, null, 2)}
Respuestas wizard: ${JSON.stringify(wizardAnswers, null, 2)}

Idea: ${idea}

Genera en JSON:
1. hypotheses: array de 6 hipótesis críticas (formato: "Si X, entonces Y medible")
   - Cada una con: id, statement, category (demand/solution/channel/revenue),
     priority (1-5), risk_level (high/medium/low)
2. interview_guide: 14 preguntas de descubrimiento de clientes
   - Cada pregunta con: id, text, hypothesis_ids[], type (open/behavioral/pricing)
   - Incluye preguntas sobre plataformas usadas en Chile y precio esperado en CLP
3. validation_channels: 3 canales específicos en Chile para encontrar entrevistados
   (ej: grupos de Facebook regionales, ferias, universidades, LinkedIn Chile)

Devuelve SOLO el JSON, sin explicaciones adicionales.`

  return { system, user }
}
