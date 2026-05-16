'use client';

import { useState } from 'react';
import { Package, TrendingUp, Zap, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface SkuRow {
  sku: string;
  product: string;
  category: string;
  sessions: number;
  addToCart: number;
  addToCartRate: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

const MOCK_SKUS: SkuRow[] = [
  { sku: 'APL-IP16P-256', product: 'iPhone 16 Pro 256GB', category: 'Smartphones', sessions: 4820, addToCart: 1205, addToCartRate: 24.99, conversions: 218, conversionRate: 4.52, revenue: 198000 },
  { sku: 'SAM-GS25-128', product: 'Samsung Galaxy S25', category: 'Smartphones', sessions: 3240, addToCart: 874, addToCartRate: 26.98, conversions: 187, conversionRate: 5.77, revenue: 149600 },
  { sku: 'APL-IPDP-512', product: 'iPad Pro M4 512GB', category: 'Tablets', sessions: 2180, addToCart: 523, addToCartRate: 23.99, conversions: 89, conversionRate: 4.08, revenue: 98000 },
  { sku: 'APL-MBM4-8', product: 'MacBook Air M4 8GB', category: 'Laptops', sessions: 1940, addToCart: 388, addToCartRate: 20.00, conversions: 52, conversionRate: 2.68, revenue: 87000 },
  { sku: 'SON-WH1000-5', product: 'Sony WH-1000XM5', category: 'Audio', sessions: 1654, addToCart: 496, addToCartRate: 29.99, conversions: 124, conversionRate: 7.50, revenue: 42600 },
  { sku: 'APL-AW10-45', product: 'Apple Watch Series 10 45mm', category: 'Wearables', sessions: 1420, addToCart: 341, addToCartRate: 24.01, conversions: 98, conversionRate: 6.90, revenue: 36800 },
  { sku: 'APL-APP2', product: 'AirPods Pro 2da Gen', category: 'Audio', sessions: 1287, addToCart: 386, addToCartRate: 29.99, conversions: 187, conversionRate: 14.53, revenue: 28000 },
  { sku: 'SAM-GW7-44', product: 'Samsung Galaxy Watch 7', category: 'Wearables', sessions: 987, addToCart: 197, addToCartRate: 19.96, conversions: 67, conversionRate: 6.79, revenue: 18700 },
  { sku: 'LOG-MX3S', product: 'Logitech MX Master 3S', category: 'Accesorios', sessions: 876, addToCart: 263, addToCartRate: 30.02, conversions: 156, conversionRate: 17.81, revenue: 14000 },
  { sku: 'APL-CAB30', product: 'Cable USB-C Apple 2m', category: 'Accesorios', sessions: 743, addToCart: 297, addToCartRate: 39.97, conversions: 234, conversionRate: 31.49, revenue: 7000 },
];

const CATEGORIES = ['Todas', 'Smartphones', 'Tablets', 'Laptops', 'Audio', 'Wearables', 'Accesorios'];

function KpiCard({
  title,
  value,
  icon: Icon,
  color,
  delta,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
  delta?: number;
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    violet: 'text-violet-600 bg-violet-50 border-violet-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <div className={cn('p-2 rounded-xl border', colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <p className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">{value}</p>
        {delta !== undefined && <DeltaBadge value={delta} />}
      </div>
      <div
        className={cn(
          'absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500',
          color === 'blue' && 'bg-blue-400',
          color === 'emerald' && 'bg-emerald-400',
          color === 'violet' && 'bg-violet-400',
          color === 'amber' && 'bg-amber-400',
        )}
      />
    </div>
  );
}

export default function SkuPerformancePage() {
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  const [skus] = useState<SkuRow[]>(MOCK_SKUS);
  const [category, setCategory] = useState('Todas');

  const filtered = category === 'Todas' ? skus : skus.filter((s) => s.category === category);
  const chartData = [...filtered].sort((a, b) => b.sessions - a.sessions).slice(0, 8);

  const totalRevenue = skus
    .reduce((s, r) => s + r.revenue, 0)
    .toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

  const topBySession = skus.reduce((best, s) => (s.sessions > best.sessions ? s : best), skus[0]);
  const topByConversion = skus.reduce(
    (best, s) => (s.conversionRate > best.conversionRate ? s : best),
    skus[0],
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Tráfico: SKU Performance
          </h1>
          <p className="text-zinc-500 mt-1">
            Rendimiento de productos por sesiones, conversión e ingresos
          </p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
        />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="SKUs Tracked"
          value={skus.length}
          icon={Package}
          color="blue"
        />
        <KpiCard
          title="SKU Top Clicks"
          value={`${topBySession.product.split(' ').slice(0, 3).join(' ')} (${topBySession.sessions.toLocaleString('es-CL')} sess.)`}
          icon={TrendingUp}
          color="emerald"
        />
        <KpiCard
          title="Mejor Conversión"
          value={`${topByConversion.product.split(' ').slice(0, 2).join(' ')} (${topByConversion.conversionRate.toFixed(1)}%)`}
          icon={Zap}
          color="violet"
        />
        <KpiCard
          title="Revenue Total"
          value={totalRevenue}
          icon={DollarSign}
          color="amber"
          delta={15.2}
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              category === cat
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Top SKUs por Sesiones</h2>
          <span className="text-xs text-zinc-400">
            {chartData.length} productos
          </span>
        </div>
        <div className="p-4" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
              <XAxis
                type="number"
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
              />
              <YAxis
                type="category"
                dataKey="product"
                width={160}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke="#52525b"
                tickFormatter={(v: string) =>
                  v.length > 22 ? v.slice(0, 22) + '…' : v
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e4e4e7',
                  borderRadius: '0.75rem',
                  color: '#18181b',
                  fontSize: 12,
                }}
                formatter={(value: number | string | ReadonlyArray<number | string> | undefined) =>
                  [typeof value === 'number' ? value.toLocaleString('es-CL') : String(value ?? ''), 'Sesiones'] as [string, string]
                }
              />
              <Bar dataKey="sessions" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Detalle por SKU</h2>
          <span className="text-xs text-zinc-400">{filtered.length} SKUs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">
                  Categoría
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  Sesiones
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase min-w-[160px]">
                  Add to Cart %
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  Conversión %
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const convColor =
                  s.conversionRate >= 15
                    ? 'text-emerald-600 font-bold'
                    : s.conversionRate >= 5
                      ? 'text-blue-600 font-medium'
                      : 'text-zinc-500';

                return (
                  <tr
                    key={i}
                    className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-400 font-mono">{s.sku}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 max-w-[220px]">
                      <span className="truncate block" title={s.product}>
                        {s.product}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-zinc-900">
                      {s.sessions.toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-zinc-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${Math.min(s.addToCartRate, 100)}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-xs text-zinc-600 w-12 text-right">
                          {s.addToCartRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className={cn('px-4 py-3 text-right tabular-nums', convColor)}>
                      {s.conversionRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-700 font-medium">
                      {s.revenue.toLocaleString('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-zinc-400 text-sm">
                    Sin SKUs en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
