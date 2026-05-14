'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'

type UseRoleResult = {
  role: string | null
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
}

export function useRole(): UseRoleResult {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (!firebaseUser || !firebaseUser.email) {
        setRole(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userDocRef = doc(db!, 'users', firebaseUser.email)
        const snapshot = await getDoc(userDocRef)

        if (snapshot.exists()) {
          const data = snapshot.data() as { role?: string }
          setRole(typeof data.role === 'string' ? data.role : null)
        } else {
          setRole(null)
        }
      } catch (error) {
        console.error('useRole: failed to fetch role for user', error)
        setRole(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { role, loading, user }
}
