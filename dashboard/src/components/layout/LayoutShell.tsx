'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { GSMAIDrawer } from '@/components/ai/GSMAIDrawer'
import { ThemeProvider } from '@/lib/theme-context'

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false)
  return (
    <ThemeProvider>
      <Sidebar />
      <GSMAIDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <div className="flex-1 ml-[288px] flex flex-col min-h-screen relative">
        <Header onOpenAI={() => setAiOpen(true)} />
        <main className="flex-1 p-6 lg:p-8 pt-4">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  )
}

/* ─── AUTH GATE (re-enable when Firebase credentials are ready) ───────────────
'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { ShieldAlert, Loader2 } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useRole } from '@/hooks/useRole'
import { auth } from '@/lib/firebase/client'

const PUBLIC_PATHS = ['/login', '/signup', '/test-auth']

function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center gap-3 px-4">
      <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" aria-hidden />
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  )
}

function UnauthorizedScreen({ email, role }: { email: string | null; role: string | null }) {
  const handleSignOut = async () => {
    try {
      if (auth) await signOut(auth)
    } catch (error) {
      console.error('UnauthorizedScreen: signOut failed', error)
    }
  }
  return (
    <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-red-600" aria-hidden />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight mb-2">Access denied</h1>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Your account does not have permission to access this dashboard.
          </p>
          <div className="mt-6 rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3 text-left">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Signed in as</div>
            <div className="text-sm font-semibold text-zinc-900 break-all">{email ?? '(unknown)'}</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-zinc-400 font-medium">Detected role</div>
            <div className="text-sm font-semibold text-zinc-900">{role ?? '(none)'}</div>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="inline-flex items-center justify-center w-full mt-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
        <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm">
          GSMPro · Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  )
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, role, loading } = useRole()
  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])
  if (loading) return <FullScreenLoader label="Verifying access…" />
  if (!user) return <FullScreenLoader label="Redirecting to sign in…" />
  if (role !== 'admin') return <UnauthorizedScreen email={user.email ?? null} role={role} />
  return <>{children}</>
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  if (isPublicPage) return <>{children}</>
  return (
    <AuthGate>
      <Sidebar />
      <div className="flex-1 ml-[288px] flex flex-col min-h-screen relative">
        <Header />
        <main className="flex-1 p-6 lg:p-8 pt-4">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>
    </AuthGate>
  )
}
─────────────────────────────────────────────────────────────────────────────── */
