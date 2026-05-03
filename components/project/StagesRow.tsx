interface StagesRowProps {
  refineProgress: number
  buildProgress: number
  currentStage: 'REFINE' | 'BUILD'
}

export function StagesRow({ refineProgress, buildProgress, currentStage }: StagesRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-card rounded-2xl p-5 border border-surface">
        <div className="flex items-center justify-between mb-3">
          <span className="font-syne font-bold text-gray-900">REFINE</span>
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              refineProgress === 100
                ? 'bg-success/10 text-success'
                : 'bg-blue/10 text-blue'
            }`}
          >
            {refineProgress}%
          </span>
        </div>
        <div className="bg-surface rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${refineProgress}%`,
              background: 'linear-gradient(90deg, #003ef3, #0490ff)',
            }}
          />
        </div>
      </div>

      <div
        className={`bg-card rounded-2xl p-5 border border-surface transition-opacity ${
          refineProgress < 100 ? 'opacity-45' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-syne font-bold text-gray-900">BUILD</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue/10 text-blue">
            {buildProgress}%
          </span>
        </div>
        <div className="bg-surface rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${buildProgress}%`,
              background: 'linear-gradient(90deg, #003ef3, #0490ff)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
