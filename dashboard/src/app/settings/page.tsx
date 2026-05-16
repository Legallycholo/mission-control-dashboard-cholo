'use client';

import { useState } from 'react';
import { UserCircle, Bell, Plug, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = 'perfil' | 'notificaciones' | 'integraciones' | 'apariencia';

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Perfil', icon: UserCircle },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'integraciones', label: 'Integraciones', icon: Plug },
  { id: 'apariencia', label: 'Apariencia', icon: Palette },
];

const notificationItems = [
  { label: 'Nuevas órdenes', enabled: true },
  { label: 'Alertas de stock', enabled: true },
  { label: 'Reportes diarios', enabled: true },
  { label: 'Errores de sincronización', enabled: true },
  { label: 'Newsletter interno', enabled: false },
];

const integrations = [
  { name: 'Shopify', status: 'connected', detail: 'Conectado · Tienda: gsmpro.cl' },
  { name: 'Google Analytics', status: 'connected', detail: 'Conectado' },
  { name: 'Search Console', status: 'connected', detail: 'Conectado' },
  { name: 'Google Ads', status: 'connected', detail: 'Conectado' },
  { name: 'Crisp CRM', status: 'connected', detail: 'Conectado' },
  { name: 'Klaviyo', status: 'none', detail: 'No configurado' },
  { name: 'RingCentral', status: 'connected', detail: 'Conectado' },
  { name: 'Vertex AI', status: 'pending', detail: 'Pendiente de credenciales' },
];

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn('inline-block w-2 h-2 rounded-full shrink-0 mt-0.5', {
        'bg-emerald-500': status === 'connected',
        'bg-zinc-400': status === 'none',
        'bg-amber-400': status === 'pending',
      })}
    />
  );
}

function PerfilSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Perfil</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Información de tu cuenta</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl tracking-tight">GS</span>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-800">Foto de perfil</p>
          <button
            disabled
            className="mt-1 text-xs text-zinc-400 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg cursor-not-allowed opacity-50"
          >
            Cambiar foto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: 'Nombre', value: 'GSM PRO Admin' },
          { label: 'Email', value: 'admin@gsmpro.cl' },
          { label: 'Rol', value: 'Administrador' },
          { label: 'Empresa', value: 'GSM PRO Chile' },
        ].map((field) => (
          <div key={field.label} className="space-y-1.5">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{field.label}</p>
            <div className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800">
              {field.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl opacity-50 cursor-not-allowed"
        >
          Guardar cambios
        </button>
        <p className="text-xs text-zinc-400">Edición de perfil disponible próximamente.</p>
      </div>
    </div>
  );
}

function NotificacionesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Notificaciones</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Preferencias de alertas del sistema</p>
      </div>

      <div className="space-y-3">
        {notificationItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-200"
          >
            <span className="text-sm font-medium text-zinc-800">{item.label}</span>
            <div
              className={cn(
                'relative flex items-center w-10 h-5 rounded-full transition-colors',
                item.enabled ? 'bg-emerald-500' : 'bg-zinc-300'
              )}
            >
              <span
                className={cn(
                  'absolute w-3.5 h-3.5 bg-white rounded-full shadow transition-transform',
                  item.enabled ? 'translate-x-5' : 'translate-x-1'
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegracionesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Integraciones</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Estado de las fuentes de datos conectadas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200"
          >
            <div className="flex items-center gap-2">
              <StatusDot status={item.status} />
              <span className="text-sm font-semibold text-zinc-800">{item.name}</span>
            </div>
            <p
              className={cn('text-xs', {
                'text-emerald-600': item.status === 'connected',
                'text-zinc-400': item.status === 'none',
                'text-amber-600': item.status === 'pending',
              })}
            >
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AparienciaSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Apariencia</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Personalización visual del dashboard</p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Tema</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-blue-500 bg-white cursor-default">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <span className="text-sm font-medium text-zinc-800">Light</span>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed">
              <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
              <span className="text-sm font-medium text-zinc-400">Dark</span>
              <span className="text-[10px] bg-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded-md">Próximo</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Idioma</p>
          <div className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 w-fit">
            Español (Chile)
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Zona horaria</p>
          <div className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 w-fit">
            America/Santiago
          </div>
        </div>

        <p className="text-xs text-zinc-400">Tema oscuro disponible próximamente.</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>('perfil');

  const sectionMap: Record<Section, React.ReactNode> = {
    perfil: <PerfilSection />,
    notificaciones: <NotificacionesSection />,
    integraciones: <IntegracionesSection />,
    apariencia: <AparienciaSection />,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Configuración</h1>
        <p className="text-zinc-500 mt-1 text-sm">Administra tu perfil, notificaciones e integraciones</p>
      </div>

      <div className="flex gap-6 items-start">
        <nav className="w-48 shrink-0 sticky top-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                    active === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6 min-h-[420px]">
          {sectionMap[active]}
        </div>
      </div>
    </div>
  );
}
