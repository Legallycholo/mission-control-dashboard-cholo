'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Search, RefreshCw, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncSource {
  source: string;
  status: string;
  lastSync: string | null;
  recordsProcessed: number;
}

interface SyncStatus {
  overallStatus: 'ok' | 'error' | 'no_data';
  mostRecentSync: string | null;
  sources: SyncSource[];
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'Sin datos';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

const SOURCE_LABELS: Record<string, string> = {
  shopify: 'Shopify',
  gsc: 'Search Console',
  google_ads: 'Google Ads',
  crisp: 'Crisp CRM',
  ringcentral: 'RingCentral',
};

export function Header({ onOpenAI }: { onOpenAI?: () => void }) {
  const [sync, setSync] = useState<SyncStatus | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchSyncStatus = async () => {
    try {
      const res = await fetch('/api/sync/status');
      const json = await res.json();
      if (json.success) setSync(json.data);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    fetchSyncStatus();
    const interval = setInterval(fetchSyncStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const badgeConfig = {
    ok: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', Icon: CheckCircle2 },
    error: { color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', Icon: AlertCircle },
    no_data: { color: 'bg-zinc-100 text-zinc-500 border-zinc-200', dot: 'bg-zinc-400', Icon: Clock },
  };

  const status = sync?.overallStatus ?? 'no_data';
  const cfg = badgeConfig[status];

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
        {/* Sync Badge */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setPopoverOpen(!popoverOpen)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all',
              cfg.color
            )}
          >
            <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot,
              status === 'ok' && 'shadow-[0_0_6px_rgba(16,185,129,0.7)]')} />
            {status === 'ok' && `Sincronizado ${relativeTime(sync?.mostRecentSync ?? null)}`}
            {status === 'error' && 'Error de sincronización'}
            {status === 'no_data' && 'Sin sincronización'}
          </button>

          {popoverOpen && (
            <div className="absolute top-full mt-2 right-0 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 min-w-[280px]">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Estado de Fuentes</p>
              <div className="space-y-2">
                {(sync?.sources ?? []).map((s) => {
                  const c = s.status === 'ok' ? 'text-emerald-600 bg-emerald-50' :
                    s.status === 'error' ? 'text-rose-600 bg-rose-50' : 'text-zinc-400 bg-zinc-100';
                  return (
                    <div key={s.source} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-zinc-700 font-medium">{SOURCE_LABELS[s.source] ?? s.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">{relativeTime(s.lastSync)}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', c)}>
                          {s.status === 'ok' ? 'OK' : s.status === 'error' ? 'Error' : 'Sin datos'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {(!sync?.sources || sync.sources.length === 0) && (
                  <p className="text-sm text-zinc-400">No hay registros de sincronización aún.</p>
                )}
              </div>
              <button
                onClick={() => { fetchSyncStatus(); setPopoverOpen(false); }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100"
              >
                <RefreshCw className="w-3 h-3" />
                Actualizar estado
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onOpenAI}
          title="GSM AI"
          className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-200/50 flex items-center justify-center text-blue-600 hover:from-blue-500/20 hover:to-violet-500/20 transition-all group"
        >
          <Sparkles className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
        </button>

        <button className="relative w-9 h-9 rounded-xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
        </button>
      </div>
    </header>
  );
}
