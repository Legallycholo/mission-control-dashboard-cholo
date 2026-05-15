'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface DeviceRow {
  device: string;
  sessions: number;
  bounceRate: number;
  conversions: number;
  revenue: number;
  avgSessionDuration: number;
  sessionShare: number;
}

const DEVICE_META: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  mobile:  { icon: Smartphone, color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',    label: 'Mobile' },
  desktop: { icon: Monitor,    color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200', label: 'Desktop' },
  tablet:  { icon: Tablet,     color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',   label: 'Tablet' },
};

const DEVICE_FILL: Record<string, string> = { mobile: '#3b82f6', desktop: '#8b5cf6', tablet: '#f59e0b' };

export default function DispositivosPage() {
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  const [data, setData] = useState<DeviceRow[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notConfigured, setNotConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true); setError(null); setNotConfigured(false);
    fetch(`/api/trafico/dispositivos?startDate=${startDate}&endDate=${endDate}`)
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
  const fmtDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${m}m ${sec}s`;
  };

  const pieData = data.map(r => ({
    name: DEVICE_META[r.device]?.label ?? r.device,
    value: r.sessions,
    fill: DEVICE_FILL[r.device] ?? '#71717a',
  }));

  const handleExport = () => {
    if (!data.length) return;
    const rows = [
      'Dispositivo,Sesiones,% Total,Rebote %,Conversiones,Revenue,Duración Prom.',
      ...data.map(r => `"${r.device}",${r.sessions},${r.sessionShare.toFixed(1)}%,${(r.bounceRate * 100).toFixed(1)}%,${r.conversions},${r.revenue.toFixed(2)},${fmtDuration(r.avgSessionDuration)}`),
    ].join('\n');
    const a = document.createElement('a');
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`;
    a.download = `trafico_dispositivos_${startDate}_${endDate}.csv`;
    a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dispositivos</h1>
          <p className="text-zinc-500 mt-1">Desglose de tráfico Mobile vs. Desktop vs. Tablet (Google Analytics 4).</p>
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
      {notConfigured && !loading && <GA4SetupCard />}

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
          {/* Device cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-zinc-200 bg-white/85">
                <div className="h-4 w-20 bg-zinc-100 rounded animate-pulse mb-3" />
                <div className="h-8 w-32 bg-zinc-100 rounded animate-pulse" />
              </div>
            )) : data.map(r => {
              const meta = DEVICE_META[r.device] ?? { icon: Monitor, color: 'text-zinc-600', bg: 'bg-zinc-50 border-zinc-200', label: r.device };
              const DeviceIcon = meta.icon;
              return (
                <div key={r.device} className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn('p-2 rounded-xl border', meta.bg)}>
                      <DeviceIcon className={cn('w-5 h-5', meta.color)} />
                    </div>
                    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full border', meta.bg, meta.color)}>
                      {r.sessionShare.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-500">{meta.label}</p>
                  <p className="text-3xl font-bold text-zinc-900 mt-1">{fmtN(r.sessions)}</p>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-100">
                    <div>
                      <p className="text-[10px] text-zinc-400">Rebote</p>
                      <p className="text-xs font-bold text-zinc-700">{(r.bounceRate * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400">Conv.</p>
                      <p className="text-xs font-bold text-zinc-700">{fmtN(r.conversions)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400">Revenue</p>
                      <p className="text-xs font-bold text-zinc-700">{fmtCurrency(r.revenue)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          {!loading && data.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pie */}
              <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                <h2 className="font-bold text-zinc-900 mb-4">Distribución de Sesiones</h2>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" stroke="none">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                        formatter={(v: unknown) => [fmtN(Number(v)), 'sesiones']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6">
                  {pieData.map(entry => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                      <span>{entry.name}</span>
                      <span className="font-semibold text-zinc-900">{fmtN(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar — revenue by device */}
              <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                <h2 className="font-bold text-zinc-900 mb-4">Revenue por Dispositivo</h2>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                      <XAxis dataKey="device" stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={d => DEVICE_META[d]?.label ?? d} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                        formatter={(v: unknown) => [fmtCurrency(Number(v)), 'Revenue']} />
                      <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={48}>
                        {data.map((r, i) => <Cell key={i} fill={DEVICE_FILL[r.device] ?? '#71717a'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Loading placeholder */}
          {loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── GA4 Setup Card ───────────────────────────────────────────────────────────

function GA4SetupCard() {
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
              El módulo <strong>Dispositivos</strong> requiere la variable de entorno{' '}
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
              desc: 'En Google Cloud Console → APIs & Services → Library → busca "Google Analytics Data API" → habilitar.',
              link: 'https://console.cloud.google.com/apis/library',
              linkLabel: 'Abrir GCP Console',
            },
            {
              step: 2,
              title: 'Copiar tu Property ID de GA4',
              desc: 'En Google Analytics → Admin → Property → Property details. Copia el número de "Property ID" (ej: 123456789).',
              link: 'https://analytics.google.com/',
              linkLabel: 'Abrir GA4',
            },
            {
              step: 3,
              title: 'Agregar la variable de entorno',
              desc: 'En .env.local (desarrollo) y en Cloud Run (producción) → Secret Manager:',
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
