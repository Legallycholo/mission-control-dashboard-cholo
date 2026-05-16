'use client';

import { useState } from 'react';
import {
  MessageCircle, Bot, TrendingUp, Clock, Package,
  CheckCheck, Check, FileText, AlertTriangle, Sparkles,
  Search, RefreshCw, ChevronRight, Star, BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  from: 'agent' | 'supplier';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: { type: 'pdf' | 'image'; name: string };
}

interface Conversation {
  id: string;
  supplier: string;
  phone: string;
  category: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  score: number;
  messages: Message[];
}

interface PriceItem {
  sku: string;
  product: string;
  supplier: string;
  supplierPrice: number;
  salePrice: number;
  margin: number;
  stock: string;
  updated: string;
  trend: 'up' | 'down' | 'stable';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    supplier: 'Samsung Distribución',
    phone: '+56 2 2345 6789',
    category: 'Smartphones & Tablets',
    avatar: 'SD',
    lastMessage: 'Precio Galaxy S25 Ultra: $1,890,000 CLP unitario',
    lastTime: 'hace 2h',
    unread: 0,
    score: 94,
    messages: [
      {
        id: 'm1', from: 'agent',
        text: 'Hola equipo Samsung. Somos GSM PRO. ¿Pueden enviarnos su lista de precios actualizada para esta semana?',
        time: '09:12', status: 'read',
      },
      {
        id: 'm2', from: 'supplier',
        text: '¡Hola GSM PRO! Claro, aquí va la lista de precios semana 20/2026.',
        time: '09:34',
        attachment: { type: 'pdf', name: 'Lista Precios Samsung S20-2026.pdf' },
      },
      {
        id: 'm3', from: 'agent',
        text: '✅ Sistema procesó 34 SKUs correctamente. ¿Tienen disponibilidad de Galaxy S25 Ultra 256GB?',
        time: '09:35', status: 'read',
      },
      {
        id: 'm4', from: 'supplier',
        text: 'Sí, tenemos stock disponible. Precio distribuidor: $1,890,000 CLP unitario. Mínimo 5 unidades. Despacho en 48h.',
        time: '10:02',
      },
      {
        id: 'm5', from: 'agent',
        text: '¿Precio de Galaxy A55 5G 128GB para esta semana?',
        time: '10:03', status: 'read',
      },
      {
        id: 'm6', from: 'supplier',
        text: 'A55 5G 128GB: $489,000 CLP. Stock: 47 unidades. Válido hasta el viernes.',
        time: '10:18',
      },
    ],
  },
  {
    id: '2',
    supplier: 'Apple Autorizado',
    phone: '+56 2 2987 1234',
    category: 'Apple Devices',
    avatar: 'AA',
    lastMessage: 'iPhone 16 Pro 256GB: $1,245,000 CLP. Stock limitado.',
    lastTime: 'ayer',
    unread: 2,
    score: 88,
    messages: [
      {
        id: 'm1', from: 'agent',
        text: 'Buenos días. ¿Tienen disponible la lista de precios Apple para esta semana?',
        time: '08:45', status: 'read',
      },
      {
        id: 'm2', from: 'supplier',
        text: 'Buenos días. Aquí la lista oficial Apple para distribuidores autorizados.',
        time: '09:15',
        attachment: { type: 'pdf', name: 'Apple Price List Chile May 2026.pdf' },
      },
      {
        id: 'm3', from: 'agent',
        text: '✅ 28 SKUs procesados. ¿Stock de iPhone 16 Pro 256GB titanio natural?',
        time: '09:16', status: 'read',
      },
      {
        id: 'm4', from: 'supplier',
        text: 'iPhone 16 Pro 256GB: $1,245,000 CLP. Stock limitado: 12 unidades. Te recomiendo reservar pronto.',
        time: '11:30',
      },
      {
        id: 'm5', from: 'supplier',
        text: '¿Van a pedir MacBook Air M3 también? Tenemos oferta especial esta semana.',
        time: '11:32',
      },
    ],
  },
  {
    id: '3',
    supplier: 'Xiaomi Chile',
    phone: '+56 9 7654 3210',
    category: 'Smartphones',
    avatar: 'XC',
    lastMessage: 'Lista enviada. Redmi Note 14 desde $189,000.',
    lastTime: 'hace 3d',
    unread: 0,
    score: 76,
    messages: [
      {
        id: 'm1', from: 'agent',
        text: 'Hola Xiaomi Chile. Solicitud de lista de precios semanal.',
        time: '10:00', status: 'read',
      },
      {
        id: 'm2', from: 'supplier',
        text: 'Hola! Aquí la lista completa Xiaomi para mayo.',
        time: '14:22',
        attachment: { type: 'pdf', name: 'Xiaomi Lista Mayo 2026.pdf' },
      },
      {
        id: 'm3', from: 'agent',
        text: '✅ 41 SKUs procesados. Redmi Note 14 Pro+ aparece sin stock. ¿Fecha estimada de reposición?',
        time: '14:23', status: 'read',
      },
      {
        id: 'm4', from: 'supplier',
        text: 'Redmi Note 14 Pro+ llega el 22 de mayo. Precio: $345,000 CLP. ¿Quieren pre-reservar unidades?',
        time: '15:01',
      },
    ],
  },
  {
    id: '4',
    supplier: 'JBL / Harman',
    phone: '+56 2 2111 5500',
    category: 'Audio & Accesorios',
    avatar: 'JH',
    lastMessage: 'Oferta especial Q2: JBL Charge 6 a $89,000',
    lastTime: 'hace 4h',
    unread: 1,
    score: 83,
    messages: [
      {
        id: 'm1', from: 'agent',
        text: 'Hola JBL. ¿Precio actualizado de JBL Charge 6 y Flip 7 para esta semana?',
        time: '11:00', status: 'read',
      },
      {
        id: 'm2', from: 'supplier',
        text: 'Buenos días! Aquí va el catálogo Q2 2026.',
        time: '11:45',
        attachment: { type: 'pdf', name: 'JBL Harman Catálogo Q2-2026.pdf' },
      },
      {
        id: 'm3', from: 'agent',
        text: '✅ 19 SKUs procesados. Precio Charge 6 registrado: $89,000 CLP.',
        time: '11:46', status: 'read',
      },
      {
        id: 'm4', from: 'supplier',
        text: 'Oferta especial Q2: JBL Charge 6 a $89,000 CLP por compra mínima de 10 unidades. Válido todo mayo.',
        time: '13:20',
      },
    ],
  },
  {
    id: '5',
    supplier: 'Lenovo Corporativo',
    phone: '+56 2 2456 7890',
    category: 'Laptops & PCs',
    avatar: 'LC',
    lastMessage: 'Disculpa la demora. Aquí la lista actualizada.',
    lastTime: 'hace 1s',
    unread: 0,
    score: 61,
    messages: [
      {
        id: 'm1', from: 'agent',
        text: 'Hola Lenovo. Segunda solicitud de lista de precios. No recibimos respuesta la semana pasada.',
        time: '09:00', status: 'read',
      },
      {
        id: 'm2', from: 'supplier',
        text: 'Disculpa la demora. Aquí la lista actualizada.',
        time: '16:40',
        attachment: { type: 'pdf', name: 'Lenovo Lista Distribuidores May26.pdf' },
      },
      {
        id: 'm3', from: 'agent',
        text: '✅ 22 SKUs procesados. Tiempo de respuesta: 7 días (score penalizado).',
        time: '16:41', status: 'delivered',
      },
    ],
  },
];

const PRICE_LIST: PriceItem[] = [
  { sku: 'SAM-S25U-256', product: 'Samsung Galaxy S25 Ultra 256GB', supplier: 'Samsung Distribución', supplierPrice: 1890000, salePrice: 2290000, margin: 17.5, stock: 'En stock', updated: 'Hoy 10:18', trend: 'up' },
  { sku: 'APL-IP16P-256', product: 'iPhone 16 Pro 256GB', supplier: 'Apple Autorizado', supplierPrice: 1245000, salePrice: 1599000, margin: 22.1, stock: '12 uds', updated: 'Ayer', trend: 'stable' },
  { sku: 'SAM-A55-128', product: 'Samsung Galaxy A55 5G 128GB', supplier: 'Samsung Distribución', supplierPrice: 489000, salePrice: 629000, margin: 22.3, stock: '47 uds', updated: 'Hoy 10:18', trend: 'down' },
  { sku: 'XIA-RN14P-256', product: 'Redmi Note 14 Pro+ 256GB', supplier: 'Xiaomi Chile', supplierPrice: 345000, salePrice: 459000, margin: 24.8, stock: 'Pre-order', updated: 'hace 3d', trend: 'stable' },
  { sku: 'JBL-CHG6', product: 'JBL Charge 6', supplier: 'JBL / Harman', supplierPrice: 89000, salePrice: 129000, margin: 31.0, stock: 'En stock', updated: 'Hoy 13:20', trend: 'stable' },
  { sku: 'APL-MBA-M3-256', product: 'MacBook Air M3 256GB', supplier: 'Apple Autorizado', supplierPrice: 1089000, salePrice: 1399000, margin: 22.2, stock: 'Consultar', updated: 'Ayer', trend: 'up' },
  { sku: 'LEN-IP5-I5', product: 'Lenovo IdeaPad 5 i5 15"', supplier: 'Lenovo Corporativo', supplierPrice: 549000, salePrice: 699000, margin: 21.5, stock: 'En stock', updated: 'hace 1s', trend: 'stable' },
  { sku: 'XIA-RN14-128', product: 'Redmi Note 14 128GB', supplier: 'Xiaomi Chile', supplierPrice: 189000, salePrice: 259000, margin: 27.0, stock: 'En stock', updated: 'hace 3d', trend: 'down' },
];

const SCORE_CHART = [
  { name: 'Samsung', score: 94, fill: '#10b981' },
  { name: 'Apple', score: 88, fill: '#10b981' },
  { name: 'JBL', score: 83, fill: '#f59e0b' },
  { name: 'Xiaomi', score: 76, fill: '#f59e0b' },
  { name: 'Lenovo', score: 61, fill: '#f43f5e' },
];

const KPI_CARDS = [
  { label: 'Mensajes Analizados', value: '2,847', sub: '+12% esta semana', icon: MessageCircle, color: 'blue' },
  { label: 'Listas Recibidas', value: '18', sub: 'Esta semana', icon: FileText, color: 'violet' },
  { label: 'SKUs Registrados', value: '144', sub: 'Actualizados hoy', icon: Package, color: 'emerald' },
  { label: 'Tiempo Resp. Prom.', value: '3.8h', sub: '-0.4h vs semana ant.', icon: Clock, color: 'amber' },
];

const COLOR_ICON: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isAgent = msg.from === 'agent';
  return (
    <div className={cn('flex gap-2 max-w-[80%]', isAgent ? 'ml-auto flex-row-reverse' : '')}>
      {!isAgent && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={cn(
        'rounded-2xl px-4 py-2.5 text-sm space-y-1',
        isAgent
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-[4px]'
          : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-[4px]',
      )}>
        {msg.attachment && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl mb-1',
            isAgent ? 'bg-blue-400/40' : 'bg-zinc-100',
          )}>
            <FileText className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium truncate">{msg.attachment.name}</span>
          </div>
        )}
        <p>{msg.text}</p>
        <div className={cn('flex items-center justify-end gap-1 text-[10px]', isAgent ? 'text-blue-200' : 'text-zinc-400')}>
          <span>{msg.time}</span>
          {isAgent && msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-200" />}
          {isAgent && msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
          {isAgent && msg.status === 'sent' && <Check className="w-3 h-3" />}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'conversaciones' | 'precios' | 'proveedores';

export default function VendorIntelligencePage() {
  const [activeTab, setActiveTab] = useState<Tab>('conversaciones');
  const [activeConv, setActiveConv] = useState<Conversation>(CONVERSATIONS[0]);
  const [search, setSearch] = useState('');

  const filteredConvs = CONVERSATIONS.filter((c) =>
    c.supplier.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">WhatsApp AI Agent</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Agente activo
            </span>
          </div>
          <p className="text-sm text-zinc-500">Inteligencia de proveedores · Recolección automática de listas de precios · Vertex AI</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Última ejecución: hace 2h</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors">
            <RefreshCw className="w-3 h-3" />
            Ejecutar ahora
          </button>
        </div>
      </div>

      {/* AI status strip */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-2 rounded-xl bg-violet-100 text-violet-600 shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-violet-900">GSM AI Agent — Ciclo semanal completado</p>
          <p className="text-xs text-violet-700 mt-0.5">
            Contactó 5 proveedores · Recibió 4 listas de precios · Procesó 144 SKUs · 1 proveedor con respuesta tardía
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          {['WhatsApp Business API', 'Vertex AI', 'Shopify Sync'].map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-violet-700 border border-violet-200">{t}</span>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((k) => (
          <div key={k.label} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-zinc-500">{k.label}</p>
              <div className={cn('p-2 rounded-xl border', COLOR_ICON[k.color])}>
                <k.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{k.value}</p>
            <p className="text-xs text-zinc-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        {([
          ['conversaciones', 'Conversaciones'],
          ['precios', 'Lista de Precios'],
          ['proveedores', 'Score Proveedores'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === key
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Conversaciones ── */}
      {activeTab === 'conversaciones' && (
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden" style={{ height: '560px' }}>
          <div className="flex h-full">

            {/* Sidebar: conversation list */}
            <div className="w-72 border-r border-zinc-100 flex flex-col shrink-0">
              <div className="p-3 border-b border-zinc-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar proveedor..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-100 rounded-xl focus:outline-none text-zinc-700 placeholder:text-zinc-400"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConvs.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={cn(
                      'w-full text-left px-4 py-3 border-b border-zinc-100/60 transition-colors hover:bg-zinc-50',
                      activeConv.id === conv.id ? 'bg-blue-50/70' : '',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-zinc-900 truncate">{conv.supplier}</p>
                          <span className="text-[10px] text-zinc-400 shrink-0 ml-1">{conv.lastTime}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-4 h-4 bg-blue-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {activeConv.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{activeConv.supplier}</p>
                    <p className="text-xs text-zinc-400">{activeConv.phone} · {activeConv.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <Star className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700">{activeConv.score}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{activeConv.category}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <div className="text-center mb-4">
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">Hoy · Ciclo automático semanal</span>
                </div>
                {activeConv.messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
              </div>

              {/* Input (disabled — agent-only) */}
              <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 shrink-0">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl">
                  <Bot className="w-4 h-4 text-violet-500" />
                  <p className="text-xs text-zinc-400 flex-1">El agente IA controla esta conversación automáticamente</p>
                  <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">Auto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Lista de Precios ── */}
      {activeTab === 'precios' && (
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Lista de Precios Consolidada</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Extraída automáticamente por GSM AI Agent · 144 SKUs activos</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Actualizada hoy</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors">
                <RefreshCw className="w-3 h-3" />
                Exportar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  {['SKU', 'Producto', 'Proveedor', 'Precio Dist.', 'Precio Venta', 'Margen', 'Stock', 'Actualizado', 'Tendencia'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICE_LIST.map((item, i) => (
                  <tr key={item.sku} className={cn('border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors', i === PRICE_LIST.length - 1 ? 'border-0' : '')}>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">{item.sku}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 max-w-[200px] truncate">{item.product}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{item.supplier}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-700">${item.supplierPrice.toLocaleString('es-CL')}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">${item.salePrice.toLocaleString('es-CL')}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold',
                        item.margin >= 25 ? 'bg-emerald-50 text-emerald-700' :
                        item.margin >= 20 ? 'bg-blue-50 text-blue-700' :
                        'bg-amber-50 text-amber-700'
                      )}>
                        {item.margin}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{item.stock}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{item.updated}</td>
                    <td className="px-4 py-3">
                      <TrendingUp className={cn('w-4 h-4',
                        item.trend === 'up' ? 'text-emerald-500' :
                        item.trend === 'down' ? 'text-rose-500 rotate-180' :
                        'text-zinc-300',
                      )} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alert strip */}
          <div className="mx-6 mb-5 mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">2 SKUs con margen bajo el objetivo (20%)</p>
              <p className="text-xs text-amber-700 mt-0.5">Redmi Note 14 128GB (18.9%) y Samsung A55 requieren revisión de precio de venta.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Score Proveedores ── */}
      {activeTab === 'proveedores' && (
        <div className="space-y-6">
          {/* Score chart */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-zinc-900 mb-1">Score de Proveedores</h2>
            <p className="text-xs text-zinc-400 mb-5">Calculado por Vertex AI · Tiempo de respuesta, calidad de datos, precio competitivo</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SCORE_CHART} layout="vertical" barSize={20}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#52525b' }} width={80} />
                <Tooltip
                  formatter={(v: number) => [`${v}/100`, 'Score']}
                  contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e4e4e7' }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {SCORE_CHART.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Vendor cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONVERSATIONS.sort((a, b) => b.score - a.score).map((conv) => (
              <div key={conv.id} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                      {conv.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{conv.supplier}</p>
                      <p className="text-xs text-zinc-400">{conv.category}</p>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold border',
                    conv.score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    conv.score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  )}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {conv.score}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Score</span><span>{conv.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all',
                        conv.score >= 85 ? 'bg-emerald-500' :
                        conv.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                      )}
                      style={{ width: `${conv.score}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Último contacto</span>
                    <span className="font-medium text-zinc-700">{conv.lastTime}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Mensajes</span>
                    <span className="font-medium text-zinc-700">{conv.messages.length} en historial</span>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveTab('conversaciones'); setActiveConv(conv); }}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100"
                >
                  Ver conversación <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* AI insight */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">GSM AI — Análisis de proveedores</p>
              <p className="text-xs text-blue-700 mt-1">
                Samsung Distribución y Apple Autorizado mantienen scores de élite. Lenovo Corporativo tiene el score más bajo (61) por tiempos de respuesta superiores a 7 días — considerar proveedor alternativo para laptops. Xiaomi Chile ofrece el mejor margen promedio del catálogo (25.9%).
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
