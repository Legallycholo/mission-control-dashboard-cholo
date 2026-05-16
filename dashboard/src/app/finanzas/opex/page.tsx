'use client';

import { useState } from 'react';
import {
  Receipt, Percent, Users, TrendingUp, AlertTriangle, Info,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';

// ─── Types ────────────────────────────────────────────────────────────────────
type OpexCategory = 'Nómina' | 'Marketing' | 'Logística' | 'Software' | 'Oficina' | 'Otros';

interface OpexEntry {
  id: string;
  name: string;
  category: OpexCategory;
  amount: number;
  pctOfRevenue: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_OPEX: OpexEntry[] = [
  { id: '1',  name: 'Nómina equipo comercial',      category: 'Nómina',    amount: 18500, pctOfRevenue: 3.4 },
  { id: '2',  name: 'Nómina logística',              category: 'Nómina',    amount: 12000, pctOfRevenue: 2.2 },
  { id: '3',  name: 'Google Ads',                    category: 'Marketing', amount: 9800,  pctOfRevenue: 1.8 },
  { id: '4',  name: 'Meta Ads',                      category: 'Marketing', amount: 6200,  pctOfRevenue: 1.1 },
  { id: '5',  name: 'Starken / Blue Express',        category: 'Logística', amount: 8400,  pctOfRevenue: 1.5 },
  { id: '6',  name: 'Shopify + Klaviyo + Crisp',     category: 'Software',  amount: 2100,  pctOfRevenue: 0.4 },
  { id: '7',  name: 'BigQuery + Firebase',           category: 'Software',  amount: 890,   pctOfRevenue: 0.2 },
  { id: '8',  name: 'Arriendo oficina',              category: 'Oficina',   amount: 3200,  pctOfRevenue: 0.6 },
  { id: '9',  name: 'Servicios básicos',             category: 'Oficina',   amount: 480,   pctOfRevenue: 0.1 },
  { id: '10', name: 'Contabilidad externa',          category: 'Otros',     amount: 1200,  pctOfRevenue: 0.2 },
];

const CATEGORY_TOTALS = [
  { category: 'Nómina',    total: 30500, color: '#3b82f6' },
  { category: 'Marketing', total: 16000, color: '#10b981' },
  { category: 'Logística', total: 8400,  color: '#f59e0b' },
  { category: 'Software',  total: 2990,  color: '#6366f1' },
  { category: 'Oficina',   total: 3680,  color: '#f43f5e' },
  { category: 'Otros',     total: 1200,  color: '#71717a' },
];

const TOTAL_OPEX = 62770;

const MOCK_TREND = [
  { month: 'Dic', opex: 58200 },
  { month: 'Ene', opex: 61000 },
  { month: 'Feb', opex: 59800 },
  { month: 'Mar', opex: 63200 },
  { month: 'Abr', opex: 60400 },
  { month: 'May', opex: 62770 },
];

const MONTHLY_REVENUE = 545800;
const OPEX_PCT = ((TOTAL_OPEX / MONTHLY_REVENUE) * 100).toFixed(1); // 11.5

// ─── Category badge config ───────────────────────────────────────────────────
const CATEGORY_BADGE: Record<OpexCategory, string> = {
  'Nómina':    'bg-blue-50 text-blue-700 border-blue-200',
  'Marketing': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Logística': 'bg-amber-50 text-amber-700 border-amber-200',
  'Software':  'bg-violet-50 text-violet-700 border-violet-200',
  'Oficina':   'bg-rose-50 text-rose-700 border-rose-200',
  'Otros':     'bg-zinc-100 text-zinc-600 border-zinc-200',
};

// ─── Formatters ──────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// ─── Sub-components ──────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, icon: Icon, glowColor, delta, inverseDelta,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  glowColor: string;
  delta?: number;
  inverseDelta?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ backgroundColor: glowColor }} />
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
          <Icon className="w-4 h-4 text-zinc-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      {delta !== undefined && (
        <div className="mt-2">
          <DeltaBadge value={delta} inverse={inverseDelta} />
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function FinanzasOpexPage() {
  const ALL_CATEGORIES: Array<'Todas' | OpexCategory> = [
    'Todas', 'Nómina', 'Marketing', 'Logística', 'Software', 'Oficina', 'Otros',
  ];
  const [filter, setFilter] = useState<'Todas' | OpexCategory>('Todas');

  const filteredEntries =
    filter === 'Todas' ? MOCK_OPEX : MOCK_OPEX.filter(e => e.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Finanzas: Gastos Fijos (OPEX)</h1>
        <p className="text-zinc-500 mt-1">Control de costos operacionales del período</p>
      </div>

      {/* Alert strip — OPEX > 10% of revenue */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          OPEX representa el{' '}
          <strong className="font-bold">{OPEX_PCT}%</strong> de los ingresos del período.
          Threshold de alerta: &gt;15%.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total OPEX"
          value={fmt(TOTAL_OPEX)}
          icon={Receipt}
          glowColor="#f43f5e"
          delta={3.2}
        />
        <KpiCard
          label="% de Ingresos"
          value={`${OPEX_PCT}%`}
          sub={`sobre ${fmt(MONTHLY_REVENUE)} en ingresos`}
          icon={Percent}
          glowColor="#f59e0b"
          delta={-0.4}
          inverseDelta
        />
        <KpiCard
          label="Categoría Mayor"
          value="Nómina"
          sub={fmt(30500)}
          icon={Users}
          glowColor="#3b82f6"
        />
        <KpiCard
          label="vs Mes Anterior"
          value="+$2,370"
          sub="respecto a abril"
          icon={TrendingUp}
          glowColor="#8b5cf6"
          delta={3.9}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Gasto por Categoría — Horizontal BarChart */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Gasto por Categoría</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Distribución del OPEX mensual</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={CATEGORY_TOTALS}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                <XAxis
                  type="number"
                  fontSize={10}
                  stroke="#71717a"
                  tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={80}
                  fontSize={11}
                  stroke="#71717a"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                  formatter={(v: unknown) => [fmt(Number(v)), 'Gasto']}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={22}>
                  {CATEGORY_TOTALS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolución OPEX — AreaChart */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Evolución OPEX (6 meses)</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Tendencia de gastos operacionales</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={MOCK_TREND}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="opexGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="month" fontSize={10} stroke="#71717a" tickLine={false} />
                <YAxis
                  fontSize={10}
                  stroke="#71717a"
                  tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                  formatter={(v: unknown) => [fmt(Number(v)), 'OPEX']}
                />
                <Area
                  type="monotone"
                  dataKey="opex"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#opexGradient)"
                  dot={{ fill: '#f43f5e', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#f43f5e' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cost entries table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-zinc-900">Desglose de Gastos</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{filteredEntries.length} entradas — período mayo 2025</p>
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as typeof filter)}
            className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-blue-400 transition-colors"
          >
            {ALL_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-10">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Concepto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">% Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr key={entry.id} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3 text-zinc-400 text-xs tabular-nums">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{entry.name}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-[10px] font-bold px-2.5 py-1 rounded-full border',
                      CATEGORY_BADGE[entry.category],
                    )}>
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900 tabular-nums font-mono">
                    {fmt(entry.amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 tabular-nums text-xs">
                    {entry.pctOfRevenue.toFixed(1)}%
                  </td>
                </tr>
              ))}

              {/* Totals row */}
              {filter === 'Todas' && (
                <tr className="bg-zinc-50 border-t-2 border-zinc-200">
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 font-bold text-zinc-900">Total OPEX</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right font-bold text-zinc-900 tabular-nums font-mono text-base">
                    {fmt(TOTAL_OPEX)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-zinc-700 tabular-nums text-xs">
                    {OPEX_PCT}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 flex gap-3">
        <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-sm text-zinc-600">
          Los datos de OPEX son ingresados manualmente. Conéctate al módulo P&amp;L para cruzar
          con los ingresos reales de BigQuery.
        </p>
      </div>

    </div>
  );
}
