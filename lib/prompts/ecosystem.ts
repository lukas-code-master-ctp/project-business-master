import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildEcosystemPrompts(
  idea: string,
  previousOutputs: Record<string, Record<string, unknown>>
): { system: string; user: string } {
  const leanCanvas = previousOutputs['lean_canvas'] ?? {}
  const brand = previousOutputs['brand'] ?? {}

  const system = `Eres un conector del ecosistema emprendedor chileno.
Conoces a fondo los actores del ecosistema: aceleradoras, fondos, comunidades, eventos y aliados estratégicos.
Conectas a emprendedores con las oportunidades correctas según su sector. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Idea: ${idea}
Lean Canvas: ${JSON.stringify(leanCanvas, null, 2)}
Marca: ${JSON.stringify(brand, null, 2)}

Basándote en el sector y tipo de negocio del lean canvas, genera el mapa del ecosistema en JSON:
{
  "sector_overview": "descripción del sector en Chile y sus tendencias actuales",
  "accelerators": [
    { "name": "nombre", "focus": "enfoque", "application_period": "período postulación", "equity": "% o sin equity", "url": "enlace" }
  ],
  "investors": [
    { "name": "nombre", "stage": "pre-seed/seed/series-a", "ticket_usd": "monto típico", "focus": "sectores de interés" }
  ],
  "grants": [
    { "name": "nombre fondo", "amount_clp": "monto", "institution": "entidad", "requirements": "requisitos principales", "url": "enlace" }
  ],
  "strategic_partners": [
    { "type": "tipo de aliado", "examples": ["empresa 1"], "value": "qué aportan" }
  ],
  "communities": [
    { "name": "nombre comunidad", "platform": "plataforma", "description": "qué ofrecen" }
  ],
  "events": [
    { "name": "nombre evento", "frequency": "frecuencia", "description": "para qué sirve" }
  ]
}

Incluye al menos: 3 aceleradoras, 3 inversores, 3 fondos, 2 tipos de socios estratégicos, 3 comunidades, 2 eventos.
Todos los datos deben ser de Chile o con presencia en Chile. Devuelve SOLO el JSON.`

  return { system, user }
}
