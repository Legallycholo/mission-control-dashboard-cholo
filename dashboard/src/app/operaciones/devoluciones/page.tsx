import { ComingSoon } from '@/components/ui/ComingSoon';
import { RotateCcw } from 'lucide-react';

export default function OperacionesDevolucionesPage() {
  return (
    <ComingSoon
      title="Devoluciones (RMA)"
      subtitle="Gestión de logística inversa — Operaciones"
      description="Panel de control de devoluciones que categoriza motivos, mide tiempos de ciclo inverso y cuantifica el impacto financiero de garantías y productos DOA por proveedor."
      icon={RotateCcw}
      accentColor="bg-gradient-to-br from-rose-600 to-red-700 border-rose-700/30"
      features={[
        {
          label: 'Pareto de Motivos de Retorno por Marca',
          description: 'Falla DOA, daño en transporte, arrepentimiento — categorizado por proveedor para exigir compensaciones.',
          area: 'Visualizacion',
        },
        {
          label: 'Tiempo de Ciclo de Logística Inversa',
          description: 'Días desde solicitud del cliente hasta ingreso a bodega y emisión de nota de crédito.',
          area: 'KPI',
        },
        {
          label: 'Interfaz de Inspección con Fotografías',
          description: 'Pantalla optimizada para técnico de bodega: documenta estado físico de la devolución.',
          area: 'UX/UI',
        },
        {
          label: 'Monitor del Embudo de Reembolsos',
          description: 'Reembolsos activos por etapa (Solicitado → Recibido → Aprobado → Procesado).',
          area: 'Visualizacion',
        },
        {
          label: 'Impacto Financiero RMA en P&L',
          description: 'Costo total de garantías y RMA descontado automáticamente del estado de resultados.',
          area: 'KPI',
        },
      ]}
    />
  );
}
