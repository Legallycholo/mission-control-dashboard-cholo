'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, Download, ArrowUpDown, Search } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { cn } from '@/lib/utils';

interface Sku {
  itemId: string; title: string; brand: string; impressions: number; clicks: number;
  cost: number; conversions: number; conversionsValue: number; roas: number; ctr: number;
  roasLabel: 'high' | 'medium' | 'low';
}

type SortKey = keyof Pick<Sku, 'cost' | 'clicks' | 'impressions' | 'conversions' | 'roas' | 'ctr'>;

const ROAS_STYLE: Record<string, string> = {
  high: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  low: 'bg-rose-50 text-rose-700 border border-rose-200',
};

export default function SkuPerformancePage() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'cost', dir: 'desc' });

  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    setLoading(true); setError(null);
    fetch(`/api/trafico/sku-performance?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json()).then(j => { if (j.success) setSkus(j.data.skus); else setError(j.error); }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [startDate, endDate, mounted]);

  const filtered = useMemo(() => {
    let list = search ? skus.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.itemId.includes(search) || s.brand.toLowerCase().includes(search.toLowerCase())) : skus;
    return [...list].sort((a, b) => {
      const diff = a[sort.key] - b[sort.key];
      return sort.dir === 'desc' ? -diff : diff;
    });
  }, [skus, search, sort]);

  const toggleSort = (key: SortKey) => setSort(s => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));

  const fmt$ = (n: number) => `$${n.toFixed(2)}`;
  const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;

  const handleExport = () => {
    const rows = ['SKU,Título,Marca,Gasto,Clics,CTR,Conversiones,Valor Conv.,ROAS',
      ...filtered.map(s => `"${s.itemId}","${s.title.replace(/"/g,'""')}","${s.brand}",${fmt$(s.cost)},${s.clicks},${fmtPct(s.ctr)},${s.conversions},${fmt$(s.conversionsValue)},${s.roas.toFixed(2)}`)
    ].join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`; a.download = `sku_performance_${startDate}_${endDate}.csv`; a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Rendimiento por Producto (SKU)</h1>
          <p className="text-zinc-500 mt-1">Gasto, conversiones y ROAS de productos en Google Shopping</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
          <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 transition-colors"><Download className="w-4 h-4" /> CSV</button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-zinc-400 font-medium">ROAS:</span>
        {[['high','≥ 3.0 Excelente'], ['medium','1.0–2.9 Regular'], ['low','< 1.0 Ineficiente']].map(([k, l]) => (
          <span key={k} className={cn('px-2.5 py-1 rounded-full font-semibold', ROAS_STYLE[k])}>{l}</span>
        ))}
      </div>

      {error ? (
        <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
            <Package className="w-4 h-4 text-zinc-400" />
            <Search className="w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Buscar por nombre, SKU o marca..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none" />
            <span className="text-xs text-zinc-400">{filtered.length} SKUs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">SKU / Título</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Marca</th>
                  {(['cost','clicks','ctr','conversions','roas'] as SortKey[]).map(k => (
                    <th key={k} className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase cursor-pointer hover:text-zinc-700 select-none" onClick={() => toggleSort(k)}>
                      <span className="flex items-center justify-end gap-1">{k === 'ctr' ? 'CTR' : k === 'roas' ? 'ROAS' : k.charAt(0).toUpperCase()+k.slice(1)} <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({length:8}).map((_,i) => (
                  <tr key={i} className="border-b border-zinc-100">{Array.from({length:7}).map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-100 rounded animate-pulse"/></td>)}</tr>
                )) : filtered.map((s, i) => (
                  <tr key={i} className="border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-zinc-900 truncate max-w-[260px]" title={s.title}>{s.title}</p>
                        <p className="text-xs text-zinc-400 font-mono">{s.itemId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{s.brand || '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-900">{fmt$(s.cost)}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{s.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{fmtPct(s.ctr)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{s.conversions}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold', ROAS_STYLE[s.roasLabel])}>
                        {s.roas.toFixed(2)}x
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-400">Sin resultados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
