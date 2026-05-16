'use client'

import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { PackageCheck, Clock, CheckCircle2, Hourglass } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FulfillmentDay { date: string; processed: number; shipped: number }

const MOCK_DAILY: FulfillmentDay[] = [
  { date: '10/05', processed: 34, shipped: 31 },
  { date: '11/05', processed: 41, shipped: 39 },
  { date: '12/05', processed: 28, shipped: 26 },
  { date: '13/05', processed: 45, shipped: 44 },
  { date: '14/05', processed: 52, shipped: 49 },
  { date: '15/05', processed: 38, shipped: 36 },
  { date: '16/05', processed: 29, shipped: 27 },
]

const MOCK_CARRIERS = [
  { carrier: 'Starken', orders: 487, avgDays: 1.8, onTimeRate: 94, color: '#3b82f6' },
  { carrier: 'Blue Express', orders: 312, avgDays: 2.1, onTimeRate: 89, color: '#10b981' },
  { carrier: 'Chilexpress', orders: 198, avgDays: 2.4, onTimeRate: 82, color: '#f59e0b' },
  { carrier: 'Correos Chile', orders: 53, avgDays: 3.8, onTimeRate: 71, color: '#6366f1' },
]

const TIME_DISTRIBUTION = [
  { range: 'Mismo día', count: 87, color: '#10b981' },
  { range: '1 día', count: 412, color: '#3b82f6' },
  { range: '2 días', count: 341, color: '#f59e0b' },
  { range: '3 días', count: 178, color: '#f43f5e' },
  { range: '4+ días', count: 32, color: '#71717a' },
]

export default function FulfillmentPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Operaciones: Fulfillment</h1>
        <p className="text-zinc-500 mt-1">Seguimiento de despacho y rendimiento logístico</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Órdenes Procesadas */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><PackageCheck className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Órdenes Procesadas</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">1,050</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600">+7.2%</span>
            <span className="text-xs text-zinc-400">vs semana anterior</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
        </div>

        {/* Tiempo Promedio */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><Clock className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Tiempo Promedio</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">2.1 días</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600">-0.3 días</span>
            <span className="text-xs text-zinc-400">mejora</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-500" />
        </div>

        {/* Tasa On-Time */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600"><CheckCircle2 className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Tasa On-Time</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">89%</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600">+2.1%</span>
            <span className="text-xs text-zinc-400">vs semana anterior</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
        </div>

        {/* Pendientes */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><Hourglass className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Pendientes de Envío</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">23</div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        </div>
      </div>

      {/* Daily Volume Area Chart */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">Volumen Diario de Fulfillment</h2>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500/40 border border-blue-500" /> Procesadas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500" /> Despachadas
            </span>
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={MOCK_DAILY} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradProcessed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradShipped" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="processed"
                name="Procesadas"
                stroke="#3b82f6"
                fill="url(#gradProcessed)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="shipped"
                name="Despachadas"
                stroke="#10b981"
                fill="url(#gradShipped)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Time Distribution Bar Chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-800">Distribución de Tiempos de Entrega</h2>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={TIME_DISTRIBUTION} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0)} órdenes`]} />
                <Bar dataKey="count" name="Órdenes" radius={[4, 4, 0, 0]}>
                  {TIME_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carrier Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-800">Rendimiento por Transportista</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Transportista</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Órdenes</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Tiempo Prom.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide min-w-[120px]">On-Time %</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CARRIERS.map((c) => (
                  <tr key={c.carrier} className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="font-medium text-zinc-800">{c.carrier}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600">{c.orders.toLocaleString('es-CL')}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{c.avgDays} días</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-semibold w-10 shrink-0',
                          c.onTimeRate >= 90 ? 'text-emerald-600' :
                          c.onTimeRate >= 80 ? 'text-amber-600' : 'text-rose-600'
                        )}>{c.onTimeRate}%</span>
                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.onTimeRate}%`,
                              backgroundColor: c.onTimeRate >= 90 ? '#10b981' : c.onTimeRate >= 80 ? '#f59e0b' : '#f43f5e',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Strip */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800">
        Tiempo promedio de fulfillment aumentó +0.3 días esta semana vs anterior.{' '}
        <strong>Chilexpress</strong> tiene la tasa on-time más baja (82%).
        Considera re-asignar volumen a Starken.
      </div>
    </div>
  )
}
