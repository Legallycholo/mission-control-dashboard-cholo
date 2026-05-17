'use client';

import { useState } from 'react';
import {
  TrendingUp, Users, Target, RefreshCw, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';

interface CohorteRow {
  cohorte: string;
  nuevos: number;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
}

interface LtvCohortePoint {
  mes: string;
  organico: number;
  googleAds: number;
  metaAds: number;
}

interface SegmentoPie {
  name: string;
  value: number;
  color: string;
}

interface SegmentoCard {
  nombre: string;
  clientes: number;
  ltv: string;
  color: string;
  badge: string;
}

interface MockData {
  ltv: number;
  cac: number;
  ratio: string;
  recompra: number;
  ltvTrend: LtvCohortePoint[];
  pieData: SegmentoPie[];
  cohortes: CohorteRow[];
  segmentos: SegmentoCard[];
}

const MOCK_DATA: MockData = {
  ltv: 187500,
  cac: 23400,
  ratio: '8.0x',
  recompra: 23,
  ltvTrend: [
    { mes: 'Nov', organico: 48000, googleAds: 62000, metaAds: 35000 },
    { mes: 'Dic', organico: 74000, googleAds: 91000, metaAds: 52000 },
    { mes: 'Ene', organico: 102000, googleAds: 128000, metaAds: 71000 },
    { mes: 'Feb', organico: 131000, googleAds: 158000, metaAds: 94000 },
    { mes: 'Mar', organico: 159000, googleAds: 193000, metaAds: 118000 },
    { mes: 'Abr', organico: 187500, googleAds: 224000, metaAds: 142000 },
  ],
  pieData: [
    { name: 'Champions', value: 18, color: '#7c3aed' },
    { name: 'Leales', value: 24, color: '#2563eb' },
    { name: 'Potenciales', value: 21, color: '#059669' },
    { name: 'En riesgo', value: 22, color: '#d97706' },
    { name: 'Perdidos', value: 15, color: '#e11d48' },
  ],
  cohortes: [
    { cohorte: 'Nov 2025', nuevos: 312, m1: 62, m2: 48, m3: 38, m4: 31, m5: 27, m6: 24 },
    { cohorte: 'Dic 2025', nuevos: 489, m1: 71, m2: 54, m3: 41, m4: 34, m5: 29, m6: 0 },
    { cohorte: 'Ene 2026', nuevos: 374, m1: 58, m2: 44, m3: 35, m4: 28, m5: 0, m6: 0 },
    { cohorte: 'Feb 2026', nuevos: 298, m1: 65, m2: 49, m3: 37, m4: 0, m5: 0, m6: 0 },
    { cohorte: 'Mar 2026', nuevos: 421, m1: 72, m2: 52, m3: 0, m4: 0, m5: 0, m6: 0 },
    { cohorte: 'Abr 2026', nuevos: 356, m1: 68, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0 },
  ],
  segmentos: [
    { nombre: 'Champions', clientes: 890, ltv: '$312.000', color: 'bg-violet-100 text-violet-700', badge: 'violet' },
    { nombre: 'Leales', clientes: 1190, ltv: '$187.000', color: 'bg-blue-100 text-blue-700', badge: 'blue' },
    { nombre: 'En Riesgo', clientes: 1100, ltv: '$89.000', color: 'bg-amber-100 text-amber-700', badge: 'amber' },
    { nombre: 'Perdidos', clientes: 745, ltv: '$34.000', color: 'bg-rose-100 text-rose-700', badge: 'rose' },
  ],
};

function cellColor(val: number): string {
  if (val === 0) return 'bg-zinc-50 text-zinc-300';
  if (val >= 50) return 'bg-emerald-100 text-emerald-800 font-semibold';
  if (val >= 30) return 'bg-yellow-100 text-yellow-800 font-semibold';
  return 'bg-rose-100 text-rose-800 font-semibold';
}

const fmtClp = (v: number) =>
  '$' + new Intl.NumberFormat('es-CL').format(v) + ' CLP';

export default function ClientesRetencionPage() {
  const [data] = useState<MockData>(MOCK_DATA);
  const [periodo, setPeriodo] = useState('30d');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Retención y LTV</h1>
          <p className="text-sm text-zinc-500 mt-1">Análisis de cohortes, valor de vida del cliente y tasa de recompra</p>
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
          <p className="text-sm font-semibold text-blue-900">Alerta de Retención — GSM Pro AI</p>
          <p className="text-sm text-blue-700 mt-0.5">
            La cohorte de Enero 2026 muestra caída de retención en Mes 4 (28%) por debajo del benchmark histórico (34%).
            Se recomienda activar campaña de reactivación vía email para los 89 clientes en riesgo.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-zinc-500 font-medium">LTV Promedio</p>
            <div className="p-1.5 bg-violet-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{fmtClp(data.ltv)}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
            <span className="text-xs text-zinc-400">vs periodo anterior</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-zinc-500 font-medium">CAC (Costo Adquisición)</p>
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{fmtClp(data.cac)}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-8%</span>
            <span className="text-xs text-zinc-400">vs periodo anterior</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-zinc-500 font-medium">LTV:CAC Ratio</p>
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{data.ratio}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+2.1x</span>
            <span className="text-xs text-zinc-400">vs periodo anterior</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-zinc-500 font-medium">Tasa de Recompra</p>
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <RefreshCw className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{data.recompra}%</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">-5%</span>
            <span className="text-xs text-zinc-400">target: 28%</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LTV Acumulado por Cohorte */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-zinc-900">LTV Acumulado por Canal de Adquisición</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Cohortes Nov 2025 – Abr 2026 en CLP</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.ltvTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradOrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradGoogle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="mes" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', color: '#18181b' }}
                  formatter={(value: unknown, name: unknown) => [fmtClp(Number(value)), String(name)]}
                />
                <Area type="monotone" dataKey="organico" name="Orgánico" stroke="#7c3aed" strokeWidth={2.5} fill="url(#gradOrg)" />
                <Area type="monotone" dataKey="googleAds" name="Google Ads" stroke="#2563eb" strokeWidth={2.5} fill="url(#gradGoogle)" />
                <Area type="monotone" dataKey="metaAds" name="Meta Ads" stroke="#059669" strokeWidth={2.5} fill="url(#gradMeta)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-4">
            {[
              { label: 'Orgánico', color: '#7c3aed' },
              { label: 'Google Ads', color: '#2563eb' },
              { label: 'Meta Ads', color: '#059669' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Pie Segmentos */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-zinc-900">Distribución por Segmento</h2>
            <p className="text-xs text-zinc-400 mt-0.5">% del total de clientes</p>
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {data.pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }}
                  formatter={(v: unknown) => [`${Number(v)}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {data.pieData.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-zinc-600">{seg.name}</span>
                </div>
                <span className="font-semibold text-zinc-900">{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Retention Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-zinc-900">Tabla de Retención por Cohorte</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Porcentaje de clientes activos por mes desde primera compra</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-100">
                {['Cohorte', 'Nuevos Clientes', 'Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-3 px-2 first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {data.cohortes.map((row) => (
                <tr key={row.cohorte} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 px-2 pl-0 font-semibold text-zinc-900 text-xs whitespace-nowrap">{row.cohorte}</td>
                  <td className="py-3 px-2 text-zinc-600 tabular-nums">{row.nuevos.toLocaleString('es-CL')}</td>
                  {([row.m1, row.m2, row.m3, row.m4, row.m5, row.m6] as number[]).map((val, i) => (
                    <td key={i} className="py-3 px-2">
                      {val === 0 ? (
                        <span className="text-zinc-200 text-xs">—</span>
                      ) : (
                        <span className={cn('inline-block text-xs px-2.5 py-0.5 rounded-lg tabular-nums', cellColor(val))}>
                          {val}%
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
            <span>≥50% retención</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" />
            <span>30–49%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-100 border border-rose-200" />
            <span>&lt;30%</span>
          </div>
        </div>
      </div>

      {/* Segment Cards */}
      <div>
        <h2 className="text-base font-bold text-zinc-900 mb-4">Segmentos de Clientes</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.segmentos.map((seg) => (
            <div key={seg.nombre} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
              <div className="mb-3">
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', seg.color)}>
                  {seg.nombre}
                </span>
              </div>
              <p className="text-2xl font-bold text-zinc-900 mt-2">
                {seg.clientes.toLocaleString('es-CL')}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">clientes</p>
              <div className="mt-3 pt-3 border-t border-zinc-100">
                <p className="text-xs text-zinc-400">LTV Promedio</p>
                <p className="text-sm font-bold text-zinc-800 mt-0.5">{seg.ltv} CLP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
