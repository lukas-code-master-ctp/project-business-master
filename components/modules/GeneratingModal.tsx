'use client'

const MODULE_LABELS: Record<string, string> = {
  lean_canvas: 'Lean Canvas',
  validation: 'Plan de Validación',
  brand: 'Identidad de Marca',
  outreach: 'Kit de Outreach',
}

interface GeneratingModalProps {
  moduleId: string
}

export function GeneratingModal({ moduleId }: GeneratingModalProps) {
  const label = MODULE_LABELS[moduleId] ?? 'módulo'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-3xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="relative mx-auto mb-6 w-20 h-20">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: 'linear-gradient(135deg, #4436ff, #010072)' }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4436ff, #010072)' }}
          >
            <span className="text-white text-3xl">⚡</span>
          </div>
        </div>

        <h3 className="font-syne font-bold text-xl text-gray-900 mb-2">
          Generando tu {label}
        </h3>
        <p className="font-outfit text-gray-500 text-sm">
          Nuestro asesor IA está analizando tu idea con contexto 100% chileno...
        </p>

        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: 'linear-gradient(90deg, #003ef3, #0490ff)',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
