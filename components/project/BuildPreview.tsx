const BUILD_MODULES = [
  'Website Generator',
  'MVP Requirements',
  'MVP Builder',
  'Business Toolkit',
  'Ecosistema Chile',
]

export function BuildPreview() {
  return (
    <div className="relative bg-card rounded-2xl border border-surface overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 backdrop-blur-sm">
        <div className="text-center px-6">
          <span className="text-4xl mb-3 block">🔒</span>
          <p className="font-outfit font-semibold text-gray-700 text-sm">
            Completa REFINE al 100% para desbloquear BUILD
          </p>
        </div>
      </div>
      <div className="p-5 pointer-events-none select-none">
        <div className="space-y-3">
          {BUILD_MODULES.map(label => (
            <div
              key={label}
              className="bg-surface rounded-xl p-4 flex justify-between items-center opacity-50"
            >
              <span className="font-outfit text-sm text-gray-700">{label}</span>
              <span className="text-gray-400 text-xs">🔒</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
