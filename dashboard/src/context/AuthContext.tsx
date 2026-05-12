'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase'

type UserRole = 'admin' | 'viewer'

interface AuthState {
  user: User | null
  role: UserRole | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  })

  useEffect(() => {
    if (!firebaseAuth) {
      setState({ user: null, role: null, loading: false })
      return
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult()
        const claimRole = tokenResult.claims.role as string | undefined
        setState({
          user: firebaseUser,
          role: claimRole === 'admin' ? 'admin' : 'viewer',
          loading: false,
        })
      } else {
        setState({ user: null, role: null, loading: false })
      }
    })

    return unsubscribe
  }, [])

  async function signOut() {
    if (firebaseAuth) await firebaseSignOut(firebaseAuth)
  }

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook to access the Firebase auth session from any client component. */
export const useAuth = () => useContext(AuthContext)
