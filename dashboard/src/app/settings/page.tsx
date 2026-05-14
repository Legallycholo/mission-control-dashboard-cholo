'use client';

import { useRouter } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { auth } from '@/lib/firebase/client';

export default function SettingsPage() {
  const router = useRouter();
  const { user, role, loading } = useRole();

  const handleSignOut = async () => {
    try {
      if (auth) await firebaseSignOut(auth);
    } catch (error) {
      console.error('SettingsPage: signOut failed', error);
    }
    router.push('/login');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Preferencias</h1>
        <p className="text-zinc-600 text-sm mt-1">
          Tu perfil y rol detectado en el dashboard
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-100/80 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200">
          <User className="w-4 h-4 text-zinc-600" />
          <h2 className="text-sm font-semibold text-zinc-900">Perfil</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 uppercase tracking-wider">
              Nombre
            </label>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-100/80 border border-zinc-200">
              <User className="w-4 h-4 text-zinc-600 shrink-0" />
              <span className="text-sm text-zinc-900">
                {loading ? '—' : user?.displayName ?? '—'}
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 uppercase tracking-wider">
              Correo electrónico
            </label>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-100/80 border border-zinc-200">
              <Mail className="w-4 h-4 text-zinc-600 shrink-0" />
              <span className="text-sm text-zinc-900">
                {loading ? '—' : user?.email ?? '—'}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Tu nombre proviene de tu cuenta de Google. Para cambiar tu rol o
            acceso, contacta a un administrador.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-100/80 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200">
          <Shield className="w-4 h-4 text-zinc-600" />
          <h2 className="text-sm font-semibold text-zinc-900">Cuenta</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-100/80 border border-zinc-200 space-y-1">
            <p className="text-xs text-zinc-600 uppercase tracking-wider">Rol</p>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                role === 'admin'
                  ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  : 'bg-zinc-100/80 text-zinc-700 border border-zinc-200'
              }`}
            >
              {loading ? '—' : role ?? 'sin rol'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-zinc-100/80 border border-zinc-200 space-y-1">
            <p className="text-xs text-zinc-600 uppercase tracking-wider">
              Proveedor
            </p>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100/80 text-zinc-700 border border-zinc-200">
              Google
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => void handleSignOut()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
}
