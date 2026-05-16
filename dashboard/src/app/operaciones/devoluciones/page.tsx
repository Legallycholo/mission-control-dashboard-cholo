'use client'

import { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { RotateCcw, Percent, DollarSign, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

type ReturnStatus = 'Solicitada' | 'En proceso' | 'Aprobada' | 'Rechazada' | 'Reembolsada'

interface ReturnRow {
  id: string
  orderId: string
  product: string
  reason: string
  amount: number
  date: string
  status: ReturnStatus
}

const RETURN_REASONS = [
  { reason: 'No coincide descripción', count: 42, color: '#f43f5e' },
  { reason: 'Producto defectuoso', count: 31, color: '#f59e0b' },
  { reason: 'Arrepentimiento', count: 24, color: '#6366f1' },
  { reason: 'Llegó dañado', count: 18, color: '#f43f5e' },
  { reason: 'Talla/Modelo incorrecto', count: 12, color: '#3b82f6' },
  { reason: 'Otro', count: 8, color: '#71717a' },
]

const MOCK_RETURNS: ReturnRow[] = [
  { id: 'RMA-087', orderId: '#45821', product: 'Cable USB-C Apple 2m', reason: 'No coincide descripción', amount: 42, date: '2026-05-14', status: 'En proceso' },
  { id: 'RMA-086', orderId: '#45690', product: 'Samsung Galaxy Watch 7', reason: 'Producto defectuoso', amount: 312, date: '2026-05-13', status: 'Aprobada' },
  { id: 'RMA-085', orderId: '#45478', product: 'AirPods Pro 2da Gen', reason: 'Arrepentimiento', amount: 149, date: '2026-05-12', status: 'Reembolsada' },
  { id: 'RMA-084', orderId: '#45201', product: 'iPhone 16 Pro 256GB', reason: 'Llegó dañado', amount: 899, date: '2026-05-11', status: 'Rechazada' },
  { id: 'RMA-083', orderId: '#44988', product: 'Logitech MX Master 3S', reason: 'No coincide descripción', amount: 89, date: '2026-05-10', status: 'Solicitada' },
  { id: 'RMA-082', orderId: '#44712', product: 'MacBook Air M4 8GB', reason: 'Producto defectuoso', amount: 1299, date: '2026-05-09', status: 'En proceso' },
]

const RETURN_TREND = [
  { month: 'Ene', returns: 18 },
  { month: 'Feb', returns: 22 },
  { month: 'Mar', returns: 19 },
  { month: 'Abr', returns: 25 },
  { month: 'May', returns: 27 },
]

const STATUS_STYLES: Record<ReturnStatus, string> = {
  'Solicitada': 'bg-zinc-100 text-zinc-600 border-zinc-200',
  'En proceso': 'bg-blue-50 text-blue-700 border-blue-200',
  'Aprobada': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rechazada': 'bg-rose-50 text-rose-700 border-rose-200',
  'Reembolsada': 'bg-violet-50 text-violet-700 border-violet-200',
}

const FILTER_TABS: Array<ReturnStatus | 'Todas'> = ['Todas', 'Solicitada', 'En proceso', 'Aprobada', 'Reembolsada', 'Rechazada']

const formatUSD = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

export default function DevolucionesPage() {
  const [activeFilter, setActiveFilter] = useState<ReturnStatus | 'Todas'>('Todas')

  const filteredReturns = activeFilter === 'Todas'
    ? MOCK_RETURNS
    : MOCK_RETURNS.filter(r => r.status === activeFilter)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Operaciones: Devoluciones (RMA)</h1>
        <p className="text-zinc-500 mt-1">Gestión de retornos y reembolsos</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Devoluciones Mayo */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600"><RotateCcw className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Devoluciones Mayo</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">135</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-rose-600">+8.1%</span>
            <span className="text-xs text-zinc-400">vs mes anterior</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-rose-500" />
        </div>

        {/* Tasa de Devolución */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><Percent className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Tasa de Devolución</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">12.9%</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-rose-600">+0.9%</span>
            <span className="text-xs text-zinc-400">vs mes anterior</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        </div>

        {/* Valor Promedio */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600"><DollarSign className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Valor Promedio</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">$398</div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
        </div>

        {/* Reembolsos Pendientes */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Wallet className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Reembolsos Pendientes</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">$2,847</div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart — Motivos */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-800">Motivos de Devolución</h2>
          </div>
          <div className="p-4 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={RETURN_REASONS}
                  dataKey="count"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                >
                  {RETURN_REASONS.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0)} casos`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3 w-full px-2">
              {RETURN_REASONS.map((d) => (
                <div key={d.reason} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-zinc-600 truncate">{d.reason}</span>
                  <span className="ml-auto font-semibold text-zinc-800 shrink-0">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Area Chart — Tendencia */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-800">Tendencia de Devoluciones</h2>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={RETURN_TREND} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0)} devoluciones`]} />
                <Area
                  type="monotone"
                  dataKey="returns"
                  name="Devoluciones"
                  stroke="#f43f5e"
                  fill="url(#gradReturns)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              activeFilter === tab
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Returns Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">Registro de Devoluciones</h2>
          <span className="text-xs text-zinc-400">{filteredReturns.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Orden</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Motivo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Monto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Fecha</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((row) => (
                <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.id}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.orderId}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{row.product}</td>
                  <td className="px-4 py-3 text-zinc-500">{row.reason}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-800">{formatUSD(row.amount)}</td>
                  <td className="px-4 py-3 text-zinc-500">{row.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLES[row.status])}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Strip */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800">
        Motivo principal de devolución: <strong>&apos;No coincide descripción&apos;</strong> (42 casos).
        Revisa las fichas técnicas de accesorios — son el 60% de este motivo.
        Tasa de devolución de <strong>12.9%</strong> supera el benchmark del sector (8%).
      </div>
    </div>
  )
}
