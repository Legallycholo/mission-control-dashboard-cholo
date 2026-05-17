'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Package, Ship, FileCheck, DollarSign, AlertCircle, Newspaper, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type PipelineStage = 'Pedido' | 'Producción' | 'En tránsito' | 'Aduana' | 'Bodega';

interface Shipment {
  id: string;
  supplier: string;
  origin: string;
  skus: number;
  estimatedValue: number;
  departureDate: string;
  eta: string;
  stage: PipelineStage;
  carrier: string;
  trackingCode?: string;
}

const MOCK_SHIPMENTS: Shipment[] = [
  { id: 'SHP-001', supplier: 'Apple Chile Distribución', origin: 'Taiwán', skus: 18, estimatedValue: 92000, departureDate: '2026-05-12', eta: '2026-05-28', stage: 'En tránsito', carrier: 'DHL Express', trackingCode: 'DHL1234567' },
  { id: 'SHP-002', supplier: 'Samsung Electronics Chile', origin: 'Corea del Sur', skus: 12, estimatedValue: 67000, departureDate: '2026-05-10', eta: '2026-05-25', stage: 'Aduana', carrier: 'FedEx International' },
  { id: 'SHP-003', supplier: 'Logitech Latinoamérica', origin: 'México', skus: 45, estimatedValue: 29000, departureDate: '2026-05-15', eta: '2026-05-30', stage: 'Producción', carrier: 'UPS' },
  { id: 'SHP-004', supplier: 'Xiaomi Chile', origin: 'China', skus: 28, estimatedValue: 38000, departureDate: '2026-05-08', eta: '2026-06-01', stage: 'En tránsito', carrier: 'COSCO Shipping' },
  { id: 'SHP-005', supplier: 'TechImport Shanghai', origin: 'China', skus: 67, estimatedValue: 14000, departureDate: '2026-06-01', eta: '2026-06-20', stage: 'Pedido', carrier: 'Pendiente' },
];

const STAGE_CONFIG: Record<PipelineStage, { color: string; bg: string; order: number }> = {
  'Pedido':       { color: 'text-zinc-600',   bg: 'bg-zinc-50 border-zinc-200',   order: 1 },
  'Producción':   { color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', order: 2 },
  'En tránsito':  { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   order: 3 },
  'Aduana':       { color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', order: 4 },
  'Bodega':       { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', order: 5 },
};

const STAGES: PipelineStage[] = ['Pedido', 'Producción', 'En tránsito', 'Aduana', 'Bodega'];

const MOCK_HISTORY = [
  { month: 'Ene', volume: 4 },
  { month: 'Feb', volume: 6 },
  { month: 'Mar', volume: 5 },
  { month: 'Abr', volume: 8 },
  { month: 'May', volume: 5 },
];

const ORIGIN_FLAG: Record<string, string> = {
  'Taiwán': '🇹🇼',
  'Corea del Sur': '🇰🇷',
  'México': '🇲🇽',
  'China': '🇨🇳',
};

interface NewsArticle {
  title:     string;
  link:      string | null;
  source:    string;
  date:      string | null;
  snippet:   string | null;
  thumbnail: string | null;
}

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const activeCount  = MOCK_SHIPMENTS.filter(s => s.stage !== 'Bodega').length;
const transitCount = MOCK_SHIPMENTS.filter(s => s.stage === 'En tránsito').length;
const aduanaCount  = MOCK_SHIPMENTS.filter(s => s.stage === 'Aduana').length;
const totalValue   = MOCK_SHIPMENTS.filter(s => s.stage !== 'Bodega').reduce((sum, s) => sum + s.estimatedValue, 0);

const NEWS_QUERIES = ['smartphones Chile', 'tecnología importación Chile', 'Apple Samsung Chile'];

export default function ComprasPipelinePage() {
  const [newsQuery,    setNewsQuery]    = useState(NEWS_QUERIES[0]);
  const [newsInput,    setNewsInput]    = useState('');
  const [articles,     setArticles]     = useState<NewsArticle[]>([]);
  const [newsLoading,  setNewsLoading]  = useState(false);
  const [newsError,    setNewsError]    = useState<string | null>(null);
  const [newsFetched,  setNewsFetched]  = useState(false);

  const fetchNews = async (q: string) => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const res  = await fetch(`/api/trends/news?q=${encodeURIComponent(q)}&gl=cl&hl=es`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setArticles(json.data.articles);
      setNewsFetched(true);
    } catch (e: any) {
      setNewsError(e.message);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleNewsSearch = () => {
    const q = (newsInput.trim() || newsQuery);
    setNewsQuery(q);
    fetchNews(q);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Compras: Pipeline de Importación</h1>
        <p className="text-sm text-zinc-500 mt-1">Seguimiento de envíos y estado de importaciones</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Envíos Activos</span>
            <div className="rounded-xl bg-blue-50 p-2">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{activeCount}</p>
          <p className="text-xs text-zinc-400 mt-1">En movimiento</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">En Tránsito</span>
            <div className="rounded-xl bg-emerald-50 p-2">
              <Ship className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{transitCount}</p>
          <p className="text-xs text-zinc-400 mt-1">Rumbo a Chile</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">En Aduana</span>
            <div className="rounded-xl bg-amber-50 p-2">
              <FileCheck className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{aduanaCount}</p>
          <p className="text-xs text-zinc-400 mt-1">Proceso aduanero</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Valor Total en Ruta</span>
            <div className="rounded-xl bg-violet-50 p-2">
              <DollarSign className="h-4 w-4 text-violet-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{usd(totalValue)}</p>
          <p className="text-xs text-zinc-400 mt-1">Excluye bodega</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-400" />
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Pipeline de Envíos</h2>
          <span className="text-xs text-zinc-400">{MOCK_SHIPMENTS.length} envíos totales</span>
        </div>
        <div className="flex gap-3 p-4 overflow-x-auto">
          {STAGES.map(stage => {
            const stageShipments = MOCK_SHIPMENTS.filter(s => s.stage === stage);
            const cfg = STAGE_CONFIG[stage];
            return (
              <div
                key={stage}
                className={cn('min-w-[180px] flex-1 rounded-xl border p-3', cfg.bg)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={cn('text-xs font-semibold', cfg.color)}>{stage}</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/80 text-xs font-bold text-zinc-700 shadow-sm">
                    {stageShipments.length}
                  </span>
                </div>
                <div>
                  {stageShipments.length === 0 && (
                    <p className="text-xs text-zinc-400 text-center py-6">Sin envíos</p>
                  )}
                  {stageShipments.map(s => (
                    <div key={s.id} className="rounded-xl border bg-white shadow-sm p-3 mb-2">
                      <p className="font-mono text-xs text-zinc-400">{s.id}</p>
                      <p className="text-xs font-medium text-zinc-800 mt-0.5 truncate">{s.supplier}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs">{ORIGIN_FLAG[s.origin] ?? '🌐'}</span>
                        <span className="text-xs text-zinc-500">{s.origin}</span>
                        <span className="text-xs text-zinc-400 ml-auto">{s.skus} SKUs</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">ETA: {s.eta}</p>
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {s.carrier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipment Detail Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Detalle de Envíos</h2>
          <span className="text-xs text-zinc-400">{MOCK_SHIPMENTS.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Proveedor</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Origen</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">SKUs</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Valor</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">ETA</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Etapa</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Transportista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_SHIPMENTS.map(s => {
                const cfg = STAGE_CONFIG[s.stage];
                return (
                  <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-zinc-500">{s.id}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-800 text-xs">{s.supplier}</td>
                    <td className="px-4 py-3 text-zinc-600 text-xs">
                      {ORIGIN_FLAG[s.origin] ?? '🌐'} {s.origin}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600">{s.skus}</td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-900">{usd(s.estimatedValue)}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{s.eta}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', cfg.bg, cfg.color)}>
                        {s.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{s.carrier}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volume BarChart */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Historial de Importaciones</h2>
          <span className="text-xs text-zinc-400">Envíos por mes</span>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_HISTORY} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: unknown) => [Number(v ?? 0), 'Envíos']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7', fontSize: 12 }}
              />
              <Bar dataKey="volume" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Strip */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-900">
          <span className="font-semibold">2 envíos críticos esta semana:</span> SHP-002 en aduana (gestionar liberación) y SHP-001 llega el 28/05. Asegúrate de tener espacio en bodega disponible.
        </p>
      </div>
    </div>
  );
}
