'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  Globe,
  ChevronDown,
  ChevronRight,
  Wallet,
  Truck,
  Package,
  UserCheck,
  Lightbulb,
  HeadphonesIcon,
  Sparkles,
  Bot,
  Signal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SubItem = {
  name: string;
  href: string;
  soon?: boolean;
};

type NavItem =
  | { name: string; href: string; icon: React.ElementType; subItems?: undefined }
  | { name: string; icon: React.ElementType; href?: undefined; subItems: SubItem[] };

const navItems: NavItem[] = [
  { name: 'General', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Ventas',
    icon: ShoppingCart,
    subItems: [
      { name: 'Indicadores (KPIs)', href: '/ventas/kpis' },
      { name: 'Análisis de Productos', href: '/ventas/productos' },
      { name: 'Por Categoría', href: '/ventas/categorias' },
      { name: 'Nuevos vs Recurrentes', href: '/ventas/retencion' },
      { name: 'Métodos de Pago', href: '/ventas/metodo-pago' },
    ],
  },
  { name: 'WhatsApp AI Agent', href: '/vendor-intelligence', icon: Bot },
  {
    name: 'Inteligencia de Mercado',
    icon: Lightbulb,
    subItems: [
      { name: 'Resumen', href: '/inteligencia-mercado' },
      { name: 'Tendencias', href: '/inteligencia-mercado/trends' },
      { name: 'Competitividad', href: '/inteligencia-mercado/competitividad' },
      { name: 'Dimensión de Mercado', href: '/inteligencia-mercado/dimension' },
      { name: 'Posicionamiento Shopping', href: '/inteligencia-mercado/shopping-position' },
      { name: 'Lanzamientos', href: '/inteligencia-mercado/lanzamientos' },
    ],
  },
  {
    name: 'Tráfico',
    icon: Globe,
    subItems: [
      { name: 'General', href: '/trafico/general' },
      { name: 'Orgánico (Search Console)', href: '/trafico/organico' },
      { name: 'Pagado (Google Ads)', href: '/trafico/pagado-google' },
      { name: 'Términos de Búsqueda', href: '/trafico/terminos-busqueda' },
      { name: 'Fuente / Medio', href: '/trafico/fuente-medio' },
      { name: 'Dispositivos', href: '/trafico/dispositivos' },
      { name: 'SKU Performance', href: '/trafico/sku-performance' },
      { name: 'Pagado (Meta Ads)', href: '/trafico/pagado-meta' },
    ],
  },
  {
    name: 'Marketing',
    icon: BarChart3,
    subItems: [
      { name: 'Email & Push (Klaviyo)', href: '/marketing' },
      { name: 'Monitor de Reseñas', href: '/marketing/resenas', soon: true },
      { name: 'Auditoría de Colecciones', href: '/marketing/auditoria', soon: true },
      { name: 'Calendario Comercial', href: '/marketing/calendario', soon: true },
    ],
  },
  {
    name: 'Servicio al Cliente',
    icon: HeadphonesIcon,
    subItems: [
      { name: 'Mensajería CRM (Crisp)', href: '/servicio-cliente/mensajeria' },
      { name: 'Llamadas (RingCentral)', href: '/servicio-cliente/llamadas' },
    ],
  },
  {
    name: 'Equipo',
    icon: Users,
    subItems: [
      { name: 'Actividad y Atribución', href: '/equipo/actividad' },
    ],
  },
  {
    name: 'Finanzas',
    icon: Wallet,
    subItems: [
      { name: 'P&L y Rentabilidad', href: '/finanzas/pnl', soon: true },
      { name: 'Gastos Fijos (OPEX)', href: '/finanzas/opex', soon: true },
      { name: 'Flujo de Caja', href: '/finanzas/cashflow', soon: true },
    ],
  },
  {
    name: 'Compras',
    icon: Truck,
    subItems: [
      { name: 'Órdenes de Compra', href: '/compras/ordenes', soon: true },
      { name: 'Proveedores', href: '/compras/proveedores', soon: true },
      { name: 'Pipeline de Importación', href: '/compras/pipeline', soon: true },
    ],
  },
  {
    name: 'Operaciones',
    icon: Package,
    subItems: [
      { name: 'Inventario y Stock', href: '/operaciones/inventario', soon: true },
      { name: 'Fulfillment', href: '/operaciones/fulfillment', soon: true },
      { name: 'Devoluciones (RMA)', href: '/operaciones/devoluciones', soon: true },
    ],
  },
  {
    name: 'Clientes',
    icon: UserCheck,
    subItems: [
      { name: 'Retención y LTV', href: '/clientes/retencion', soon: true },
      { name: 'Segmentación', href: '/clientes/segmentacion', soon: true },
      { name: 'Perfil 360°', href: '/clientes/perfil', soon: true },
    ],
  },
  {
    name: 'Configuración',
    icon: Settings,
    subItems: [
      { name: 'Preferencias', href: '/settings' },
    ],
  },
];

function HexLogo() {
  return (
    <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" aria-hidden>
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="hexGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer hex */}
      <polygon
        points="18,2 31,9.5 31,26.5 18,34 5,26.5 5,9.5"
        fill="url(#hexGrad)"
        fillOpacity="0.12"
        stroke="url(#hexGrad)"
        strokeWidth="1.5"
        filter="url(#hexGlow)"
      />
      {/* Inner hex */}
      <polygon
        points="18,8 26,12.5 26,23.5 18,28 10,23.5 10,12.5"
        fill="none"
        stroke="url(#hexGrad)"
        strokeWidth="0.75"
        opacity="0.5"
      />
      {/* GS text */}
      <text
        x="18" y="22"
        textAnchor="middle"
        fill="url(#hexGrad)"
        fontSize="10"
        fontWeight="700"
        fontFamily="Space Grotesk, Inter, sans-serif"
        letterSpacing="-0.5"
      >
        GS
      </text>
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = { ...expandedItems };
    let changed = false;
    navItems.forEach((item) => {
      if (!item.subItems) return;
      const shouldExpand = item.subItems.some((sub) => pathname.startsWith(sub.href));
      if (shouldExpand && !next[item.name]) {
        next[item.name] = true;
        changed = true;
      }
    });
    if (changed) setExpandedItems(next);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (name: string) =>
    setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <aside className="w-64 h-[calc(100vh-2rem)] fixed top-4 left-4 z-50 flex flex-col rounded-3xl overflow-hidden border border-zinc-200/70 dark:border-sky-500/12 bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl shadow-2xl shadow-zinc-300/30 dark:shadow-sky-500/5 transition-colors duration-300">

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

      {/* Logo */}
      <div className="p-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <HexLogo />
          <div>
            <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-slate-100 leading-none">
              GSM
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">PRO</span>
            </h1>
            <p className="text-[9px] font-mono font-medium text-zinc-400 dark:text-sky-500/60 tracking-widest uppercase mt-0.5">
              Mission Control
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-sky-500/15 to-transparent shrink-0" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const hasSubItems = !!item.subItems;
          const isExpanded = expandedItems[item.name];
          const isGroupActive =
            hasSubItems && item.subItems!.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + '/'));
          const isDirectActive = !hasSubItems && pathname === item.href;

          return (
            <div key={item.name}>
              {/* Top-level item */}
              {hasSubItems ? (
                <button
                  onClick={() => toggle(item.name)}
                  className={cn(
                    'w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none',
                    isGroupActive && !isExpanded
                      ? 'nav-pill-active'
                      : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800/60',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors duration-200',
                        isGroupActive || isExpanded
                          ? 'text-sky-500 dark:text-sky-400'
                          : 'text-zinc-400 dark:text-slate-500 group-hover:text-zinc-700 dark:group-hover:text-slate-300',
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-slate-500" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isDirectActive
                      ? 'nav-pill-active'
                      : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800/60',
                  )}
                >
                  {isDirectActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sky-500 dark:bg-sky-400 rounded-r-full shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                  )}
                  <item.icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isDirectActive
                        ? 'text-sky-500 dark:text-sky-400'
                        : 'text-zinc-400 dark:text-slate-500 group-hover:text-zinc-700 dark:group-hover:text-slate-300',
                    )}
                  />
                  {item.name}
                </Link>
              )}

              {/* Sub-items */}
              {hasSubItems && isExpanded && (
                <div className="mt-0.5 mb-1 ml-3 pl-3.5 border-l border-zinc-200 dark:border-sky-500/15 space-y-0.5">
                  {item.subItems!.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + '/');
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                          isSubActive
                            ? 'bg-sky-500/10 dark:bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20 dark:border-sky-500/25'
                            : 'text-zinc-500 dark:text-slate-500 hover:text-zinc-900 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800/50',
                        )}
                      >
                        <span>{sub.name}</span>
                        {sub.soon && (
                          <span className="flex items-center gap-0.5 text-[9px] font-semibold text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200/60 dark:border-violet-400/25 px-1.5 py-0.5 rounded-full shrink-0 ml-1">
                            <Sparkles className="w-2 h-2" />
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 shrink-0">
        <div className="mx-auto h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-sky-500/15 to-transparent mb-4" />
        <div className="p-3 rounded-2xl border border-zinc-200/70 dark:border-sky-500/12 bg-zinc-50 dark:bg-slate-900/60">
          <div className="flex items-center justify-between mb-1">
            <p className="font-mono text-[9px] font-medium text-zinc-400 dark:text-sky-500/60 tracking-widest uppercase">
              SISTEMA
            </p>
            <div className="flex items-center gap-1">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <Signal className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <p className="font-mono text-[9px] text-zinc-400 dark:text-slate-500">
            v2.4.1 · ALL NODES UP
          </p>
        </div>
      </div>
    </aside>
  );
}
