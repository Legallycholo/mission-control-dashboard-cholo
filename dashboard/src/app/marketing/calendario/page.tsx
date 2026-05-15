import { ComingSoon } from '@/components/ui/ComingSoon';
import { CalendarDays } from 'lucide-react';

export default function MarketingCalendarioPage() {
  return (
    <ComingSoon
      title="Calendario Comercial"
      subtitle="Planificación de campañas — Marketing"
      description="Vista centralizada de fechas clave en Chile, vigencias de campañas activas y condiciones de ofertas para alinear a los equipos de Precios, Creatividad y Servicio al Cliente."
      icon={CalendarDays}
      accentColor="bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-700/30"
      features={[
        {
          label: 'Calendario de Fechas Clave Chile',
          description: 'CyberMonday, CyberDay, Día de la Madre, Fiestas Patrias, Black Friday — con alertas anticipadas.',
          area: 'UX/UI',
        },
        {
          label: 'Vigencias de Campañas Activas',
          description: 'Vista de campañas en curso con fecha de inicio, fin y presupuesto restante.',
          area: 'Visualizacion',
        },
        {
          label: 'Condiciones de Ofertas',
          description: 'Términos de descuentos activos: mínimo de compra, productos incluidos/excluidos.',
          area: 'UX/UI',
        },
        {
          label: 'Sincronización con Google Ads',
          description: 'Mostrar automáticamente las fechas de vuelo de campañas de Google Ads activas.',
          area: 'Backend',
        },
        {
          label: 'Alertas de Preparación',
          description: 'Notificación X días antes de fechas clave para preparar stock, creatividades y SAC.',
          area: 'Backend',
        },
        {
          label: 'Historial de Performance por Fecha Comercial',
          description: 'Comparar ventas del CyberDay 2025 vs 2026 para estimar presupuesto y metas.',
          area: 'Visualizacion',
        },
      ]}
      apiNote="La sincronización de fechas de campaña de Google Ads usa la API ya integrada. El calendario base puede iniciarse de forma manual sin APIs adicionales."
    />
  );
}
