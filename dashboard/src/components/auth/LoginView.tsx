'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase'

const googleProvider = new GoogleAuthProvider()

/* ── Error code → human-readable message map ─────────────────────────── */
const ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found':     'No account found with this email address.',
  'auth/wrong-password':     'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/invalid-email':      'Please enter a valid email address.',
  'auth/too-many-requests':  'Too many failed attempts. Try again later.',
  'auth/user-disabled':      'This account has been disabled. Contact your administrator.',
  'auth/network-request-failed': 'Network error. Check your connection and retry.',
  'auth/missing-email':      'Enter your email address first.',
}

/* ── Inline toast ─────────────────────────────────────────────────────── */
function Toast({
  message,
  variant,
}: {
  message: string
  variant: 'error' | 'success'
}) {
  const isError = variant === 'error'
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 right-5 z-50 flex items-start gap-3 max-w-sm w-full text-sm px-4 py-3 rounded-xl shadow-lg border ${
        isError
          ? 'bg-white border-red-200 text-red-700'
          : 'bg-white border-emerald-200 text-emerald-800'
      }`}
      style={{ animation: 'slideInRight 0.25s ease-out' }}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
      ) : (
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
      )}
      <span>{message}</span>
    </div>
  )
}

/* ── Google logo SVG (official brand mark) ────────────────────────────── */
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" />
    </svg>
  )
}

/* ── Main component ───────────────────────────────────────────────────── */
export function LoginView() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [toast, setToast]       = useState<{ message: string; variant: 'error' | 'success' } | null>(null)

  const anyLoading = loading || googleLoading || resetLoading

  function showToast(message: string, variant: 'error' | 'success' = 'error') {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 4500)
  }

  async function handleGoogleSignIn() {
    if (!firebaseAuth) {
      showToast('Authentication is not configured. Contact your administrator.')
      return
    }
    setGoogleLoading(true)
    try {
      await signInWithPopup(firebaseAuth, googleProvider)
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      // User closed the popup — not an error worth showing
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      showToast(ERROR_MESSAGES[code] ?? 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!firebaseAuth) {
      showToast('Authentication is not configured. Contact your administrator.')
      return
    }
    const trimmed = email.trim()
    if (!trimmed) {
      showToast('Enter your email address first, then tap Forgot Password.')
      return
    }

    setResetLoading(true)
    try {
      await sendPasswordResetEmail(firebaseAuth, trimmed)
      showToast('If an account exists for that email, you will receive a reset link shortly.', 'success')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      showToast(ERROR_MESSAGES[code] ?? 'Could not send reset email. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firebaseAuth) {
      showToast('Authentication is not configured. Contact your administrator.')
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      showToast(ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-10">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(1rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {toast && <Toast message={toast.message} variant={toast.variant} />}

      <div className="w-full max-w-sm flex flex-col items-center justify-center">

        {/* ── Card (logo + copy + form + links) ─────────────────────────── */}
        <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">
              Sign in to your company account
            </p>
          </div>

          {/* ── Google Sign-In ─────────────────────────────────────────── */}
          <button
            type="button"
            disabled={anyLoading}
            onClick={() => void handleGoogleSignIn()}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 text-sm font-medium text-zinc-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <svg className="animate-spin w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : (
              <GoogleLogo />
            )}
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* ── Divider ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-medium">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-zinc-900 mb-1.5"
              >
                Username
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-zinc-900 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={anyLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4 text-center text-sm">
            <button
              type="button"
              disabled={anyLoading}
              onClick={() => void handleForgotPassword()}
              className="text-zinc-900 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {resetLoading ? 'Sending…' : 'Forgot Password?'}
            </button>
            <p className="text-zinc-600 leading-relaxed">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-zinc-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 rounded"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm">
          GSMPro · Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  )
}
