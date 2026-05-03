import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildMvpRequirementsPrompts(
  idea: string,
  wizardAnswers: Record<string, unknown>,
  previousOutputs: Record<string, Record<string, unknown>>
): { system: string; user: string } {
  const leanCanvas = previousOutputs['lean_canvas'] ?? {}
  const brand = previousOutputs['brand'] ?? {}

  const system = `Eres un product manager con experiencia en startups chilenas.
Defines MVPs alcanzables con equipos pequeños y presupuestos limitados.
Prioriza funcionalidades que validan la hipótesis central. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Idea: ${idea}
Lean Canvas: ${JSON.stringify(leanCanvas, null, 2)}
Marca: ${JSON.stringify(brand, null, 2)}
Respuestas del wizard: ${JSON.stringify(wizardAnswers, null, 2)}

Define los requisitos del MVP en JSON:
{
  "mvp_description": "descripción del MVP en 2-3 oraciones",
  "core_hypothesis": "hipótesis principal que este MVP valida",
  "user_stories": [
    { "as_a": "tipo de usuario", "i_want": "funcionalidad", "so_that": "beneficio" }
  ],
  "must_have_features": ["feature obligatorio 1"],
  "nice_to_have_features": ["feature opcional 1"],
  "out_of_scope": ["qué NO incluye el MVP"],
  "technical_stack": "tecnología recomendada y por qué",
  "timeline_estimate": "estimación de tiempo realista",
  "budget_estimate_clp": "rango de presupuesto en CLP",
  "success_metrics": ["métrica 1 para validar el MVP"]
}

Incluye al menos 3 user stories, 4 must-have features y 2 success metrics. Devuelve SOLO el JSON.`

  return { system, user }
}
