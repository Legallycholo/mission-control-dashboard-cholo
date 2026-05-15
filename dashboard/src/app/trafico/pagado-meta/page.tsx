'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign, Eye, MousePointerClick, TrendingUp,
  ShoppingCart, Zap, Download, RefreshCw, AlertTriangle, ExternalLink,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Skeleton } from '@/components/ui/Skeleton';

const META_BLUE = '#0668E1';
const META_PINK = '#E1306C';
const CAMPAIGN_COLORS = [META_BLUE, META_PINK, '#8b5cf6', '#10b981', '#f59e0b', '#14b8a6', '#f43f5e', '#6366f1'];

interface Summary {
  spend: number; impressions: number; clicks: number;
  ctr: number; cpc: number; cpm: number; reach: number;
  purchases: number; purchaseValue: number; roas: number;
}
interface Campaign {
  id: string; name: string; spend: number; impressions: number;
  clicks: number; ctr: number; cpc: number; cpm: number; reach: number;
  purchases: number; purchaseValue: number; roas: number;
}
interface TrendPoint { date: string; spend: number; clicks: number; impressions: number; purchases: number; }

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtFull = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

function KpiCard({ label, value, icon: Icon, color, loading, sub }: {
  label: string; value: string; icon: React.ElementType;
  color: string; loading: boolean; sub?: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <div className={cn('p-2 rounded-xl border', color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="relative z-10">
        {loading ? <Skeleton className="h-8 w-28" />
          : <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>}
        {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-[#0668E1]" />
    </div>
  );
}

export default function MetaAdsPage() {
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [notConfigured, setNotConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [trendMetric, setTrendMetric] = useState<'spend' | 'clicks' | 'purchases'>('spend');

  useEffect(() => { setMounted(true); }, []);

  const fetchData = () => {
    setLoading(true); setError(null); setNotConfigured(false);
    fetch(`/api/meta?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setSummary(json.data.summary);
          setCampaigns(json.data.campaigns);
          setTrend(json.data.trend);
        } else if (json.reason === 'meta_not_configured') {
          setNotConfigured(true);
        } else {
          setError(json.error ?? json.message ?? 'Error desconocido');
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (mounted) fetchData(); }, [startDate, endDate, mounted]);

  const handleExport = () => {
    if (!campaigns.length) return;
    const rows = [
      'Campaña,Gasto,Impresiones,Clicks,CTR,CPC,CPM,Alcance,Compras,Revenue,ROAS',
      ...campaigns.map(c =>
        `"${c.name}",${c.spend},${c.impressions},${c.clicks},${c.ctr.toFixed(2)}%,${c.cpc.toFixed(2)},${c.cpm.toFixed(2)},${c.reach},${c.purchases},${c.purchaseValue.toFixed(2)},${c.roas.toFixed(2)}`
      ),
    ].join('\n');
    const a = document.createElement('a');
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`;
    a.download = `meta_ads_${startDate}_${endDate}.csv`;
    a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Meta logo colours */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0668E1 0%, #E1306C 100%)' }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-9l7 4.5-7 4.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Meta Ads</h1>
            <p className="text-zinc-500 mt-0.5">Facebook e Instagram — rendimiento de campañas pagas.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
          {campaigns.length > 0 && (
            <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> CSV
            </button>
          )}
        </div>
      </div>

      {/* Not Configured */}
      {notConfigured && !loading && <MetaSetupCard />}

      {/* Error */}
      {error && !loading && (
        <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900">Error al cargar datos de Meta</p>
            <p className="text-sm text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {!notConfigured && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard label="Gasto Total" value={summary ? fmt(summary.spend) : '...'} icon={DollarSign}
              color="bg-blue-50 text-blue-600 border-blue-200" loading={loading} sub="inversión en el periodo" />
            <KpiCard label="Impresiones" value={summary ? fmtN(summary.impressions) : '...'} icon={Eye}
              color="bg-violet-50 text-violet-600 border-violet-200" loading={loading} sub={summary ? `CPM ${fmtFull(summary.cpm)}` : ''} />
            <KpiCard label="Clicks" value={summary ? fmtN(summary.clicks) : '...'} icon={MousePointerClick}
              color="bg-sky-50 text-sky-600 border-sky-200" loading={loading} sub={summary ? `CTR ${fmtPct(summary.ctr)}` : ''} />
            <KpiCard label="Compras" value={summary ? fmtN(summary.purchases) : '...'} icon={ShoppingCart}
              color="bg-emerald-50 text-emerald-600 border-emerald-200" loading={loading} sub={summary ? `Revenue ${fmt(summary.purchaseValue)}` : ''} />
            <KpiCard label="ROAS" value={summary ? `${summary.roas.toFixed(2)}x` : '...'} icon={Zap}
              color={summary && summary.roas >= 2 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
              loading={loading} sub={summary ? `CPC ${fmtFull(summary.cpc)}` : ''} />
          </div>

          {/* ROAS quality indicator */}
          {!loading && summary && (
            <div className={cn('px-5 py-3 rounded-xl border flex items-center gap-3 text-sm font-medium',
              summary.roas >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : summary.roas >= 2 ? 'bg-blue-50 border-blue-200 text-blue-800'
                : summary.roas >= 1 ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            )}>
              <TrendingUp className="w-4 h-4 shrink-0" />
              {summary.roas >= 3
                ? `ROAS ${summary.roas.toFixed(2)}x — Excelente. Cada $1 invertido genera $${summary.roas.toFixed(2)} en ventas.`
                : summary.roas >= 2
                  ? `ROAS ${summary.roas.toFixed(2)}x — Bueno. Objetivo recomendado: 3x o superior.`
                  : summary.roas >= 1
                    ? `ROAS ${summary.roas.toFixed(2)}x — Por debajo del objetivo. Revisar targeting y creatividades.`
                    : `ROAS ${summary.roas.toFixed(2)}x — Negativo. Las campañas están gastando más de lo que generan.`}
            </div>
          )}

          {/* Trend Chart */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-zinc-900">Evolución Diaria</h2>
              <div className="flex bg-zinc-50 border border-zinc-200 rounded-xl p-1 gap-1">
                {(['spend', 'clicks', 'purchases'] as const).map(m => (
                  <button key={m} onClick={() => setTrendMetric(m)}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                      trendMetric === m ? 'bg-[#0668E1] text-white' : 'text-zinc-600 hover:text-zinc-900')}>
                    {m === 'spend' ? 'Gasto' : m === 'clicks' ? 'Clicks' : 'Compras'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[260px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[#0668E1]/30 border-t-[#0668E1] rounded-full animate-spin" />
                </div>
              ) : trend.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Sin datos para este periodo.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={META_BLUE} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={META_BLUE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                    <XAxis dataKey="date" fontSize={11} stroke="#71717a" tickLine={false} axisLine={false}
                      tickFormatter={d => { const p = d.split('-'); return `${p[2]}/${p[1]}`; }} />
                    <YAxis fontSize={11} stroke="#71717a" tickLine={false} axisLine={false}
                      tickFormatter={v => trendMetric === 'spend' ? `$${(v/1000).toFixed(1)}k` : fmtN(v)} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                      formatter={(v: unknown) => [
                        trendMetric === 'spend' ? fmtFull(Number(v)) : fmtN(Number(v)),
                        trendMetric === 'spend' ? 'Gasto' : trendMetric === 'clicks' ? 'Clicks' : 'Compras',
                      ]}
                      labelFormatter={d => { const p = String(d).split('-'); return `${p[2]}/${p[1]}/${p[0]}`; }}
                    />
                    <Area type="monotone" dataKey={trendMetric} stroke={META_BLUE} strokeWidth={2.5}
                      fill="url(#metaGrad)" activeDot={{ r: 5, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Campaigns table + bar chart */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Bar chart — spend by campaign */}
            <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
              <h2 className="font-bold text-zinc-900 mb-4">Gasto por Campaña</h2>
              <div className="h-[280px]">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#0668E1]/30 border-t-[#0668E1] rounded-full animate-spin" />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Sin campañas</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaigns.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                      <XAxis type="number" fontSize={10} stroke="#71717a" tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                      <YAxis type="category" dataKey="name" fontSize={9} stroke="#71717a" width={110}
                        tickFormatter={n => n.length > 18 ? n.slice(0, 16) + '…' : n} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                        formatter={(v: unknown) => [fmtFull(Number(v)), 'Gasto']} />
                      <Bar dataKey="spend" radius={[0, 4, 4, 0]} barSize={18}>
                        {campaigns.slice(0, 8).map((_, i) => <Cell key={i} fill={CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Campaigns table */}
            <div className="lg:col-span-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100">
                <h2 className="font-bold text-zinc-900">Detalle de Campañas</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      {['Campaña', 'Gasto', 'Clicks', 'CTR', 'Compras', 'ROAS'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-zinc-100">
                        {Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td>)}
                      </tr>
                    )) : campaigns.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-400 text-sm">Sin campañas activas en este periodo.</td></tr>
                    ) : campaigns.map((c, i) => (
                      <tr key={c.id} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length] }} />
                            <span className="font-medium text-zinc-900 text-xs max-w-[160px] truncate" title={c.name}>{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-zinc-900 tabular-nums text-xs">{fmtFull(c.spend)}</td>
                        <td className="px-4 py-3 text-zinc-600 tabular-nums text-xs">{fmtN(c.clicks)}</td>
                        <td className="px-4 py-3 text-zinc-600 tabular-nums text-xs">{fmtPct(c.ctr)}</td>
                        <td className="px-4 py-3 text-emerald-700 tabular-nums text-xs font-medium">{fmtN(c.purchases)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border',
                            c.roas >= 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : c.roas >= 2 ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : c.roas >= 1 ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}>
                            {c.roas.toFixed(2)}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Setup Card ───────────────────────────────────────────────────────────────

function MetaSetupCard() {
  return (
    <div className="space-y-5">
      <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-blue-100 shrink-0">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-blue-900">Meta Ads no está configurado</p>
            <p className="text-sm text-blue-700 mt-1">
              Necesitas <code className="bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded font-mono text-xs">META_ACCESS_TOKEN</code> y{' '}
              <code className="bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded font-mono text-xs">META_AD_ACCOUNT_ID</code> en tu <code className="font-mono text-xs">.env.local</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
        <h3 className="font-bold text-zinc-900 mb-5">Cómo conectar Meta Ads en 4 pasos</h3>
        <div className="space-y-5">
          {[
            {
              step: 1,
              title: 'Ir al Explorador de la API Graph',
              desc: 'Abre Meta for Developers → Tools → Graph API Explorer.',
              link: 'https://developers.facebook.com/tools/explorer',
              linkLabel: 'Abrir Graph API Explorer',
            },
            {
              step: 2,
              title: 'Generar token con permisos de Ads',
              desc: 'En el Explorador: selecciona tu app → clic en "Generate Access Token" → activa los permisos: ads_read, ads_management, business_management. Luego extiéndelo a largo plazo.',
            },
            {
              step: 3,
              title: 'Obtener tu Ad Account ID',
              desc: 'Ve a Meta Ads Manager → selecciona tu cuenta → copia el número del campo "Cuenta publicitaria ID" en la URL o en Configuración de la cuenta. Formato: act_XXXXXXXXXX.',
              link: 'https://adsmanager.facebook.com/',
              linkLabel: 'Abrir Ads Manager',
            },
            {
              step: 4,
              title: 'Agregar al .env.local',
              code: 'META_ACCESS_TOKEN=EAAxxxxxxxx\nMETA_AD_ACCOUNT_ID=act_XXXXXXXXXX',
            },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0668E1, #E1306C)' }}>
                {item.step}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 text-sm">{item.title}</p>
                {'desc' in item && <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>}
                {'code' in item && item.code && (
                  <pre className="mt-2 bg-zinc-900 text-emerald-400 px-4 py-3 rounded-xl text-xs font-mono whitespace-pre-wrap">{item.code}</pre>
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
