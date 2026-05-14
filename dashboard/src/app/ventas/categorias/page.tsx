'use client';

import { useState, useEffect } from 'react';
import { Download, BarChart2, Tag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface Category {
  category: string; orders: number; unitsSold: number;
  revenue: number; discounts: number; revenueShare: number;
}
interface ApiData { categories: Category[]; totalRevenue: number; dateRange: { startDate: string; endDate: string } }

const COLORS = ['#3b82f6','#10b981','#6366f1','#f59e0b','#f43f5e','#8b5cf6','#14b8a6','#ef4444','#84cc16','#ec4899'];

export default function VentasCategoriasPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true); setError(null);
    fetch(`/api/ventas/categorias?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) setData(j.data);
        else setError(j.message ?? j.error);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate, mounted]);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

  const handleExport = () => {
    if (!data) return;
    const rows = ['Categoría,Órdenes,Unidades,Ingresos,Descuentos,% Total',
      ...data.categories.map(c => `"${c.category}",${c.orders},${c.unitsSold},${c.revenue.toFixed(2)},${c.discounts.toFixed(2)},${c.revenueShare.toFixed(1)}%`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`;
    a.download = `ventas_categorias_${startDate}_${endDate}.csv`;
    a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ventas por Categoría</h1>
          <p className="text-zinc-500 mt-1">Desglose de ingresos por tipo de producto</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 transition-colors">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50 text-amber-700">
          <p className="font-semibold">Datos no disponibles</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-zinc-900">Ingresos por Categoría</h2>
            </div>
            <div className="h-[380px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : data && data.categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categories} layout="vertical" margin={{ top: 0, right: 20, left: 120, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                    <XAxis type="number" fontSize={11} stroke="#71717a" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="category" fontSize={12} stroke="#71717a" width={115} tick={{ fill: '#52525b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                      formatter={(v: unknown, _n: unknown, props: { payload?: Category }) => [fmt(Number(v)), `${props.payload?.revenueShare?.toFixed(1)}% del total`]}
                    />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={22}>
                      {(data.categories ?? []).map((_: Category, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-full text-zinc-400">Sin datos</div>}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-500" />
              <h2 className="font-bold text-zinc-900">Detalle por Categoría</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {['#', 'Categoría', 'Ingresos', '% Total', 'Unidades', 'Órdenes', 'Descuentos'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  )) : (data?.categories ?? []).map((c, i) => (
                    <tr key={c.category} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 text-xs font-mono">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="font-medium text-zinc-900">{c.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-zinc-900">{fmt(c.revenue)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden w-16">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.revenueShare}%` }} />
                          </div>
                          <span className="text-zinc-600 text-xs font-medium">{c.revenueShare.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{fmtN(c.unitsSold)}</td>
                      <td className="px-4 py-3 text-zinc-600">{fmtN(c.orders)}</td>
                      <td className="px-4 py-3 text-rose-600 text-xs">{fmt(c.discounts)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
