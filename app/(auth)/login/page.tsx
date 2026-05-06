'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setError('Debes confirmar tu email antes de ingresar. Revisa tu bandeja de entrada.')
      } else {
        setError('Email o contraseña incorrectos')
      }
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl p-8 w-full max-w-md shadow-xl border border-surface">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">
          Bienvenido de vuelta
        </h1>
        <p className="font-outfit text-gray-500 mb-8">
          Inicia sesión en tu cuenta EmprendeCL
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-outfit font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-surface bg-bg font-outfit focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-outfit font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-surface bg-bg font-outfit focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-outfit">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl text-white font-outfit font-bold text-sm disabled:opacity-60"
            style={{
              background: 'linear-gradient(90deg, #003ef3, #0490ff)',
              boxShadow: '0 4px 14px rgba(0,62,243,0.3)',
            }}
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="text-center text-sm font-outfit text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-blue font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
