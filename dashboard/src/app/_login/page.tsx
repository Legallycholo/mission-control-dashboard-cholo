'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { Building2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { auth, googleProvider } from '@/lib/firebase/client'
import { useRole } from '@/hooks/useRole'

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useRole()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [forgotMode, setForgotMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const handleGoogleSignIn = async () => {
    if (!auth) return
    setError(null)
    setSigningIn(true)
    try {
      await signInWithPopup(auth, googleProvider)
      router.replace('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        return
      }
      setError(
        code === 'auth/popup-blocked'
          ? 'Your browser blocked the sign-in popup. Allow popups for this site and try again.'
          : code === 'auth/network-request-failed'
            ? 'Network error. Check your connection and try again.'
            : 'Google sign-in failed. Please try again.',
      )
    } finally {
      setSigningIn(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    setError(null)
    setSigningIn(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      console.error('Email sign-in error code:', code, err)
      setError(
        code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : code === 'auth/operation-not-allowed'
            ? 'Email/password sign-in is not enabled. Contact your administrator.'
            : code === 'auth/too-many-requests'
              ? 'Too many attempts. Try again later or reset your password.'
              : code === 'auth/network-request-failed'
                ? 'Network error. Check your connection and try again.'
                : `Sign-in failed (${code || 'unknown'}). Please try again.`,
      )
    } finally {
      setSigningIn(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    setError(null)
    setResetting(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetSent(true)
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      setError(
        code === 'auth/user-not-found'
          ? 'No account found with that email.'
          : 'Failed to send reset email. Try again.',
      )
    } finally {
      setResetting(false)
    }
  }

  if (authLoading || (!authLoading && user)) {
    return (
      <div className="min-h-dvh w-full bg-[#F0F2F5] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" aria-hidden />
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh w-full bg-[#F0F2F5] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm px-8 py-10">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <Building2 className="w-8 h-8 text-white" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">
              Sign in to your company account
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          {forgotMode ? (
            /* ── Forgot password view ── */
            <div>
              {resetSent ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-zinc-700">
                    Reset link sent to <span className="font-semibold">{resetEmail}</span>. Check your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail('') }}
                    className="text-sm font-semibold text-zinc-900 hover:underline"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => void handleForgotPassword(e)} className="space-y-4">
                  <p className="text-sm text-zinc-600 text-center mb-2">
                    Enter your email and we&apos;ll send a reset link.
                  </p>
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-semibold text-zinc-800 mb-1.5">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none text-sm text-zinc-900 placeholder:text-zinc-400 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetting}
                    className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resetting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                    {resetting ? 'Sending…' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setError(null) }}
                    className="w-full text-sm text-zinc-500 hover:text-zinc-700 text-center"
                  >
                    Back to sign in
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ── Main sign-in view ── */
            <>
              {/* Google button */}
              <button
                type="button"
                disabled={signingIn}
                onClick={() => void handleGoogleSignIn()}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border-2 border-blue-500 hover:bg-blue-50 active:bg-blue-100 text-sm font-semibold text-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signingIn ? (
                  <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" aria-hidden />
                ) : (
                  <GoogleLogo />
                )}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-xs text-zinc-400 font-medium">or</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              {/* Email + password form */}
              <form onSubmit={(e) => void handleEmailSignIn(e)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-zinc-800 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none text-sm text-zinc-900 placeholder:text-zinc-400 transition"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-zinc-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none text-sm text-zinc-900 placeholder:text-zinc-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {signingIn && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                  {signingIn ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              {/* Forgot password */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setError(null); setResetEmail(email) }}
                  className="text-sm font-semibold text-zinc-800 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Register link */}
              <div className="mt-4 text-center text-sm text-zinc-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-bold text-zinc-900 hover:underline focus:outline-none"
                >
                  Register here
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
