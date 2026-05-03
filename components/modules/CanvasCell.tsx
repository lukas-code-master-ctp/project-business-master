'use client'
import { useState } from 'react'

interface CanvasCellProps {
  label: string
  value: string
  onSave: (value: string) => void
}

export function CanvasCell({ label, value, onSave }: CanvasCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function handleSave() {
    onSave(draft.trim() || value)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(value)
    setEditing(false)
  }

  const isJson = value.startsWith('{') || value.startsWith('[')

  return (
    <div className="group bg-card rounded-xl border border-surface p-4 relative">
      <p className="font-mono text-xs text-blue mb-2 uppercase tracking-wide">{label}</p>

      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            rows={isJson ? 8 : 4}
            className="w-full text-sm font-outfit text-gray-700 resize-y border border-blue/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue/30"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="text-xs font-outfit font-bold text-white px-3 py-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #003ef3, #0490ff)' }}
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="text-xs font-outfit text-gray-500 px-3 py-1 rounded-full border border-surface hover:bg-surface"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-outfit text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap">
            {value}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-gray-400 hover:text-blue p-1 rounded"
            aria-label="Editar"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
