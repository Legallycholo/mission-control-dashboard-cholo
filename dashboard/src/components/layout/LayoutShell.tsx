'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { GSMAIDrawer } from '@/components/ai/GSMAIDrawer'
import { ThemeProvider } from '@/lib/theme-context'

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <ThemeProvider>
      <Sidebar />
      <GSMAIDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <div className="flex-1 ml-[288px] flex flex-col min-h-screen relative">
        <Header onOpenAI={() => setAiOpen(true)} />
        <main className="flex-1 p-6 lg:p-8 pt-4">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  )
}
