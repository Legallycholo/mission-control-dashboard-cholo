'use client';

import { useState } from 'react';
import { Layers, Trophy, PieChart as PieIcon, CreditCard } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

// ── Mock data ────────────────────────────────────────────────────────────────

interface CategoryRow {
  category: string;
  revenue: number;
  units: number;
  revenueShare: number;
  avgOrder: number;
}

const MOCK_CATEGORIES: CategoryRow[] = [
  { category: 'Smartphones',       revenue: 285000, units: 342,  revenueShare: 41.2, avgOrder: 833  },
  { category: 'Accesorios',        revenue: 124000, units: 1240, revenueShare: 17.9, avgOrder: 100  },
  { category: 'Tablets',           revenue:  98000, units:  89,  revenueShare: 14.2, avgOrder: 1101 },
  { category: 'Laptops',           revenue:  87000, units:  52,  revenueShare: 12.6, avgOrder: 1673 },
  { category: 'Audio',             revenue:  54000, units: 312,  revenueShare:  7.8, avgOrder: 173  },
  { category: 'Wearables',         revenue:  38000, units: 198,  revenueShare:  5.5, avgOrder: 192  },
  { category: 'Gaming',            revenue:   7600, units:  43,  revenueShare:  1.1, avgOrder: 177  },
  { category: 'Hogar Inteligente', revenue:   2400, units:  31,  revenueShare:  0.3, avgOrder:  77  },
];

const PIE_DATA = MOCK_CATEGORIES.slice(0, 5).map(c => ({
  name: c.category,
  value: c.revenueShare,
}));

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#f43f5e', '#14b8a6', '#8b5cf6', '#ec4899'];

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

const RANK_BADGE: Record<number, { label: string; className: string }> = {
  0: { label: '🥇', className: 'text-amber-500 font-bold' },
  1: { label: '🥈', className: 'text-zinc-400 font-bold' },
  2: { label: '🥉', className: 'text-amber-700 font-bold' },
};

// ── Custom Pie Legend ─────────────────────────────────────────────────────────

function PieLegend({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {data.map((entry, i) => (
        <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
          <span>{entry.name}</span>
          <span className="font-semibold text-zinc-800">{entry.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function VentasCategoriasPage() {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categories] = useState<CategoryRow[]>(MOCK_CATEGORIES);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ventas: Por Categoría</h1>
          <p className="text-zinc-500 mt-1">Rendimiento y participación de cada categoría de producto</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
        />
      </div>

      {/* ── KPI grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Categorías Activas */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Categorías Activas</p>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">8</p>
          <div className="mt-2"><DeltaBadge value={2} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
        </div>

        {/* Categoría Líder */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Categoría Líder</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900 truncate">Smartphones</p>
          <p className="text-sm text-zinc-500 mt-1">{fmt(285000)} en ingresos</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-500" />
        </div>

        {/* Participación Líder */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Participación Líder</p>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">41.2%</p>
          <p className="text-sm text-zinc-500 mt-1">del total de ingresos</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
        </div>

        {/* Ticket Promedio Global */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Ticket Promedio Global</p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{fmt(834)}</p>
          <div className="mt-2"><DeltaBadge value={5.2} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        </div>
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Horizontal bar chart */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Ingresos por Categoría</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={categories}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={120}
                  fontSize={12}
                  tick={{ fill: '#52525b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <XAxis
                  type="number"
                  fontSize={12}
                  stroke="#e4e4e7"
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => [fmt(Number(v ?? 0)), 'Ingresos']}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={22}>
                  {categories.map((_row, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut pie chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Distribución de Ingresos</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((_entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => [`${Number(v ?? 0).toFixed(1)}%`, 'Participación']}
                />
              </PieChart>
            </ResponsiveContainer>
            <PieLegend data={PIE_DATA} />
          </div>
        </div>
      </div>

      {/* ── Full table ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900">Desglose Completo</h2>
          <span className="text-sm text-zinc-400">{categories.length} categorías</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['#', 'Categoría', 'Ingresos', 'Unidades', 'Participación', 'Ticket Promedio'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr
                  key={c.category}
                  className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors"
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    {RANK_BADGE[i] ? (
                      <span className={cn('text-base', RANK_BADGE[i].className)}>
                        {RANK_BADGE[i].label}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 font-mono">{i + 1}</span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="font-medium text-zinc-900">{c.category}</span>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-4 py-3 font-semibold text-zinc-900">{fmt(c.revenue)}</td>

                  {/* Units */}
                  <td className="px-4 py-3 text-zinc-600">{fmtN(c.units)}</td>

                  {/* Revenue share */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(c.revenueShare / MOCK_CATEGORIES[0].revenueShare) * 100}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${COLORS[i % COLORS.length]}20`,
                          color: COLORS[i % COLORS.length],
                        }}
                      >
                        {c.revenueShare.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Avg order */}
                  <td className="px-4 py-3 text-zinc-700 font-medium">{fmt(c.avgOrder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
