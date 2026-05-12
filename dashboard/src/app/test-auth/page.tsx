'use client'

import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase/client'

export default function TestAuthPage() {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log(result.user.displayName)
      alert('Connected!')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <button
        type="button"
        onClick={handleSignIn}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          background: '#ffffff',
          cursor: 'pointer',
        }}
      >
        Sign in with Google
      </button>
    </div>
  )
}
