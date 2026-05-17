'use client';
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
  DollarSign,
  Package,
  Eye,
  Percent,
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
    icon: DollarSign,
    color: 'sky',
  },
  {
    label: 'Órdenes Hoy',
    value: '47',
    unit: '',
    delta: '+12%',
    positive: true,
    sub: 'vs ayer',
    icon: Package,
    color: 'violet',
  },
  {
    label: 'Visitantes',
    value: '2.341',
    unit: '',
    delta: '-3%',
    positive: false,
    sub: 'vs ayer',
    icon: Eye,
    color: 'emerald',
  },
  {
    label: 'Tasa Conversión',
    value: '2,1%',
    unit: '',
    delta: '+0,3%',
    positive: true,
    sub: 'vs ayer',
    icon: Percent,
    color: 'amber',
  },
];

const kpiIconStyles: Record<string, { bg: string; icon: string; glow: string; watermark: string }> = {
  sky:     { bg: 'bg-sky-500/12 dark:bg-sky-500/15',     icon: 'text-sky-500 dark:text-sky-400',     glow: 'dark:shadow-[0_0_20px_rgba(56,189,248,0.12)]',   watermark: 'text-sky-500/6 dark:text-sky-400/5'   },
  violet:  { bg: 'bg-violet-500/12 dark:bg-violet-500/15', icon: 'text-violet-500 dark:text-violet-400', glow: 'dark:shadow-[0_0_20px_rgba(139,92,246,0.12)]',   watermark: 'text-violet-500/6 dark:text-violet-400/5' },
  emerald: { bg: 'bg-emerald-500/12 dark:bg-emerald-500/15', icon: 'text-emerald-500 dark:text-emerald-400', glow: 'dark:shadow-[0_0_20px_rgba(52,211,153,0.12)]', watermark: 'text-emerald-500/6 dark:text-emerald-400/5' },
  amber:   { bg: 'bg-amber-500/12 dark:bg-amber-500/15',  icon: 'text-amber-500 dark:text-amber-400',  glow: 'dark:shadow-[0_0_20px_rgba(245,158,11,0.12)]',   watermark: 'text-amber-500/6 dark:text-amber-400/5'  },
};

const moduleHealth = [
  { name: 'Shopify',           status: 'ok',   sync: 'hace 2 min', detail: '47 órdenes hoy' },
  { name: 'Google Analytics',  status: 'ok',   sync: 'hace 8 min', detail: '2,3K sesiones' },
  { name: 'Search Console',    status: 'ok',   sync: 'hace 1h',    detail: '847 clics' },
  { name: 'Google Ads',        status: 'ok',   sync: 'hace 30 min',detail: 'ROAS 4.2x' },
  { name: 'Crisp CRM',         status: 'ok',   sync: 'hace 5 min', detail: '3 tickets abiertos' },
  { name: 'RingCentral',       status: 'warn', sync: 'hace 3h',    detail: 'datos parciales' },
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
  { name: 'Orgánico',    value: 38 },
  { name: 'Google Ads',  value: 24 },
  { name: 'Directo',     value: 18 },
  { name: 'Social',      value: 12 },
  { name: 'Email',       value: 8  },
];

const TRAFFIC_COLORS = ['#38bdf8', '#8b5cf6', '#6b7280', '#34d399', '#f59e0b'];

const activityFeed = [
  { icon: ShoppingBag, color: 'sky',     text: 'Nueva orden #GSM-2847 — iPhone 15 Pro, $1.2M CLP',        time: 'hace 3 min'  },
  { icon: Users,       color: 'violet',  text: 'Cliente VIP: María González realizó su 8ª compra',          time: 'hace 12 min' },
  { icon: AlertCircle, color: 'amber',   text: 'Stock bajo: AirPods Pro 2 — 5 unidades restantes',          time: 'hace 28 min' },
  { icon: TrendingUp,  color: 'emerald', text: 'Meta mensual alcanzada al 87% — 13 días restantes',         time: 'hace 1h'     },
  { icon: MessageSquare, color: 'zinc',  text: 'Crisp: 2 conversaciones pendientes de respuesta',           time: 'hace 2h'     },
];

const feedIconStyles: Record<string, { bg: string; icon: string }> = {
  sky:     { bg: 'bg-sky-500/12 dark:bg-sky-500/15',     icon: 'text-sky-500 dark:text-sky-400'     },
  violet:  { bg: 'bg-violet-500/12 dark:bg-violet-500/15', icon: 'text-violet-500 dark:text-violet-400' },
  amber:   { bg: 'bg-amber-500/12 dark:bg-amber-500/15', icon: 'text-amber-500 dark:text-amber-400'   },
  emerald: { bg: 'bg-emerald-500/12 dark:bg-emerald-500/15', icon: 'text-emerald-500 dark:text-emerald-400' },
  zinc:    { bg: 'bg-zinc-100 dark:bg-slate-800',         icon: 'text-zinc-500 dark:text-slate-400'  },
};

function formatCLP(value: number) {
  return `$${(value / 1000000).toFixed(1).replace('.', ',')}M`;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-slate-100 tracking-tight">
            Centro de Comando
          </h2>
          <p className="text-zinc-500 dark:text-slate-400 mt-0.5 text-sm">
            Visión general en tiempo real — GSM PRO
          </p>
        </div>
        <div className="font-mono text-xs font-medium text-zinc-400 dark:text-sky-500/70 bg-zinc-100 dark:bg-slate-800/60 border border-zinc-200 dark:border-sky-500/15 px-3 py-1.5 rounded-xl">
          {new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const s = kpiIconStyles[kpi.color];
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={cn(
                'hud-card relative p-5 overflow-hidden transition-all duration-300',
                s.glow
              )}
            >
              {/* Watermark icon */}
              <Icon className={cn('absolute -bottom-2 -right-2 w-20 h-20', s.watermark)} />

              {/* Icon badge */}
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', s.bg)}>
                <Icon className={cn('w-4 h-4', s.icon)} />
              </div>

              <p className="text-[10px] font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-widest">
                {kpi.label}
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-slate-100 mt-1 tracking-tight font-mono">
                {kpi.value}
                {kpi.unit && (
                  <span className="text-sm font-medium text-zinc-400 dark:text-slate-500 ml-1 font-sans">
                    {kpi.unit}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    'text-xs font-semibold px-1.5 py-0.5 rounded-md border',
                    kpi.positive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  )}
                >
                  {kpi.delta}
                </span>
                <span className="text-xs text-zinc-400 dark:text-slate-500">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module health */}
      <div className="hud-card p-6">
        <h3 className="text-xs font-semibold text-zinc-500 dark:text-sky-500/70 uppercase tracking-widest mb-4">
          Estado de Módulos
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {moduleHealth.map((mod) => (
            <div
              key={mod.name}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-100 dark:border-sky-500/10 bg-zinc-50/60 dark:bg-slate-800/40 transition-colors"
            >
              <div className="relative mt-0.5 shrink-0">
                {mod.status === 'ok' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" style={{ animationDuration: '2.5s' }} />
                  </>
                ) : (
                  <AlertOctagon className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-800 dark:text-slate-200 truncate">{mod.name}</p>
                <p className="font-mono text-[10px] text-zinc-400 dark:text-slate-500 mt-0.5">{mod.sync}</p>
                <p className="text-xs text-zinc-500 dark:text-slate-400 mt-0.5">{mod.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/8 p-4 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Alertas Activas</h3>
        </div>
        <ul className="space-y-2">
          <li className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            Stock crítico: iPhone 15 Pro 256GB — 3 unidades
          </li>
          <li className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            Carrito abandonado: 23 carritos en las últimas 4h
          </li>
        </ul>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sales trend */}
        <div className="lg:col-span-3 hud-card p-6 scan-container">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-sky-500/70 uppercase tracking-widest mb-1">
            Ventas últimos 14 días
          </h3>
          <p className="text-xs text-zinc-400 dark:text-slate-500 mb-5">Comparación con período anterior</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gradAnterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatCLP}
                tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                formatter={(v: unknown, name: unknown) => [
                  `$${Number(v ?? 0).toLocaleString('es-CL')} CLP`,
                  name === 'actual' ? 'Este período' : 'Período anterior',
                ]}
                labelStyle={{ fontSize: 11, color: '#94a3b8' }}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 12,
                  border: '1px solid rgba(56,189,248,0.15)',
                  background: 'rgba(15,28,55,0.92)',
                  color: '#e2e8f0',
                  backdropFilter: 'blur(12px)',
                }}
              />
              <Area
                type="monotone"
                dataKey="anterior"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="url(#gradAnterior)"
                name="anterior"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#gradActual)"
                name="actual"
                style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.3))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic pie */}
        <div className="lg:col-span-2 hud-card p-6">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-sky-500/70 uppercase tracking-widest mb-1">
            Fuentes de Tráfico
          </h3>
          <p className="text-xs text-zinc-400 dark:text-slate-500 mb-2">Distribución de sesiones hoy</p>
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
                  <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>
                )}
              />
              <Tooltip
                formatter={(v: unknown) => [`${Number(v ?? 0)}%`, 'Participación']}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 12,
                  border: '1px solid rgba(56,189,248,0.15)',
                  background: 'rgba(15,28,55,0.92)',
                  color: '#e2e8f0',
                  backdropFilter: 'blur(12px)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity feed */}
      <div className="hud-card p-6">
        <h3 className="text-xs font-semibold text-zinc-500 dark:text-sky-500/70 uppercase tracking-widest mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {activityFeed.map((item, idx) => {
            const Icon = item.icon;
            const s = feedIconStyles[item.color];
            return (
              <div key={idx} className="flex items-start gap-3 group">
                <div className={cn('p-2 rounded-xl shrink-0 transition-all duration-200 group-hover:scale-105', s.bg)}>
                  <Icon className={cn('w-4 h-4', s.icon)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-800 dark:text-slate-200">{item.text}</p>
                  <p className="font-mono text-[10px] text-zinc-400 dark:text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI insight */}
      <div className="rounded-2xl border border-sky-200 dark:border-sky-500/25 bg-sky-50 dark:bg-sky-500/8 p-4 flex items-start gap-3 transition-colors">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-sky-500/25 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-0.5">GSM Pro AI</p>
          <p className="text-sm text-sky-700 dark:text-sky-400/80">
            Detectado: Las ventas de hoy superan el promedio semanal en un 18%. El ROAS de Google Ads mejoró 0.4x respecto al lunes.
          </p>
        </div>
      </div>
    </div>
  );
}
