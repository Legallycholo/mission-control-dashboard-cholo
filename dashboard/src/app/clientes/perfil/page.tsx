'use client';

import { useState } from 'react';
import {
  Search, Mail, Phone, MapPin, Calendar, ShoppingBag,
  DollarSign, MessageSquare, Sparkles, Clock, CheckCircle,
  Truck, XCircle, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Orden {
  fecha: string;
  numero: string;
  productos: string;
  total: string;
  estado: 'Entregado' | 'En camino' | 'Cancelado';
}

interface Ticket {
  fecha: string;
  titulo: string;
  canal: 'Chat' | 'Email';
  resolucion: string;
  estado: 'Resuelto' | 'Abierto';
}

interface MockPerfil {
  nombre: string;
  email: string;
  telefono: string;
  segmento: string;
  miembro: string;
  compras: number;
  ltv: string;
  ciudad: string;
  ordenes: Orden[];
  tickets: Ticket[];
}

const MOCK_PERFIL: MockPerfil = {
  nombre: 'Carlos Mendoza',
  email: 'carlos.mendoza@gmail.com',
  telefono: '+56 9 8734 2156',
  segmento: 'Champions',
  miembro: 'Marzo 2023',
  compras: 18,
  ltv: '$412.500',
  ciudad: 'Santiago, RM',
  ordenes: [
    {
      fecha: '12 Abr 2026',
      numero: '#GSM-9841',
      productos: 'iPhone 16 Pro + MagSafe Duo',
      total: '$989.990',
      estado: 'Entregado',
    },
    {
      fecha: '03 Mar 2026',
      numero: '#GSM-9204',
      productos: 'AirPods Pro 2da Gen',
      total: '$249.990',
      estado: 'Entregado',
    },
    {
      fecha: '15 Feb 2026',
      numero: '#GSM-8877',
      productos: 'Apple Watch Series 10',
      total: '$399.990',
      estado: 'En camino',
    },
    {
      fecha: '28 Ene 2026',
      numero: '#GSM-8341',
      productos: 'MacBook Air M3 13"',
      total: '$1.199.990',
      estado: 'Entregado',
    },
    {
      fecha: '10 Dic 2025',
      numero: '#GSM-7902',
      productos: 'Cargador USB-C 140W Apple',
      total: '$79.990',
      estado: 'Cancelado',
    },
  ],
  tickets: [
    {
      fecha: 'Mar 2026',
      titulo: 'Problema con garantía iPhone 15',
      canal: 'Chat',
      resolucion: '4 horas',
      estado: 'Resuelto',
    },
    {
      fecha: 'Ene 2026',
      titulo: 'Consulta sobre envío',
      canal: 'Email',
      resolucion: '2 horas',
      estado: 'Resuelto',
    },
    {
      fecha: 'Nov 2025',
      titulo: 'Solicitud de cambio',
      canal: 'Chat',
      resolucion: '6 horas',
      estado: 'Resuelto',
    },
  ],
};

type Tab = 'compras' | 'soporte' | 'ia';

function estadoBadge(estado: Orden['estado']) {
  if (estado === 'Entregado')
    return { cls: 'text-emerald-700 bg-emerald-50 border border-emerald-200', icon: CheckCircle };
  if (estado === 'En camino')
    return { cls: 'text-blue-700 bg-blue-50 border border-blue-200', icon: Truck };
  return { cls: 'text-rose-700 bg-rose-50 border border-rose-200', icon: XCircle };
}

function canalBadge(canal: Ticket['canal']) {
  if (canal === 'Chat') return 'text-violet-700 bg-violet-50 border border-violet-200';
  return 'text-blue-700 bg-blue-50 border border-blue-200';
}

export default function ClientesPerfilPage() {
  const [data] = useState<MockPerfil>(MOCK_PERFIL);
  const [tab, setTab] = useState<Tab>('compras');
  const [query, setQuery] = useState('');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'compras', label: 'Compras' },
    { id: 'soporte', label: 'Soporte' },
    { id: 'ia', label: 'IA Resumen' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Perfil 360° del Cliente</h1>
        <p className="text-sm text-zinc-500 mt-1">Vista unificada de historial, soporte y análisis de IA por cliente</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente por nombre, email o teléfono..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 shadow-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="bg-zinc-100 px-2 py-0.5 rounded-lg font-medium">Enter</span>
          <span>para buscar</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Profile Card */}
        <div className="w-full lg:w-72 shrink-0 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6 space-y-5">

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
              CM
            </div>
            <h2 className="text-lg font-bold text-zinc-900">{data.nombre}</h2>
            <span className="mt-1.5 text-xs font-semibold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full">
              {data.segmento}
            </span>
          </div>

          {/* Contact */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-2.5 text-sm text-zinc-600">
              <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="truncate">{data.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-600">
              <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{data.telefono}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-600">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{data.ciudad}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-600">
              <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Miembro desde {data.miembro}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
            <div className="bg-zinc-50 rounded-xl p-3 text-center">
              <ShoppingBag className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-zinc-900">{data.compras}</p>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Compras</p>
            </div>
            <div className="bg-zinc-50 rounded-xl p-3 text-center">
              <DollarSign className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-base font-bold text-zinc-900 leading-tight">{data.ltv}</p>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">LTV Total</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            <button className="w-full flex items-center justify-between text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2.5 rounded-xl transition-colors">
              <span>Enviar campaña personalizada</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button className="w-full flex items-center justify-between text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-2.5 rounded-xl transition-colors">
              <span>Ver segmento Champion</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Tabs */}
          <div className="flex gap-1 bg-zinc-100 rounded-2xl p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'px-5 py-2 text-sm font-semibold rounded-xl transition-all',
                  tab === t.id
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Compras Tab */}
          {tab === 'compras' && (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
              <div className="mb-5">
                <h3 className="text-base font-bold text-zinc-900">Historial de Compras</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{data.compras} órdenes totales — mostrando las últimas 5</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      {['Fecha', 'Orden #', 'Productos', 'Total', 'Estado'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-3 px-3 first:pl-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {data.ordenes.map((orden) => {
                      const badge = estadoBadge(orden.estado);
                      const EstadoIcon = badge.icon;
                      return (
                        <tr key={orden.numero} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3.5 px-3 pl-0 text-xs text-zinc-500 whitespace-nowrap">{orden.fecha}</td>
                          <td className="py-3.5 px-3 font-semibold text-blue-600 text-xs">{orden.numero}</td>
                          <td className="py-3.5 px-3 text-zinc-700 text-xs max-w-[180px] truncate">{orden.productos}</td>
                          <td className="py-3.5 px-3 font-bold text-zinc-900 text-xs tabular-nums whitespace-nowrap">{orden.total} CLP</td>
                          <td className="py-3.5 px-3">
                            <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full', badge.cls)}>
                              <EstadoIcon className="w-3 h-3" />
                              {orden.estado}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Soporte Tab */}
          {tab === 'soporte' && (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-base font-bold text-zinc-900">Historial de Soporte</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{data.tickets.length} tickets registrados</p>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[23px] top-0 bottom-0 w-px bg-zinc-100" />
                <div className="space-y-6">
                  {data.tickets.map((ticket, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center z-10">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 bg-zinc-50/60 border border-zinc-100 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900">{ticket.titulo}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                {ticket.fecha}
                              </span>
                              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', canalBadge(ticket.canal))}>
                                {ticket.canal}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                              {ticket.estado}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Resolución en {ticket.resolucion}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IA Resumen Tab */}
          {tab === 'ia' && (
            <div className="space-y-4">
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
                {/* AI Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">GSM AI — Perfil de {data.nombre}</p>
                    <p className="text-xs text-zinc-400">Análisis generado · 16 May 2026</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Resumen de Comportamiento</h4>
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      Carlos es un cliente de alto valor del segmento Champions con 18 compras acumuladas desde marzo 2023,
                      concentradas principalmente en dispositivos Apple de gama alta (iPhone, Mac, AirPods).
                      Su ticket promedio supera los $400.000 CLP y su frecuencia de compra es de 4.2 transacciones mensuales,
                      ubicándolo en el top 6% de la base total de clientes de GSM Pro.
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Recomendaciones IA</h4>
                    <div className="space-y-3">
                      {[
                        {
                          num: '01',
                          titulo: 'Oportunidad de Upsell',
                          texto: 'Carlos adquirió el iPhone 16 Pro pero no tiene accesorio Beats ni HomePod. Recomendamos campaña de upsell con descuento del 12% en audio premium.',
                          color: 'bg-blue-50 border-blue-200 text-blue-900',
                          numColor: 'text-blue-400',
                        },
                        {
                          num: '02',
                          titulo: 'Momento Óptimo de Contacto',
                          texto: 'Basado en su ciclo de compra histórico, su próxima transacción estimada es en 22-28 días. Activar email de reactivación en 18 días para capturar la ventana.',
                          color: 'bg-violet-50 border-violet-200 text-violet-900',
                          numColor: 'text-violet-400',
                        },
                        {
                          num: '03',
                          titulo: 'Riesgo de Churn Bajo',
                          texto: 'El modelo de predicción de GSM AI asigna un riesgo de abandono del 4% a Carlos, muy por debajo del 8.4% promedio. No requiere campaña de retención activa.',
                          color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                          numColor: 'text-emerald-400',
                        },
                      ].map((rec) => (
                        <div key={rec.num} className={cn('border rounded-xl p-4 flex gap-3', rec.color)}>
                          <span className={cn('text-xs font-bold shrink-0 mt-0.5', rec.numColor)}>{rec.num}</span>
                          <div>
                            <p className="text-xs font-bold mb-0.5">{rec.titulo}</p>
                            <p className="text-xs leading-relaxed opacity-90">{rec.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  Generado con <strong>Vertex AI (simulado)</strong> — Modelo: gemini-2.0-flash · Confianza: 94% ·
                  Basado en 18 órdenes, 3 tickets de soporte y datos RFM actualizados al 16/05/2026.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
