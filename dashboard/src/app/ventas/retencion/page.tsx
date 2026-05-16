'use client';

import { useState } from 'react';
import { UserPlus, UserCheck, RefreshCw, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

// ── Mock data ────────────────────────────────────────────────────────────────

interface RetentionSummary {
  newOrders: number;
  returningOrders: number;
  totalOrders: number;
  repeatPurchaseRate: number;
  avgOrdersPerReturning: number;
  newCustomers: number;
  returningCustomers: number;
}

interface TrendPoint {
  date: string;
  new: number;
  returning: number;
}

interface CohortRow {
  month: string;
  m0: number;
  m1: number | null;
  m2: number | null;
  m3: number | null;
}

const MOCK_RETENTION: RetentionSummary = {
  newOrders: 512, returningOrders: 338, totalOrders: 850,
  repeatPurchaseRate: 39.8, avgOrdersPerReturning: 3.2,
  newCustomers: 512, returningCustomers: 289,
};

const MOCK_TREND: TrendPoint[] = [
  { date: '01/05', new: 42, returning: 28 },
  { date: '05/05', new: 38, returning: 31 },
  { date: '10/05', new: 55, returning: 29 },
  { date: '15/05', new: 61, returning: 38 },
  { date: '20/05', new: 48, returning: 42 },
  { date: '25/05', new: 52, returning: 35 },
  { date: '30/05', new: 44, returning: 39 },
];

const MOCK_COHORT: CohortRow[] = [
  { month: 'Ene 2026', m0: 100, m1: 42,   m2: 31,   m3: 23   },
  { month: 'Feb 2026', m0: 100, m1: 38,   m2: 28,   m3: null },
  { month: 'Mar 2026', m0: 100, m1: 44,   m2: null, m3: null },
  { month: 'Abr 2026', m0: 100, m1: null, m2: null, m3: null },
];

const DONUT_DATA = [
  { name: 'Nuevos',      value: MOCK_RETENTION.newOrders,       color: '#3b82f6' },
  { name: 'Recurrentes', value: MOCK_RETENTION.returningOrders, color: '#10b981' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

function cohortCellStyle(val: number | null): string {
  if (val === null) return 'bg-zinc-50 text-zinc-300';
  if (val >= 40)    return 'bg-blue-500 text-white';
  if (val >= 25)    return 'bg-blue-200 text-blue-800';
  if (val >= 10)    return 'bg-blue-50 text-blue-600';
  return 'bg-zinc-50 text-zinc-400';
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function VentasRetencionPage() {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const retention = MOCK_RETENTION;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ventas: Nuevos vs Recurrentes</h1>
          <p className="text-zinc-500 mt-1">Análisis de retención y fidelización de clientes</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
        />
      </div>

      {/* ── KPI grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Órdenes Nuevos Clientes */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Órdenes Nuevos Clientes</p>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{fmtN(retention.newOrders)}</p>
          <div className="mt-2"><DeltaBadge value={8.3} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
        </div>

        {/* Órdenes Clientes Recurrentes */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Órdenes Clientes Recurrentes</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{fmtN(retention.returningOrders)}</p>
          <div className="mt-2"><DeltaBadge value={14.2} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-500" />
        </div>

        {/* Tasa de Recompra */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Tasa de Recompra</p>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{retention.repeatPurchaseRate.toFixed(1)}%</p>
          <div className="mt-2"><DeltaBadge value={2.1} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
        </div>

        {/* Órdenes/Cliente Recurrente */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Órdenes/Cliente Recurrente</p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{retention.avgOrdersPerReturning.toFixed(1)}x</p>
          <div className="mt-2"><DeltaBadge value={0.3} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        </div>
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Area chart — trend */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Evolución Nuevos vs Recurrentes</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={MOCK_TREND} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradReturning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="date" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                />
                <Legend
                  formatter={(value: string) => value === 'new' ? 'Nuevos' : 'Recurrentes'}
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="new"
                  name="new"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#gradNew)"
                />
                <Area
                  type="monotone"
                  dataKey="returning"
                  name="returning"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#gradReturning)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut — order distribution */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Distribución de Órdenes</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {DONUT_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => [fmtN(Number(v ?? 0)), 'órdenes']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {DONUT_DATA.map(d => {
                const pct = ((d.value / retention.totalOrders) * 100).toFixed(1);
                return (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-zinc-600">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: d.color }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-zinc-800 w-12 text-right">
                        {fmtN(d.value)}
                      </span>
                      <span className="text-xs text-zinc-400 w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cohort table ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-zinc-900">Retención por Cohorte (Simplificado)</h2>
            <p className="text-xs text-zinc-400 mt-0.5">M0=mes de adquisición, M1=mes siguiente, etc.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 py-2 bg-zinc-50 rounded-lg w-32">
                  Cohorte
                </th>
                {(['M0', 'M1', 'M2', 'M3'] as const).map(col => (
                  <th
                    key={col}
                    className="text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 py-2 bg-zinc-50 rounded-lg w-24"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_COHORT.map(row => (
                <tr key={row.month}>
                  <td className="px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-50 rounded-lg whitespace-nowrap">
                    {row.month}
                  </td>
                  {([row.m0, row.m1, row.m2, row.m3] as (number | null)[]).map((val, ci) => (
                    <td key={ci} className="px-3 py-2 text-center">
                      <div
                        className={cn(
                          'rounded-lg px-2 py-1.5 text-sm font-semibold mx-auto',
                          cohortCellStyle(val)
                        )}
                      >
                        {val !== null ? `${val}%` : '—'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-zinc-100">
            {[
              { label: '≥40%', className: 'bg-blue-500 text-white' },
              { label: '25–39%', className: 'bg-blue-200 text-blue-800' },
              { label: '10–24%', className: 'bg-blue-50 text-blue-600' },
              { label: 'Sin datos', className: 'bg-zinc-50 text-zinc-300' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn('px-2 py-0.5 rounded text-xs font-semibold', item.className)}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
