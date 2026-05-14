// TODO: Vendor Intelligence — WhatsApp Integration
// Data source: WhatsApp Business API or scraped export
// AI layer: Vertex AI (Gemini) for vendor scoring and sentiment
// Shopify sync: Cross-reference vendors with Shopify product catalog
// Trigger: Manual upload or scheduled Cloud Function
// Status: Placeholder only — do not implement until spec is provided

'use client';

import { MessageSquare, Brain, Store, Clock } from 'lucide-react';

const MOCK_METRICS = [
  { label: 'Mensajes Analizados', value: '2,847', icon: MessageSquare, color: 'blue', change: 'Último mes' },
  { label: 'Top Proveedor', value: 'Samsung Distribución', icon: Store, color: 'emerald', change: 'Por volumen' },
  { label: 'Tiempo Resp. Promedio', value: '4.2h', icon: Clock, color: 'amber', change: 'Últimos 30d' },
];

const MOCK_VENDORS = [
  { vendor: 'Samsung Distribución', category: 'Smartphones', score: 94, lastContact: '2026-05-10', status: 'Activo' },
  { vendor: 'Apple Autorizado', category: 'Apple Devices', score: 88, lastContact: '2026-05-08', status: 'Activo' },
  { vendor: 'Xiaomi Chile', category: 'Smartphones', score: 76, lastContact: '2026-05-05', status: 'Activo' },
  { vendor: 'Lenovo Corporativo', category: 'Laptops', score: 61, lastContact: '2026-04-28', status: 'Inactivo' },
  { vendor: 'JBL / Harman', category: 'Auriculares', score: 83, lastContact: '2026-05-01', status: 'Activo' },
];

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
};

export default function VendorIntelligencePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Vendor Intelligence</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200">
              Coming Soon
            </span>
          </div>
          <p className="text-zinc-500">Análisis de proveedores con IA · Integración WhatsApp Business · Scoring automático</p>
        </div>
        <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600">
          <Brain className="w-6 h-6" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="p-5 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-violet-100 text-violet-600 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-violet-900">Módulo en desarrollo</h3>
            <p className="text-sm text-violet-700 mt-1">
              Esta sección conectará con la API de WhatsApp Business para analizar conversaciones con proveedores,
              puntuar relaciones y sincronizar con el catálogo de Shopify mediante Vertex AI (Gemini).
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['WhatsApp Business API', 'Vertex AI (Gemini)', 'Shopify Sync', 'Cloud Functions'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-violet-700 border border-violet-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mock Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_METRICS.map((m) => (
          <div key={m.label} className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-zinc-500">{m.label}</p>
              <div className={`p-2 rounded-xl border ${COLOR_MAP[m.color]}`}>
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">{m.value}</h3>
            <p className="text-xs text-zinc-400 mt-1">{m.change}</p>
            <div className="absolute top-1 right-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-400">DEMO</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Vendor Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Directorio de Proveedores</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Datos de muestra — no reflejan datos reales</p>
          </div>
          <span className="px-2 py-1 rounded-lg text-xs font-bold bg-zinc-100 text-zinc-400">PLACEHOLDER</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {['Proveedor', 'Categoría', 'Score', 'Último Contacto', 'Estado'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_VENDORS.map((v, i) => (
                <tr key={v.vendor} className={`border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors ${i === MOCK_VENDORS.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-6 py-4 font-medium text-zinc-900">{v.vendor}</td>
                  <td className="px-6 py-4 text-zinc-500">{v.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden w-16">
                        <div className={`h-full rounded-full ${v.score >= 85 ? 'bg-emerald-500' : v.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${v.score}%` }} />
                      </div>
                      <span className="font-semibold text-zinc-700">{v.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{v.lastContact}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v.status === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
