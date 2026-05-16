'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ClipboardList, Truck, AlertTriangle, DollarSign, AlertCircle } from 'lucide-react';

type POStatus = 'Pendiente' | 'Confirmado' | 'En tránsito' | 'Recibido' | 'Atrasado';

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  totalAmount: number;
  orderDate: string;
  expectedDate: string;
  status: POStatus;
  notes: string;
}

const MOCK_POS: PurchaseOrder[] = [
  { id: 'PO-2026-041', supplier: 'Apple Chile Distribución', items: 45, totalAmount: 187000, orderDate: '2026-05-01', expectedDate: '2026-05-20', status: 'Recibido', notes: 'Entrega completa' },
  { id: 'PO-2026-042', supplier: 'Samsung Electronics Chile', items: 28, totalAmount: 134000, orderDate: '2026-05-05', expectedDate: '2026-05-25', status: 'En tránsito', notes: 'En aduana Santiago' },
  { id: 'PO-2026-043', supplier: 'Sony Chile', items: 12, totalAmount: 48000, orderDate: '2026-05-08', expectedDate: '2026-05-22', status: 'Atrasado', notes: 'Retraso en fábrica Shenzhen' },
  { id: 'PO-2026-044', supplier: 'Logitech Latinoamérica', items: 67, totalAmount: 29000, orderDate: '2026-05-10', expectedDate: '2026-05-28', status: 'Confirmado', notes: 'Confirma despacho el 15/05' },
  { id: 'PO-2026-045', supplier: 'Apple Chile Distribución', items: 18, totalAmount: 92000, orderDate: '2026-05-12', expectedDate: '2026-06-02', status: 'Pendiente', notes: 'Aguardando confirmación' },
  { id: 'PO-2026-046', supplier: 'Xiaomi Chile', items: 34, totalAmount: 41000, orderDate: '2026-05-14', expectedDate: '2026-05-30', status: 'En tránsito', notes: 'Salió de Hong Kong el 12/05' },
];

const STATUS_STYLES: Record<POStatus, string> = {
  'Recibido': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'En tránsito': 'bg-blue-50 text-blue-700 border-blue-200',
  'Atrasado': 'bg-rose-50 text-rose-700 border-rose-200',
  'Confirmado': 'bg-violet-50 text-violet-700 border-violet-200',
  'Pendiente': 'bg-zinc-100 text-zinc-600 border-zinc-200',
};

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

type FilterTab = 'Todas' | POStatus;
const FILTER_TABS: FilterTab[] = ['Todas', 'Pendiente', 'Confirmado', 'En tránsito', 'Recibido', 'Atrasado'];

const PIPELINE_STAGES: POStatus[] = ['Pendiente', 'Confirmado', 'En tránsito', 'Recibido'];
const PIPELINE_BG: Record<string, string> = {
  'Pendiente': 'bg-zinc-50',
  'Confirmado': 'bg-violet-50',
  'En tránsito': 'bg-blue-50',
  'Recibido': 'bg-emerald-50',
};

export default function ComprasOrdenesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todas');

  const filtered = activeFilter === 'Todas' ? MOCK_POS : MOCK_POS.filter(po => po.status === activeFilter);

  const activeCount = MOCK_POS.filter(po => po.status !== 'Recibido').length;
  const transitCount = MOCK_POS.filter(po => po.status === 'En tránsito').length;
  const delayedCount = MOCK_POS.filter(po => po.status === 'Atrasado').length;
  const totalCommit = MOCK_POS.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Compras: Órdenes de Compra</h1>
        <p className="text-sm text-zinc-500 mt-1">Seguimiento de pedidos a proveedores</p>
      </div>

      {/* Alert strip */}
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3">
        <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
        <p className="text-sm text-rose-800">
          <span className="font-semibold">1 orden atrasada</span> detectada: PO-2026-043 con Sony Chile. Fecha límite superada.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Órdenes Activas */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Órdenes Activas</span>
            <div className="rounded-xl bg-blue-50 p-2">
              <ClipboardList className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{activeCount}</p>
          <p className="text-xs text-zinc-400 mt-1">No recibidas</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-400" />
        </div>

        {/* En Tránsito */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">En Tránsito</span>
            <div className="rounded-xl bg-emerald-50 p-2">
              <Truck className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{transitCount}</p>
          <p className="text-xs text-zinc-400 mt-1">Órdenes en camino</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-400" />
        </div>

        {/* Órdenes Atrasadas */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Órdenes Atrasadas</span>
            <div className="rounded-xl bg-rose-50 p-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{delayedCount}</p>
          <p className="text-xs text-zinc-400 mt-1">Requieren atención</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-rose-400" />
        </div>

        {/* Compromiso Total */}
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Compromiso Total</span>
            <div className="rounded-xl bg-violet-50 p-2">
              <DollarSign className="h-4 w-4 text-violet-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{usd(totalCommit)}</p>
          <p className="text-xs text-zinc-400 mt-1">Total órdenes abiertas</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-400" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              activeFilter === tab
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PO Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Órdenes de Compra</h2>
          <span className="text-xs text-zinc-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Proveedor</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Artículos</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Monto Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Fecha Orden</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Fecha Esperada</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(po => (
                <tr
                  key={po.id}
                  className={cn(
                    'transition-colors hover:bg-zinc-50/50',
                    po.status === 'Atrasado' && 'bg-rose-50/30'
                  )}
                >
                  <td className="px-6 py-3">
                    <span className="font-mono text-xs text-zinc-500">{po.id}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{po.supplier}</td>
                  <td className="px-4 py-3 text-right text-zinc-600">{po.items}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900">{usd(po.totalAmount)}</td>
                  <td className="px-4 py-3 text-zinc-500">{po.orderDate}</td>
                  <td className="px-4 py-3 text-zinc-500">{po.expectedDate}</td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLES[po.status])}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline visual */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Pipeline de Órdenes</h2>
          <span className="text-xs text-zinc-400">Excluye Atrasado</span>
        </div>
        <div className="p-4 flex gap-4 overflow-x-auto">
          {PIPELINE_STAGES.map(stage => {
            const stagePOs = MOCK_POS.filter(po => po.status === stage);
            return (
              <div key={stage} className={cn('flex-1 min-w-0 rounded-xl p-3', PIPELINE_BG[stage])}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-700">{stage}</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/80 text-xs font-bold text-zinc-700 shadow-sm">
                    {stagePOs.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {stagePOs.length === 0 && (
                    <p className="text-xs text-zinc-400 text-center py-4">Sin órdenes</p>
                  )}
                  {stagePOs.map(po => (
                    <div key={po.id} className="rounded-lg bg-white/90 border border-white shadow-sm p-3">
                      <p className="font-mono text-xs text-zinc-400">{po.id}</p>
                      <p className="text-xs font-medium text-zinc-800 mt-0.5 truncate">{po.supplier}</p>
                      <p className="text-xs text-zinc-500 mt-1">{usd(po.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
