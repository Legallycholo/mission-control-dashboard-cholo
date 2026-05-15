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
    <aside className="w-64 h-[calc(100vh-2rem)] fixed top-4 left-4 border border-zinc-200 bg-white/90 backdrop-blur-3xl shadow-2xl shadow-zinc-300/40 z-50 flex flex-col rounded-3xl overflow-hidden">
      {/* Logo */}
      <div className="p-6 shrink-0">
        <h1 className="text-xl font-bold tracking-tighter text-zinc-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-sm">GS</span>
          </div>
          GSM<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">PRO</span>
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors duration-200',
                        isGroupActive || isExpanded ? 'text-blue-600' : 'text-zinc-400 group-hover:text-zinc-700',
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isDirectActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50',
                  )}
                >
                  {isDirectActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                  )}
                  <item.icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isDirectActive ? 'text-blue-600' : 'text-zinc-400 group-hover:text-zinc-700',
                    )}
                  />
                  {item.name}
                </Link>
              )}

              {/* Sub-items */}
              {hasSubItems && isExpanded && (
                <div className="mt-0.5 mb-1 ml-3 pl-3.5 border-l border-zinc-200 space-y-0.5">
                  {item.subItems!.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + '/');
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                          isSubActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50',
                        )}
                      >
                        <span>{sub.name}</span>
                        {sub.soon && (
                          <span className="flex items-center gap-0.5 text-[9px] font-semibold text-violet-500 bg-violet-50 border border-violet-200/60 px-1.5 py-0.5 rounded-full shrink-0 ml-1">
                            <Sparkles className="w-2 h-2" />
                            Próximo
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
        <div className="p-3 rounded-2xl border border-zinc-200/70 bg-zinc-50 text-center">
          <p className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase">GSM Pro</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Mission Control v2</p>
        </div>
      </div>
    </aside>
  );
}
