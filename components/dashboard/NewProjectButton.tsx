import Link from 'next/link'

export function NewProjectButton({ large }: { large?: boolean }) {
  return (
    <Link
      href="/projects/new"
      className={`inline-flex items-center gap-2 font-outfit font-bold text-white rounded-2xl transition-opacity hover:opacity-90 ${
        large ? 'px-8 py-4 text-base' : 'px-5 py-2.5 text-sm'
      }`}
      style={{
        background: 'linear-gradient(90deg, #003ef3, #0490ff)',
        boxShadow: '0 4px 14px rgba(0,62,243,0.3)',
      }}
    >
      + Nuevo proyecto
    </Link>
  )
}
