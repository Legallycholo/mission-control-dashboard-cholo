'use client';

import { useState } from 'react';
import { FolderOpen, CheckCircle2, AlertTriangle, Search, XCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type CollectionStatus = 'OK' | 'Sin imagen' | 'Sin SEO' | 'Sin productos' | 'Incompleto';

interface CollectionRow {
  name: string;
  slug: string;
  productCount: number;
  hasImage: boolean;
  metaTitle: boolean;
  metaDesc: boolean;
  status: CollectionStatus;
  seoScore: number;
}

const MOCK_COLLECTIONS: CollectionRow[] = [
  { name: 'Smartphones', slug: 'smartphones', productCount: 142, hasImage: true, metaTitle: true, metaDesc: true, status: 'OK', seoScore: 98 },
  { name: 'iPhone', slug: 'iphone', productCount: 67, hasImage: true, metaTitle: true, metaDesc: false, status: 'Incompleto', seoScore: 72 },
  { name: 'Samsung Galaxy', slug: 'samsung-galaxy', productCount: 43, hasImage: true, metaTitle: true, metaDesc: true, status: 'OK', seoScore: 94 },
  { name: 'Accesorios', slug: 'accesorios', productCount: 312, hasImage: true, metaTitle: false, metaDesc: false, status: 'Sin SEO', seoScore: 41 },
  { name: 'Laptops', slug: 'laptops', productCount: 28, hasImage: true, metaTitle: true, metaDesc: true, status: 'OK', seoScore: 91 },
  { name: 'Tablets', slug: 'tablets', productCount: 19, hasImage: false, metaTitle: true, metaDesc: true, status: 'Sin imagen', seoScore: 65 },
  { name: 'Audio', slug: 'audio', productCount: 87, hasImage: true, metaTitle: false, metaDesc: false, status: 'Sin SEO', seoScore: 38 },
  { name: 'Ofertas de Verano', slug: 'ofertas-verano', productCount: 0, hasImage: false, metaTitle: false, metaDesc: false, status: 'Sin productos', seoScore: 0 },
  { name: 'Wearables', slug: 'wearables', productCount: 34, hasImage: true, metaTitle: true, metaDesc: false, status: 'Incompleto', seoScore: 68 },
  { name: 'Gaming', slug: 'gaming', productCount: 22, hasImage: false, metaTitle: false, metaDesc: false, status: 'Sin imagen', seoScore: 22 },
];

const STATUS_FILTERS: Array<CollectionStatus | 'Todas'> = ['Todas', 'OK', 'Sin SEO', 'Sin imagen', 'Incompleto', 'Sin productos'];

const STATUS_BADGE: Record<CollectionStatus, string> = {
  'OK': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Sin imagen': 'text-rose-700 bg-rose-50 border-rose-200',
  'Sin SEO': 'text-rose-700 bg-rose-50 border-rose-200',
  'Sin productos': 'text-rose-700 bg-rose-50 border-rose-200',
  'Incompleto': 'text-amber-700 bg-amber-50 border-amber-200',
};

function SeoScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-zinc-100 rounded-full h-2">
        <div className={cn('h-2 rounded-full transition-all', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-zinc-700 w-8 text-right">{score}</span>
    </div>
  );
}

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
  ) : (
    <XCircle className="w-4 h-4 text-rose-500 mx-auto" />
  );
}

export default function AuditoriaPage() {
  const [activeFilter, setActiveFilter] = useState<CollectionStatus | 'Todas'>('Todas');

  const totalOk = MOCK_COLLECTIONS.filter((c) => c.status === 'OK').length;
  const needsAttention = MOCK_COLLECTIONS.filter((c) => c.status !== 'OK').length;
  const avgSeo = Math.round(MOCK_COLLECTIONS.reduce((a, c) => a + c.seoScore, 0) / MOCK_COLLECTIONS.length);

  const filtered = activeFilter === 'Todas' ? MOCK_COLLECTIONS : MOCK_COLLECTIONS.filter((c) => c.status === activeFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Marketing: Auditoría de Colecciones</h1>
        <p className="text-sm text-zinc-500 mt-1">Estado SEO y completitud de las colecciones de Shopify</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Colecciones</span>
            <FolderOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{MOCK_COLLECTIONS.length}</div>
          <p className="text-xs text-zinc-400 mt-1">Colecciones en Shopify</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Colecciones OK</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{totalOk}</div>
          <p className="text-xs text-zinc-400 mt-1">Completamente optimizadas</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-rose-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Requieren Atención</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{needsAttention}</div>
          <p className="text-xs text-zinc-400 mt-1">Con problemas de SEO o contenido</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">SEO Score Promedio</span>
            <Search className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{avgSeo}/100</div>
          <p className="text-xs text-zinc-400 mt-1">Promedio del catálogo</p>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              activeFilter === f
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-800">Colecciones</h2>
          <span className="text-xs text-zinc-400">{filtered.length} colección{filtered.length !== 1 ? 'es' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Colección</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Productos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Imagen</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Meta Title</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Meta Descripción</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide min-w-[120px]">SEO Score</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((col, i) => (
                <tr key={col.slug} className={cn('border-b border-zinc-100/80 last:border-0', i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30')}>
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-zinc-800">{col.name}</div>
                    <div className="text-xs text-zinc-400">/{col.slug}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn('font-semibold', col.productCount === 0 ? 'text-rose-500' : 'text-zinc-700')}>
                      {new Intl.NumberFormat('es-CL').format(col.productCount)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center"><BoolIcon value={col.hasImage} /></td>
                  <td className="px-4 py-3.5 text-center"><BoolIcon value={col.metaTitle} /></td>
                  <td className="px-4 py-3.5 text-center"><BoolIcon value={col.metaDesc} /></td>
                  <td className="px-4 py-3.5"><SeoScoreBar score={col.seoScore} /></td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full border', STATUS_BADGE[col.status])}>
                      {col.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Fixes Panel */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-amber-900">Acciones Recomendadas por GSM Pro AI</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-amber-800">
            <span className="text-amber-500 mt-0.5 font-bold">•</span>
            Agregar imágenes a <strong>Tablets</strong> y <strong>Gaming</strong> para mejorar la presentación visual y el SEO de cada colección.
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-800">
            <span className="text-amber-500 mt-0.5 font-bold">•</span>
            Completar meta descripción en <strong>iPhone</strong> y <strong>Wearables</strong> para maximizar el CTR en resultados de búsqueda.
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-800">
            <span className="text-amber-500 mt-0.5 font-bold">•</span>
            Eliminar o rellenar <strong>Ofertas de Verano</strong> (sin productos) para evitar páginas vacías que perjudican el SEO del sitio.
          </li>
        </ul>
      </div>
    </div>
  );
}
