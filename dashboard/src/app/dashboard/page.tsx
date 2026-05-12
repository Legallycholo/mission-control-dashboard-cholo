import { redirect } from 'next/navigation'

/**
 * /dashboard is the canonical post-login entry point.
 * Redirects to the root overview until this page gets its own BigQuery content.
 */
export default function DashboardPage() {
  redirect('/')
}
