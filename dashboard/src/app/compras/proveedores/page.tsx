import { ComingSoon } from '@/components/ui/ComingSoon';
import { Building2 } from 'lucide-react';

export default function ComprasProveedoresPage() {
  return (
    <ComingSoon
      title="Proveedores"
      subtitle="Scorecard y gestión de abastecimiento — Compras"
      description="Panel de evaluación de proveedores basado en OTIF, tasa de defectos DOA y concentración de riesgo. Detecta dependencia excesiva de un solo fabricante antes de que afecte las ventas."
      icon={Building2}
      accentColor="bg-gradient-to-br from-rose-500 to-pink-600 border-rose-600/30"
      features={[
        {
          label: 'Scorecard de Rendimiento (OTIF)',
          description: 'On Time In Full: cumplimiento de entregas y exactitud de cantidades enviadas por proveedor.',
          area: 'Visualizacion',
        },
        {
          label: 'Tasa de Defectos RMA por Proveedor',
          description: 'Reclamos por garantías y productos DOA vinculados directamente a su fabricante de origen.',
          area: 'KPI',
        },
        {
          label: 'Panel de Concentración de Riesgo',
          description: 'Treemap que alerta si un porcentaje crítico del inventario depende de un solo proveedor.',
          area: 'Visualizacion',
        },
        {
          label: 'Historial de Precios por Proveedor',
          description: 'Evolución del precio de compra por SKU/marca para detectar inflación y renegociar.',
          area: 'Visualizacion',
        },
        {
          label: 'Comparador de Cotizaciones',
          description: 'Tabla side-by-side de precios, plazos y condiciones entre proveedores alternativos.',
          area: 'UX/UI',
        },
      ]}
    />
  );
}
