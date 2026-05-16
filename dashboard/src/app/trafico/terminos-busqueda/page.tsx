'use client';

import { useState } from 'react';
import { Search, MousePointerClick, TrendingUp, Eye, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeltaBadge } from '@/components/ui/DeltaBadge';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface SearchTerm {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  positionDelta: number;
  opportunity: 'Alta' | 'Media' | 'Baja';
}

const MOCK_TERMS: SearchTerm[] = [
  { keyword: 'iphone 16 pro chile', clicks: 1240, impressions: 18400, ctr: 6.74, position: 2.1, positionDelta: -0.4, opportunity: 'Baja' },
  { keyword: 'samsung galaxy s25', clicks: 890, impressions: 14200, ctr: 6.27, position: 3.2, positionDelta: -0.8, opportunity: 'Baja' },
  { keyword: 'ipad pro precio chile', clicks: 654, impressions: 22100, ctr: 2.96, position: 5.8, positionDelta: -1.2, opportunity: 'Alta' },
  { keyword: 'auriculares inalambricos', clicks: 543, impressions: 19800, ctr: 2.74, position: 4.4, positionDelta: +0.3, opportunity: 'Alta' },
  { keyword: 'apple watch serie 10', clicks: 487, impressions: 9800, ctr: 4.97, position: 3.9, positionDelta: -0.6, opportunity: 'Media' },
  { keyword: 'laptop gaming chile', clicks: 412, impressions: 16700, ctr: 2.47, position: 6.1, positionDelta: +1.4, opportunity: 'Alta' },
  { keyword: 'airpods pro 2 chile', clicks: 398, impressions: 8200, ctr: 4.85, position: 2.8, positionDelta: -0.2, opportunity: 'Baja' },
  { keyword: 'tablet android barata', clicks: 321, impressions: 24500, ctr: 1.31, position: 7.4, positionDelta: +0.8, opportunity: 'Alta' },
  { keyword: 'cargador inalambrico iphone', clicks: 287, impressions: 11200, ctr: 2.56, position: 5.2, positionDelta: -0.5, opportunity: 'Media' },
  { keyword: 'smartwatch deportivo', clicks: 243, impressions: 13400, ctr: 1.81, position: 6.8, positionDelta: +2.1, opportunity: 'Alta' },
  { keyword: 'macbook air m4', clicks: 218, impressions: 7600, ctr: 2.87, position: 4.1, positionDelta: -0.9, opportunity: 'Media' },
  { keyword: 'samsung buds chile', clicks: 187, impressions: 6900, ctr: 2.71, position: 3.7, positionDelta: -0.3, opportunity: 'Baja' },
];

const OPPORTUNITY_COLORS: Record<string, string> = {
  Alta: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Media: 'bg-amber-50 text-amber-700 border border-amber-200',
  Baja: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
};

function KpiCard({
  title,
  value,
  icon: Icon,
  color,
  delta,
  inverse,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
  delta?: number;
  inverse?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    violet: 'text-violet-600 bg-violet-50 border-violet-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <div className={cn('p-2 rounded-xl border', colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
        {delta !== undefined && <DeltaBadge value={delta} inverse={inverse} />}
      </div>
      <div
        className={cn(
          'absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500',
          color === 'blue' && 'bg-blue-400',
          color === 'emerald' && 'bg-emerald-400',
          color === 'violet' && 'bg-violet-400',
          color === 'amber' && 'bg-amber-400',
        )}
      />
    </div>
  );
}

export default function TerminosBusquedaPage() {
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  const [terms] = useState<SearchTerm[]>(MOCK_TERMS);
  const [query, setQuery] = useState('');
  const [opportunity, setOpportunity] = useState('All');

  const filtered = terms.filter(
    (t) =>
      t.keyword.toLowerCase().includes(query.toLowerCase()) &&
      (opportunity === 'All' || t.opportunity === opportunity),
  );

  const highOpportunityCount = terms.filter((t) => t.opportunity === 'Alta').length;

  const avgCtr = (terms.reduce((s, t) => s + t.ctr, 0) / terms.length).toFixed(2) + '%';
  const avgPos = (terms.reduce((s, t) => s + t.position, 0) / terms.length).toFixed(1);
  const totalImpressions = terms.reduce((s, t) => s + t.impressions, 0).toLocaleString('es-CL');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Tráfico: Términos de Búsqueda
          </h1>
          <p className="text-zinc-500 mt-1">
            Palabras clave orgánicas desde Google Search Console
          </p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
        />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Términos"
          value={terms.length}
          icon={Search}
          color="blue"
        />
        <KpiCard
          title="CTR Promedio"
          value={avgCtr}
          icon={MousePointerClick}
          color="emerald"
          delta={0.8}
        />
        <KpiCard
          title="Posición Promedio"
          value={avgPos}
          icon={TrendingUp}
          color="violet"
          delta={-0.4}
          inverse
        />
        <KpiCard
          title="Impresiones Totales"
          value={totalImpressions}
          icon={Eye}
          color="amber"
          delta={12.3}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 bg-zinc-100/80 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none placeholder:text-zinc-400 text-zinc-900 focus:border-blue-300 focus:bg-white transition-colors"
          />
        </div>
        <select
          value={opportunity}
          onChange={(e) => setOpportunity(e.target.value)}
          className="bg-zinc-100/80 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none text-zinc-700 focus:border-blue-300 focus:bg-white transition-colors"
        >
          <option value="All">Todas las oportunidades</option>
          <option value="Alta">Oportunidad Alta</option>
          <option value="Media">Oportunidad Media</option>
          <option value="Baja">Oportunidad Baja</option>
        </select>
        <span className="flex items-center text-xs text-zinc-400 px-2">
          {filtered.length} resultados
        </span>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Tabla de Términos</h2>
          <span className="text-xs text-zinc-400">{filtered.length} keywords</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">
                  Keyword
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  Clics
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  Impresiones
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  CTR
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">
                  Posición
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase">
                  Δ Posición
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase">
                  Oportunidad
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const ctrColor =
                  t.ctr >= 5
                    ? 'text-emerald-600 font-semibold'
                    : t.ctr >= 2
                      ? 'text-blue-600'
                      : 'text-zinc-500';

                const posColor =
                  t.position <= 3
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : t.position <= 5
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-zinc-500';

                return (
                  <tr
                    key={i}
                    className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 max-w-[260px]">
                      <span className="truncate block" title={t.keyword}>
                        {t.keyword}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-600">
                      {t.clicks.toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-600">
                      {t.impressions.toLocaleString('es-CL')}
                    </td>
                    <td className={cn('px-4 py-3 text-right tabular-nums', ctrColor)}>
                      {t.ctr.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'inline-block tabular-nums',
                          t.position <= 5
                            ? 'px-2 py-0.5 rounded-full text-xs font-semibold ' + posColor
                            : posColor,
                        )}
                      >
                        {t.position.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DeltaBadge value={t.positionDelta} inverse />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
                          OPPORTUNITY_COLORS[t.opportunity],
                        )}
                      >
                        {t.opportunity}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-zinc-400 text-sm">
                    Sin resultados para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity summary strip */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 flex gap-3">
        <div className="shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 text-emerald-600" />
        </div>
        <p className="text-sm text-emerald-800">
          <strong>{highOpportunityCount} términos de alta oportunidad</strong> identificados. Están
          en posición 4-10 con alto volumen — optimización de contenido podría incrementar el
          tráfico orgánico significativamente.
        </p>
      </div>
    </div>
  );
}
