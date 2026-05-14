'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface Segment { customers: number; orders: number; revenue: number; revenueShare: number; }
interface ApiData { new: Segment; returning: Segment; totals: { customers: number; revenue: number }; retentionRate: number; dateRange: { startDate: string; endDate: string }; }

const DONUT_COLORS = { new: '#3b82f6', returning: '#10b981' };

export default function VentasRetencionPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    fetch(`/api/ventas/retencion?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [startDate, endDate, mounted]);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

  const donutData = data ? [
    { name: 'Nuevos', value: data.new.customers, color: DONUT_COLORS.new },
    { name: 'Recurrentes', value: data.returning.customers, color: DONUT_COLORS.returning },
  ] : [];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Clientes Nuevos vs Recurrentes</h1>
          <p className="text-zinc-500 mt-1">Retención de clientes y valor por segmento</p>
        </div>
        <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Clientes Nuevos', value: data ? fmtN(data.new.customers) : '...', icon: UserPlus, color: 'blue', sub: `${data?.new.orders ?? 0} órdenes` },
          { title: 'Clientes Recurrentes', value: data ? fmtN(data.returning.customers) : '...', icon: UserCheck, color: 'emerald', sub: `${data?.returning.orders ?? 0} órdenes` },
          { title: 'Tasa de Retención', value: data ? `${data.retentionRate.toFixed(1)}%` : '...', icon: TrendingUp, color: 'indigo', sub: 'Del periodo' },
          { title: 'Total Clientes', value: data ? fmtN(data.totals.customers) : '...', icon: Users, color: 'zinc', sub: fmt(data?.totals.revenue ?? 0) },
        ].map(({ title, value, icon: Icon, color, sub }) => (
          <div key={title} className={cn('relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl hover:shadow-xl transition-all group',
            color === 'blue' && 'border-blue-500/20',
            color === 'emerald' && 'border-emerald-500/20',
            color === 'indigo' && 'border-indigo-500/20',
            color === 'zinc' && 'border-zinc-200',
          )}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500">{title}</p>
              <div className={cn('p-2 rounded-xl', color === 'blue' && 'bg-blue-50 text-blue-600', color === 'emerald' && 'bg-emerald-50 text-emerald-600', color === 'indigo' && 'bg-indigo-50 text-indigo-600', color === 'zinc' && 'bg-zinc-100 text-zinc-600')}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              {loading ? <div className="h-8 w-20 bg-zinc-100 rounded animate-pulse" /> : <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>}
              <p className="text-xs text-zinc-400 mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Donut + Revenue breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Distribución de Clientes</h2>
          <div className="h-[280px] flex items-center">
            {loading ? (
              <div className="w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" stroke="none">
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }} formatter={(v: unknown) => [fmtN(Number(v)), 'clientes']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-sm text-zinc-600">{d.name}: <span className="font-semibold text-zinc-900">{fmtN(d.value)}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Ingresos por Segmento</h2>
          {loading ? (
            <div className="space-y-4 mt-6">{[0, 1].map(i => <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse" />)}</div>
          ) : data && (
            <div className="space-y-5 mt-4">
              {[
                { label: 'Clientes Nuevos', revenue: data.new.revenue, share: data.new.revenueShare, color: DONUT_COLORS.new },
                { label: 'Clientes Recurrentes', revenue: data.returning.revenue, share: data.returning.revenueShare, color: DONUT_COLORS.returning },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700">{s.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-900">{fmt(s.revenue)}</span>
                      <span className="text-xs text-zinc-400 ml-2">{s.share.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.share}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-zinc-100 flex justify-between">
                <span className="text-sm font-semibold text-zinc-700">Total</span>
                <span className="text-sm font-bold text-zinc-900">{fmt(data.totals.revenue)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
