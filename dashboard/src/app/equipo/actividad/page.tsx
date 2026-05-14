'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Clock, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface SummaryData { staff_id: string; full_name: string; action: string; event_count: number; last_activity: { value: string }; }
interface EventData { audit_id: string; occurred_at: { value: string }; full_name: string; action: string; subject_type: string; subject_id: string; }
interface Pagination { page: number; limit: number; total: number; totalPages: number; }

export default function EquipoActividadPage() {
  const [summary, setSummary] = useState<SummaryData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [activeAdvisor, setActiveAdvisor] = useState<string>('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      startDate: `${startDate}T00:00:00Z`,
      endDate: `${endDate}T23:59:59Z`,
      page: String(page),
      limit: '50',
    });
    if (activeAdvisor) params.set('advisor', activeAdvisor);

    fetch(`/api/equipo/actividad?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setSummary(data.summary || []);
        setEvents(data.recentEvents || []);
        setPagination(data.pagination || { page: 1, limit: 50, total: 0, totalPages: 1 });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate, page, activeAdvisor]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [startDate, endDate, activeAdvisor]);

  const uniqueActions = Array.from(new Set(summary.map(s => s.action))).sort();

  const chartDataMap = summary.reduce((acc, curr) => {
    if (filterAction !== 'all' && curr.action !== filterAction) return acc;
    if (!acc[curr.full_name]) acc[curr.full_name] = { name: curr.full_name, total: 0 };
    acc[curr.full_name].total += curr.event_count;
    return acc;
  }, {} as Record<string, { name: string; total: number }>);

  const chartData = Object.values(chartDataMap).sort((a, b) => b.total - a.total);
  const filteredTotalEvents = chartData.reduce((acc, curr) => acc + curr.total, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBarClick = (data: any) => {
    const name = data?.activePayload?.[0]?.payload?.name as string | undefined;
    if (name) setActiveAdvisor(prev => prev === name ? '' : name);
  };

  if (loading && summary.length === 0) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] col-span-2" /><Skeleton className="h-[400px]" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Actividad del Equipo</h1>
          <p className="text-zinc-500 mt-1">Monitoreo y atribución de acciones en Shopify Audit Logs</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="bg-transparent text-sm text-zinc-900 focus:outline-none">
              <option value="all">Todas las acciones</option>
              {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-sm text-zinc-600">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-zinc-900">{filteredTotalEvents.toLocaleString()}</span>
            <span>eventos</span>
          </div>
        </div>
      </div>

      {/* Active advisor pill */}
      {activeAdvisor && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Filtrado por:</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
            {activeAdvisor}
            <button onClick={() => setActiveAdvisor('')} className="ml-1 hover:text-blue-900"><X className="w-3.5 h-3.5" /></button>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="col-span-2 border-zinc-200 bg-white/85 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-zinc-900">
              Operaciones por Empleado
              {filterAction !== 'all' && <span className="text-blue-500 text-sm ml-2">({filterAction})</span>}
              <span className="text-xs text-zinc-400 font-normal ml-2">— clic en barra para filtrar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[340px] overflow-x-auto">
              <div style={{ width: Math.max(chartData.length * 65, 500), height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }} onClick={handleBarClick} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} stroke="#71717a" tickLine={false} axisLine={false} interval={0} angle={-40} textAnchor="end" />
                    <YAxis fontSize={12} stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '0.75rem' }} cursor={{ fill: '#f4f4f5' }} />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={36}
                      fill="#3b82f6"
                      stroke="none"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top actions */}
        <Card className="border-zinc-200 bg-white/85 backdrop-blur-xl">
          <CardHeader><CardTitle className="text-base font-bold text-zinc-900">Top Tipos de Acción</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <div>
                    <span className="font-medium text-blue-600 text-sm">{item.action}</span>
                    <p className="text-xs text-zinc-400">{item.full_name}</p>
                  </div>
                  <span className="bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded-full text-xs font-semibold">{item.event_count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events table */}
      <Card className="border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-400" /> Eventos Registrados</CardTitle>
            <span className="text-sm text-zinc-400">{pagination.total.toLocaleString()} total</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead><tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 text-xs uppercase tracking-wider">
                {['Fecha y Hora','Empleado','Acción','Recurso','ID Ref.'].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? Array.from({length:8}).map((_,i) => (
                  <tr key={i}>{Array.from({length:5}).map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse"/></td>)}</tr>
                )) : events.map((evt, idx) => (
                  <tr key={idx} className={`hover:bg-zinc-50 transition-colors ${evt.full_name === activeAdvisor ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-3 text-zinc-500 text-xs font-mono whitespace-nowrap">{new Date(evt.occurred_at?.value).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setActiveAdvisor(prev => prev === evt.full_name ? '' : evt.full_name)} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">{evt.full_name.charAt(0)}</div>
                        <span className="font-medium text-zinc-900">{evt.full_name}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3"><span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">{evt.action}</span></td>
                    <td className="px-4 py-3 text-zinc-500 capitalize text-xs">{evt.subject_type?.toLowerCase().replace(/_/g,' ') || '—'}</td>
                    <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{evt.subject_id || '—'}</td>
                  </tr>
                ))}
                {!loading && events.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-400">No hay eventos para este período.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100">
              <span className="text-sm text-zinc-500">Página {pagination.page} de {pagination.totalPages}</span>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4 text-zinc-600" />
                </button>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
