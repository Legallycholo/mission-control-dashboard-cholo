import { noneProvider } from './providers/none'
import { supabaseProvider } from './providers/supabase'
import { firebaseProvider } from './providers/firebase'
import type { AuthProvider } from './types'

/**
 * Auth Factory — GSMPRO Dashboard
 *
 * Selecciona el proveedor de autenticación según la variable de entorno:
 *
 *   NEXT_PUBLIC_AUTH_PROVIDER=firebase  → Google Identity Platform (producción GCP)
 *   NEXT_PUBLIC_AUTH_PROVIDER=supabase  → Vercel / staging (colaborador)
 *   NEXT_PUBLIC_AUTH_PROVIDER=none      → Cloud Run sin auth (default)
 */
function resolveProvider(): AuthProvider {
  const configured = process.env.NEXT_PUBLIC_AUTH_PROVIDER

  switch (configured) {
    case 'firebase':
      return firebaseProvider
    case 'supabase':
      return supabaseProvider
    case 'none':
    default:
      return noneProvider
  }
}

const provider = resolveProvider()

export const getUser = provider.getUser.bind(provider)
export const signOut = provider.signOut.bind(provider)
export type { AuthUser } from './types'
