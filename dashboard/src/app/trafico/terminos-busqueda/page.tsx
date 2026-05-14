'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, AlertTriangle, Download, ArrowUpDown } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface Term {
  term: string; status: string; impressions: number; clicks: number;
  cost: number; conversions: number; ctr: number; cpc: number; isNegativeCandidate: boolean;
}

type SortKey = keyof Pick<Term, 'impressions' | 'clicks' | 'cost' | 'conversions' | 'ctr' | 'cpc'>;

export default function TerminosBusquedaPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [showNegOnly, setShowNegOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'cost', dir: 'desc' });

  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    setLoading(true); setError(null);
    fetch(`/api/trafico/terminos-busqueda?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
      .then(j => { if (j.success) setTerms(j.data.terms); else setError(j.error); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate, mounted]);

  const filtered = useMemo(() => {
    let list = terms;
    if (search) list = list.filter(t => t.term.toLowerCase().includes(search.toLowerCase()));
    if (showNegOnly) list = list.filter(t => t.isNegativeCandidate);
    return [...list].sort((a, b) => {
      const diff = (a[sort.key] as number) - (b[sort.key] as number);
      return sort.dir === 'desc' ? -diff : diff;
    });
  }, [terms, search, showNegOnly, sort]);

  const negCandidates = terms.filter(t => t.isNegativeCandidate).length;
  const fmt$ = (n: number) => `$${n.toFixed(2)}`;
  const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;

  const toggleSort = (key: SortKey) => setSort(s => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));

  const handleExport = () => {
    const rows = ['Término,Impresiones,Clics,CTR,Costo,CPC,Conversiones,Candidato Negativo',
      ...filtered.map(t => `"${t.term}",${t.impressions},${t.clicks},${fmtPct(t.ctr)},${fmt$(t.cost)},${fmt$(t.cpc)},${t.conversions},${t.isNegativeCandidate ? 'Sí' : 'No'}`)
    ].join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`; a.download = `terminos_busqueda_${startDate}_${endDate}.csv`; a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Términos de Búsqueda</h1>
          <p className="text-zinc-500 mt-1">Consultas reales que activaron tus anuncios de Google Ads</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 transition-colors"><Download className="w-4 h-4" /> CSV</button>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm">
          <span className="font-semibold text-zinc-900">{terms.length}</span>
          <span className="text-zinc-500">términos únicos</span>
        </div>
        {negCandidates > 0 && (
          <button onClick={() => setShowNegOnly(s => !s)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${showNegOnly ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'}`}>
            <AlertTriangle className="w-4 h-4" />
            {negCandidates} candidatos a negativo
          </button>
        )}
      </div>

      {error ? (
        <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
            <Search className="w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Filtrar términos..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none" />
            <span className="text-xs text-zinc-400">{filtered.length} resultados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Término</th>
                  {(['impressions','clicks','ctr','cost','cpc','conversions'] as SortKey[]).map(k => (
                    <th key={k} className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase cursor-pointer hover:text-zinc-700 select-none" onClick={() => toggleSort(k)}>
                      <span className="flex items-center justify-end gap-1">{k === 'ctr' ? 'CTR' : k === 'cpc' ? 'CPC' : k.charAt(0).toUpperCase()+k.slice(1)} <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase">Flag</th>
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({length:10}).map((_,i) => (
                  <tr key={i} className="border-b border-zinc-100">{Array.from({length:8}).map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse"/></td>)}</tr>
                )) : filtered.map((t, i) => (
                  <tr key={i} className={`border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors ${t.isNegativeCandidate ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium text-zinc-900 max-w-[280px]">
                      <span className="truncate block" title={t.term}>{t.term}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600">{t.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{t.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{fmtPct(t.ctr)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-900">{fmt$(t.cost)}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{fmt$(t.cpc)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{t.conversions}</td>
                    <td className="px-4 py-3 text-center">
                      {t.isNegativeCandidate && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                          <AlertTriangle className="w-3 h-3" /> Negativo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400">Sin resultados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
