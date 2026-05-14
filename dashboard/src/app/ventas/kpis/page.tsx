'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign, ShoppingCart, TrendingUp, Download,
  CreditCard, Percent, Activity, Pencil, Target, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip,
  XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface KpiMetrics {
  grossSales: number; netSales: number; grossOrderCount: number; netOrderCount: number;
  totalDiscounts: number; netDiscounts: number; aov: number; averageDailySales: number;
}
interface Deltas { netSales: number; grossSales: number; netOrderCount: number; grossOrderCount: number; aov: number; averageDailySales: number; totalDiscounts: number; }
interface TrendData { date: string; netSales: number; grossSales: number; orders: number; }
interface PaymentStatusData { name: string; value: number; amount: number; }
interface ApiResponseData { kpis: KpiMetrics; previousKpis: KpiMetrics; deltas: Deltas; trend: TrendData[]; paymentStatuses: PaymentStatusData[]; }
interface GoalsData { goal: number; netSales: number; progress: number; runRate: number; daysElapsed: number; daysInMonth: number; remainingDays: number; dailyNeeded: number; }
interface TopCategory { category: string; revenue: number; unitsSold: number; revenueShare: number; }

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#6366f1', '#71717a'];

export default function VentasKpisPage() {
  const [data, setData] = useState<ApiResponseData | null>(null);
  const [goals, setGoals] = useState<GoalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ventas/kpis?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) { console.error('Error fetching data:', error); }
    finally { setLoading(false); }
  };

  const fetchGoals = async () => {
    setGoalsLoading(true);
    try {
      const res = await fetch('/api/ventas/goals');
      const json = await res.json();
      if (json.success) setGoals(json.data);
    } catch (error) { console.error('Error fetching goals:', error); }
    finally { setGoalsLoading(false); }
  };

  const fetchTopCategories = async () => {
    setCatsLoading(true);
    try {
      const res = await fetch(`/api/ventas/categorias?startDate=${startDate}&endDate=${endDate}`);
      const json = await res.json();
      if (json.success) setTopCategories(json.data.categories.slice(0, 5));
    } catch { /* ignore — optional widget */ }
    finally { setCatsLoading(false); }
  };

  useEffect(() => { fetchData(); fetchTopCategories(); }, [startDate, endDate]);
  useEffect(() => { fetchGoals(); }, []);

  const handleSaveGoal = async () => {
    const amount = parseFloat(goalInput.replace(/[^0-9.]/g, ''));
    if (!amount || amount <= 0) return;
    setSavingGoal(true);
    try {
      const res = await fetch('/api/ventas/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if ((await res.json()).success) { setEditingGoal(false); fetchGoals(); }
    } catch { /* ignore */ }
    finally { setSavingGoal(false); }
  };

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const fmtN = (val: number) => new Intl.NumberFormat('en-US').format(val);

  const handleExportCSV = () => {
    if (!data) return;
    const csv = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + `Ventas Totales,${data.kpis.grossSales}\n`
      + `Ventas Pagadas,${data.kpis.netSales}\n`
      + `Promedio Diario,${data.kpis.averageDailySales}\n`
      + `Órdenes Totales,${data.kpis.grossOrderCount}\n`
      + `Órdenes Pagadas,${data.kpis.netOrderCount}\n`
      + `AOV,${data.kpis.aov}\n`
      + `Descuentos,${data.kpis.totalDiscounts}\n`;
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `ventas_kpis_${startDate}_${endDate}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ventas: Indicadores (KPIs)</h1>
          <p className="text-zinc-600 mt-1">Rendimiento financiero y volumen de pedidos.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-200/70">
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Ventas Pagadas" value={data ? fmt(data.kpis.netSales) : '...'} icon={DollarSign} color="blue" loading={loading} subtitle="Solo órdenes 'paid'" delta={data?.deltas.netSales} />
        <KpiCard title="Ventas Totales" value={data ? fmt(data.kpis.grossSales) : '...'} icon={Activity} color="zinc" loading={loading} subtitle="Sin filtro de estado" delta={data?.deltas.grossSales} />
        <KpiCard title="Promedio Diario" value={data ? fmt(data.kpis.averageDailySales) : '...'} icon={TrendingUp} color="emerald" loading={loading} subtitle="Ventas pagadas / días" delta={data?.deltas.averageDailySales} />
        <KpiCard title="Ticket Promedio (AOV)" value={data ? fmt(data.kpis.aov) : '...'} icon={CreditCard} color="indigo" loading={loading} subtitle="Promedio por orden cobrada" delta={data?.deltas.aov} />
        <KpiCard title="Órdenes Cobradas" value={data ? fmtN(data.kpis.netOrderCount) : '...'} icon={ShoppingCart} color="blue" loading={loading} subtitle="Estado 'paid'" delta={data?.deltas.netOrderCount} />
        <KpiCard title="Órdenes Totales" value={data ? fmtN(data.kpis.grossOrderCount) : '...'} icon={ShoppingCart} color="zinc" loading={loading} subtitle="Incluye pendientes" delta={data?.deltas.grossOrderCount} />
        <KpiCard title="Total Descuentos" value={data ? fmt(data.kpis.totalDiscounts) : '...'} icon={Percent} color="rose" loading={loading} subtitle="En todo el periodo" delta={data?.deltas.totalDiscounts} inverse />
      </div>

      {/* Pacing Bar */}
      <PacingBar goals={goals} loading={goalsLoading} editingGoal={editingGoal} goalInput={goalInput} savingGoal={savingGoal} onEditStart={() => { setGoalInput(goals?.goal ? String(goals.goal) : ''); setEditingGoal(true); }} onGoalInputChange={setGoalInput} onSave={handleSaveGoal} onCancel={() => setEditingGoal(false)} fmt={fmt} />

      {/* Top Categories */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900">Top Categorías del Periodo</h2>
          <Link href="/ventas/categorias" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            Ver todas <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-zinc-50 border-b border-zinc-100">{['Rank','Categoría','Ingresos','Unidades','% Total'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {catsLoading ? Array.from({length:5}).map((_,i) => (
                <tr key={i} className="border-b border-zinc-100">{Array.from({length:5}).map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse"/></td>)}</tr>
              )) : topCategories.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-zinc-400 text-sm">Sin datos de categorías. Verifica que la tabla shopify_order_line_items exista en BigQuery.</td></tr>
              ) : topCategories.map((c, i) => (
                <tr key={c.category} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{i+1}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{c.category}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(c.revenue)}</td>
                  <td className="px-4 py-3 text-zinc-600">{new Intl.NumberFormat('en-US').format(c.unitsSold)}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">{c.revenueShare.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Evolución de Ventas Pagadas</h2>
              <p className="text-sm text-zinc-600">Ventas cobradas diariamente</p>
            </div>
          </div>
          <div className="h-[300px] w-full relative z-10">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : data && data.trend && data.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNetSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#52525b" fontSize={12}
                    tickFormatter={(v) => { const p = v.split('-'); return p.length === 3 ? `${p[2]}/${p[1]}` : v; }} />
                  <YAxis stroke="#52525b" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '0.75rem', color: '#18181b' }} itemStyle={{ color: '#3b82f6' }} formatter={(value: unknown) => [fmt(Number(value)), 'Ventas Pagadas']} labelFormatter={(label) => `Fecha: ${label}`} />
                  <Area type="monotone" dataKey="netSales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNetSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">No hay datos para este rango.</div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 relative z-10">Estados de Pago</h2>
          <div className="h-[300px] w-full relative z-10 flex items-center justify-center">
            {loading ? (
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            ) : data && data.paymentStatuses && data.paymentStatuses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.paymentStatuses} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                    {data.paymentStatuses.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '0.75rem', color: '#18181b' }} formatter={(value: unknown, name: unknown, props: { payload?: { amount?: number } }) => [`${value} órdenes (${fmt(props.payload?.amount ?? 0)})`, String(name).toUpperCase()]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-zinc-600 text-sm">No hay datos</div>
            )}
            {!loading && data && data.paymentStatuses && (
              <div className="absolute bottom-0 w-full flex flex-wrap justify-center gap-3">
                {data.paymentStatuses.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="capitalize">{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ title, value, icon: Icon, color, loading, subtitle, delta, inverse }: {
  title: string; value: string; icon: React.ElementType; color: string;
  loading: boolean; subtitle: string; delta?: number; inverse?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-400',
    zinc: 'from-zinc-500/20 to-zinc-600/5 border-zinc-200 text-zinc-600',
  };
  const parts = colorMap[color].split(' ');

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group bg-gradient-to-br bg-white/85', parts[0], parts[1], parts[2])}>
      <div className="flex items-center justify-between relative z-10">
        <p className="text-sm font-medium text-zinc-600">{title}</p>
        <div className={cn('p-2 rounded-xl bg-zinc-100/80', parts[3])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 relative z-10">
        {loading ? (
          <div className="h-8 w-24 bg-zinc-100 rounded animate-pulse" />
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</h3>
            {delta !== undefined && <DeltaBadge value={delta} inverse={inverse} />}
          </div>
        )}
        <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>
      </div>
      <div className={cn('absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-transform duration-500 group-hover:scale-150',
        color === 'blue' && 'bg-blue-500', color === 'emerald' && 'bg-emerald-500',
        color === 'indigo' && 'bg-indigo-500', color === 'rose' && 'bg-rose-500', color === 'zinc' && 'bg-zinc-500'
      )} />
    </div>
  );
}

function PacingBar({ goals, loading, editingGoal, goalInput, savingGoal, onEditStart, onGoalInputChange, onSave, onCancel, fmt }: {
  goals: GoalsData | null; loading: boolean; editingGoal: boolean; goalInput: string;
  savingGoal: boolean; onEditStart: () => void; onGoalInputChange: (v: string) => void;
  onSave: () => void; onCancel: () => void; fmt: (n: number) => string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Meta Mensual</h2>
            <p className="text-sm text-zinc-500">Seguimiento de avance y proyección de cierre</p>
          </div>
        </div>
        {!editingGoal && (
          <button onClick={onEditStart} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
            <Pencil className="w-3.5 h-3.5" /> Editar meta
          </button>
        )}
      </div>

      {editingGoal ? (
        <div className="flex items-center gap-3 relative z-10">
          <input
            type="number" value={goalInput} onChange={(e) => onGoalInputChange(e.target.value)}
            placeholder="Ej: 20000000" autoFocus
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:border-blue-400"
          />
          <button onClick={onSave} disabled={savingGoal} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50">
            {savingGoal ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">
            Cancelar
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
          <div className="h-3 w-full bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-4 w-64 bg-zinc-100 rounded animate-pulse" />
        </div>
      ) : goals && goals.goal > 0 ? (
        <div className="space-y-4 relative z-10">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-zinc-900">{fmt(goals.netSales)}</span>
            <span className="text-zinc-500 text-sm">de {fmt(goals.goal)}</span>
            <span className={cn('text-sm font-bold', goals.progress >= 100 ? 'text-emerald-600' : goals.progress >= 75 ? 'text-blue-600' : goals.progress >= 50 ? 'text-amber-600' : 'text-rose-600')}>
              ({goals.progress.toFixed(1)}%)
            </span>
          </div>

          <div className="relative h-3 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={cn('absolute left-0 top-0 h-full rounded-full transition-all duration-700',
                goals.progress >= 100 ? 'bg-emerald-500' : goals.progress >= 75 ? 'bg-blue-500' : goals.progress >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              )}
              style={{ width: `${Math.min(100, goals.progress)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Proyección de cierre</p>
              <p className="text-base font-bold text-zinc-900">{fmt(goals.runRate)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Días restantes</p>
              <p className="text-base font-bold text-zinc-900">{goals.remainingDays} días</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Diario necesario</p>
              <p className="text-base font-bold text-zinc-900">{fmt(goals.dailyNeeded)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 text-center py-4">
          <p className="text-zinc-500 text-sm">No hay meta configurada para este mes.</p>
          <button onClick={onEditStart} className="mt-2 text-blue-600 text-sm font-semibold hover:underline">
            Configurar ahora →
          </button>
        </div>
      )}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
    </div>
  );
}
