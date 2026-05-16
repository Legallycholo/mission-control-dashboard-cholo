'use client';

import { useState } from 'react';
import {
  Users, Star, Activity, TrendingDown, Sparkles,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';

interface KpiCard {
  label: string;
  value: string;
  sub: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface SegmentRow {
  segmento: string;
  clientes: number;
  pct: string;
  ltv: string;
  frecuencia: string;
  ultimaCompra: string;
  accion: string;
  badge: string;
  badgeBg: string;
}

interface PieEntry {
  name: string;
  value: number;
  color: string;
}

interface BarEntry {
  segmento: string;
  ingresos: number;
  color: string;
}

interface MockData {
  kpis: KpiCard[];
  pieData: PieEntry[];
  barData: BarEntry[];
  tabla: SegmentRow[];
}

const MOCK_DATA: MockData = {
  kpis: [
    {
      label: 'Total Clientes',
      value: '4.967',
      sub: 'base completa de clientes',
      delta: '',
      deltaPositive: true,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Segmento VIP',
      value: '312',
      sub: '6.3% de la base',
      delta: '+15%',
      deltaPositive: true,
      icon: Star,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Activos (30d)',
      value: '1.847',
      sub: '37.2% de la base',
      delta: '+4.1%',
      deltaPositive: true,
      icon: Activity,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Tasa de Abandono',
      value: '8.4%',
      sub: 'churn mensual',
      delta: '-1.2%',
      deltaPositive: true,
      icon: TrendingDown,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
  ],
  pieData: [
    { name: 'Champions', value: 890, color: '#7c3aed' },
    { name: 'Leales', value: 1190, color: '#2563eb' },
    { name: 'Potenciales', value: 1042, color: '#059669' },
    { name: 'En riesgo', value: 1100, color: '#d97706' },
    { name: 'Perdidos', value: 745, color: '#e11d48' },
  ],
  barData: [
    { segmento: 'Champions', ingresos: 2300000, color: '#7c3aed' },
    { segmento: 'Leales', ingresos: 1800000, color: '#2563eb' },
    { segmento: 'Potenciales', ingresos: 890000, color: '#059669' },
    { segmento: 'En riesgo', ingresos: 420000, color: '#d97706' },
    { segmento: 'Perdidos', ingresos: 95000, color: '#e11d48' },
  ],
  tabla: [
    {
      segmento: 'Champions',
      clientes: 890,
      pct: '17.9%',
      ltv: '$312.000',
      frecuencia: '4.2x / mes',
      ultimaCompra: '8 días',
      accion: 'Campaña VIP',
      badge: 'text-violet-700 bg-violet-100',
      badgeBg: 'bg-violet-600',
    },
    {
      segmento: 'Leales',
      clientes: 1190,
      pct: '23.9%',
      ltv: '$187.000',
      frecuencia: '2.1x / mes',
      ultimaCompra: '18 días',
      accion: 'Fidelizar',
      badge: 'text-blue-700 bg-blue-100',
      badgeBg: 'bg-blue-600',
    },
    {
      segmento: 'Potenciales',
      clientes: 1042,
      pct: '21.0%',
      ltv: '$94.000',
      frecuencia: '1.3x / mes',
      ultimaCompra: '32 días',
      accion: 'Activar',
      badge: 'text-emerald-700 bg-emerald-100',
      badgeBg: 'bg-emerald-600',
    },
    {
      segmento: 'En riesgo',
      clientes: 1100,
      pct: '22.1%',
      ltv: '$89.000',
      frecuencia: '0.4x / mes',
      ultimaCompra: '74 días',
      accion: 'Retener',
      badge: 'text-amber-700 bg-amber-100',
      badgeBg: 'bg-amber-500',
    },
    {
      segmento: 'Perdidos',
      clientes: 745,
      pct: '15.0%',
      ltv: '$34.000',
      frecuencia: '0.1x / mes',
      ultimaCompra: '142 días',
      accion: 'Re-enganchar',
      badge: 'text-rose-700 bg-rose-100',
      badgeBg: 'bg-rose-600',
    },
  ],
};

const fmtM = (v: number) =>
  v >= 1000000
    ? `$${(v / 1000000).toFixed(1)}M`
    : `$${(v / 1000).toFixed(0)}K`;

const SCATTER_DOTS = [
  { x: 88, y: 85, color: '#7c3aed', label: 'Champions' },
  { x: 68, y: 65, color: '#7c3aed', label: '' },
  { x: 75, y: 78, color: '#7c3aed', label: '' },
  { x: 55, y: 55, color: '#2563eb', label: 'Leales' },
  { x: 60, y: 48, color: '#2563eb', label: '' },
  { x: 50, y: 60, color: '#2563eb', label: '' },
  { x: 45, y: 35, color: '#059669', label: 'Potenciales' },
  { x: 38, y: 42, color: '#059669', label: '' },
  { x: 52, y: 28, color: '#059669', label: '' },
  { x: 28, y: 45, color: '#d97706', label: 'En riesgo' },
  { x: 22, y: 38, color: '#d97706', label: '' },
  { x: 35, y: 30, color: '#d97706', label: '' },
  { x: 12, y: 15, color: '#e11d48', label: 'Perdidos' },
  { x: 18, y: 10, color: '#e11d48', label: '' },
  { x: 8, y: 20, color: '#e11d48', label: '' },
];

export default function ClientesSegmentacionPage() {
  const [data] = useState<MockData>(MOCK_DATA);
  const [periodo, setPeriodo] = useState('30d');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Segmentación de Clientes</h1>
          <p className="text-sm text-zinc-500 mt-1">Análisis RFM, distribución de segmentos e ingresos por grupo</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="text-sm border border-zinc-200 rounded-xl px-3 py-1.5 bg-white text-zinc-700 focus:outline-none"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
        </select>
      </div>

      {/* AI Insight */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Oportunidad de Segmento — GSM AI</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Los clientes <strong>Leales</strong> representan el 23.9% de la base pero solo el 30% del ingreso total.
            Activar una campaña de upgrade con descuento en accesorios podría mover hasta 180 clientes al segmento Champions en 60 días.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-zinc-500 font-medium">{kpi.label}</p>
                <div className={cn('p-1.5 rounded-lg', kpi.iconBg)}>
                  <Icon className={cn('w-4 h-4', kpi.iconColor)} />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900">{kpi.value}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {kpi.delta && (
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    kpi.deltaPositive
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-rose-600 bg-rose-50'
                  )}>
                    {kpi.delta}
                  </span>
                )}
                <span className="text-xs text-zinc-400">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie RFM */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-zinc-900">Distribución RFM</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Clientes por segmento de comportamiento</p>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => [Number(v).toLocaleString('es-CL') + ' clientes', '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {data.pieData.map((seg) => (
              <div key={seg.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-zinc-500">{seg.name}</span>
                <span className="ml-auto font-semibold text-zinc-900">{seg.value.toLocaleString('es-CL')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Ingresos */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-zinc-900">Ingreso por Segmento</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Ingresos acumulados en CLP</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.barData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickFormatter={(v) => fmtM(v)}
                />
                <YAxis
                  type="category"
                  dataKey="segmento"
                  stroke="#a1a1aa"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => ['$' + Number(v).toLocaleString('es-CL') + ' CLP', 'Ingresos']}
                />
                <Bar dataKey="ingresos" radius={[0, 6, 6, 0]}>
                  {data.barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Segment Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-zinc-900">Detalle de Segmentos</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Métricas clave y acción recomendada por segmento</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-100">
                {['Segmento', 'Clientes', '% Base', 'LTV Promedio', 'Frecuencia', 'Última Compra', 'Acción'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-3 px-3 first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {data.tabla.map((row) => (
                <tr key={row.segmento} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3.5 px-3 pl-0">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', row.badge)}>
                      {row.segmento}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-zinc-900 tabular-nums">
                    {row.clientes.toLocaleString('es-CL')}
                  </td>
                  <td className="py-3.5 px-3 text-zinc-500 tabular-nums">{row.pct}</td>
                  <td className="py-3.5 px-3 font-semibold text-zinc-900">{row.ltv} CLP</td>
                  <td className="py-3.5 px-3 text-zinc-500">{row.frecuencia}</td>
                  <td className="py-3.5 px-3 text-zinc-500">{row.ultimaCompra}</td>
                  <td className="py-3.5 px-3">
                    <button
                      className={cn(
                        'text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80',
                        row.badgeBg
                      )}
                    >
                      {row.accion}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFM Scatter Mock */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-zinc-900">Mapa RFM — Recencia vs Frecuencia</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Visualización de clientes en espacio RFM (simulado)</p>
        </div>
        <div className="relative w-full h-[360px] bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100">
          {/* Quadrant lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-200" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-200" />

          {/* Quadrant labels */}
          <span className="absolute top-3 right-4 text-[10px] font-semibold text-violet-500 uppercase tracking-wide">Campeones</span>
          <span className="absolute top-3 left-4 text-[10px] font-semibold text-amber-500 uppercase tracking-wide">En Riesgo</span>
          <span className="absolute bottom-3 right-4 text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">Potenciales</span>
          <span className="absolute bottom-3 left-4 text-[10px] font-semibold text-rose-500 uppercase tracking-wide">Perdidos</span>

          {/* Axis labels */}
          <span className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 font-medium">Frecuencia →</span>
          <span className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-[10px] text-zinc-400 font-medium">Recencia →</span>

          {/* Dots */}
          {SCATTER_DOTS.map((dot, i) => (
            <div
              key={i}
              className="absolute w-3.5 h-3.5 rounded-full opacity-80 hover:opacity-100 transition-opacity hover:scale-125"
              style={{
                left: `${dot.x}%`,
                top: `${100 - dot.y}%`,
                backgroundColor: dot.color,
                transform: 'translate(-50%, -50%)',
              }}
              title={dot.label || undefined}
            />
          ))}
        </div>
        <div className="flex items-center gap-5 mt-3">
          {[
            { label: 'Champions', color: '#7c3aed' },
            { label: 'Leales', color: '#2563eb' },
            { label: 'Potenciales', color: '#059669' },
            { label: 'En riesgo', color: '#d97706' },
            { label: 'Perdidos', color: '#e11d48' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
