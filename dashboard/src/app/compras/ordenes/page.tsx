import { ComingSoon } from '@/components/ui/ComingSoon';
import { ClipboardList } from 'lucide-react';

export default function ComprasOrdenesPage() {
  return (
    <ComingSoon
      title="Órdenes de Compra"
      subtitle="Gestión de pedidos a proveedores — Compras"
      description="Panel de creación, seguimiento y trazabilidad de órdenes de compra internacionales, con alertas de impacto cambiario y estado logístico en tiempo real."
      icon={ClipboardList}
      accentColor="bg-gradient-to-br from-amber-500 to-orange-600 border-amber-600/30"
      features={[
        {
          label: 'Trazabilidad del Pipeline de Importación',
          description: 'Kanban: En Producción → Tránsito Marítimo/Aéreo → Aduana Chile → Recepción.',
          area: 'UX/UI',
        },
        {
          label: 'Monitor de Impacto Cambiario (USD/CLP)',
          description: 'O.C. abiertas × tipo de cambio diario = variación del costo real y riesgo financiero.',
          area: 'KPI',
        },
        {
          label: 'Análisis de Variación de Precio de Compra (PPV)',
          description: 'Evolución histórica del costo de adquisición por dispositivo para renegociar.',
          area: 'Visualizacion',
        },
        {
          label: 'Simulador de Rentabilidad por Volumen (MOQ)',
          description: 'Simulación de costos si no se cumplen los mínimos del proveedor.',
          area: 'UX/UI',
        },
        {
          label: 'Alertas de Vencimiento y Pago',
          description: 'Notificaciones de fechas de pago a distribuidores y plazos de despacho.',
          area: 'Backend',
        },
      ]}
      apiNote="Requiere integración con sistema de tipo de cambio diario (API del Banco Central de Chile) para el monitor cambiario automático."
    />
  );
}
