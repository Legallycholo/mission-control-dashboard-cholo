'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Wallet, ShoppingCart,
  Plus, Trash2, RefreshCw, AlertTriangle, ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

type CostCategory = 'COGS' | 'OPEX' | 'GATEWAY' | 'SHIPPING' | 'MARKETING' | 'OTHER';

interface CostEntry { id: string; category: CostCategory; name: string; amount_usd: number; notes: string; }
interface RevSummary { netSales: number; grossSales: number; discounts: number; orderCount: number; }
interface PnlSummary {
  grossProfit: number; grossMargin: number;
  cogs: number; opex: number; gateway: number; shipping: number; marketing: number; other: number;
  totalOpex: number; operatingProfit: number; operatingMargin: number;
}

const CATEGORY_META: Record<CostCategory, { label: string; color: string; bg: string; desc: string }> = {
  COGS:      { label: 'COGS',          color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200',     desc: 'Costo de mercadería vendida' },
  OPEX:      { label: 'OPEX',          color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',   desc: 'Gastos operacionales fijos' },
  GATEWAY:   { label: 'Pasarela',      color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', desc: 'Comisiones Webpay / MercadoPago' },
  SHIPPING:  { label: 'Envío',         color: 'text-sky-700',    bg: 'bg-sky-50 border-sky-200',       desc: 'Costos logísticos y despacho' },
  MARKETING: { label: 'Marketing',     color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     desc: 'Inversión en pauta publicitaria' },
  OTHER:     { label: 'Otros',         color: 'text-zinc-700',   bg: 'bg-zinc-50 border-zinc-200',     desc: 'Otros gastos no clasificados' },
};

const CATEGORY_ORDER: CostCategory[] = ['COGS', 'OPEX', 'GATEWAY', 'SHIPPING', 'MARKETING', 'OTHER'];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n >= 0 ? '' : ''}${n.toFixed(1)}%`;

function getMonths(count = 12) {
  const months = [];
  const d = new Date();
  for (let i = 0; i < count; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const label = d.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
    months.push({ value: `${y}-${m}`, label });
    d.setMonth(d.getMonth() - 1);
  }
  return months;
}

export default function FinanzasPnlPage() {
  const months = getMonths();
  const [period, setPeriod] = useState(months[0].value);
  const [revenue, setRevenue] = useState<RevSummary | null>(null);
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [summary, setSummary] = useState<PnlSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Add cost form state
  const [addOpen, setAddOpen] = useState(false);
  const [formCat, setFormCat] = useState<CostCategory>('COGS');
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchData();
  }, [period, mounted]);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/finanzas/pnl?period=${period}`);
      const json = await res.json();
      if (json.success) {
        setRevenue(json.data.revenue);
        setCosts(json.data.costs);
        setSummary(json.data.summary);
      } else {
        setError(json.error ?? 'Error al cargar datos');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCost = async () => {
    if (!formName.trim() || !formAmount) return;
    setSaving(true);
    try {
      const res = await fetch('/api/finanzas/pnl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, category: formCat, name: formName.trim(), amount_usd: parseFloat(formAmount), notes: formNotes }),
      });
      const json = await res.json();
      if (json.success) {
        setFormName(''); setFormAmount(''); setFormNotes('');
        setAddOpen(false);
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/finanzas/pnl?id=${id}`, { method: 'DELETE' });
      fetchData();
    } finally {
      setDeleting(null);
    }
  };

  // Waterfall chart data
  const waterfallData = summary ? [
    { name: 'Ventas Netas', value: revenue?.netSales ?? 0, type: 'positive' },
    { name: 'COGS',         value: -summary.cogs,         type: 'negative' },
    { name: 'Ut. Bruta',   value: summary.grossProfit,    type: summary.grossProfit >= 0 ? 'result' : 'negative' },
    { name: 'OPEX',         value: -summary.opex,          type: 'negative' },
    { name: 'Marketing',   value: -summary.marketing,     type: 'negative' },
    { name: 'Pasarela',    value: -summary.gateway,       type: 'negative' },
    { name: 'Envío',       value: -summary.shipping,      type: 'negative' },
    { name: 'Ut. Oper.',   value: summary.operatingProfit, type: summary.operatingProfit >= 0 ? 'result' : 'negative' },
  ].filter(d => d.value !== 0) : [];

  const waterfillColor = (type: string) =>
    type === 'positive' ? '#10b981' : type === 'result' ? '#3b82f6' : '#f43f5e';

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">P&amp;L y Rentabilidad</h1>
          <p className="text-zinc-500 mt-1">Estado de resultados real — ingresos Shopify + costos manuales.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:border-blue-400 transition-colors"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Error al cargar datos</p>
            <p className="text-sm text-amber-700 mt-0.5">{error}</p>
            <p className="text-xs text-amber-600 mt-2">
              Asegúrate de que la tabla <code className="bg-amber-100 px-1 rounded font-mono">pnl_costs</code> exista en BigQuery.
              Ejecuta <code className="bg-amber-100 px-1 rounded font-mono">scripts/sql/raw_layer.pnl_costs.sql</code> primero.
            </p>
          </div>
        </div>
      )}

      {/* P&L Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Ingresos Netos',
            value: revenue ? fmt(revenue.netSales) : '...',
            icon: DollarSign,
            color: 'emerald',
            sub: revenue ? `${revenue.orderCount} órdenes cobradas` : '',
          },
          {
            label: 'Utilidad Bruta',
            value: summary ? fmt(summary.grossProfit) : '...',
            icon: summary && summary.grossProfit >= 0 ? TrendingUp : TrendingDown,
            color: summary && summary.grossProfit >= 0 ? 'blue' : 'rose',
            sub: summary ? `Margen ${fmtPct(summary.grossMargin)}` : '',
          },
          {
            label: 'Total Costos',
            value: summary ? fmt(summary.cogs + summary.totalOpex) : '...',
            icon: ShoppingCart,
            color: 'rose',
            sub: summary ? `COGS + OPEX + Otros` : '',
          },
          {
            label: 'Utilidad Operacional',
            value: summary ? fmt(summary.operatingProfit) : '...',
            icon: summary && summary.operatingProfit >= 0 ? TrendingUp : TrendingDown,
            color: summary && summary.operatingProfit >= 0 ? 'emerald' : 'rose',
            sub: summary ? `Margen ${fmtPct(summary.operatingMargin)}` : '',
          },
        ].map(card => {
          const colorMap: Record<string, string> = {
            emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
            blue:    'bg-blue-50 border-blue-200 text-blue-700',
            rose:    'bg-rose-50 border-rose-200 text-rose-700',
          };
          const CardIcon = card.icon;
          return (
            <div key={card.label} className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                <div className={cn('p-1.5 rounded-lg border', colorMap[card.color])}>
                  <CardIcon className="w-4 h-4" />
                </div>
              </div>
              {loading ? <div className="h-8 w-24 bg-zinc-100 rounded animate-pulse" />
                : <p className="text-2xl font-bold text-zinc-900 tracking-tight">{card.value}</p>}
              <p className="text-xs text-zinc-400 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* P&L Breakdown + Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Breakdown */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
          <h2 className="font-bold text-zinc-900 mb-4">Estado de Resultados</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-5 bg-zinc-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-0">
              {revenue && summary && [
                { label: 'Ventas Brutas', value: revenue.grossSales, indent: 0, bold: false },
                { label: 'Descuentos', value: -revenue.discounts, indent: 1, negative: true },
                { label: 'Ventas Netas', value: revenue.netSales, indent: 0, bold: true, separator: true },
                { label: 'COGS', value: -summary.cogs, indent: 1, negative: true },
                { label: 'Utilidad Bruta', value: summary.grossProfit, indent: 0, bold: true, separator: true, highlight: summary.grossProfit >= 0 ? 'emerald' : 'rose' },
                { label: `  Margen ${fmtPct(summary.grossMargin)}`, value: null, indent: 1, meta: true },
                { label: 'OPEX (Gastos Fijos)', value: -summary.opex, indent: 1, negative: true },
                { label: 'Marketing / Ads', value: -summary.marketing, indent: 1, negative: true },
                { label: 'Pasarela de Pago', value: -summary.gateway, indent: 1, negative: true },
                { label: 'Envío', value: -summary.shipping, indent: 1, negative: true },
                { label: 'Otros', value: -summary.other, indent: 1, negative: true },
                { label: 'Utilidad Operacional', value: summary.operatingProfit, indent: 0, bold: true, separator: true, highlight: summary.operatingProfit >= 0 ? 'blue' : 'rose' },
                { label: `  Margen ${fmtPct(summary.operatingMargin)}`, value: null, indent: 1, meta: true },
              ].map((row, i) => {
                if (row.meta) {
                  return <p key={i} className="text-xs text-zinc-400 pl-4 pb-2">{row.label}</p>;
                }
                return (
                  <div key={i} className={cn('flex items-center justify-between py-2.5 border-b border-zinc-100/60',
                    row.separator && 'border-t-2 border-zinc-300 mt-1',
                    row.bold && 'font-semibold',
                  )}>
                    <span className={cn('text-sm text-zinc-600', row.indent === 1 && 'pl-4', row.bold && 'text-zinc-900')}>
                      {row.label}
                    </span>
                    {row.value !== null && (
                      <span className={cn('text-sm tabular-nums font-mono',
                        row.bold && 'font-bold',
                        row.highlight === 'emerald' && 'text-emerald-700',
                        row.highlight === 'blue' && 'text-blue-700',
                        row.highlight === 'rose' && 'text-rose-700',
                        !row.highlight && row.negative && row.value < 0 && 'text-rose-600',
                        !row.highlight && !row.negative && 'text-zinc-900',
                      )}>
                        {fmt(row.value)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Waterfall chart */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
          <h2 className="font-bold text-zinc-900 mb-4">Cascada de Rentabilidad</h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : waterfallData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} stroke="#71717a" tickLine={false} />
                  <YAxis fontSize={10} stroke="#71717a" tickLine={false} tickFormatter={v => `$${Math.abs(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                    formatter={(v: unknown) => [fmt(Math.abs(Number(v))), Number(v) < 0 ? 'Costo' : 'Ingreso/Utilidad']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                    {waterfallData.map((entry, i) => (
                      <Cell key={i} fill={waterfillColor(entry.type)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-zinc-400">
              <Wallet className="w-10 h-10 text-zinc-300" />
              <p className="text-sm">Ingresa costos para ver la cascada de rentabilidad</p>
            </div>
          )}
        </div>
      </div>

      {/* Cost entries */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-zinc-900">Entradas de Costo</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Costos manuales para {months.find(m => m.value === period)?.label}</p>
          </div>
          <button
            onClick={() => setAddOpen(prev => !prev)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar costo
          </button>
        </div>

        {/* Add cost form */}
        {addOpen && (
          <div className="p-5 border-b border-zinc-100 bg-zinc-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Categoría</label>
                <select
                  value={formCat}
                  onChange={e => setFormCat(e.target.value as CostCategory)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-blue-400"
                >
                  {CATEGORY_ORDER.map(c => (
                    <option key={c} value={c}>{CATEGORY_META[c].label} — {CATEGORY_META[c].desc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Nombre</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Ej: Costo de Mercadería"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Monto (USD)</label>
                <input
                  type="number"
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  placeholder="Ej: 5000"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Notas (opcional)</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Descripción adicional"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCost}
                disabled={saving || !formName.trim() || !formAmount}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Cost list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['Categoría', 'Nombre', 'Monto (USD)', 'Notas', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  {Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td>)}
                </tr>
              )) : costs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Wallet className="w-8 h-8 text-zinc-300" />
                      <p className="text-sm">Sin costos ingresados para este periodo.</p>
                      <button onClick={() => setAddOpen(true)} className="mt-1 text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                        Agregar primer costo <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                CATEGORY_ORDER.flatMap(cat => {
                  const entries = costs.filter(c => c.category === cat);
                  if (!entries.length) return [];
                  const meta = CATEGORY_META[cat];
                  return entries.map((entry, i) => (
                    <tr key={entry.id} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                      {i === 0 && (
                        <td className="px-4 py-3" rowSpan={entries.length}>
                          <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border', meta.bg, meta.color)}>
                            {meta.label}
                          </span>
                        </td>
                      )}
                      {i > 0 && null}
                      <td className="px-4 py-3 font-medium text-zinc-900">{entry.name}</td>
                      <td className="px-4 py-3 font-semibold text-rose-700 tabular-nums">{fmt(entry.amount_usd)}</td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{entry.notes || '—'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleting === entry.id}
                          className="p-1.5 rounded-lg text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          {deleting === entry.id
                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ));
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
