'use client'

import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase/client'
import { useRole } from '@/hooks/useRole'

export default function TestAuthPage() {
  const { user, role, loading } = useRole()

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log(result.user.displayName)
      alert('Connected!')
    } catch (error) {
      console.error(error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  }

  const isAdmin = role === 'admin'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px',
        padding: '24px',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {!user ? (
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
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            minWidth: '320px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Signed in as</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{user.email}</div>

          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            Detected role
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            {loading ? 'Loading…' : role ?? '(none)'}
          </div>

          {!loading && (
            isAdmin ? (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                ACCESS GRANTED: ADMIN
              </div>
            ) : (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                ACCESS DENIED
              </div>
            )
          )}

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f9fafb',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
