import { ComingSoon } from '@/components/ui/ComingSoon';
import { Boxes } from 'lucide-react';

export default function OperacionesInventarioPage() {
  return (
    <ComingSoon
      title="Inventario y Stock"
      subtitle="Control dinámico de existencias — Operaciones"
      description="Panel predictivo de inventario que cruza el stock físico con la velocidad de venta (Run Rate) para alertar quiebres antes de que ocurran y priorizar reposición de Top Ventas."
      icon={Boxes}
      accentColor="bg-gradient-to-br from-teal-600 to-green-700 border-teal-700/30"
      features={[
        {
          label: 'Días de Cobertura (Safety Stock)',
          description: 'Stock actual / Run Rate histórico = días antes del quiebre por SKU.',
          area: 'KPI',
        },
        {
          label: 'Matriz de Envejecimiento (Aging Stock)',
          description: 'Productos con >60 o >90 días sin rotación para campañas de liquidación anticipada.',
          area: 'Visualizacion',
        },
        {
          label: 'Sincronización OOS con Google Merchant Center',
          description: 'Detectar quiebre y pausar automáticamente el producto en Google Shopping/Ads.',
          area: 'Backend',
        },
        {
          label: 'Provisión por Obsolescencia',
          description: 'Alerta de depreciación de smartphones/dispositivos inmovilizados >90 días.',
          area: 'KPI',
        },
        {
          label: 'Mapa de Calor de Rotación por Categoría',
          description: 'Visualización de cuáles categorías rotan más rápido para optimizar el capital de trabajo.',
          area: 'Visualizacion',
        },
        {
          label: 'Alertas Predictivas de Reposición',
          description: 'Notificación automática cuando un Top Seller queda a <X días de cobertura.',
          area: 'Backend',
        },
      ]}
      apiNote="Requiere Merchant Center ID y Content API habilitada en GCP para la sincronización automática de out-of-stock con Google Shopping."
    />
  );
}
