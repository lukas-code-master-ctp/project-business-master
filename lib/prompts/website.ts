import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildWebsitePrompts(
  idea: string,
  previousOutputs: Record<string, Record<string, unknown>>
): { system: string; user: string } {
  const leanCanvas = previousOutputs['lean_canvas'] ?? {}
  const brand = previousOutputs['brand'] ?? {}
  const outreach = previousOutputs['outreach'] ?? {}

  const system = `Eres un experto en copywriting y diseño web para startups latinoamericanas.
Creas textos web persuasivos, directos y adaptados al mercado chileno.
Usa un tono profesional pero cercano. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Idea: ${idea}

Lean Canvas: ${JSON.stringify(leanCanvas, null, 2)}
Identidad de Marca: ${JSON.stringify(brand, null, 2)}
Estrategia de Outreach: ${JSON.stringify(outreach, null, 2)}

Genera el contenido de una landing page completa en JSON:
{
  "hero_headline": "título principal impactante (máx 10 palabras)",
  "hero_subheadline": "subtítulo que explica el valor (máx 20 palabras)",
  "hero_cta": "llamada a la acción principal (máx 5 palabras)",
  "about_section": "párrafo de presentación de la empresa (2-3 oraciones)",
  "features": [
    { "title": "nombre del feature", "description": "beneficio en 1 oración" }
  ],
  "social_proof_placeholder": "texto de testimonial genérico a reemplazar",
  "cta_section": "texto de segunda llamada a la acción",
  "seo_keywords": ["5 keywords relevantes para Chile"],
  "meta_description": "descripción para Google (máx 155 caracteres)",
  "footer_tagline": "slogan breve de la empresa"
}

Incluye al menos 3 features. Devuelve SOLO el JSON.`

  return { system, user }
}
