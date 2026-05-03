'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function TopBar({ title }: { title?: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 bg-card border-b border-surface flex items-center justify-between px-6 shrink-0">
      <span className="font-outfit font-medium text-gray-700">
        {title ?? 'EmprendeCL'}
      </span>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-gray-700 font-outfit transition-colors"
      >
        Cerrar sesión
      </button>
    </header>
  )
}
