'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertOctagon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

const kpis = [
  {
    label: 'Ventas Hoy',
    value: '$3.847.200',
    unit: 'CLP',
    delta: '+18%',
    positive: true,
    sub: 'vs ayer',
  },
  {
    label: 'Órdenes Hoy',
    value: '47',
    unit: '',
    delta: '+12%',
    positive: true,
    sub: 'vs ayer',
  },
  {
    label: 'Visitantes',
    value: '2.341',
    unit: '',
    delta: '-3%',
    positive: false,
    sub: 'vs ayer',
  },
  {
    label: 'Tasa Conversión',
    value: '2,1%',
    unit: '',
    delta: '+0,3%',
    positive: true,
    sub: 'vs ayer',
  },
];

const moduleHealth = [
  {
    name: 'Shopify',
    status: 'ok',
    sync: 'hace 2 min',
    detail: '47 órdenes hoy',
  },
  {
    name: 'Google Analytics',
    status: 'ok',
    sync: 'hace 8 min',
    detail: '2,3K sesiones',
  },
  {
    name: 'Search Console',
    status: 'ok',
    sync: 'hace 1h',
    detail: '847 clics',
  },
  {
    name: 'Google Ads',
    status: 'ok',
    sync: 'hace 30 min',
    detail: 'ROAS 4.2x',
  },
  {
    name: 'Crisp CRM',
    status: 'ok',
    sync: 'hace 5 min',
    detail: '3 tickets abiertos',
  },
  {
    name: 'RingCentral',
    status: 'warn',
    sync: 'hace 3h',
    detail: 'datos parciales',
  },
];

const salesData = [
  { dia: '2 may', actual: 2800000, anterior: 2400000 },
  { dia: '3 may', actual: 3100000, anterior: 2600000 },
  { dia: '4 may', actual: 2950000, anterior: 2750000 },
  { dia: '5 may', actual: 3400000, anterior: 2900000 },
  { dia: '6 may', actual: 3200000, anterior: 3050000 },
  { dia: '7 may', actual: 2700000, anterior: 2800000 },
  { dia: '8 may', actual: 3600000, anterior: 2950000 },
  { dia: '9 may', actual: 3900000, anterior: 3100000 },
  { dia: '10 may', actual: 3550000, anterior: 3200000 },
  { dia: '11 may', actual: 4100000, anterior: 3300000 },
  { dia: '12 may', actual: 3800000, anterior: 3150000 },
  { dia: '13 may', actual: 4200000, anterior: 3400000 },
  { dia: '14 may', actual: 3950000, anterior: 3250000 },
  { dia: '15 may', actual: 3847200, anterior: 3260000 },
];

const trafficData = [
  { name: 'Orgánico', value: 38 },
  { name: 'Google Ads', value: 24 },
  { name: 'Directo', value: 18 },
  { name: 'Social', value: 12 },
  { name: 'Email', value: 8 },
];

const TRAFFIC_COLORS = ['#3b82f6', '#8b5cf6', '#6b7280', '#10b981', '#f59e0b'];

const activityFeed = [
  {
    icon: ShoppingBag,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    text: 'Nueva orden #GSM-2847 — iPhone 15 Pro, $1.2M CLP',
    time: 'hace 3 min',
  },
  {
    icon: Users,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    text: 'Cliente VIP: María González realizó su 8ª compra',
    time: 'hace 12 min',
  },
  {
    icon: AlertCircle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    text: 'Stock bajo: AirPods Pro 2 — 5 unidades restantes',
    time: 'hace 28 min',
  },
  {
    icon: TrendingUp,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    text: 'Meta mensual alcanzada al 87% — 13 días restantes',
    time: 'hace 1h',
  },
  {
    icon: MessageSquare,
    iconColor: 'text-zinc-600',
    iconBg: 'bg-zinc-100',
    text: 'Crisp: 2 conversaciones pendientes de respuesta',
    time: 'hace 2h',
  },
];

function formatCLP(value: number) {
  return `$${(value / 1000000).toFixed(1).replace('.', ',')}M`;
}

export default function DashboardPage() {
  const [_ready] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Centro de Comando</h2>
          <p className="text-zinc-500 mt-1 text-sm">Visión general en tiempo real — GSM PRO</p>
        </div>
        <div className="text-xs font-medium text-zinc-400 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl">
          16 mayo 2026
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-2xl font-bold text-zinc-900 mt-2 tracking-tight">
              {kpi.value}
              {kpi.unit && <span className="text-sm font-medium text-zinc-400 ml-1">{kpi.unit}</span>}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  kpi.positive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                )}
              >
                {kpi.delta}
              </span>
              <span className="text-xs text-zinc-400">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">Estado de Módulos</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {moduleHealth.map((mod) => (
            <div
              key={mod.name}
              className="flex items-start gap-3 p-4 rounded-xl border border-zinc-100 bg-zinc-50/60"
            >
              {mod.status === 'ok' ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-800 truncate">{mod.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{mod.sync}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{mod.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <h3 className="text-sm font-semibold text-amber-800">Alertas Activas</h3>
        </div>
        <ul className="space-y-2">
          <li className="text-sm text-amber-700 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            Stock crítico: iPhone 15 Pro 256GB — 3 unidades
          </li>
          <li className="text-sm text-amber-700 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            Carrito abandonado: 23 carritos en las últimas 4h
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">Ventas últimos 14 días</h3>
          <p className="text-xs text-zinc-400 mb-5">Comparación con período anterior</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAnterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatCLP}
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString('es-CL')} CLP`,
                  name === 'actual' ? 'Este período' : 'Período anterior',
                ]}
                labelStyle={{ fontSize: 11, color: '#3f3f46' }}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 12,
                  border: '1px solid #e4e4e7',
                  background: 'rgba(255,255,255,0.95)',
                }}
              />
              <Area
                type="monotone"
                dataKey="anterior"
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="url(#gradAnterior)"
                name="anterior"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gradActual)"
                name="actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">Fuentes de Tráfico</h3>
          <p className="text-xs text-zinc-400 mb-2">Distribución de sesiones hoy</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="44%"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
              >
                {trafficData.map((entry, index) => (
                  <Cell key={entry.name} fill={TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: '#52525b' }}>{value}</span>
                )}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Participación']}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 12,
                  border: '1px solid #e4e4e7',
                  background: 'rgba(255,255,255,0.95)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {activityFeed.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className={cn('p-2 rounded-xl shrink-0', item.iconBg)}>
                  <Icon className={cn('w-4 h-4', item.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-800">{item.text}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-0.5">GSM AI</p>
          <p className="text-sm text-blue-700">
            GSM AI detectó: Las ventas de hoy superan el promedio semanal en un 18%. El ROAS de Google Ads mejoró 0.4x respecto al lunes.
          </p>
        </div>
      </div>
    </div>
  );
}
