'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const [name, setName] = useState('')
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedIdea = idea.trim()
    if (!trimmedName || !trimmedIdea) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName, idea: trimmedIdea }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al crear proyecto')
      setLoading(false)
      return
    }

    const project = await res.json()
    router.push(`/projects/${project.id}`)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">Nuevo proyecto</h1>
      <p className="font-outfit text-gray-500 mb-8">
        Cuéntanos tu idea y te ayudamos a construirla paso a paso
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-outfit font-semibold text-gray-700 mb-2">
            Nombre del proyecto
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={80}
            className="w-full px-4 py-3 rounded-xl border border-surface bg-card font-outfit focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue"
            placeholder="ej: FundoFresh"
          />
        </div>

        <div>
          <label className="block text-sm font-outfit font-semibold text-gray-700 mb-2">
            Tu idea de negocio
          </label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            required
            rows={5}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border border-surface bg-card font-outfit focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue resize-none"
            placeholder="Describe tu idea en 2-3 oraciones. ¿Qué problema resuelve? ¿Para quién?"
          />
          <p className="text-xs text-gray-400 font-mono mt-1 text-right">
            {idea.length}/500
          </p>
        </div>

        {error && <p className="text-red-500 text-sm font-outfit">{error}</p>}

        <button
          type="submit"
          disabled={loading || !name.trim() || !idea.trim()}
          className="w-full py-4 rounded-2xl text-white font-outfit font-bold text-base disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(90deg, #003ef3, #0490ff)',
            boxShadow: '0 4px 14px rgba(0,62,243,0.3)',
          }}
        >
          {loading ? 'Creando proyecto...' : 'Empezar a construir →'}
        </button>
      </form>
    </div>
  )
}
