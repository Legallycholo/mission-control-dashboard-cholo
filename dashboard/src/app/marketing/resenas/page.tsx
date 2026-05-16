'use client';

import { useState } from 'react';
import { Star, MessageSquare, Reply, ThumbsUp, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const MOCK_STATS = { avgRating: 4.3, totalReviews: 847, responseRate: 72, nps: 58 };

const MOCK_DISTRIBUTION = [
  { stars: 5, count: 412, pct: 48.6 },
  { stars: 4, count: 243, pct: 28.7 },
  { stars: 3, count: 98, pct: 11.6 },
  { stars: 2, count: 52, pct: 6.1 },
  { stars: 1, count: 42, pct: 5.0 },
];

const MOCK_SENTIMENT = [
  { name: 'Positivo', value: 655, color: '#10b981' },
  { name: 'Neutral', value: 98, color: '#f59e0b' },
  { name: 'Negativo', value: 94, color: '#f43f5e' },
];

interface Review {
  id: string;
  author: string;
  rating: number;
  product: string;
  date: string;
  text: string;
  responded: boolean;
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Carlos M.', rating: 5, product: 'iPhone 16 Pro 256GB', date: '2026-05-14', text: 'Excelente atención, llegó antes de lo esperado. El equipo estaba perfectamente embalado.', responded: true },
  { id: '2', author: 'Andrea L.', rating: 4, product: 'Samsung Galaxy S25', date: '2026-05-13', text: 'Muy buena calidad de imagen y rendimiento. Entrega rápida y bien embalado.', responded: true },
  { id: '3', author: 'Felipe R.', rating: 2, product: 'Cable USB-C 2m', date: '2026-05-12', text: 'El cable dejó de funcionar a la semana. Esperaba mejor calidad para el precio pagado.', responded: false },
  { id: '4', author: 'Valentina S.', rating: 5, product: 'AirPods Pro 2da Gen', date: '2026-05-11', text: 'La cancelación de ruido es increíble. Sin duda lo mejor que he comprado este año.', responded: true },
  { id: '5', author: 'Matías C.', rating: 1, product: 'Samsung Galaxy Watch 7', date: '2026-05-10', text: 'Llegó con la pantalla rayada. Pedí cambio y el proceso fue muy lento. No recomiendo.', responded: false },
  { id: '6', author: 'Isadora P.', rating: 3, product: 'Logitech MX Master 3S', date: '2026-05-09', text: 'Buen mouse pero el scroll lateral no funciona bien en mi Mac. Esperaba más por el precio.', responded: true },
];

const STAR_BAR_COLORS: Record<number, string> = {
  5: 'bg-emerald-500',
  4: 'bg-blue-500',
  3: 'bg-amber-500',
  2: 'bg-orange-500',
  1: 'bg-rose-500',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn('w-3.5 h-3.5', s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200')}
        />
      ))}
    </span>
  );
}

export default function ResenasPage() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [responseFilter, setResponseFilter] = useState<'all' | 'responded' | 'pending'>('all');

  const filtered = MOCK_REVIEWS.filter((r) => {
    if (ratingFilter !== null && r.rating !== ratingFilter) return false;
    if (responseFilter === 'responded' && !r.responded) return false;
    if (responseFilter === 'pending' && r.responded) return false;
    const q = search.toLowerCase();
    if (q && !r.author.toLowerCase().includes(q) && !r.product.toLowerCase().includes(q) && !r.text.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Marketing: Monitor de Reseñas</h1>
        <p className="text-sm text-zinc-500 mt-1">Análisis de satisfacción y reputación de clientes</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-400" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Rating Promedio</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{MOCK_STATS.avgRating} ★</div>
          <div className="mt-2">
            <span className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn('w-3.5 h-3.5', s <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200')} />
              ))}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-blue-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Reseñas Totales</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{new Intl.NumberFormat('es-CL').format(MOCK_STATS.totalReviews)}</div>
          <p className="text-xs text-zinc-400 mt-1">Reseñas acumuladas</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-emerald-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Tasa de Respuesta</span>
            <Reply className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{MOCK_STATS.responseRate}%</div>
          <p className="text-xs text-zinc-400 mt-1">De reseñas respondidas</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border p-6 bg-white/85 backdrop-blur-xl transition-all duration-300 hover:shadow-xl group">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-violet-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">NPS Score</span>
            <ThumbsUp className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{MOCK_STATS.nps}</div>
          <p className="text-xs text-zinc-400 mt-1">Promotores − Detractores</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Star Distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Distribución de Calificaciones</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {MOCK_DISTRIBUTION.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-700 w-6">{d.stars}★</span>
                <div className="flex-1 bg-zinc-100 rounded-full h-2.5">
                  <div
                    className={cn('h-2.5 rounded-full', STAR_BAR_COLORS[d.stars])}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-sm text-zinc-600 w-8 text-right">{d.count}</span>
                <span className="text-xs text-zinc-400 w-12 text-right">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Pie */}
        <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-semibold text-zinc-800">Análisis de Sentimiento</h2>
          </div>
          <div className="px-4 py-4">
            <ResponsiveContainer width="100%" height={175}>
              <PieChart>
                <Pie data={MOCK_SENTIMENT} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {MOCK_SENTIMENT.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [new Intl.NumberFormat('es-CL').format(value), 'Reseñas']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {MOCK_SENTIMENT.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-zinc-600">{s.name}</span>
                  </div>
                  <span className="font-semibold text-zinc-800">{new Intl.NumberFormat('es-CL').format(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar reseña, autor o producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <select
          value={ratingFilter ?? ''}
          onChange={(e) => setRatingFilter(e.target.value === '' ? null : Number(e.target.value))}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Todas las estrellas</option>
          {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}★</option>)}
        </select>
        <select
          value={responseFilter}
          onChange={(e) => setResponseFilter(e.target.value as 'all' | 'responded' | 'pending')}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">Todas</option>
          <option value="responded">Con respuesta</option>
          <option value="pending">Sin respuesta</option>
        </select>
      </div>

      {/* Review Feed */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-800">Reseñas Recientes</h2>
          <span className="text-xs text-zinc-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-zinc-400">No hay reseñas que coincidan con los filtros.</div>
        ) : (
          filtered.map((review) => (
            <div key={review.id} className="px-5 py-4 border-b border-zinc-100/80 last:border-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-800 text-sm">{review.author}</span>
                <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600">{review.product}</span>
                <span className="text-xs text-zinc-400 ml-auto">{review.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <StarRating rating={review.rating} />
                <span className="text-xs font-semibold text-zinc-600">{review.rating}/5</span>
              </div>
              <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">{review.text}</p>
              <div className="mt-2">
                {review.responded ? (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Respondida</span>
                ) : (
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">Sin responder</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Insight Strip */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 flex gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800">
          Palabra más frecuente en reseñas positivas: <strong>&apos;rápido&apos;</strong> y <strong>&apos;bien embalado&apos;</strong>. En reseñas negativas: <strong>&apos;cable&apos;</strong> y <strong>&apos;pantalla&apos;</strong>. Considera mejorar el control de calidad en accesorios.
        </p>
      </div>
    </div>
  );
}
