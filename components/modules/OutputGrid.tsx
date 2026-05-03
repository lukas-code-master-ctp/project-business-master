'use client'
import { CanvasCell } from './CanvasCell'

interface OutputGridProps {
  output: Record<string, unknown>
  labels: Record<string, string>
  onSaveCell: (key: string, value: string) => void
  onConfirm: () => void
  onRegenerate: () => void
  confirming?: boolean
  isCompleted?: boolean
}

function valueToString(v: unknown): string {
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (Array.isArray(v)) {
    return v
      .map((item, i) =>
        typeof item === 'string'
          ? `${i + 1}. ${item}`
          : `${i + 1}. ${JSON.stringify(item, null, 2)}`
      )
      .join('\n')
  }
  return JSON.stringify(v, null, 2)
}

export function OutputGrid({
  output,
  labels,
  onSaveCell,
  onConfirm,
  onRegenerate,
  confirming = false,
  isCompleted = false,
}: OutputGridProps) {
  const entries = Object.entries(output)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {entries.map(([key, value]) => (
          <CanvasCell
            key={key}
            label={labels[key] ?? key.replace(/_/g, ' ')}
            value={valueToString(value)}
            onSave={val => onSaveCell(key, val)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {isCompleted ? (
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="px-8 py-3 rounded-2xl text-white font-outfit font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(90deg, #003ef3, #0490ff)',
              boxShadow: '0 4px 14px rgba(0,62,243,0.3)',
            }}
          >
            {confirming ? 'Guardando...' : 'Guardar cambios'}
          </button>
        ) : (
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="px-8 py-3 rounded-2xl text-white font-outfit font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(90deg, #00b87a, #00d68f)',
              boxShadow: '0 4px 14px rgba(0,184,122,0.3)',
            }}
          >
            {confirming ? 'Guardando...' : 'Confirmar y continuar ✓'}
          </button>
        )}

        <button
          onClick={onRegenerate}
          className="px-6 py-3 rounded-2xl font-outfit font-semibold text-sm text-blue border-2 border-blue/30 hover:border-blue/60 transition-colors"
        >
          Regenerar ↺
        </button>
      </div>
    </div>
  )
}
