'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { WizardQuestion, Project, ModuleOutput } from '@/lib/types'
import type { SupportedModuleId } from '@/lib/ai-orchestrator'
import { AdvisorWizard } from './AdvisorWizard'
import { GeneratingModal } from './GeneratingModal'
import { OutputGrid } from './OutputGrid'

interface ModulePageClientProps {
  project: Project
  moduleOutput: ModuleOutput
  moduleId: SupportedModuleId
  moduleName: string
  wizardQuestions: WizardQuestion[]
  outputLabels: Record<string, string>
  phase?: 'REFINE' | 'BUILD'
}

type Step = 'wizard' | 'generating' | 'output'

export function ModulePageClient({
  project,
  moduleOutput,
  moduleId,
  moduleName,
  wizardQuestions,
  outputLabels,
  phase = 'REFINE',
}: ModulePageClientProps) {
  const router = useRouter()

  const [step, setStep] = useState<Step>(
    moduleOutput.status === 'completed' ? 'output' : 'wizard'
  )
  const [output, setOutput] = useState<Record<string, unknown>>(
    (moduleOutput.output as Record<string, unknown>) ?? {}
  )
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [directGenerating, setDirectGenerating] = useState(false)

  async function handleWizardComplete(answers: Record<string, string>) {
    setStep('generating')
    setError(null)

    const res = await fetch(`/api/generate/${moduleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, wizardAnswers: answers }),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Error generando output')
      setStep('wizard')
      setDirectGenerating(false)
      return
    }

    const data = (await res.json()) as { output: Record<string, unknown> }
    setOutput(data.output)
    setStep('output')
    setDirectGenerating(false)
  }

  async function handleSaveCell(key: string, value: string) {
    const updated = { ...output, [key]: value }
    setOutput(updated)

    const res = await fetch(`/api/projects/${project.id}/modules/${moduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output: updated }),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Error al guardar celda')
    }
  }

  async function handleConfirm() {
    setConfirming(true)

    const res = await fetch(`/api/projects/${project.id}/modules/${moduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output, status: 'completed' }),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Error al guardar')
      setConfirming(false)
      return
    }

    setConfirming(false)
    router.push(`/projects/${project.id}`)
    router.refresh()
  }

  function handleRegenerate() {
    setOutput({})
    setStep('wizard')
  }

  const noWizard = wizardQuestions.length === 0

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="font-mono text-xs text-gray-400">
          {project.name} / {phase}
        </span>
        <h1 className="font-syne font-bold text-3xl text-gray-900 mt-1">{moduleName}</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-outfit">
          {error}
        </div>
      )}

      {step === 'wizard' && noWizard && (
        <div className="flex flex-col items-center gap-6 py-16">
          <p className="font-outfit text-gray-500 text-center max-w-md">
            Nuestro asesor de IA analizará toda la información de tu proyecto para generar este módulo automáticamente.
          </p>
          <button
            onClick={() => {
              setDirectGenerating(true)
              void handleWizardComplete({})
            }}
            disabled={directGenerating}
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-outfit font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {directGenerating ? 'Generando...' : 'Generar con IA →'}
          </button>
        </div>
      )}

      {step === 'wizard' && !noWizard && (
        <AdvisorWizard
          questions={wizardQuestions}
          onComplete={handleWizardComplete}
          disabled={false}
        />
      )}

      {step === 'generating' && <GeneratingModal moduleId={moduleId} />}

      {step === 'output' && (
        <OutputGrid
          output={output}
          labels={outputLabels}
          onSaveCell={handleSaveCell}
          onConfirm={handleConfirm}
          onRegenerate={handleRegenerate}
          confirming={confirming}
          isCompleted={moduleOutput.status === 'completed'}
        />
      )}
    </div>
  )
}
