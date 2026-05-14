'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Download,
  MousePointerClick,
  Eye,
  Percent,
  Search,
  Tag,
  Globe,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';

interface KpiMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface TrendData {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface ApiResponseData {
  kpis: KpiMetrics;
  trend: TrendData[];
  topQueries: QueryData[];
  topPages: PageData[];
}

interface SegmentKpis { clicks: number; impressions: number; avgCtr: number; avgPosition: number; queryCount: number; }
interface SeoSegData { queries: QueryData[]; kpis: { branded: SegmentKpis; non_branded: SegmentKpis; all: SegmentKpis }; }

export default function TraficoOrganicoPage() {
  const [data, setData] = useState<ApiResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [seoSeg, setSeoSeg] = useState<SeoSegData | null>(null);
  const [seoSegLoading, setSeoSegLoading] = useState(true);
  const [activeSegTab, setActiveSegTab] = useState<'all' | 'branded' | 'non_branded'>('all');
  
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trafico/organico?startDate=${startDate}&endDate=${endDate}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeoSeg = async () => {
    setSeoSegLoading(true);
    try {
      const res = await fetch(`/api/trafico/seo-segmentado?startDate=${startDate}&endDate=${endDate}`);
      const json = await res.json();
      if (json.success) setSeoSeg(json.data);
    } catch { /* ignore */ }
    finally { setSeoSegLoading(false); }
  };

  useEffect(() => {
    fetchData();
    fetchSeoSeg();
  }, [startDate, endDate]);

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;
  const formatPos = (val: number) => val.toFixed(1);

  const handleExportCSV = () => {
    if (!data) return;
    let csvContent = "data:text/csv;charset=utf-8,\n" 
      + "=== KPIS ===\n"
      + `Clics,${data.kpis.clicks}\n`
      + `Impresiones,${data.kpis.impressions}\n`
      + `CTR Promedio,${data.kpis.ctr}%\n`
      + `Posición Promedio,${data.kpis.position}\n`
      + "\n=== TREND ===\n"
      + "Date,Clicks,Impressions,CTR,Position\n"
      + data.trend.map(row => `${row.date},${row.clicks},${row.impressions},${row.ctr.toFixed(2)},${row.position.toFixed(1)}`).join("\n")
      + "\n\n=== TOP QUERIES ===\n"
      + "Query,Clicks,Impressions,CTR,Position\n"
      + data.topQueries.slice(0, 50).map(row => `"${row.query.replace(/"/g, '""')}",${row.clicks},${row.impressions},${row.ctr.toFixed(2)},${row.position.toFixed(1)}`).join("\n")
      + "\n\n=== TOP PAGES ===\n"
      + "Page,Clicks,Impressions,CTR,Position\n"
      + data.topPages.slice(0, 50).map(row => `"${row.page.replace(/"/g, '""')}",${row.clicks},${row.impressions},${row.ctr.toFixed(2)},${row.position.toFixed(1)}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trafico_organico_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Tráfico Orgánico (SEO)</h1>
          <p className="text-zinc-600 mt-1">Rendimiento en motores de búsqueda vía Google Search Console.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-xl backdrop-blur-md">
            <CalendarDays className="w-4 h-4 text-zinc-600 ml-2" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm text-zinc-900 focus:outline-none px-2"
            />
            <span className="text-zinc-600">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm text-zinc-900 focus:outline-none px-2"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-200/70"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Clics Totales" 
          value={data ? formatNumber(data.kpis.clicks) : '...'} 
          icon={MousePointerClick} 
          color="blue"
          loading={loading}
        />
        <KpiCard 
          title="Impresiones Totales" 
          value={data ? formatNumber(data.kpis.impressions) : '...'} 
          icon={Eye} 
          color="emerald"
          loading={loading}
        />
        <KpiCard 
          title="CTR Promedio" 
          value={data ? formatPercent(data.kpis.ctr) : '...'} 
          icon={Percent} 
          color="amber"
          loading={loading}
        />
        <KpiCard 
          title="Posición Promedio" 
          value={data ? formatPos(data.kpis.position) : '...'} 
          icon={Search} 
          color="purple"
          loading={loading}
        />
      </div>

      {/* Trend Chart */}
      <div className="w-full p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Evolución de Clics vs Impresiones</h2>
            <p className="text-sm text-zinc-600">Rendimiento diario orgánico</p>
          </div>
        </div>
        
        <div className="h-[350px] w-full relative z-10">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : data && data.trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth()+1}`;
                  }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#52525b" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#52525b" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '0.75rem', color: '#18181b' }}
                  itemStyle={{ color: '#18181b' }}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="impressions" 
                  name="Impresiones"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorImpressions)" 
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="clicks" 
                  name="Clics"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">No hay datos</div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Queries Table */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 relative z-10">Top Consultas (Keywords)</h2>
          <div className="relative z-10 overflow-x-auto">
            {loading ? (
              <div className="w-full h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : data && data.topQueries && data.topQueries.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-600 uppercase bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Keyword</th>
                    <th className="px-4 py-3 text-right">Clics</th>
                    <th className="px-4 py-3 text-right">Impresiones</th>
                    <th className="px-4 py-3 text-right">Pos.</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topQueries.slice(0, 50).map((q, i) => (
                    <tr key={i} className="border-b border-zinc-200/70 hover:bg-zinc-100/70 transition-colors">
                      <td className="px-4 py-3 font-medium text-blue-400 truncate max-w-[200px]" title={q.query}>
                        {q.query}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-900">{formatNumber(q.clicks)}</td>
                      <td className="px-4 py-3 text-right text-zinc-600">{formatNumber(q.impressions)}</td>
                      <td className="px-4 py-3 text-right text-purple-400">{formatPos(q.position)}</td>
                      <td className="px-4 py-3 text-right text-amber-400">{formatPercent(q.ctr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-zinc-600">No hay datos</div>
            )}
          </div>
        </div>

        {/* Top Pages Table */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 relative z-10">Top Páginas de Aterrizaje</h2>
          <div className="relative z-10 overflow-x-auto">
            {loading ? (
              <div className="w-full h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : data && data.topPages && data.topPages.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-600 uppercase bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">URL</th>
                    <th className="px-4 py-3 text-right">Clics</th>
                    <th className="px-4 py-3 text-right">Pos.</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.slice(0, 50).map((p, i) => {
                    const shortUrl = p.page.replace('https://gsmpro.cl', '').replace('https://www.gsmpro.cl', '');
                    return (
                      <tr key={i} className="border-b border-zinc-200/70 hover:bg-zinc-100/70 transition-colors">
                        <td className="px-4 py-3 font-medium text-zinc-200 truncate max-w-[280px]" title={p.page}>
                          {shortUrl}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-zinc-900">{formatNumber(p.clicks)}</td>
                        <td className="px-4 py-3 text-right text-purple-400">{formatPos(p.position)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-zinc-600">No hay datos</div>
            )}
          </div>
        </div>

      </div>

      {/* Brand vs Non-Brand SEO */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-zinc-500" />
            <h2 className="font-bold text-zinc-900">SEO Marca vs No-Marca</h2>
          </div>
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            {([['all','Todas'], ['branded','Marca'], ['non_branded','No-Marca']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setActiveSegTab(k)} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors', activeSegTab === k ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700')}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {seoSeg && (
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-100">
            {([
              { key: 'branded' as const, label: 'Marca (GSMPro)', icon: Tag, color: 'blue' },
              { key: 'non_branded' as const, label: 'No-Marca (Discovery)', icon: Globe, color: 'emerald' },
            ]).map(({ key, label, icon: Icon, color }) => {
              const kpi = seoSeg.kpis[key];
              return (
                <div key={key} className="p-5 border-r last:border-r-0 border-zinc-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn('p-1.5 rounded-lg', color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">{label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[{l:'Clics',v:kpi.clicks.toLocaleString()},{l:'Impresiones',v:kpi.impressions.toLocaleString()},{l:'Pos. Prom.',v:kpi.avgPosition.toFixed(1)}].map(({l,v}) => (
                      <div key={l}><p className="text-xs text-zinc-400">{l}</p><p className="text-lg font-bold text-zinc-900">{v}</p></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-zinc-50 border-b border-zinc-100">{['Consulta','Segmento','Clics','Impresiones','CTR','Posición'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {seoSegLoading ? Array.from({length:5}).map((_,i) => (
                <tr key={i} className="border-b border-zinc-100">{Array.from({length:6}).map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse"/></td>)}</tr>
              )) : ((seoSeg?.queries ?? []).filter((q: QueryData) => activeSegTab === 'all' || (q as QueryData & {segment?:string}).segment === activeSegTab)).slice(0,50).map((q: QueryData, i: number) => {
                const seg = (q as QueryData & {segment?:string}).segment;
                return (
                  <tr key={i} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900 max-w-[260px] truncate" title={q.query}>{q.query}</td>
                    <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', seg === 'branded' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700')}>{seg === 'branded' ? 'Marca' : 'No-Marca'}</span></td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{q.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-zinc-500">{q.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-amber-600">{(q.ctr * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-purple-600">{q.position.toFixed(1)}</td>
                  </tr>
                );
              })}
              {!seoSegLoading && (!seoSeg?.queries || seoSeg.queries.length === 0) && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-zinc-400 text-sm">Sin datos de segmentación SEO.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// KPI Card Component
function KpiCard({ title, value, icon: Icon, color, loading }: { title: string, value: string | number, icon: any, color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'zinc', loading?: boolean }) {
  const colorStyles = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    zinc: 'text-zinc-600 bg-zinc-500/10 border-zinc-500/20',
  };

  return (
    <div className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <p className="text-sm font-medium text-zinc-600">{title}</p>
        <div className={cn("p-2 rounded-xl border", colorStyles[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 relative z-10">
        {loading ? (
           <div className="h-8 w-24 bg-zinc-100/80 rounded animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</h3>
          </div>
        )}
      </div>
      {/* Background glow effect */}
      <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500", colorStyles[color].split(' ')[1])} />
    </div>
  );
}
