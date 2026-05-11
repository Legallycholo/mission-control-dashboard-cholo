'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getUser } from '@/lib/auth';

export function Header() {
  const [isAdmin, setIsAdmin]           = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getUser().then(async (user) => {
      if (!user || user.role !== 'admin') return;
      setIsAdmin(true);
      // Endpoint optimizado: devuelve solo { count } con caché 60s
      const res = await fetch('/api/admin/pending-count');
      if (res.ok) {
        const { count } = await res.json();
        setPendingCount(count ?? 0);
      }
    });
  }, []);

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
        {isAdmin && (
          <Link
            href="/admin"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/80 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admitir usuarios</span>
            {pendingCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </Link>
        )}

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
