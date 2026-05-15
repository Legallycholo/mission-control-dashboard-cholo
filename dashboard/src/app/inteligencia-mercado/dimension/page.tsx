"use client";

import { useState, useEffect } from 'react';
import { Globe, TrendingUp, ShoppingBag, BarChart2, RefreshCw, Clock, Calculator, AlertTriangle } from 'lucide-react';
import {
  Treemap,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';

interface GlobalMetrics {
  totalMarketSizeAvg: number;
  totalMarketSizeLast: number;
  totalShareAvg: number;
  totalShareLast: number;
  productCount: number;
}

interface ProductMetric {
  product_id: number;
  product_title: string;
  vendor: string;
  keyword: string;
  avg_price: number;
  avg_monthly_searches: number;
  last_month_searches: number;
  market_size_avg: number;
  market_size_last: number;
  market_share_avg: number;
  market_share_last: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatNumber = (n: number) =>
  new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n);

const CustomTreemapContent = ({ x, y, width, height, name, value }: any) => {
  if (!width || !height || width < 40 || height < 30) return null;
  const fontSize = Math.min(12, Math.max(8, width / 12));
  return (
    <g>
      <rect
        x={x} y={y} width={width} height={height}
        style={{ fill: `hsl(${210 + (value % 60)}, 70%, ${25 + (value % 20)}%)`, stroke: 'rgba(255,255,255,0.12)', strokeWidth: 2 }}
        rx={4}
      />
      <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
        <div style={{ overflow: 'hidden', color: '#fafafa', fontSize: `${fontSize}px`, lineHeight: '1.2', fontWeight: 500 }}>
          <div style={{ marginBottom: 2 }}>{name}</div>
          <div style={{ opacity: 0.7, fontSize: `${fontSize - 1}px` }}>{formatCurrency(value)}</div>
        </div>
      </foreignObject>
    </g>
  );
};

export default function DimensionMercadoPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [globals, setGlobals] = useState<GlobalMetrics | null>(null);
  const [products, setProducts] = useState<ProductMetric[]>([]);
  const [view, setView] = useState<'treemap' | 'ranking'>('ranking');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchData();
  }, [mounted]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inteligencia-mercado/dimension');
      const json = await res.json();
      if (json.success && json.data.globals.productCount > 0) {
        setGlobals(json.data.globals);
        setProducts(json.data.products);
        setNoData(false);
      } else {
        setNoData(true);
      }
    } catch (err) {
      console.error(err);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  const treemapData = products.slice(0, 50).map(p => ({
    name: p.product_title.length > 30 ? p.product_title.slice(0, 27) + '...' : p.product_title,
    fullName: p.product_title,
    value: p.market_size_avg,
    vendor: p.vendor,
    keyword: p.keyword,
    searches: p.avg_monthly_searches,
  }));

  const top15 = products.slice(0, 15).map(p => ({
    name: p.product_title.length > 25 ? p.product_title.slice(0, 22) + '...' : p.product_title,
    fullName: p.product_title,
    marketSize: p.market_size_avg,
    marketShare: p.market_share_avg,
    searches: p.avg_monthly_searches,
  }));

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dimensión de Mercado</h1>
          <p className="text-zinc-600 mt-1">
            Market Size, Market Share y proyecciones con la Google Success Formula.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200/90 border border-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Market Size Promedio"
          value={loading ? "..." : globals ? formatCurrency(globals.totalMarketSizeAvg) : "Sin datos"}
          subtitle="Tamaño total del mercado"
          icon={Globe}
          color="blue"
        />
        <KpiCard
          title="Market Size Último Mes"
          value={loading ? "..." : globals ? formatCurrency(globals.totalMarketSizeLast) : "Sin datos"}
          subtitle="Tamaño estimado del mes actual"
          icon={TrendingUp}
          color="violet"
        />
        <KpiCard
          title="Market Share Promedio"
          value={loading ? "..." : globals ? formatCurrency(globals.totalShareAvg) : "Sin datos"}
          subtitle="Nuestra cuota estimada"
          icon={ShoppingBag}
          color="emerald"
        />
        <KpiCard
          title="Productos Analizados"
          value={loading ? "..." : globals ? formatNumber(globals.productCount) : "0"}
          subtitle="Productos activos con datos"
          icon={BarChart2}
          color="amber"
        />
      </div>

      {/* Pending State banner */}
      {noData && !loading && <PendingStateBanner />}

      {/* Charts (only when data exists) */}
      {!noData && !loading && (
        <>
          <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Mapa de Mercado por Producto</h2>
                <p className="text-xs text-zinc-600 mt-1">Área proporcional al Market Size estimado</p>
              </div>
              <div className="flex bg-zinc-50 border border-zinc-200 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setView('ranking')}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    view === 'ranking' ? "bg-blue-600 text-white" : "text-zinc-600 hover:text-zinc-900")}
                >
                  Ranking
                </button>
                <button
                  onClick={() => setView('treemap')}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    view === 'treemap' ? "bg-blue-600 text-white" : "text-zinc-600 hover:text-zinc-900")}
                >
                  Treemap
                </button>
              </div>
            </div>

            {view === 'treemap' ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="value"
                    aspectRatio={4 / 3}
                    content={<CustomTreemapContent />}
                  >
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '1rem', color: '#18181b', fontSize: '12px' }}
                      formatter={(val: any, _: any, props: any) => [
                        formatCurrency(val),
                        `${props.payload?.fullName || ''} | Búsquedas: ${formatNumber(props.payload?.searches || 0)}`
                      ]}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top15} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                    <XAxis type="number" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} width={140} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={true} horizontal={false} />
                    <RechartsTooltip
                      cursor={{ fill: '#e4e4e7', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '1rem', color: '#18181b', fontSize: '12px' }}
                      formatter={(val: any, key: any) => [
                        formatCurrency(val),
                        key === 'marketSize' ? 'Market Size Promedio' : 'Market Share Estimado'
                      ]}
                      labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="marketSize" name="Market Size" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                    <Bar dataKey="marketShare" name="Market Share" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-zinc-900 mb-5">Detalle por Producto</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-600 uppercase">
                  <tr className="bg-zinc-50 rounded-lg">
                    <th className="px-4 py-3 rounded-tl-lg">#</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Keyword</th>
                    <th className="px-4 py-3 text-right">Vol. Prom./mes</th>
                    <th className="px-4 py-3 text-right">Market Size Prom.</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Market Share Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.product_id} className="border-b border-zinc-200/70 hover:bg-zinc-100/70 transition-colors">
                      <td className="px-4 py-3 text-zinc-600 font-mono text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900 text-xs leading-tight max-w-[220px]">{p.product_title}</div>
                        <div className="text-zinc-600 text-[10px] mt-0.5">{p.vendor}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-500/10 text-blue-700 border border-blue-200 rounded-lg px-2 py-0.5 text-[10px] font-mono">
                          {p.keyword}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 font-mono text-xs">
                        {formatNumber(p.avg_monthly_searches)}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-600 font-medium text-xs">
                        {formatCurrency(p.market_size_avg)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-medium text-xs">
                        {formatCurrency(p.market_share_avg)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Google Success Formula Simulator — always visible */}
      <GoogleSuccessFormulaSimulator products={products} />
    </div>
  );
}

// ─── Google Success Formula Simulator ────────────────────────────────────────

const GSF_SCENARIOS = [
  { label: 'Pesimista',   sov: 0.20, cardCls: 'bg-rose-50 border-rose-200',     badgeCls: 'bg-rose-100 text-rose-700',     valCls: 'text-rose-700' },
  { label: 'Conservador', sov: 0.50, cardCls: 'bg-amber-50 border-amber-200',   badgeCls: 'bg-amber-100 text-amber-700',   valCls: 'text-amber-700' },
  { label: 'Optimista',   sov: 0.85, cardCls: 'bg-emerald-50 border-emerald-200', badgeCls: 'bg-emerald-100 text-emerald-700', valCls: 'text-emerald-700' },
];

const FORMULA_TOKENS = [
  { label: 'MSV',     desc: 'Vol. búsquedas/mes',  cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  { symbol: '×' },
  { label: '47%',     desc: 'CTR Shopping (fijo)',  cls: 'bg-violet-100 text-violet-700 border-violet-200' },
  { symbol: '×' },
  { label: 'SoV',     desc: 'Share of Voice',       cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  { symbol: '×' },
  { label: 'CR%',     desc: 'Tasa conversión',      cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { symbol: '×' },
  { label: 'AOV',     desc: 'Ticket promedio',      cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { symbol: '=' },
  { label: 'Revenue', desc: 'Ingreso proyectado',   cls: 'bg-rose-100 text-rose-700 border-rose-200' },
];

function GoogleSuccessFormulaSimulator({ products }: { products: ProductMetric[] }) {
  const [selectedId, setSelectedId] = useState('');
  const [msv, setMsv] = useState('');
  const [aov, setAov] = useState('');
  const [cr, setCr] = useState('2.0');

  const CTR = 0.47;

  useEffect(() => {
    const p = products.find(x => String(x.product_id) === selectedId);
    if (p) {
      setMsv(String(Math.round(p.avg_monthly_searches)));
      setAov(String(Math.round(p.avg_price)));
    }
  }, [selectedId, products]);

  const msvNum = parseFloat(msv) || 0;
  const aovNum = parseFloat(aov) || 0;
  const crFrac = parseFloat(cr) / 100;
  const hasInputs = msvNum > 0 && aovNum > 0;

  const results = GSF_SCENARIOS.map(s => {
    const clicks = msvNum * CTR * s.sov;
    const buyers = clicks * crFrac;
    const revenue = buyers * aovNum;
    return { ...s, clicks, buyers, revenue };
  });

  return (
    <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Google Success Formula — Simulador</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Proyección de revenue en 3 escenarios por nivel de Share of Voice.
          </p>
        </div>
      </div>

      {/* Formula visualization */}
      <div className="flex items-center gap-2 flex-wrap mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        {FORMULA_TOKENS.map((token, i) => {
          if ('symbol' in token) {
            return <span key={i} className="text-zinc-400 font-bold text-base">{token.symbol}</span>;
          }
          return (
            <div key={i} className={cn('px-3 py-1.5 rounded-xl border text-center min-w-[70px]', token.cls)}>
              <div className="text-xs font-bold leading-tight">{token.label}</div>
              <div className="text-[10px] opacity-70 leading-tight mt-0.5">{token.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {products.length > 0 && (
          <div className="md:col-span-2 lg:col-span-4">
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">
              Auto-completar desde producto (MSV y AOV en vivo)
            </label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-blue-400 transition-colors"
            >
              <option value="">Seleccionar producto para auto-completar...</option>
              {products.slice(0, 60).map(p => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_title.length > 55 ? p.product_title.slice(0, 52) + '...' : p.product_title}
                  {' '}— {formatNumber(p.avg_monthly_searches)} búsq./mes · ${Math.round(p.avg_price)} AOV
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">MSV — Búsquedas / mes</label>
          <input
            type="number"
            value={msv}
            onChange={e => setMsv(e.target.value)}
            placeholder="Ej: 10 000"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">CTR Shopping</label>
          <div className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-400 font-mono select-none">
            47% (constante GSF)
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">CR — Tasa de Conversión (%)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="100"
            value={cr}
            onChange={e => setCr(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">AOV — Ticket Promedio (USD)</label>
          <input
            type="number"
            value={aov}
            onChange={e => setAov(e.target.value)}
            placeholder="Ej: 150"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      {/* Results */}
      {hasInputs ? (
        <>
          {/* Formula substitution */}
          <div className="mb-5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-xs font-mono text-zinc-500">
              {formatNumber(msvNum)}
              <span className="text-zinc-400"> × 47% × </span>
              <span className="text-amber-600">SoV</span>
              <span className="text-zinc-400"> × </span>
              <span className="text-emerald-600">{cr}%</span>
              <span className="text-zinc-400"> × </span>
              {formatCurrency(aovNum)}
              <span className="text-zinc-400"> = </span>
              <span className="text-rose-600">?</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map(r => (
              <div key={r.label} className={cn('p-5 rounded-2xl border relative overflow-hidden', r.cardCls)}>
                <div className="flex items-center justify-between mb-4">
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', r.badgeCls)}>
                    {r.label}
                  </span>
                  <span className={cn('text-xs font-mono font-bold', r.valCls)}>
                    SoV {(r.sov * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Revenue mensual</p>
                  <p className={cn('text-2xl font-bold tracking-tight', r.valCls)}>
                    {formatCurrency(r.revenue)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-200/60">
                  <div>
                    <p className="text-[10px] text-zinc-500">Clicks / mes</p>
                    <p className="text-sm font-bold text-zinc-700">{formatNumber(r.clicks)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500">Compradores / mes</p>
                    <p className="text-sm font-bold text-zinc-700">{formatNumber(r.buyers)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Annual projection */}
          <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-2">Proyección Anual (escenario conservador)</p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[10px] text-blue-500">Revenue anual</p>
                <p className="text-lg font-bold text-blue-800">{formatCurrency(results[1].revenue * 12)}</p>
              </div>
              <div>
                <p className="text-[10px] text-blue-500">Compradores / año</p>
                <p className="text-lg font-bold text-blue-800">{formatNumber(results[1].buyers * 12)}</p>
              </div>
              <div>
                <p className="text-[10px] text-blue-500">SoV usado</p>
                <p className="text-lg font-bold text-blue-800">50%</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <Calculator className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm font-medium">Ingresa MSV y AOV para ver las proyecciones</p>
          <p className="text-zinc-400 text-xs mt-1">
            {products.length > 0
              ? 'Selecciona un producto arriba para auto-completar los valores en vivo.'
              : 'Ingresa los valores manualmente para calcular.'}
          </p>
        </div>
      )}

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

// ─── Pending State Banner ─────────────────────────────────────────────────────

function PendingStateBanner() {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl border border-amber-200 bg-amber-50">
      <div className="p-2 rounded-xl bg-amber-100 flex-shrink-0">
        <Clock className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <p className="text-amber-800 font-semibold">Esperando datos de Google Ads</p>
        <p className="text-amber-700 text-sm mt-1">
          El servicio{' '}
          <code className="text-xs bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded text-amber-800 font-mono">
            KeywordPlanIdeaService
          </code>{' '}
          requiere aprobación de Basic Access. Las tablas de BigQuery se poblarán automáticamente cuando se apruebe.
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Solicitado en ads.google.com
          </span>
          <span className="text-[10px] text-amber-600">1–5 días hábiles · El acceso llega por email</span>
        </div>
        <p className="text-amber-700 text-xs mt-3">
          Mientras tanto, usa el Simulador de Google Success Formula abajo para calcular proyecciones manualmente.
        </p>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string; subtitle: string; icon: any;
  color: 'blue' | 'violet' | 'emerald' | 'amber';
}) {
  const styles = {
    blue:    'text-blue-600   bg-blue-50   border-blue-200/60',
    violet:  'text-violet-600 bg-violet-50 border-violet-200/60',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
    amber:   'text-amber-600  bg-amber-50  border-amber-200/60',
  };
  return (
    <div className="p-5 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-3 relative z-10">
        <p className="text-xs font-medium text-zinc-500 leading-tight">{title}</p>
        <div className={cn("p-1.5 rounded-lg border", styles[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900 tracking-tight relative z-10">{value}</p>
      <p className="text-[10px] text-zinc-500 mt-1 relative z-10">{subtitle}</p>
      <div className={cn("absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity",
        color === 'blue' && 'bg-blue-400',
        color === 'violet' && 'bg-violet-400',
        color === 'emerald' && 'bg-emerald-400',
        color === 'amber' && 'bg-amber-400',
      )} />
    </div>
  );
}
