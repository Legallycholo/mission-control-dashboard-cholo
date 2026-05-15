'use client';

import { useState, useEffect } from 'react';
import { GitBranch, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface ChannelRow {
  source: string;
  medium: string;
  sessions: number;
  bounceRate: number;
  conversions: number;
  revenue: number;
  sessionShare: number;
}

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6', '#ec4899', '#84cc16'];

const MEDIUM_COLORS: Record<string, string> = {
  organic: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cpc: 'bg-blue-50 text-blue-700 border-blue-200',
  email: 'bg-orange-50 text-orange-700 border-orange-200',
  social: 'bg-pink-50 text-pink-700 border-pink-200',
  referral: 'bg-violet-50 text-violet-700 border-violet-200',
  none: 'bg-zinc-50 text-zinc-600 border-zinc-200',
};

const mediumBadge = (medium: string) => MEDIUM_COLORS[medium] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200';

export default function FuenteMedioPage() {
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  const [data, setData] = useState<ChannelRow[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notConfigured, setNotConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true); setError(null); setNotConfigured(false);
    fetch(`/api/trafico/fuente-medio?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          setTotalSessions(json.totalSessions);
        } else if (json.reason === 'ga4_not_configured') {
          setNotConfigured(true);
        } else {
          setError(json.error ?? json.message);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate, mounted]);

  const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  // Top channels for pie chart
  const pieData = data.slice(0, 6).map((r, i) => ({
    name: `${r.source} / ${r.medium}`,
    value: r.sessions,
    fill: COLORS[i],
  }));

  const handleExport = () => {
    if (!data.length) return;
    const rows = [
      'Fuente,Medio,Sesiones,% Sesiones,Rebote %,Conversiones,Revenue',
      ...data.map(r => `"${r.source}","${r.medium}",${r.sessions},${r.sessionShare.toFixed(1)}%,${(r.bounceRate * 100).toFixed(1)}%,${r.conversions},${r.revenue.toFixed(2)}`),
    ].join('\n');
    const a = document.createElement('a');
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`;
    a.download = `trafico_fuente_medio_${startDate}_${endDate}.csv`;
    a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Fuente / Medio</h1>
          <p className="text-zinc-500 mt-1">Distribución de tráfico por canal de adquisición (Google Analytics 4).</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          {data.length > 0 && (
            <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 transition-colors">
              <Download className="w-4 h-4" /> CSV
            </button>
          )}
        </div>
      </div>

      {/* GA4 Not Configured */}
      {notConfigured && !loading && <GA4SetupCard module="Fuente / Medio" />}

      {/* Error */}
      {error && !loading && (
        <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error al cargar datos</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!notConfigured && !error && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Sesiones', value: loading ? '...' : fmtN(totalSessions), color: 'blue' },
              { label: 'Canales Activos', value: loading ? '...' : String(data.length), color: 'violet' },
              { label: 'Top Canal', value: loading ? '...' : (data[0] ? `${data[0].source}` : '—'), color: 'emerald' },
              { label: 'Canal con Mayor Revenue', value: loading ? '...' : (data.sort((a, b) => b.revenue - a.revenue)[0] ? `${data[0]?.source ?? '—'}` : '—'), color: 'amber' },
            ].map(card => (
              <div key={card.label} className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                <p className="text-xs font-medium text-zinc-500">{card.label}</p>
                {loading ? <div className="h-7 w-24 bg-zinc-100 rounded animate-pulse mt-2" />
                  : <p className="text-2xl font-bold text-zinc-900 mt-1 truncate">{card.value}</p>}
              </div>
            ))}
          </div>

          {/* Charts */}
          {!loading && data.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Bar chart — sessions by channel */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-5">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                  <h2 className="font-bold text-zinc-900">Sesiones por Canal</h2>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                      <XAxis type="number" fontSize={11} stroke="#71717a" tickLine={false} />
                      <YAxis type="category" dataKey="source" fontSize={10} stroke="#71717a" width={90} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                        formatter={(v: unknown) => [fmtN(Number(v)), 'Sesiones']}
                      />
                      <Bar dataKey="sessions" radius={[0, 5, 5, 0]} barSize={18}>
                        {data.slice(0, 10).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie — share */}
              <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                <h2 className="font-bold text-zinc-900 mb-5">Distribución</h2>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }} formatter={(v: unknown) => [fmtN(Number(v)), 'sesiones']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {pieData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-600">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                      <span className="truncate">{entry.name}</span>
                      <span className="ml-auto font-medium text-zinc-900">{fmtN(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h2 className="font-bold text-zinc-900">Detalle por Fuente / Medio</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {['#', 'Fuente', 'Medio', 'Sesiones', '% Total', 'Rebote', 'Conversiones', 'Revenue'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      {Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td>)}
                    </tr>
                  )) : data.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400 text-sm">Sin datos para este periodo.</td></tr>
                  ) : data.map((r, i) => (
                    <tr key={`${r.source}/${r.medium}`} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 text-xs font-mono">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{r.source}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', mediumBadge(r.medium))}>
                          {r.medium}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-zinc-900 tabular-nums">{fmtN(r.sessions)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, r.sessionShare)}%` }} />
                          </div>
                          <span className="text-xs text-zinc-600">{r.sessionShare.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 tabular-nums">{(r.bounceRate * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-emerald-700 tabular-nums">{fmtN(r.conversions)}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900 tabular-nums">{fmtCurrency(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── GA4 Setup Card ───────────────────────────────────────────────────────────

function GA4SetupCard({ module }: { module: string }) {
  return (
    <div className="space-y-5">
      <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-100 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">GA4 no está configurado</p>
            <p className="text-sm text-amber-700 mt-1">
              El módulo <strong>{module}</strong> requiere la variable de entorno{' '}
              <code className="bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded font-mono text-xs">GA4_PROPERTY_ID</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
        <h3 className="font-bold text-zinc-900 mb-4">Cómo configurar en 3 pasos</h3>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Habilitar Google Analytics Data API',
              desc: 'En Google Cloud Console, ve a APIs & Services → Library → busca "Google Analytics Data API" → habilitar.',
              link: 'https://console.cloud.google.com/apis/library',
              linkLabel: 'Abrir GCP Console',
            },
            {
              step: 2,
              title: 'Copiar tu Property ID de GA4',
              desc: 'En Google Analytics, ve a Admin → Property → Property details. Copia el número de "Property ID" (ej: 123456789).',
              link: 'https://analytics.google.com/',
              linkLabel: 'Abrir GA4',
            },
            {
              step: 3,
              title: 'Agregar la variable de entorno',
              desc: 'En tu archivo .env.local (desarrollo) y en Cloud Run (producción):',
              code: 'GA4_PROPERTY_ID=123456789',
            },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 text-sm">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                {'code' in item && item.code && (
                  <code className="block mt-2 bg-zinc-900 text-emerald-400 px-3 py-2 rounded-lg text-xs font-mono">
                    {item.code}
                  </code>
                )}
                {'link' in item && item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    {item.linkLabel} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
