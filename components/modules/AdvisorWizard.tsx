'use client'
import { useState } from 'react'
import type { WizardQuestion } from '@/lib/types'

interface AdvisorWizardProps {
  questions: WizardQuestion[]
  onComplete: (answers: Record<string, string>) => void
  disabled?: boolean
}

export function AdvisorWizard({ questions, onComplete, disabled = false }: AdvisorWizardProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const current = questions[step]
  const isLast = step === questions.length - 1
  const currentAnswer = answers[current.id] ?? ''

  function handleNext() {
    if (!currentAnswer.trim() || disabled) return
    if (isLast) {
      onComplete(answers)
    } else {
      setStep(s => s + 1)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && e.metaKey) {
      handleNext()
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background:
                i <= step ? 'linear-gradient(90deg, #003ef3, #0490ff)' : '#e2eaf2',
            }}
          />
        ))}
      </div>

      <p className="font-mono text-xs text-blue-light mb-3">
        Pregunta {step + 1} de {questions.length}
      </p>

      <h3 className="font-syne font-bold text-xl text-gray-900 mb-6">{current.label}</h3>

      <textarea
        key={current.id}
        value={currentAnswer}
        onChange={e => setAnswers(prev => ({ ...prev, [current.id]: e.target.value }))}
        onKeyDown={handleKeyDown}
        placeholder={current.placeholder}
        rows={4}
        autoFocus
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border border-surface bg-card font-outfit text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue resize-none disabled:opacity-60"
      />

      <p className="text-xs text-gray-400 font-mono mt-1">
        Tip: ⌘+Enter para continuar
      </p>

      <div className="flex items-center justify-between mt-6">
        {step > 0 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={disabled}
            className="text-sm font-outfit text-gray-500 hover:text-gray-700 disabled:opacity-60"
          >
            ← Anterior
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={!currentAnswer.trim() || disabled}
          className="px-7 py-3 rounded-2xl text-white font-outfit font-bold text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{
            background: 'linear-gradient(90deg, #003ef3, #0490ff)',
            boxShadow: '0 4px 14px rgba(0,62,243,0.3)',
          }}
        >
          {isLast
            ? disabled
              ? 'Generando...'
              : 'Generar con IA →'
            : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}
