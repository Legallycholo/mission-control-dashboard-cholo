'use client'

import Link from 'next/link'
import { Building2, Mail, ShieldCheck } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-dvh w-full bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Building2 className="w-7 h-7 text-white" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Request access
            </h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">
              GSM PRO is an internal dashboard
            </p>
          </div>

          <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <ShieldCheck
                className="w-5 h-5 mt-0.5 shrink-0 text-zinc-700"
                aria-hidden
              />
              <p>
                There is no self-serve sign-up. Access is granted by an
                administrator to a specific Google account.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <Mail
                className="w-5 h-5 mt-0.5 shrink-0 text-zinc-700"
                aria-hidden
              />
              <p>
                To request access, contact{' '}
                <a
                  href="mailto:dariel@tanygrowth.com"
                  className="font-semibold text-zinc-900 hover:underline"
                >
                  dariel@tanygrowth.com
                </a>{' '}
                with the Google email you want approved.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full mt-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white font-semibold text-sm transition-colors"
          >
            Back to sign in
          </Link>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm">
          GSMPro · Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  )
}
