import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildLeanCanvasPrompts(
  idea: string,
  wizardAnswers: Record<string, string>
): { system: string; user: string } {
  const system = `Eres un experto en metodología Lean Startup especializado en el mercado chileno.
Generas Lean Canvas estructurados, específicos y accionables.
NUNCA uses respuestas genéricas. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Idea del emprendedor: ${idea}
Respuestas del wizard: ${JSON.stringify(wizardAnswers, null, 2)}

Genera un Lean Canvas completo en JSON con los campos:
customer_segments, problem, unique_value, solution, channels,
revenue_streams, cost_structure, key_metrics, unfair_advantage,
existing_alternatives, chile_context.

Sé específico con nombres de plataformas chilenas, montos en CLP,
fondos de fomento aplicables y estructura legal recomendada.

Devuelve SOLO el JSON, sin explicaciones adicionales.`

  return { system, user }
}
