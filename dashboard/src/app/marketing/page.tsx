"use client";

import { useState, useEffect } from 'react';
import {
  Mail, MailOpen, MousePointerClick, Search, MousePointer2,
  Eye, Download, TrendingUp, ShoppingCart, UserMinus, AlertTriangle,
  CheckCircle2, Clock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('es-CL');
const fmtUSD = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

const CAMPAIGN_STATUS: Record<string, { label: string; cls: string }> = {
  sent: { label: 'Enviada', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { label: 'Programada', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  draft: { label: 'Borrador', cls: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
  cancelled: { label: 'Cancelada', cls: 'bg-red-50 text-red-600 border-red-200' },
};

// ── sub-components ────────────────────────────────────────────────────────────

function KlaviyoSetupCard() {
  return (
    <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/60 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200 shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-800 text-base">Klaviyo no está conectado</h3>
          <p className="text-sm text-zinc-600 mt-1 mb-4">
            Configura tu clave privada para ver el rendimiento de email marketing en tiempo real.
          </p>
          <ol className="space-y-2 text-sm text-zinc-700">
            <li className="flex gap-2"><span className="font-bold text-amber-700">1.</span> Ve a <strong>klaviyo.com</strong> → Settings → API Keys</li>
            <li className="flex gap-2"><span className="font-bold text-amber-700">2.</span> Copia tu <strong>Private API Key</strong> (empieza con <code className="bg-amber-100 px-1 rounded">pk_</code>)</li>
            <li className="flex gap-2"><span className="font-bold text-amber-700">3.</span> Agrega en <code className="bg-amber-100 px-1 rounded">.env.local</code>:<br />
              <code className="bg-amber-100 px-2 py-0.5 rounded text-xs block mt-1">KLAVIYO_PRIVATE_API_KEY=pk_XXXXX</code>
            </li>
            <li className="flex gap-2"><span className="font-bold text-amber-700">4.</span> Reinicia el servidor de desarrollo</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, color, label, value, sub, loading,
}: {
  icon: React.ElementType; color: string; label: string;
  value: string | number; sub?: string; loading: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl flex flex-col gap-4">
      <div className={`p-2.5 rounded-xl border w-fit ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <div className="mt-1.5 h-9">
          {loading
            ? <Skeleton className="h-8 w-28" />
            : <p className="text-3xl font-bold text-zinc-900">{value}</p>}
        </div>
        {sub && !loading && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-lg text-sm">
      <p className="text-zinc-500 mb-1">{label}</p>
      {payload.map((e: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-zinc-700 font-medium">{e.name}:</span>
          <span className="text-zinc-900 font-bold">{e.value?.toLocaleString('es-CL')}</span>
        </div>
      ))}
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function MarketingEmailPage() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  const [klv, setKlv] = useState<any>(null);
  const [klvNotConfigured, setKlvNotConfigured] = useState(false);
  const [loadingKlv, setLoadingKlv] = useState(true);

  const [gscData, setGscData] = useState<any[]>([]);
  const [loadingGsc, setLoadingGsc] = useState(true);

  const [trendMetric, setTrendMetric] = useState<'opens' | 'clicks' | 'revenue'>('opens');

  useEffect(() => {
    setLoadingKlv(true);
    setLoadingGsc(true);

    Promise.all([
      fetch(`/api/klaviyo?startDate=${startDate}&endDate=${endDate}`).then(r => r.json()),
      fetch(`/api/gsc?startDate=${startDate}&endDate=${endDate}`).then(r => r.json()),
    ])
      .then(([k, gsc]) => {
        if (k.success) {
          setKlv(k.data);
          setKlvNotConfigured(false);
        } else if (k.reason === 'klaviyo_not_configured') {
          setKlvNotConfigured(true);
        }
        if (gsc.success) {
          setGscData(
            gsc.data.map((row: any) => ({
              date: new Date(row.date.value).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
              clicks: row.clicks,
              impressions: row.impressions,
              ctr: +(row.ctr * 100).toFixed(2),
              position: +row.position.toFixed(1),
            }))
          );
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoadingKlv(false);
        setLoadingGsc(false);
      });
  }, [startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = klv?.summary;
  const trend: any[] = (klv?.trend ?? []).map((d: any) => ({
    ...d,
    date: new Date(d.date + 'T12:00:00').toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
  }));
  const campaigns: any[] = klv?.campaigns ?? [];

  const totalGscClicks = gscData.reduce((s, r) => s + r.clicks, 0);
  const totalGscImpressions = gscData.reduce((s, r) => s + r.impressions, 0);
  const avgCtr = gscData.length > 0
    ? (gscData.reduce((s, r) => s + r.ctr, 0) / gscData.length).toFixed(2)
    : '0.00';

  const handleExportCSV = () => {
    if (!trend.length) return;
    const csv = 'data:text/csv;charset=utf-8,'
      + 'Fecha,Enviados,Aperturas,Clicks,Ingresos\n'
      + trend.map(r => `${r.date},${r.sent},${r.opens},${r.clicks},${r.revenue}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `klaviyo_${startDate}_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Email & Push (Klaviyo)</h1>
          <p className="text-zinc-500 mt-1">Rendimiento de email marketing y tráfico orgánico.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
          />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-200"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {/* Klaviyo section */}
      <div>
        <h2 className="text-base font-semibold text-zinc-700 mb-3">Email Marketing (Klaviyo)</h2>

        {klvNotConfigured ? (
          <KlaviyoSetupCard />
        ) : (
          <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                icon={Mail}
                color="bg-zinc-100 text-zinc-500 border-zinc-200"
                label="Emails Enviados"
                value={summary ? fmt(summary.sent) : '—'}
                loading={loadingKlv}
              />
              <StatCard
                icon={MailOpen}
                color="bg-blue-50 text-blue-500 border-blue-200/60"
                label="Tasa de Apertura"
                value={summary ? fmtPct(summary.openRate) : '—'}
                sub={summary ? `${fmt(summary.opens)} aperturas` : undefined}
                loading={loadingKlv}
              />
              <StatCard
                icon={MousePointerClick}
                color="bg-emerald-50 text-emerald-500 border-emerald-200/60"
                label="Tasa de Clic"
                value={summary ? fmtPct(summary.clickRate) : '—'}
                sub={summary ? `${fmt(summary.clicks)} clicks` : undefined}
                loading={loadingKlv}
              />
              <StatCard
                icon={TrendingUp}
                color="bg-orange-50 text-orange-500 border-orange-200/60"
                label="Ingresos Atribuidos"
                value={summary ? fmtUSD(summary.revenue) : '—'}
                sub={summary ? `${fmt(summary.orders)} pedidos` : undefined}
                loading={loadingKlv}
              />
              <StatCard
                icon={UserMinus}
                color="bg-rose-50 text-rose-500 border-rose-200/60"
                label="Bajas"
                value={summary ? fmt(summary.unsubs) : '—'}
                loading={loadingKlv}
              />
            </div>

            {/* Trend chart */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-zinc-800">Tendencia Diaria</h3>
                <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl">
                  {(['opens', 'clicks', 'revenue'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setTrendMetric(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        trendMetric === m ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                      }`}
                    >
                      {m === 'opens' ? 'Aperturas' : m === 'clicks' ? 'Clicks' : 'Ingresos'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[280px]">
                {loadingKlv ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                ) : trend.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Sin datos para este periodo.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="klvGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={trendMetric === 'revenue' ? '#f97316' : trendMetric === 'clicks' ? '#10b981' : '#3b82f6'} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={trendMetric === 'revenue' ? '#f97316' : trendMetric === 'clicks' ? '#10b981' : '#3b82f6'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                      <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dx={-4} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey={trendMetric}
                        name={trendMetric === 'opens' ? 'Aperturas' : trendMetric === 'clicks' ? 'Clicks' : 'Ingresos'}
                        stroke={trendMetric === 'revenue' ? '#f97316' : trendMetric === 'clicks' ? '#10b981' : '#3b82f6'}
                        strokeWidth={2.5}
                        fill="url(#klvGrad)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Recent campaigns */}
            {campaigns.length > 0 && (
              <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
                <h3 className="text-base font-semibold text-zinc-800 mb-4">Campañas Recientes</h3>
                <div className="space-y-3">
                  {campaigns.map((c: any) => {
                    const st = CAMPAIGN_STATUS[c.status?.toLowerCase()] ?? { label: c.status, cls: 'bg-zinc-100 text-zinc-600 border-zinc-200' };
                    return (
                      <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
                        <div className="flex items-center gap-3">
                          {c.status?.toLowerCase() === 'sent'
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            : <Clock className="w-4 h-4 text-zinc-400 shrink-0" />}
                          <span className="text-sm font-medium text-zinc-800 truncate max-w-[280px]">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {c.sendTime && (
                            <span className="text-xs text-zinc-400">
                              {new Date(c.sendTime).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GSC section */}
      <div>
        <h2 className="text-base font-semibold text-zinc-700 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" />
          Búsqueda Orgánica (Google Search Console)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={MousePointer2}
            color="bg-indigo-50 text-indigo-500 border-indigo-200/60"
            label="Total Clicks Orgánicos"
            value={fmt(totalGscClicks)}
            loading={loadingGsc}
          />
          <StatCard
            icon={Eye}
            color="bg-purple-50 text-purple-500 border-purple-200/60"
            label="Total Impresiones"
            value={fmt(totalGscImpressions)}
            loading={loadingGsc}
          />
          <StatCard
            icon={Search}
            color="bg-pink-50 text-pink-500 border-pink-200/60"
            label="CTR Promedio"
            value={`${avgCtr}%`}
            loading={loadingGsc}
          />
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
          <h3 className="text-base font-semibold text-zinc-800 mb-5">Evolución de Tráfico Orgánico</h3>
          <div className="h-[300px]">
            {loadingGsc ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : gscData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Sin datos para este periodo.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gscData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis yAxisId="l" stroke="#818cf8" fontSize={11} tickLine={false} axisLine={false} dx={-4} />
                  <YAxis yAxisId="r" orientation="right" stroke="#c084fc" fontSize={11} tickLine={false} axisLine={false} dx={4} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} iconType="circle" />
                  <Area yAxisId="l" type="monotone" dataKey="clicks" name="Clicks" stroke="#818cf8" strokeWidth={2.5} fill="url(#gClicks)" activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Area yAxisId="r" type="monotone" dataKey="impressions" name="Impresiones" stroke="#c084fc" strokeWidth={2.5} fill="url(#gImpressions)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
