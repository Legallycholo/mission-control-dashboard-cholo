import { ComingSoon } from '@/components/ui/ComingSoon';
import { Ship } from 'lucide-react';

export default function ComprasPipelinePage() {
  return (
    <ComingSoon
      title="Pipeline de Importación"
      subtitle="Trazabilidad logística de O.C. — Compras"
      description="Vista Kanban interactiva que muestra el estado logístico exacto de cada orden de compra internacional, desde producción en fábrica hasta recepción en bodega."
      icon={Ship}
      accentColor="bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-700/30"
      features={[
        {
          label: 'Vista Kanban por Etapa Logística',
          description: 'En Producción → Tránsito → Puerto → Aduana → En Bodega → Disponible.',
          area: 'UX/UI',
        },
        {
          label: 'Timeline de Cada O.C.',
          description: 'Línea de tiempo visual con fechas estimadas vs reales por etapa.',
          area: 'Visualizacion',
        },
        {
          label: 'Alertas de Retraso',
          description: 'Notificación automática cuando una O.C. supera la fecha estimada de cada etapa.',
          area: 'Backend',
        },
        {
          label: 'Integración con Tracking de Courier',
          description: 'Conexión con APIs de DHL, FedEx o agentes de carga para actualizar el estado automáticamente.',
          area: 'Backend',
        },
      ]}
      apiNote="Requiere integración con couriers internacionales (DHL/FedEx) o agente de carga para tracking automático. Puede iniciarse con actualización manual."
    />
  );
}
