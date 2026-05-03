import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildBusinessToolkitPrompts(
  idea: string,
  wizardAnswers: Record<string, unknown>,
  previousOutputs: Record<string, Record<string, unknown>>
): { system: string; user: string } {
  const leanCanvas = previousOutputs['lean_canvas'] ?? {}
  const validation = previousOutputs['validation'] ?? {}

  const system = `Eres un consultor de negocios especializado en startups chilenas.
Combinas conocimiento de fondos CORFO/SERCOTEC, estructura SpA y mercado local.
Generas planes financieros y de go-to-market realistas para Chile. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Idea: ${idea}
Lean Canvas: ${JSON.stringify(leanCanvas, null, 2)}
Validación: ${JSON.stringify(validation, null, 2)}
Respuestas del wizard: ${JSON.stringify(wizardAnswers, null, 2)}

Genera el kit de negocios completo en JSON:
{
  "pricing_strategy": "estrategia de precios con valores en CLP",
  "revenue_model": "descripción del modelo de ingresos",
  "monthly_projections": [
    { "month": 1, "revenue_clp": 0, "expenses_clp": 0, "customers": 0 }
  ],
  "go_to_market_plan": {
    "phase_1": "primeras 4 semanas",
    "phase_2": "semanas 5-12",
    "phase_3": "mes 4 en adelante"
  },
  "funding_sources": [
    { "name": "nombre del fondo", "amount_clp": 0, "requirements": "requisitos", "url": "enlace" }
  ],
  "legal_checklist": ["paso legal 1"],
  "kpis": [
    { "metric": "nombre métrica", "target": "meta", "frequency": "mensual" }
  ],
  "break_even_estimate": "estimación de punto de equilibrio"
}

monthly_projections debe tener 6 meses. funding_sources debe incluir opciones CORFO y SERCOTEC aplicables. Devuelve SOLO el JSON.`

  return { system, user }
}
