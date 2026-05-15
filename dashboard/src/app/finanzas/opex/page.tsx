import { ComingSoon } from '@/components/ui/ComingSoon';
import { Receipt } from 'lucide-react';

export default function FinanzasOpexPage() {
  return (
    <ComingSoon
      title="Gastos Fijos (OPEX)"
      subtitle="Control de costos operacionales — Finanzas"
      description="Panel de gestión de gastos fijos que distribuye nómina, arriendo y licencias sobre el volumen de ventas para calcular el margen neto real por unidad y categoría."
      icon={Receipt}
      accentColor="bg-gradient-to-br from-violet-600 to-purple-700 border-violet-700/30"
      features={[
        {
          label: 'Registro de Gastos Fijos Mensuales',
          description: 'Nómina, arriendo, licencias de software, servicios de courier fijos.',
          area: 'UX/UI',
        },
        {
          label: 'Prorrateo Automático por Ventas',
          description: 'Distribución proporcional de OPEX sobre el volumen de ventas para obtener costo por orden.',
          area: 'Backend',
        },
        {
          label: 'Evolución Histórica de Costos',
          description: 'Gráfico de líneas comparando OPEX mes a mes para detectar inflación de costos.',
          area: 'Visualizacion',
        },
        {
          label: 'Margen Neto por Categoría',
          description: 'Cruzar OPEX con ventas por categoría para identificar las líneas más rentables.',
          area: 'KPI',
        },
        {
          label: 'Proyección de Flujo de Caja',
          description: 'Contraste de ingresos líquidos vs cuentas por pagar a proveedores y plataformas.',
          area: 'Visualizacion',
        },
      ]}
    />
  );
}
