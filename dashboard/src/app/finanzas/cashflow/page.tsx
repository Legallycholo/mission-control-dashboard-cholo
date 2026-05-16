'use client';

import {
  Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, Bot,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CashflowWeek {
  week: string;
  inflows: number;
  outflows: number;
  balance: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_WEEKS: CashflowWeek[] = [
  { week: 'Sem 1 May', inflows: 142000, outflows: 98000,  balance: 44000 },
  { week: 'Sem 2 May', inflows: 167000, outflows: 112000, balance: 55000 },
  { week: 'Sem 3 May', inflows: 134000, outflows: 89000,  balance: 45000 },
  { week: 'Sem 4 May', inflows: 158000, outflows: 104000, balance: 54000 },
];

const INFLOW_BREAKDOWN = [
  { source: 'Ventas Shopify',           amount: 531000, color: '#10b981' },
  { source: 'Recuperación Cuotas',      amount: 48000,  color: '#3b82f6' },
  { source: 'Devoluciones Proveedores', amount: 22000,  color: '#f59e0b' },
];

const OUTFLOW_BREAKDOWN = [
  { source: 'Proveedores',          amount: 187000, color: '#f43f5e' },
  { source: 'Nómina',              amount: 30500,  color: '#6366f1' },
  { source: 'Marketing',           amount: 16000,  color: '#f59e0b' },
  { source: 'Logística',           amount: 8400,   color: '#14b8a6' },
  { source: 'Software + Oficina',  amount: 6670,   color: '#71717a' },
];

const OPENING_BALANCE = 284000;
const TOTAL_INFLOWS = 601000;
const TOTAL_OUTFLOWS = 403000;
const CLOSING_BALANCE = OPENING_BALANCE + TOTAL_INFLOWS - TOTAL_OUTFLOWS; // 482000
const PROJECTED_RUNWAY_MONTHS = 7.7;
const RUNWAY_TARGET_MONTHS = 12;

// ─── Formatter ───────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// ─── Sub-components ──────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, icon: Icon, glowColor, delta, inverseDelta,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  glowColor: string;
  delta?: number;
  inverseDelta?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ backgroundColor: glowColor }} />
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
          <Icon className="w-4 h-4 text-zinc-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      {delta !== undefined && (
        <div className="mt-2">
          <DeltaBadge value={delta} inverse={inverseDelta} />
        </div>
      )}
    </div>
  );
}

function HorizontalBreakdownChart({
  data,
  height,
}: {
  data: { source: string; amount: number; color: string }[];
  height: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
        <XAxis
          type="number"
          fontSize={10}
          stroke="#71717a"
          tickLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="source"
          width={130}
          fontSize={10}
          stroke="#71717a"
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
          formatter={(v: unknown) => [fmt(Number(v)), 'Monto']}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={18}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function FinanzasCashflowPage() {
  const runwayPct = Math.min((PROJECTED_RUNWAY_MONTHS / RUNWAY_TARGET_MONTHS) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Finanzas: Flujo de Caja</h1>
        <p className="text-zinc-500 mt-1">Proyección y control de entradas y salidas de efectivo</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Saldo Apertura"
          value={fmt(OPENING_BALANCE)}
          sub="Inicio del período"
          icon={Wallet}
          glowColor="#71717a"
        />
        <KpiCard
          label="Total Entradas"
          value={fmt(TOTAL_INFLOWS)}
          sub="Ingresos del período"
          icon={ArrowDownRight}
          glowColor="#10b981"
          delta={8.4}
        />
        <KpiCard
          label="Total Salidas"
          value={fmt(TOTAL_OUTFLOWS)}
          sub="Egresos del período"
          icon={ArrowUpRight}
          glowColor="#f43f5e"
          delta={5.2}
          inverseDelta
        />
        <KpiCard
          label="Saldo de Cierre"
          value={fmt(CLOSING_BALANCE)}
          sub="Resultado neto del período"
          icon={TrendingUp}
          glowColor="#3b82f6"
          delta={12.1}
        />
      </div>

      {/* Runway metric strip */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 flex items-center gap-6">
        <div className="shrink-0">
          <div className="text-3xl font-bold text-blue-700">{PROJECTED_RUNWAY_MONTHS} meses</div>
          <p className="text-sm text-blue-600">de runway proyectado</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-blue-600 mb-2">
            <span>0 meses</span>
            <span className="font-semibold">{PROJECTED_RUNWAY_MONTHS} / {RUNWAY_TARGET_MONTHS} meses objetivo</span>
            <span>{RUNWAY_TARGET_MONTHS} meses</span>
          </div>
          <div className="h-3 rounded-full bg-blue-200/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{ width: `${runwayPct}%` }}
            />
          </div>
          <p className="text-xs text-blue-500 mt-1.5">
            Basado en saldo de cierre {fmt(CLOSING_BALANCE)} ÷ quema mensual promedio
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Flujo Semanal — Grouped BarChart */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Flujo Semanal</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Entradas vs salidas por semana — mayo 2025</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={MOCK_WEEKS}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                barCategoryGap="25%"
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="week" fontSize={10} stroke="#71717a" tickLine={false} />
                <YAxis
                  fontSize={10}
                  stroke="#71717a"
                  tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem', fontSize: 12 }}
                  formatter={(v: unknown, name: unknown) => [fmt(Number(v)), name === 'inflows' ? 'Entradas' : 'Salidas']}
                />
                <Legend
                  formatter={value => value === 'inflows' ? 'Entradas' : 'Salidas'}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                <Bar dataKey="inflows" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} name="inflows" />
                <Bar dataKey="outflows" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={28} name="outflows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desglose de Entradas + Salidas */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          {/* Entradas */}
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Desglose de Entradas</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Fuentes de ingreso del período</p>
          </div>
          <div className="px-4 pt-4 pb-2">
            <HorizontalBreakdownChart data={INFLOW_BREAKDOWN} height={140} />
          </div>

          {/* Salidas */}
          <div className="px-6 py-3 border-t border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Desglose de Salidas</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Destinos de egreso del período</p>
          </div>
          <div className="px-4 pt-4 pb-4">
            <HorizontalBreakdownChart data={OUTFLOW_BREAKDOWN} height={180} />
          </div>
        </div>
      </div>

      {/* Weekly table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-zinc-900">Detalle Semanal</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Flujo de caja semana a semana</p>
          </div>
          <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">Mayo 2025</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Semana</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Entradas</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Salidas</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Balance Neto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-40">Indicador</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_WEEKS.map((row) => {
                const barPct = Math.min((row.balance / 60000) * 100, 100);
                return (
                  <tr key={row.week} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900">{row.week}</td>
                    <td className="px-4 py-3 text-right text-emerald-700 font-semibold tabular-nums font-mono">
                      {fmt(row.inflows)}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-600 font-semibold tabular-nums font-mono">
                      {fmt(row.outflows)}
                    </td>
                    <td className={cn(
                      'px-4 py-3 text-right font-bold tabular-nums font-mono',
                      row.balance >= 0 ? 'text-blue-700' : 'text-rose-700',
                    )}>
                      {row.balance >= 0 ? '+' : ''}{fmt(row.balance)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2 rounded-full bg-zinc-100 overflow-hidden w-36">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            row.balance >= 0 ? 'bg-emerald-500' : 'bg-rose-500',
                          )}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Totals row */}
              <tr className="bg-zinc-50 border-t-2 border-zinc-200">
                <td className="px-4 py-3 font-bold text-zinc-900">Total Período</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-700 tabular-nums font-mono">
                  {fmt(TOTAL_INFLOWS)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-rose-600 tabular-nums font-mono">
                  {fmt(TOTAL_OUTFLOWS)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-blue-700 tabular-nums font-mono text-base">
                  +{fmt(TOTAL_INFLOWS - TOTAL_OUTFLOWS)}
                </td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI strip */}
      <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 flex gap-3 items-start">
        <Bot className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <p className="text-sm text-violet-800">
          <strong className="font-semibold">Proyección GSM AI:</strong> Al ritmo actual, el saldo de
          cierre de junio será aproximadamente{' '}
          <strong className="font-bold">$510,000 USD</strong>. Flujo positivo estable — sin alertas
          de liquidez.
        </p>
      </div>

    </div>
  );
}
