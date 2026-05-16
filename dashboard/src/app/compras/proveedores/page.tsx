'use client';

import { cn } from '@/lib/utils';
import { Building2, ShieldCheck, Clock, Star, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type RiskLevel = 'Bajo' | 'Medio' | 'Alto';

interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  leadTimeDays: number;
  reliability: number;
  totalOrders: number;
  lastOrderDate: string;
  totalSpend: number;
  risk: RiskLevel;
  preferred: boolean;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S001', name: 'Apple Chile Distribución', country: 'CL', category: 'Smartphones/Tablets', leadTimeDays: 14, reliability: 96, totalOrders: 28, lastOrderDate: '2026-05-01', totalSpend: 1840000, risk: 'Bajo', preferred: true },
  { id: 'S002', name: 'Samsung Electronics Chile', country: 'CL', category: 'Smartphones', leadTimeDays: 18, reliability: 91, totalOrders: 19, lastOrderDate: '2026-05-05', totalSpend: 980000, risk: 'Bajo', preferred: true },
  { id: 'S003', name: 'Sony Chile', country: 'CL', category: 'Audio/Wearables', leadTimeDays: 21, reliability: 78, totalOrders: 12, lastOrderDate: '2026-05-08', totalSpend: 342000, risk: 'Medio', preferred: false },
  { id: 'S004', name: 'Logitech Latinoamérica', country: 'MX', category: 'Accesorios', leadTimeDays: 28, reliability: 88, totalOrders: 31, lastOrderDate: '2026-05-10', totalSpend: 217000, risk: 'Bajo', preferred: false },
  { id: 'S005', name: 'Xiaomi Chile', country: 'CL', category: 'Smartphones/Accesorios', leadTimeDays: 35, reliability: 72, totalOrders: 8, lastOrderDate: '2026-05-14', totalSpend: 128000, risk: 'Medio', preferred: false },
  { id: 'S006', name: 'TechImport Shanghai', country: 'CN', category: 'Accesorios/Cables', leadTimeDays: 45, reliability: 65, totalOrders: 5, lastOrderDate: '2026-04-20', totalSpend: 67000, risk: 'Alto', preferred: false },
];

const RISK_STYLES: Record<RiskLevel, string> = {
  'Bajo': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Medio': 'bg-amber-50 text-amber-700 border-amber-200',
  'Alto': 'bg-rose-50 text-rose-700 border-rose-200',
};

const FLAG: Record<string, string> = {
  CL: '🇨🇱',
  MX: '🇲🇽',
  CN: '🇨🇳',
};

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function reliabilityColor(r: number): string {
  if (r >= 90) return '#10b981';
  if (r >= 75) return '#3b82f6';
  return '#f59e0b';
}

function reliabilityBarClass(r: number): string {
  if (r >= 90) return 'bg-emerald-500';
  if (r >= 75) return 'bg-blue-500';
  return 'bg-amber-500';
}

const avgReliability = (MOCK_SUPPLIERS.reduce((s, sup) => s + sup.reliability, 0) / MOCK_SUPPLIERS.length).toFixed(1);
const avgLeadTime = (MOCK_SUPPLIERS.reduce((s, sup) => s + sup.leadTimeDays, 0) / MOCK_SUPPLIERS.length).toFixed(1);
const preferredCount = MOCK_SUPPLIERS.filter(s => s.preferred).length;
const chartData = [...MOCK_SUPPLIERS].sort((a, b) => b.reliability - a.reliability);

export default function ComprasProveedoresPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Compras: Proveedores</h1>
        <p className="text-sm text-zinc-500 mt-1">Panel de gestión y evaluación de proveedores</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Proveedores</span>
            <div className="rounded-xl bg-blue-50 p-2">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{MOCK_SUPPLIERS.length}</p>
          <p className="text-xs text-zinc-400 mt-1">Activos en cartera</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Confiabilidad Promedio</span>
            <div className="rounded-xl bg-emerald-50 p-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{avgReliability}%</p>
          <p className="text-xs text-zinc-400 mt-1">Cumplimiento de plazos</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Lead Time Promedio</span>
            <div className="rounded-xl bg-amber-50 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{avgLeadTime} días</p>
          <p className="text-xs text-zinc-400 mt-1">Tiempo de entrega</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Proveedores Preferidos</span>
            <div className="rounded-xl bg-violet-50 p-2">
              <Star className="h-4 w-4 text-violet-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{preferredCount}</p>
          <p className="text-xs text-zinc-400 mt-1">Proveedores estrella</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-400" />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SUPPLIERS.map(supplier => (
          <div
            key={supplier.id}
            className="rounded-2xl border p-5 bg-white/85 backdrop-blur-xl hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-zinc-900 text-sm truncate">{supplier.name}</h3>
                  {supplier.preferred && (
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{supplier.id}</p>
              </div>
              <span className={cn('ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0', RISK_STYLES[supplier.risk])}>
                {supplier.risk}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-base">{FLAG[supplier.country] ?? '🌐'}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-100 text-zinc-600 border border-zinc-200">
                {supplier.category}
              </span>
              <span className="text-xs text-zinc-500">Lead time: {supplier.leadTimeDays} días</span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-600">Confiabilidad</span>
                <span className="text-xs font-bold text-zinc-800">{supplier.reliability}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', reliabilityBarClass(supplier.reliability))}
                  style={{ width: `${supplier.reliability}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-xs font-semibold text-zinc-700">{usd(supplier.totalSpend)} total gastado</span>
              <span className="text-xs text-zinc-400">{supplier.totalOrders} órdenes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison BarChart */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Comparativa de Confiabilidad</h2>
          <span className="text-xs text-zinc-400">% cumplimiento de plazos</span>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 4, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <YAxis
                dataKey="name"
                type="category"
                width={160}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Confiabilidad']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7', fontSize: 12 }}
              />
              <Bar dataKey="reliability" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={reliabilityColor(entry.reliability)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-900">
          Proveedor de mayor riesgo: <span className="font-semibold">TechImport Shanghai</span> (65% confiabilidad). Considera diversificar accesorios con Logitech o un proveedor local.
        </p>
      </div>
    </div>
  );
}
