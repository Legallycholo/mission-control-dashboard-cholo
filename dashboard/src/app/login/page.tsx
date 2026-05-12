'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithPopup } from 'firebase/auth'
import { Building2, AlertCircle, Loader2 } from 'lucide-react'
import { auth, googleProvider } from '@/lib/firebase/client'
import { useRole } from '@/hooks/useRole'

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
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
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const handleGoogleSignIn = async () => {
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
      console.error('LoginPage: Google sign-in failed', err)
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

  const showInitialLoader = authLoading || (!authLoading && user)

  if (showInitialLoader) {
    return (
      <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" aria-hidden />
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Building2 className="w-7 h-7 text-white" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">
              Sign in with your company Google account
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
            >
              <AlertCircle
                className="w-4 h-4 mt-0.5 shrink-0 text-red-500"
                aria-hidden
              />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            disabled={signingIn}
            onClick={() => void handleGoogleSignIn()}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 text-sm font-semibold text-zinc-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signingIn ? (
              <>
                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              <>
                <GoogleLogo />
                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-xs text-zinc-500 mt-6 leading-relaxed">
            By signing in, you agree to the company access policy. Only
            authorized accounts can reach the dashboard.
          </p>

          <div className="mt-6 text-center text-sm text-zinc-600">
            Need access?{' '}
            <Link
              href="/signup"
              className="font-bold text-zinc-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 rounded"
            >
              Request an account
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm">
          GSMPro · Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  )
}
