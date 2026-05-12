import type { AuthUser, AuthProvider } from '../types'

/**
 * Provider: Firebase Auth (Google Identity Platform)
 *
 * Used when NEXT_PUBLIC_AUTH_PROVIDER=firebase.
 * Reads the current Firebase user from the client-side auth state.
 * Role is sourced from Custom Claims set in Firebase console / Admin SDK.
 *
 * Required env vars:
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */
export const firebaseProvider: AuthProvider = {
  async getUser(): Promise<AuthUser | null> {
    if (typeof window === 'undefined') return null

    const [{ getAuth }, { firebaseApp }] = await Promise.all([
      import('firebase/auth'),
      import('@/lib/firebase'),
    ])

    if (!firebaseApp) return null
    const user = getAuth(firebaseApp).currentUser
    if (!user) return null

    const tokenResult = await user.getIdTokenResult()
    const claimRole = tokenResult.claims.role as string | undefined

    return {
      id:        user.uid,
      email:     user.email ?? '',
      full_name: user.displayName,
      role:      claimRole === 'admin' ? 'admin' : 'user',
    }
  },

  async signOut(): Promise<void> {
    if (typeof window === 'undefined') return

    const [{ signOut, getAuth }, { firebaseApp }] = await Promise.all([
      import('firebase/auth'),
      import('@/lib/firebase'),
    ])

    if (!firebaseApp) return
    await signOut(getAuth(firebaseApp))
  },
}
