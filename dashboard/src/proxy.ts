import { NextResponse, type NextRequest } from 'next/server'

/**
 * proxy.ts — Next.js 16 middleware convention
 *
 * Production: Google Cloud Run.
 * Auth is enforced at the component/API route layer (Firebase Auth + Firestore RBAC),
 * not in this global middleware.
 */
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
