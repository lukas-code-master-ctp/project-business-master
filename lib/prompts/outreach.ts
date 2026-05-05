import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildOutreachPrompts(
  idea: string,
  wizardAnswers: Record<string, unknown>,
  leanCanvasOutput: Record<string, unknown>,
  brandOutput: Record<string, unknown>
): { system: string; user: string } {
  const system = `Eres un experto en copywriting y ventas para el mercado latinoamericano.
Escribes textos directos, cercanos y persuasivos en español chileno auténtico.
NUNCA uses anglicismos innecesarios. El tono debe sentirse local, no corporativo.
${CHILE_CONTEXT}`

  const user = `Lean Canvas: ${JSON.stringify(leanCanvasOutput, null, 2)}
Marca: ${JSON.stringify(brandOutput, null, 2)}
Respuestas wizard: ${JSON.stringify(wizardAnswers, null, 2)}

Idea: ${idea}

Genera en JSON:
1. elevator_pitch: { version_30s, version_60s, version_escrita }
2. whatsapp_messages: [3 mensajes] — cada uno con asunto y cuerpo natural en español chileno
3. landing_copy: { hero_headline, hero_subheadline, features: [3], cta, social_proof_placeholder }
4. cold_email: { subject, body } — máx 150 palabras, tono directo

Devuelve SOLO el JSON, sin explicaciones adicionales.`

  return { system, user }
}
