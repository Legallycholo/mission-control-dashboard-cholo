'use client'

import { useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Package, XCircle, AlertTriangle, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'

type StockStatus = 'OK' | 'Stock Bajo' | 'Sin Stock' | 'Sobrestock'

interface InventoryItem {
  sku: string
  product: string
  category: string
  currentStock: number
  minStock: number
  runRate: number
  coverageDays: number
  status: StockStatus
  lastRestocked: string
}

const MOCK_INVENTORY: InventoryItem[] = [
  { sku: 'APL-IP16P-256', product: 'iPhone 16 Pro 256GB', category: 'Smartphones', currentStock: 24, minStock: 10, runRate: 2.8, coverageDays: 8, status: 'Stock Bajo', lastRestocked: '2026-05-01' },
  { sku: 'SAM-GS25-128', product: 'Samsung Galaxy S25', category: 'Smartphones', currentStock: 18, minStock: 8, runRate: 1.9, coverageDays: 9, status: 'Stock Bajo', lastRestocked: '2026-05-05' },
  { sku: 'APL-IPDP-512', product: 'iPad Pro M4 512GB', category: 'Tablets', currentStock: 11, minStock: 5, runRate: 0.9, coverageDays: 12, status: 'OK', lastRestocked: '2026-04-28' },
  { sku: 'APL-MBM4-8', product: 'MacBook Air M4 8GB', category: 'Laptops', currentStock: 8, minStock: 4, runRate: 0.5, coverageDays: 16, status: 'OK', lastRestocked: '2026-04-20' },
  { sku: 'SON-WH1000-5', product: 'Sony WH-1000XM5', category: 'Audio', currentStock: 0, minStock: 6, runRate: 1.2, coverageDays: 0, status: 'Sin Stock', lastRestocked: '2026-04-15' },
  { sku: 'APL-AW10-45', product: 'Apple Watch S10 45mm', category: 'Wearables', currentStock: 14, minStock: 5, runRate: 0.8, coverageDays: 17, status: 'OK', lastRestocked: '2026-05-03' },
  { sku: 'APL-APP2', product: 'AirPods Pro 2da Gen', category: 'Audio', currentStock: 67, minStock: 15, runRate: 1.8, coverageDays: 37, status: 'OK', lastRestocked: '2026-05-08' },
  { sku: 'LOG-MX3S', product: 'Logitech MX Master 3S', category: 'Accesorios', currentStock: 3, minStock: 8, runRate: 1.4, coverageDays: 2, status: 'Sin Stock', lastRestocked: '2026-04-10' },
  { sku: 'APL-CAB30', product: 'Cable USB-C Apple 2m', category: 'Accesorios', currentStock: 245, minStock: 30, runRate: 2.1, coverageDays: 116, status: 'Sobrestock', lastRestocked: '2026-03-01' },
  { sku: 'SAM-GW7-44', product: 'Samsung Galaxy Watch 7', category: 'Wearables', currentStock: 9, minStock: 4, runRate: 0.6, coverageDays: 15, status: 'OK', lastRestocked: '2026-05-06' },
]

const STATUS_STYLES: Record<StockStatus, string> = {
  'OK': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Stock Bajo': 'bg-amber-50 text-amber-700 border-amber-200',
  'Sin Stock': 'bg-rose-50 text-rose-700 border-rose-200',
  'Sobrestock': 'bg-blue-50 text-blue-700 border-blue-200',
}

const STATUS_BAR_COLOR: Record<StockStatus, string> = {
  'OK': '#10b981',
  'Stock Bajo': '#f59e0b',
  'Sin Stock': '#f43f5e',
  'Sobrestock': '#3b82f6',
}

const HEALTH_DATA = [
  { name: 'OK', value: 5, color: '#10b981' },
  { name: 'Stock Bajo', value: 2, color: '#f59e0b' },
  { name: 'Sin Stock', value: 2, color: '#f43f5e' },
  { name: 'Sobrestock', value: 1, color: '#3b82f6' },
]

const FILTER_TABS: Array<StockStatus | 'Todos'> = ['Todos', 'OK', 'Stock Bajo', 'Sin Stock', 'Sobrestock']

const chartData = MOCK_INVENTORY.map(i => ({
  product: i.product.length > 22 ? i.product.slice(0, 22) + '…' : i.product,
  coverageDays: i.coverageDays,
  status: i.status,
}))

export default function InventarioPage() {
  const [activeFilter, setActiveFilter] = useState<StockStatus | 'Todos'>('Todos')

  const filteredItems = activeFilter === 'Todos'
    ? MOCK_INVENTORY
    : MOCK_INVENTORY.filter(i => i.status === activeFilter)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Operaciones: Inventario y Stock</h1>
        <p className="text-zinc-500 mt-1">Control dinámico de existencias y cobertura de stock</p>
      </div>

      {/* Critical Alert */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-800">
        <strong>2 productos sin stock</strong> detectados: Sony WH-1000XM5 y Logitech MX Master 3S.{' '}
        <strong>2 productos con stock bajo</strong> (cobertura &lt;10 días).
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Package className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Total SKUs</span>
          </div>
          <div className="text-3xl font-bold text-zinc-900">10</div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600"><XCircle className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Sin Stock</span>
          </div>
          <div className="text-3xl font-bold text-rose-600">2</div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-rose-500" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><AlertTriangle className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Stock Bajo</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">2</div>
          <p className="text-xs text-zinc-400 mt-1">&lt;10 días cobertura</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600"><Archive className="w-5 h-5" /></div>
            <span className="text-sm font-medium text-zinc-500">Sobrestock</span>
          </div>
          <div className="text-3xl font-bold text-violet-600">1</div>
          <p className="text-xs text-zinc-400 mt-1">&gt;90 días cobertura</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coverage Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-800">Días de Cobertura por SKU</h2>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 h-px border-t-2 border-dashed border-rose-500" /> 7 días
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 h-px border-t-2 border-dashed border-blue-500" /> 30 días
              </span>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 24, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="product" width={160} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0)} días`, 'Cobertura']} />
                <ReferenceLine x={7} stroke="#f43f5e" strokeDasharray="4 2" />
                <ReferenceLine x={30} stroke="#3b82f6" strokeDasharray="4 2" />
                <Bar dataKey="coverageDays" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_BAR_COLOR[entry.status as StockStatus]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-800">Estado de Inventario</h2>
          </div>
          <div className="p-4 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={HEALTH_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
                  {HEALTH_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0)} SKUs`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2 w-full px-2">
              {HEALTH_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-zinc-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-zinc-800">{d.value}</span>
                </div>
              ))}
            </div>
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

      {/* Inventory Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">Tabla de Inventario</h2>
          <span className="text-xs text-zinc-400">{filteredItems.length} productos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Stock Actual</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Stock Mín</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Run Rate/día</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide min-w-[140px]">Cobertura</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const barPct = Math.min((item.coverageDays / 30) * 100, 100)
                const barColor =
                  item.coverageDays < 7 ? 'bg-rose-500' :
                  item.coverageDays < 15 ? 'bg-amber-500' : 'bg-emerald-500'
                return (
                  <tr
                    key={item.sku}
                    className={cn(
                      'border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors',
                      item.status === 'Sin Stock' ? 'bg-rose-50/20' : ''
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{item.sku}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800">{item.product}</td>
                    <td className="px-4 py-3 text-zinc-500">{item.category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-800">{item.currentStock}</td>
                    <td className="px-4 py-3 text-right text-zinc-500">{item.minStock}</td>
                    <td className="px-4 py-3 text-right text-zinc-500">{item.runRate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-700 w-12 shrink-0">{item.coverageDays}d</span>
                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${barPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLES[item.status])}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Strip */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800">
        <strong>Acción recomendada:</strong> Emitir orden de compra urgente para Sony WH-1000XM5 y Logitech MX Master 3S.
        Cable USB-C Apple tiene 116 días de cobertura — considera promoción de liquidación.
      </div>
    </div>
  )
}
