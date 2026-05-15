import { ComingSoon } from '@/components/ui/ComingSoon';
import { UserCircle } from 'lucide-react';

export default function ClientesPerfilPage() {
  return (
    <ComingSoon
      title="Perfil 360° del Cliente"
      subtitle="Vista única y unificada — Clientes"
      description="Buscador por email o RUT que centraliza en una sola pantalla el historial de pedidos, LTV acumulado, ecosistema tecnológico preferido, carritos abandonados y tickets de soporte."
      icon={UserCircle}
      accentColor="bg-gradient-to-br from-sky-600 to-blue-700 border-sky-700/30"
      features={[
        {
          label: 'Buscador por Email o RUT',
          description: 'Búsqueda instantánea que une datos de Shopify, Crisp y Klaviyo en una sola vista.',
          area: 'UX/UI',
        },
        {
          label: 'Historial Completo de Pedidos',
          description: 'Todos los pedidos con estado, monto, productos y método de pago.',
          area: 'Visualizacion',
        },
        {
          label: 'LTV Acumulado y Proyectado',
          description: 'Valor histórico + proyección de siguiente compra basada en ciclo de vida del producto.',
          area: 'KPI',
        },
        {
          label: 'Tickets de Soporte Vinculados',
          description: 'Historial de conversaciones en Crisp y llamadas en RingCentral del mismo cliente.',
          area: 'Visualizacion',
        },
        {
          label: 'Carritos Abandonados',
          description: 'Carritos no completados con valor estimado y emails de recuperación enviados.',
          area: 'KPI',
        },
        {
          label: 'Perfil de Riesgo',
          description: 'Indicador de frecuencia de devoluciones y alertas de posible fraude.',
          area: 'Backend',
        },
      ]}
    />
  );
}
