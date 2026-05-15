# Hitos y Módulos — GSM Pro Mission Control Dashboard

Source: https://docs.google.com/spreadsheets/d/1MC35AIusWZG2jpPV-f5XNQsJxCXfybktv20yumgofUw/edit

`TRUE` = implemented / milestone reached. `FALSE` = not yet built.

---

## RESUMEN (Architecture & Infrastructure)

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Capas de Datos en BigQuery (Raw vs Marts) | Modelo de datos escalable: raw_layer + marts_layer | Arquitectura | TRUE |
| Resiliencia y Control de APIs (Exponential Backoff) | Reintentos automáticos para rate limits (Crisp, Klaviyo, Yotpo) | Arquitectura | TRUE |
| Gestión de Entornos y Zero-Trust | Sin credenciales hardcodeadas; forzar uso de env vars (GCP_PROJECT_ID) | Seguridad | TRUE |
| Estandarización del Stack Tecnológico | STACK_TECHNOLOGICO.md — reglas Cloud-Native para prevenir deuda técnica | Seguridad | TRUE |
| Scripts Estructurales GA4 | Pipelines autónomos: sync-ga4.js, list-ga4-properties.js | Backend | TRUE |

---

## VENTAS

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Filtros Temporales Básico | Selector de rango de fechas agrupado por mes | UX/UI | TRUE |
| Filtros Temporales Avanzados | Selector de rango de fechas personalizado | UX/UI | TRUE |
| Exportación de Datos (CSV) | Botón "Exportar CSV" | UX/UI | TRUE |
| Exportación de Datos (Multi-formato) | Google Sheets, CSV, Excel, txt, PDF | UX/UI | FALSE |
| Control de Sincronización | Botón "Sincronizar Manual" | UX/UI | TRUE |
| Badge de Sincronización | Indicador de última sincronización | UX/UI | FALSE ⚠️ (implementado en Header pero no marcado) |
| Buscador Global | Barra superior para ubicar métricas, órdenes, productos | UX/UI | TRUE |
| Buscador Global Avanzado | Filtros complementarios bajo más de un criterio | UX/UI | FALSE |
| Navegación Escalable | Menú lateral estructurado | UX/UI | TRUE |
| Flujo de Caja vs. Intención | Separación "Ventas Pagadas" vs "Ventas Totales" | KPI | TRUE |
| Ticket Promedio (AOV) | Venta total por pedido en promedio | KPI | TRUE |
| Velocidad de Venta | Promedio Venta Diaria | KPI | TRUE |
| Embudo de Cobro | Órdenes Cobradas vs Órdenes Totales | KPI | TRUE |
| Control de Márgenes Inicial | Total Descuentos | KPI | TRUE |
| Tendencia Histórica | Gráfico de líneas temporal diario | Visualizacion | TRUE |
| Salud de Cartera | Donut chart de estados de pago | Visualizacion | TRUE |
| Barra de Metas (Pacing) | Barra de progreso vs objetivo mensual | Visualizacion | TRUE |
| Proyección de Cierre (Forecast/Run-rate) | Cálculo automático: "cerraremos el periodo con $X" | Visualizacion | FALSE ⚠️ (implementado en PacingBar como runRate) |
| Variación de Periodos (MoM / YoY) | Indicador porcentual (flecha verde/roja) en tarjetas | UX/UI | TRUE |
| Desglose de Ventas por Categoría | Ventas separadas por categoría de producto | Visualizacion | TRUE |
| Indicador de Participación | % que representa cada categoría de la venta total | UX/UI | FALSE |
| Ventas Nuevos vs. Recurrentes | Gráfico de retención | Visualizacion | TRUE |
| Ventas por Método de Pago | Desglose por forma de pago | Visualizacion | TRUE |
| Top Categorías | Ranking de categorías por volumen e ingresos | KPI | FALSE ⚠️ (tabla implementada en /ventas/kpis y página completa /ventas/categorias) |
| Análisis de Pareto | Óptimo de Pareto en ventas | Visualizacion | FALSE |
| Índice de Explotación de Ventas | Capacidad de transformar potencial de mercado en liquidez | KPI | FALSE |

---

## INTELIGENCIA DE MERCADO

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Monitoreo Autónomo con IA | Vertex AI para escanear/categorizar nuevos productos del mercado | Visualizacion | TRUE |
| Clasificación Visual | Distribución de categorías de hardware | UX/UI | TRUE |
| Estimación de Demanda Real | Google Ads MSV como proxy para Market Size y Market Share | KPI | TRUE |
| Monitor de Pricing Relativo | Índice de Competitividad y Diferencia Promedio vs rivales | Visualizacion | TRUE |
| Detección de Quiebres (Sin Stock Competidores) | Monitoreo cuando competencia se queda sin stock | KPI | TRUE |
| Categorización Temprana | Sistema "Breakouts / En Alza / En Riesgo" como radar de interés | KPI | TRUE |
| Separación Táctica | Toggles Pagado vs Orgánico para medir presupuesto vs posicionamiento | Visualizacion | TRUE |
| Frecuencia Dinámica | Escaneo programado 3 veces al día en horarios pico | Backend | TRUE |
| Sugerencias de Ajuste de Precio (Repricing) | Cruzar Competitividad con márgenes internos | Visualizacion | FALSE |
| Cruce de Tendencia vs. Inventario Interno | Conectar Tendencias con stock real | Visualizacion | FALSE |
| Detección de Brechas de Catálogo | Cruzar búsquedas de mercado vs catálogo propio | KPI | FALSE |
| Scraping de Reviews/Estrellas | Calificación promedio del producto | KPI | FALSE |
| Identidad Competitiva (Share of Voice) | Cuántos competidores hay, ranking de rivales | Visualizacion | FALSE |
| Salud de Merchant Center | % catálogo rechazado por Google (falta GTIN/EAN, políticas) | KPI | FALSE |

---

## MARKETING

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Auditoría de Colecciones | Productos activos no asignados a colecciones, afectando visibilidad | KPI | FALSE |
| Monitor de Reseñas | Panel centralizado de nuevas reseñas para filtrado y respuesta | Visualizacion | TRUE ⚠️ (marcado TRUE pero no encontrado en el código) |
| Calendario Comercial Integrado | Fechas clave Chile, vigencias campañas, condiciones de ofertas | Visualizacion | FALSE |
| Rendimiento de Email & Push | Métricas de receptividad (aperturas, clics), leads segmentados | Visualizacion | TRUE ⚠️ (Klaviyo implementado en /marketing pero página no accesible via sidebar) |

---

## TRÁFICO

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Adquisición Global | Sesiones Totales, Visitantes Únicos, Páginas Vistas, CVR | KPI | TRUE |
| Evolución de Tráfico | Gráfico Sesiones vs Visitantes Diarios | Visualizacion | TRUE |
| Calidad de Tráfico | Bounce Rate, Páginas por Sesión | KPI | TRUE |
| Distribución por Canal (Source/Medium) | Tráfico por fuente: Orgánico, Pagado, Directo, Email | KPI | FALSE |
| Comportamiento por Dispositivo | Móvil vs Desktop (tráfico y conversiones) | KPI | FALSE |
| Embudo de E-commerce (Funnel) | Visitas → Carrito → Checkout → Compra | KPI | FALSE |
| Retención (Nuevos vs Recurrentes) | % clientes nuevos vs que regresan | KPI | FALSE |
| Rendimiento Global SEO | Clics, Impresiones, CTR Promedio, Posición Promedio | KPI | TRUE |
| Top Consultas y Landings | Rendimiento de keywords y URLs de aterrizaje | Visualizacion | TRUE |
| Segmentación Marca vs No-Marca | "gsmpro" vs genéricas ("comprar asus rog") | Visualizacion | FALSE |
| Visibilidad de "Rich Snippets" | Clics/impresiones de Merchant Listings en Google | KPI | FALSE |
| KPIs Core Financieros | Gasto, Impresiones, Clics, CPC, Conversiones, Costo/Conv, ROAS | KPI | TRUE |
| Tendencias Diarias de Performance | Gasto vs Clics y Conversiones diarias | Visualizacion | TRUE |
| Desglose por Campaña | Rendimiento por campaña activa | Visualizacion | TRUE |
| Rendimiento a nivel Producto (SKU) | Inversión y ROAS por ID de Producto en Google Shopping/PMax | Visualizacion | TRUE |
| Términos de Búsqueda Reales | Consultas exactas por las que Google cobra clics | KPI | FALSE ⚠️ (implementado en /trafico/terminos-busqueda pero marcado FALSE) |
| Estado del Merchant Center | Alertas productos rechazados o errores de feed | Backend | FALSE |
| Integración y Arquitectura (Meta Ads) | Conexión API BigQuery para datos de Meta Ads | Visualizacion | FALSE |
| KPIs Core de Social Ads | Inversión, Alcance, CTR, CPA, ROAS en Facebook/Instagram | KPI | FALSE |
| CAC Blended | Gasto total marketing / Nuevos clientes generados | KPI | FALSE |
| POAS (Profit On Ad Spend) | ROAS cruzado con COGS para rentabilidad sobre margen | KPI | TRUE |

---

## SERVICIO AL CLIENTE

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Métricas Base Mensajería (Crisp) | Total Conversaciones, Resueltas, CSAT Promedio | Visualizacion | TRUE |
| Análisis de Sentimiento (NLP) | Inteligencia Emocional diaria (Negativo, Neutral, Positivo) | Visualizacion | TRUE |
| Tiempos de Respuesta (TTFR) | Promedios de respuesta por operador | Visualizacion | TRUE |
| Tabla de Rendimiento por Operador | Tickets atendidos, resueltos, tiempo rpta, CSAT en Crisp | UX/UI | TRUE |
| Métricas Base Llamadas (RingCentral) | Volumen Total, Entrantes, Salientes, Tasa de Respuesta | KPI | TRUE |
| Tendencia Histórica de Llamadas | Llamadas contestadas, perdidas y totales diarias | Visualizacion | TRUE |
| Mapa de Calor Horario (Volumen) | Distribución por hora para picos de demanda telefónica | Visualizacion | TRUE |
| Tabla de Rendimiento por Agente | Llamadas contestadas/perdidas, tasa respuesta, duración | UX/UI | TRUE |
| Navegación e Interfaz Transversal | Selector de fechas, buscador, exportar CSV, sincronizar | UX/UI | TRUE |
| Resolución de Bug: Tiempos Negativos | Corregir TTFR con valores negativos | Backend | TRUE |
| Resolución de Bug: Datos de Resolución | Ajustar Crisp Webhook: Resueltos=0 y CSAT=N/A | Backend | TRUE |
| Tipificación de Tickets (Categorías) | Motivos: WISMO, Garantías/RMA, Soporte Técnico, Ventas | Visualizacion | FALSE |
| Resolución al Primer Contacto (FCR) | % casos resueltos en 1er contacto sin escalar | KPI | FALSE |
| Gestión de Garantías (RMA) | Tickets que derivan en retorno o revisión técnica | KPI | FALSE |
| Atribución de Ventas en GA4 | Conectar chat con GA4 para "Ventas Asistidas" | Backend | FALSE |
| Monitoreo de Reputación Google | Rating promedio en Google Reviews | Visualizacion | FALSE |
| Alertas Google Merchant Center | Alertas sobre productos suspendidos o errores de feed | Backend | FALSE |
| Tasa de Deflexión (Bots/IA) | Consultas resueltas por bots sin intervención humana | KPI | FALSE |
| Alertas Visuales de SLA Breach | Formato rojo cuando operador supera tiempo máximo | UX/UI | FALSE |
| Tiempo Medio de Resolución (ART) | Tiempo desde apertura hasta cierre definitivo del ticket | KPI | FALSE |
| Monitor del Embudo de Reembolsos | Reembolsos activos por etapa y completados | Visualizacion | FALSE |
| Visibilidad Logística Macro (WISMO) | Pedidos por estado de envío (preparación, tránsito, retrasado) | Visualizacion | FALSE |
| Tasa de Duplicidad Omnicanal | Casos redundantes del mismo usuario en distintos canales | KPI | FALSE |
| Monitor de Quiebre de Stock | Alertas de stock real conectadas al inventario | Backend | FALSE |
| Recuperación de Carritos (Soporte) | Carritos abandonados gestionados por equipo + ventas rescatadas | KPI | FALSE |
| Volumen de Validaciones KYC | Pedidos retenidos por validación de identidad | Visualizacion | FALSE |
| Tasa de Redención de Cupones | Cupones de disculpa emitidos por soporte que se usan | KPI | FALSE |
| Tickets por Tipo de Cliente (LTV) | Segmentación por clientes nuevos vs recurrentes | Visualizacion | FALSE |
| Integración Soporte Omnicanal | Unificar chats (Crisp) y llamadas (RingCentral) por empleado | Backend | FALSE |

---

## EQUIPO

| Necesidad | Descripción | Area | Hito |
|---|---|---|---|
| Extracción de Shopify Audit Logs | Ingesta de acciones de empleados en Shopify | Backend | TRUE |
| Total de Volumen de Actividad | Recuento total de eventos atribuidos al personal | KPI | TRUE |
| Gráfico de Productividad General | Volumen de trabajo operativo por integrante | Visualizacion | TRUE |
| Ranking de Top Acciones | Acciones más frecuentes (published, create, status_changed) | Visualizacion | TRUE |
| Filtrado por Tipo de Acción | Menú desplegable para aislar eventos específicos | UX/UI | TRUE |
| Historial Cronológico | Tabla de auditoría: Fecha, Empleado, Acción, Recurso, ID | Visualizacion | TRUE |
| Sincronización a Demanda | Botón de actualización manual de logs | Backend | TRUE |
| Filtro de Rango de Fechas | Selector temporal (Hoy, Semana, Mes) | UX/UI | TRUE |
| Paginación en Tabla de Registros | Controles de navegación en historial | UX/UI | TRUE |
| Drill-down por Perfil de Asesor | Clic en usuario filtra todo el dashboard por sus métricas | UX/UI | TRUE |
| Tendencia Operativa en el Tiempo | Time-series de carga de trabajo por días de la semana | Visualizacion | TRUE |
| Atribución de Ventas Asistidas ($) | Cruzar interacciones SAC con cierres de compra por asesor | KPI | FALSE |
| SLA y Tiempos de Respuesta | Tiempo de primera respuesta y resolución de tickets por agente | KPI | FALSE |
| Eficiencia Logística (Fulfillment) | Tiempo promedio de bodega para procesar/despachar una orden | KPI | FALSE |
| Control de Calidad y Devoluciones | Volumen de eventos perjudiciales (refund_created, cancelled) por agente | KPI | FALSE |
| Integración de Atribución GA4 | Enviar eventos a GA4 con UTM de asesores | Backend | FALSE |
| Exportación a Google Sheets | Exportar tabla/reporte directamente a Google Sheets | UX/UI | FALSE |
| Single Sign-On (Google Workspace) | Autenticación y RBAC con cuentas corporativas Google | Backend | TRUE |

---

## FINANZAS — Todo pendiente (FALSE)

| Necesidad | Descripción | Area |
|---|---|---|
| Cálculo Automático de Rentabilidad Neta (P&L) | Estado de resultados: Ventas - COGS - comisiones - envíos - Ads - fijos | Backend |
| Prorrateo e Impacto de Gastos Fijos (OPEX) | Distribuir costos fijos sobre volumen de ventas | Backend |
| Cálculo de Punto de Equilibrio (Break-even) | Meta de ventas diaria/mensual para cubrir costos fijos | KPI |
| Gráfico de Cascada (Waterfall) del P&L | Ingresos brutos → centros de costo → ganancia neta | Visualizacion |
| Cálculo de POAS (Profit On Ad Spend) | Google Ads vía BigQuery × margen bruto = verdadera rentabilidad | KPI |
| Conciliación de Pasarelas de Pago | Comisiones Webpay, MercadoPago, VentiPay deducidas automáticamente | Backend |
| Impacto Financiero de Garantías y RMA | P&L descontando pérdidas por garantías y logística inversa | KPI |
| Impacto de Variación Cambiaria (USD/CLP) | Efecto del dólar sobre COGS del stock importado | Backend |
| Provisión por Obsolescencia de Inventario | Alerta de depreciación de productos >90 días en bodega | KPI |
| Proyección de Flujo de Caja (Cashflow) | Ingresos líquidos vs cuentas por pagar (proveedores, aduanas) | Visualizacion |
| Simulador de Escenarios (What-If) | Deslizadores para proyectar impacto de CyberDay, CPC, costos fijos | UX/UI |

---

## COMPRAS — Todo pendiente (FALSE)

| Necesidad | Descripción | Area |
|---|---|---|
| Scorecard de Rendimiento de Proveedores | OTIF (On Time In Full) y exactitud de cantidades enviadas | Visualizacion |
| Monitor de Impacto Cambiario (USD/CLP) | O.C. abiertas × tipo de cambio diario = riesgo financiero | KPI |
| Análisis de Variación de Precio de Compra (PPV) | Evolución histórica del costo de adquisición por dispositivo | Visualizacion |
| Trazabilidad Visual del Pipeline de Importación | Kanban: En Producción → Tránsito → Aduana Chile → Recepción | UX/UI |
| KPI: Tasa de Defectos (RMA) por Proveedor | Reclamos garantías DOA vinculados a proveedor de origen | KPI |
| Panel de Concentración de Riesgo de Abastecimiento | Treemap de dependencia en un solo proveedor/fábrica | Visualizacion |
| Simulador de Rentabilidad por Volumen (MOQ) | Simulación de costos si no se cumplen mínimos del proveedor | UX/UI |

---

## OPERACIONES — Todo pendiente (FALSE)

| Necesidad | Descripción | Area |
|---|---|---|
| Sincronización OOS con Google Merchant Center | Detectar quiebres de stock y pausar productos en Google Ads | Backend |
| Matriz de Envejecimiento (Aging Stock) | Productos >60-90 días sin rotación para liquidación anticipada | Visualizacion |
| Días de Cobertura de Inventario (Safety Stock) | Stock actual / Run Rate = días antes de quiebre | KPI |
| Mapa de Calor de Incidencias Logísticas | Google Maps API para regiones/comunas con retrasos de courier | Visualizacion |
| Tasa de Pedido Perfecto (Perfect Order Rate) | % órdenes despachadas a tiempo, correctas y sin daño | KPI |
| Pareto de Motivos de Retorno (RMA) por Marca | Causas de retorno por proveedor (DOA, daño transporte, arrepentimiento) | Visualizacion |
| Interfaz de Inspección de Logística Inversa | Pantalla para técnico de bodega con fotos del estado de devolución | UX/UI |
| Tiempo de Ciclo de Logística Inversa | Días desde solicitud hasta ingreso a bodega y nota de crédito | KPI |

---

## CLIENTES — Todo pendiente (FALSE)

| Necesidad | Descripción | Area |
|---|---|---|
| Predicción de Fuga (Churn) por Ciclo Tecnológico | GA4/BigQuery ML para alertar clientes >18 meses sin recomprar | Backend |
| Rentabilidad de Adquisición (CAC vs LTV) | Google Ads cost vs valor histórico de compra del cliente | KPI |
| Perfil 360° del Cliente (Vista Única) | Búsqueda por email/RUT: historial, LTV, ecosistema, carritos, tickets | UX/UI |
| Tasa de Devoluciones y Garantías (RMA) por Cliente | Usuarios con alta frecuencia de devoluciones/reclamos | KPI |
| Afinidad por Ecosistema y Marca (Device Affinity) | Auto-etiquetado: "Apple Lover", "Android Fan", "Gamer" | Backend |

---

## NOTAS IMPORTANTES

Items marcados `⚠️` tienen discrepancias entre el spreadsheet y el código real:
- **Badge de Sincronización**: Marcado FALSE en spreadsheet, IMPLEMENTADO en `Header.tsx`
- **Proyección de Cierre (Run-rate)**: Marcado FALSE, IMPLEMENTADO dentro del PacingBar component en `/ventas/kpis`
- **Top Categorías**: Marcado FALSE como KPI card, pero tabla y página `/ventas/categorias` EXISTEN
- **Términos de Búsqueda Reales**: Marcado FALSE, pero `/trafico/terminos-busqueda` está COMPLETAMENTE implementado
- **Monitor de Reseñas**: Marcado TRUE en spreadsheet, NO encontrado en ningún archivo del repo
