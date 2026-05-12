'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, AlertTriangle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (authError) {
      setError(
        authError.message === 'User already registered'
          ? 'Este correo ya está registrado.'
          : authError.message,
      )
      setLoading(false)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Building2 className="w-7 h-7 text-white" aria-hidden />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight mb-2">
              Solicitud enviada
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Tu cuenta fue creada. Un administrador revisará tu solicitud y te dará acceso al
              dashboard. Recibirás acceso una vez aprobado.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full mt-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white font-semibold text-sm transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
          <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm">
            GSMPro · Restricted access — authorized personnel only
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Building2 className="w-7 h-7 text-white" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight text-center">GMS PRO</h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">Solicitar acceso al dashboard</p>
          </div>

          <div
            role="note"
            className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" aria-hidden />
            <span>
              Tu cuenta quedará <strong>pendiente de aprobación</strong>. Un administrador debe
              activarla antes de que puedas ingresar.
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900">Crear cuenta</h2>
            <p className="text-sm text-zinc-500 mt-1">Completa el formulario para solicitar acceso</p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="signup-fullname"
                className="block text-sm font-semibold text-zinc-900 mb-1.5"
              >
                Nombre completo
              </label>
              <input
                id="signup-fullname"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-semibold text-zinc-900 mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-semibold text-zinc-900 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Creando cuenta…
                </span>
              ) : (
                'Solicitar acceso'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-6">
            ¿Ya tienes acceso?{' '}
            <Link
              href="/login"
              className="font-bold text-zinc-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 rounded"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm">
          GSMPro · Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  )
}
