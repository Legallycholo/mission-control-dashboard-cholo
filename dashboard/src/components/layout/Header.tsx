'use client';

import { Bell, Search, RefreshCw } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-200/70 bg-white/85 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar KPIs, órdenes, productos..."
            className="w-full bg-zinc-100/80 border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/10 text-blue-700 text-sm font-medium hover:bg-blue-600/15 transition-all border border-blue-500/25">
          <RefreshCw className="w-4 h-4" />
          Sincronizar
        </button>

        <button className="relative w-9 h-9 rounded-xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
        </button>
      </div>
    </header>
  );
}
