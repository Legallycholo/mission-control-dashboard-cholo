'use client';

import { useState } from 'react';
import { CreditCard, Award, DollarSign, Receipt } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

// ── Mock data ────────────────────────────────────────────────────────────────

interface PaymentMethod {
  method: string;
  count: number;
  total: number;
  avgOrder: number;
  share: number;
  color: string;
}

interface WeeklyTrend {
  week: string;
  webpay: number;
  mercadopago: number;
  transferencia: number;
}

const MOCK_METHODS: PaymentMethod[] = [
  { method: 'Webpay (Débito)',   count: 412, total: 187000, avgOrder: 454, share: 38.4, color: '#3b82f6' },
  { method: 'Webpay (Crédito)', count: 287, total: 156000, avgOrder: 544, share: 26.7, color: '#10b981' },
  { method: 'MercadoPago',      count: 198, total:  98000, avgOrder: 495, share: 19.2, color: '#f59e0b' },
  { method: 'Transferencia',    count:  89, total:  67000, avgOrder: 753, share:  9.8, color: '#6366f1' },
  { method: 'PayPal',           count:  43, total:  28000, avgOrder: 651, share:  4.1, color: '#f43f5e' },
  { method: 'Otro',             count:  21, total:   9800, avgOrder: 467, share:  1.8, color: '#71717a' },
];

const MOCK_TREND: WeeklyTrend[] = [
  { week: 'Sem 1', webpay: 48000, mercadopago: 22000, transferencia: 14000 },
  { week: 'Sem 2', webpay: 52000, mercadopago: 25000, transferencia: 18000 },
  { week: 'Sem 3', webpay: 61000, mercadopago: 28000, transferencia: 12000 },
  { week: 'Sem 4', webpay: 55000, mercadopago: 23000, transferencia: 23000 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

const PIE_DATA = MOCK_METHODS.map(m => ({ name: m.method, value: m.share, color: m.color }));

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MetodoPagoPage() {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const totalTransactions = MOCK_METHODS.reduce((s, m) => s + m.count, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ventas: Métodos de Pago</h1>
          <p className="text-zinc-500 mt-1">Distribución de ingresos y transacciones por pasarela de pago</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
        />
      </div>

      {/* ── KPI grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Procesado */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Total Procesado</p>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{fmt(545800)}</p>
          <div className="mt-2"><DeltaBadge value={11.4} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
        </div>

        {/* Método Favorito */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Método Favorito</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-zinc-900 leading-tight">Webpay Débito</p>
          <p className="text-sm text-zinc-500 mt-1">38% de transacciones</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-500" />
        </div>

        {/* Ticket Promedio Global */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Ticket Promedio Global</p>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{fmt(521)}</p>
          <div className="mt-2"><DeltaBadge value={3.2} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
        </div>

        {/* Transacciones Totales */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500">Transacciones Totales</p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{fmtN(totalTransactions)}</p>
          <div className="mt-2"><DeltaBadge value={9.1} /></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        </div>
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Donut — distribution by method */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Distribución por Método</h2>
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
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => [`${Number(v ?? 0).toFixed(1)}%`, 'Participación']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
              {PIE_DATA.map(entry => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                  <span className="font-semibold text-zinc-800">{entry.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked bar — weekly volume */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Volumen Semanal por Método</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MOCK_TREND} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="week" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown, name: unknown) => {
                    const labels: Record<string, string> = {
                      webpay: 'Webpay',
                      mercadopago: 'MercadoPago',
                      transferencia: 'Transferencia',
                    };
                    const key = String(name ?? '');
                    return [fmt(Number(v ?? 0)), labels[key] ?? key];
                  }}
                />
                <Legend
                  formatter={(value: string) => {
                    const labels: Record<string, string> = {
                      webpay: 'Webpay',
                      mercadopago: 'MercadoPago',
                      transferencia: 'Transferencia',
                    };
                    return labels[value] ?? value;
                  }}
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                <Bar dataKey="webpay"        name="webpay"        stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="mercadopago"   name="mercadopago"   stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="transferencia" name="transferencia" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Full table ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900">Detalle por Método de Pago</h2>
          <span className="text-sm text-zinc-400">{MOCK_METHODS.length} métodos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['Método de Pago', 'Transacciones', 'Ingresos Totales', 'Ticket Promedio', 'Participación'].map(h => (
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
              {MOCK_METHODS.map((m, i) => (
                <tr
                  key={m.method}
                  className={cn(
                    'border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors',
                    i === MOCK_METHODS.length - 1 && 'border-b-0'
                  )}
                >
                  {/* Method name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="font-medium text-zinc-900">{m.method}</span>
                    </div>
                  </td>

                  {/* Transactions */}
                  <td className="px-4 py-3 text-zinc-700 font-medium">{fmtN(m.count)}</td>

                  {/* Revenue */}
                  <td className="px-4 py-3 font-semibold text-zinc-900">{fmt(m.total)}</td>

                  {/* Avg order */}
                  <td className="px-4 py-3 text-zinc-600">{fmt(m.avgOrder)}</td>

                  {/* Revenue share */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(m.share / MOCK_METHODS[0].share) * 100}%`,
                            backgroundColor: m.color,
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: `${m.color}20`,
                          color: m.color,
                        }}
                      >
                        {m.share.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
