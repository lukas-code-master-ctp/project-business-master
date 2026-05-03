'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside
      className="w-64 min-h-screen flex flex-col shrink-0"
      style={{ background: 'linear-gradient(135deg, #4436ff, #010072)' }}
    >
      <div className="p-6">
        <span className="font-syne font-extrabold text-white text-xl tracking-tight">
          EmprendeCL
        </span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-outfit text-white transition-all ${
                active
                  ? 'border-l-2 border-blue-light bg-[rgba(4,144,255,0.12)]'
                  : 'hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
