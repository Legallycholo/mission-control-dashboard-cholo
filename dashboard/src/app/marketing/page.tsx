"use client";

import { useState, useEffect } from 'react';
import { Mail, MailOpen, MousePointerClick, Search, MousePointer2, Eye, Download } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-lg text-sm">
      <p className="text-zinc-500 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-700 font-medium">{entry.name}:</span>
          <span className="text-zinc-900 font-bold">{entry.value.toLocaleString('es-CL')}</span>
        </div>
      ))}
    </div>
  );
};

function StatCard({
  icon: Icon,
  color,
  label,
  value,
  loading,
}: {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string | number;
  loading: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl flex flex-col gap-4">
      <div className={`p-2.5 rounded-xl border w-fit ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <div className="mt-1.5 h-9">
          {loading
            ? <Skeleton className="h-8 w-28" />
            : <p className="text-3xl font-bold text-zinc-900">{value}</p>}
        </div>
      </div>
    </div>
  );
}

export default function MarketingEmailPage() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  const [klaviyoData, setKlaviyoData] = useState<any>(null);
  const [loadingKlaviyo, setLoadingKlaviyo] = useState(true);
  const [gscData, setGscData] = useState<any[]>([]);
  const [loadingGsc, setLoadingGsc] = useState(true);

  const startISO = `${startDate}T00:00:00Z`;
  const endISO = `${endDate}T23:59:59Z`;

  useEffect(() => {
    setLoadingKlaviyo(true);
    setLoadingGsc(true);

    Promise.all([
      fetch(`/api/kpis/klaviyo?startDate=${startISO}&endDate=${endISO}`).then((r) => r.json()),
      fetch(`/api/gsc?startDate=${startDate}&endDate=${endDate}`).then((r) => r.json()),
    ])
      .then(([klaviyo, gsc]) => {
        setKlaviyoData(klaviyo);
        if (gsc.success) {
          setGscData(
            gsc.data.map((row: any) => ({
              date: new Date(row.date.value).toLocaleDateString('es-CL', {
                month: 'short',
                day: 'numeric',
              }),
              clicks: row.clicks,
              impressions: row.impressions,
              ctr: +(row.ctr * 100).toFixed(2),
              position: +row.position.toFixed(1),
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoadingKlaviyo(false);
        setLoadingGsc(false);
      });
  }, [startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalClicks = gscData.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = gscData.reduce((s, r) => s + r.impressions, 0);
  const avgCtr =
    gscData.length > 0
      ? (gscData.reduce((s, r) => s + r.ctr, 0) / gscData.length).toFixed(2)
      : '0.00';

  const handleExportCSV = () => {
    if (!gscData.length) return;
    const csv =
      'data:text/csv;charset=utf-8,' +
      'Fecha,Clicks,Impresiones,CTR,Posición\n' +
      gscData.map((r) => `${r.date},${r.clicks},${r.impressions},${r.ctr}%,${r.position}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `marketing_${startDate}_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Email & Push (Klaviyo)</h1>
          <p className="text-zinc-500 mt-1">Rendimiento de email marketing y tráfico orgánico.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
          />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-200"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {/* Klaviyo KPIs */}
      <div>
        <h2 className="text-base font-semibold text-zinc-700 mb-3">Email Marketing (Klaviyo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Mail}
            color="bg-orange-50 text-orange-500 border-orange-200/60"
            label="Ingresos Atribuidos (Klaviyo)"
            value={
              klaviyoData
                ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(klaviyoData.attributedRevenue || 0)
                : '...'
            }
            loading={loadingKlaviyo}
          />
          <StatCard
            icon={MailOpen}
            color="bg-blue-50 text-blue-500 border-blue-200/60"
            label="Emails Abiertos"
            value={klaviyoData ? (klaviyoData.openedCount || 0).toLocaleString('es-CL') : '...'}
            loading={loadingKlaviyo}
          />
          <StatCard
            icon={MousePointerClick}
            color="bg-emerald-50 text-emerald-500 border-emerald-200/60"
            label="Clicks en Emails"
            value={klaviyoData ? (klaviyoData.clickedCount || 0).toLocaleString('es-CL') : '...'}
            loading={loadingKlaviyo}
          />
        </div>
      </div>

      {/* GSC KPIs */}
      <div>
        <h2 className="text-base font-semibold text-zinc-700 mb-3">
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-500" />
            Búsqueda Orgánica (Google Search Console)
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={MousePointer2}
            color="bg-indigo-50 text-indigo-500 border-indigo-200/60"
            label="Total Clicks Orgánicos"
            value={totalClicks.toLocaleString('es-CL')}
            loading={loadingGsc}
          />
          <StatCard
            icon={Eye}
            color="bg-purple-50 text-purple-500 border-purple-200/60"
            label="Total Impresiones"
            value={totalImpressions.toLocaleString('es-CL')}
            loading={loadingGsc}
          />
          <StatCard
            icon={Search}
            color="bg-pink-50 text-pink-500 border-pink-200/60"
            label="CTR Promedio"
            value={`${avgCtr}%`}
            loading={loadingGsc}
          />
        </div>
      </div>

      {/* GSC trend chart */}
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl">
        <h3 className="text-base font-semibold text-zinc-800 mb-5">Evolución de Tráfico Orgánico</h3>
        <div className="h-[320px]">
          {loadingGsc ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : gscData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
              Sin datos para este periodo.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gscData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis yAxisId="l" stroke="#818cf8" fontSize={11} tickLine={false} axisLine={false} dx={-4} />
                <YAxis yAxisId="r" orientation="right" stroke="#c084fc" fontSize={11} tickLine={false} axisLine={false} dx={4} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} iconType="circle" />
                <Area yAxisId="l" type="monotone" dataKey="clicks" name="Clicks" stroke="#818cf8" strokeWidth={2.5} fill="url(#gClicks)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area yAxisId="r" type="monotone" dataKey="impressions" name="Impresiones" stroke="#c084fc" strokeWidth={2.5} fill="url(#gImpressions)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
