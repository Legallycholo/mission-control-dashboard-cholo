'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface Gateway { gateway: string; orders: number; revenue: number; avgOrderValue: number; revenueShare: number; }
interface ApiData { gateways: Gateway[]; totalRevenue: number; dateRange: { startDate: string; endDate: string }; }

const COLORS = ['#3b82f6','#10b981','#6366f1','#f59e0b','#f43f5e','#8b5cf6','#14b8a6','#ec4899'];

const GATEWAY_LABELS: Record<string, string> = {
  paypal: 'PayPal', stripe: 'Stripe', shopify_payments: 'Shopify Payments',
  manual: 'Manual', cash: 'Efectivo', bank_deposit: 'Depósito Bancario',
  mercadopago: 'MercadoPago', webpay: 'Webpay',
};

function labelGateway(g: string): string {
  return GATEWAY_LABELS[g.toLowerCase()] ?? g.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function MetodoPagoPage() {
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
    fetch(`/api/ventas/metodo-pago?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json()).then(j => { if (j.success) setData(j.data); }).catch(console.error).finally(() => setLoading(false));
  }, [startDate, endDate, mounted]);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

  const handleExport = () => {
    if (!data) return;
    const rows = ['Pasarela,Órdenes,Ingresos,AOV,% Total',
      ...data.gateways.map(g => `"${labelGateway(g.gateway)}",${g.orders},${g.revenue.toFixed(2)},${g.avgOrderValue.toFixed(2)},${g.revenueShare.toFixed(1)}%`)
    ].join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`; a.download = `metodo_pago_${startDate}_${endDate}.csv`; a.click();
  };

  const donutData = (data?.gateways ?? []).map((g, i) => ({ name: labelGateway(g.gateway), value: g.revenue, color: COLORS[i % COLORS.length] }));

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Métodos de Pago</h1>
          <p className="text-zinc-500 mt-1">Distribución de ingresos por pasarela de pago</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 transition-colors"><Download className="w-4 h-4" /> CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-blue-600" /><h2 className="font-bold text-zinc-900">Por Ingresos</h2></div>
          <div className="h-[300px]">
            {loading ? <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={75} outerRadius={115} paddingAngle={3} dataKey="value" stroke="none">
                    {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }} formatter={(v: unknown) => [fmt(Number(v))]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-zinc-600">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100"><h2 className="font-bold text-zinc-900">Desglose por Pasarela</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-zinc-50 border-b border-zinc-100">{['Pasarela', 'Ingresos', 'Órdenes', 'AOV', '% Total'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {loading ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100">{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td>)}</tr>
                )) : (data?.gateways ?? []).map((g, i) => (
                  <tr key={g.gateway} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium text-zinc-900">{labelGateway(g.gateway)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{fmt(g.revenue)}</td>
                    <td className="px-4 py-3 text-zinc-600">{fmtN(g.orders)}</td>
                    <td className="px-4 py-3 text-zinc-600">{fmt(g.avgOrderValue)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${g.revenueShare}%`, backgroundColor: COLORS[i % COLORS.length] }} /></div>
                        <span className="text-xs text-zinc-500">{g.revenueShare.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
