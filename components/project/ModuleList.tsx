import Link from 'next/link'
import type { ModuleOutput } from '@/lib/types'

const MODULE_META: Record<string, { label: string; description: string }> = {
  lean_canvas: { label: 'Lean Canvas', description: 'Estructura tu modelo de negocio' },
  validation: { label: 'Validación', description: 'Hipótesis y guía de entrevistas' },
  brand: { label: 'Marca', description: 'Nombre, tono y posicionamiento' },
  outreach: { label: 'Outreach', description: 'Pitch, mensajes y landing copy' },
  website: { label: 'Website Generator', description: 'Estructura de landing page' },
  mvp_requirements: {
    label: 'MVP Requirements',
    description: 'User stories y specs técnicas',
  },
  mvp_builder: { label: 'MVP Builder', description: 'Scaffold Next.js descargable' },
  business_toolkit: {
    label: 'Business Toolkit',
    description: 'Modelo financiero y checklist legal CLP',
  },
  ecosystem: { label: 'Ecosistema Chile', description: 'Oportunidades y red de contactos' },
}

const MODULE_ROUTE: Record<string, string> = {
  lean_canvas: 'lean-canvas',
  validation: 'validation',
  brand: 'brand',
  outreach: 'outreach',
  website: 'website',
  mvp_requirements: 'mvp-requirements',
  mvp_builder: 'mvp-builder',
  business_toolkit: 'business-toolkit',
  ecosystem: 'ecosystem',
}

const REFINE_ORDER = ['lean_canvas', 'validation', 'brand', 'outreach']
const BUILD_ORDER = [
  'website',
  'mvp_requirements',
  'mvp_builder',
  'business_toolkit',
  'ecosystem',
]

interface ModuleListProps {
  projectId: string
  modules: ModuleOutput[]
  stage: 'REFINE' | 'BUILD'
}

export function ModuleList({ projectId, modules, stage }: ModuleListProps) {
  const order = stage === 'REFINE' ? REFINE_ORDER : BUILD_ORDER
  const stageModules = order
    .map(id => modules.find(m => m.module_id === id))
    .filter(Boolean) as ModuleOutput[]

  return (
    <div className="space-y-3">
      {stageModules.map((mod, idx) => {
        const meta = MODULE_META[mod.module_id]
        const isCompleted = mod.status === 'completed'
        const isAvailable = mod.status === 'available'
        const isLocked = mod.status === 'locked'

        return (
          <div
            key={mod.module_id}
            className={`bg-card rounded-2xl p-5 border transition-all ${
              isLocked ? 'opacity-45' : ''
            }`}
            style={
              isCompleted
                ? { borderLeft: '4px solid #00b87a', borderColor: 'rgba(0,184,122,0.2)' }
                : isAvailable
                ? {
                    borderLeft: '4px solid #003ef3',
                    borderColor: 'rgba(0,62,243,0.25)',
                    boxShadow: '0 0 20px rgba(0,62,243,0.08)',
                  }
                : { borderColor: '#e2eaf2' }
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-gray-400 w-5 shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-outfit font-semibold text-gray-900">{meta?.label}</h4>
                  <p className="text-xs text-gray-500 font-outfit mt-0.5">
                    {meta?.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                {isCompleted && (
                  <span className="text-xs font-outfit text-success bg-success/10 px-3 py-1 rounded-full">
                    Completado ✓
                  </span>
                )}
                {isAvailable && (
                  <Link
                    href={`/projects/${projectId}/${MODULE_ROUTE[mod.module_id]}`}
                    className="text-sm font-outfit font-bold text-white px-5 py-2 rounded-full whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(90deg, #003ef3, #0490ff)',
                      boxShadow: '0 4px 14px rgba(0,62,243,0.3)',
                    }}
                  >
                    Continuar →
                  </Link>
                )}
                {isLocked && (
                  <span className="text-xs font-outfit text-gray-400">🔒</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
