'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Search, RefreshCw, CheckCircle2, AlertCircle, Clock, Sparkles, Sun, Moon, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';

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
  const { theme, toggle } = useTheme();
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

  const status = sync?.overallStatus ?? 'no_data';

  const badgeConfig = {
    ok: {
      wrapper: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400 dark:border-emerald-400/30 dark:bg-emerald-500/10',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
      pulse: true,
      Icon: CheckCircle2,
    },
    error: {
      wrapper: 'bg-rose-500/10 text-rose-600 border-rose-500/25 dark:text-rose-400 dark:border-rose-400/30',
      dot: 'bg-rose-500 dark:bg-rose-400',
      pulse: false,
      Icon: AlertCircle,
    },
    no_data: {
      wrapper: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700/50',
      dot: 'bg-zinc-400 dark:bg-zinc-500',
      pulse: false,
      Icon: Clock,
    },
  };

  const cfg = badgeConfig[status];

  return (
    <header className="h-16 border-b border-zinc-200/70 dark:border-sky-500/10 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-sky-500/60" />
          <input
            type="text"
            placeholder="Buscar KPIs, órdenes, productos..."
            className="w-full bg-zinc-100/80 dark:bg-slate-800/60 border border-zinc-200 dark:border-sky-500/15 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-slate-200 placeholder:text-zinc-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 dark:focus:border-sky-500/50 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] transition-all"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2.5">
        {/* Sync badge */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setPopoverOpen(!popoverOpen)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              cfg.wrapper
            )}
          >
            <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
              <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
              {cfg.pulse && (
                <span className={cn('absolute inset-0 rounded-full animate-ping opacity-60', cfg.dot)} />
              )}
            </span>
            {status === 'ok' && (
              <>
                <Radio className="w-3 h-3" />
                {`Sync ${relativeTime(sync?.mostRecentSync ?? null)}`}
              </>
            )}
            {status === 'error' && 'Error de sincronización'}
            {status === 'no_data' && 'Sin sincronización'}
          </button>

          {/* Popover */}
          {popoverOpen && (
            <div className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-sky-500/15 rounded-2xl shadow-xl dark:shadow-sky-500/5 p-4 min-w-[280px]">
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-sky-500/60 uppercase tracking-widest mb-3">Estado de Fuentes</p>
              <div className="space-y-2">
                {(sync?.sources ?? []).map((s) => {
                  const c =
                    s.status === 'ok'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                      : s.status === 'error'
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'
                      : 'text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800';
                  return (
                    <div key={s.source} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-zinc-700 dark:text-slate-300 font-medium">
                        {SOURCE_LABELS[s.source] ?? s.source}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 dark:text-slate-500">{relativeTime(s.lastSync)}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', c)}>
                          {s.status === 'ok' ? 'OK' : s.status === 'error' ? 'Error' : 'Sin datos'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {(!sync?.sources || sync.sources.length === 0) && (
                  <p className="text-sm text-zinc-400 dark:text-slate-500">No hay registros de sincronización aún.</p>
                )}
              </div>
              <button
                onClick={() => { fetchSyncStatus(); setPopoverOpen(false); }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-colors border border-sky-100 dark:border-sky-500/20"
              >
                <RefreshCw className="w-3 h-3" />
                Actualizar estado
              </button>
            </div>
          )}
        </div>

        {/* AI button */}
        <button
          onClick={onOpenAI}
          title="GSM AI"
          className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/10 to-violet-500/10 dark:from-sky-500/15 dark:to-violet-500/15 border border-sky-200/60 dark:border-sky-500/25 flex items-center justify-center text-sky-600 dark:text-sky-400 hover:from-sky-500/20 hover:to-violet-500/20 hover:border-sky-400/50 dark:hover:border-sky-400/50 hover:shadow-[0_0_16px_rgba(14,165,233,0.2)] transition-all group"
        >
          <Sparkles className="w-4 h-4 group-hover:animate-spin" style={{ animationDuration: '3s' }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 dark:bg-violet-400 rounded-full animate-pulse" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          className="relative w-9 h-9 rounded-xl bg-zinc-100/80 dark:bg-slate-800/60 border border-zinc-200 dark:border-sky-500/15 flex items-center justify-center text-zinc-500 dark:text-sky-400 hover:text-zinc-900 dark:hover:text-sky-300 hover:bg-zinc-100 dark:hover:bg-slate-800 hover:border-zinc-300 dark:hover:border-sky-500/30 transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-zinc-100/80 dark:bg-slate-800/60 border border-zinc-200 dark:border-sky-500/15 flex items-center justify-center text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-sky-500 rounded-full shadow-[0_0_6px_rgba(14,165,233,0.8)]" />
        </button>
      </div>
    </header>
  );
}
