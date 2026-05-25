import { NextResponse, type NextRequest } from 'next/server'

/**
 * proxy.ts — Next.js 16 middleware convention
 *
 * Production: Google Cloud Run.
 * No request-level auth gating is performed here; the dashboard is currently
 * served behind IAP / Cloud Run access controls.
 */
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
