const { BigQuery } = require('@google-cloud/bigquery');
const bq = new BigQuery({ projectId: process.env.GCP_PROJECT_ID || 'YOUR_GCP_PROJECT_ID' });

async function run() {
  try {
    const [rows] = await bq.query(`
      SELECT 
        IFNULL(s.first_name, a.staff_id) as empleado,
        a.action as accion,
        COUNT(*) as cantidad_eventos
      FROM \`YOUR_GCP_PROJECT_ID.raw_layer.shopify_audit_log\` a
      LEFT JOIN \`YOUR_GCP_PROJECT_ID.raw_layer.shopify_staff\` s 
        ON CAST(a.staff_id AS STRING) = CAST(s.staff_id AS STRING)
      GROUP BY empleado, accion
      ORDER BY empleado, cantidad_eventos DESC
    `);
    
    console.log("=== REPORTE ESTRUCTURAL DE ACTIVIDADES ===");
    console.log(console.table(rows));
    
  } catch (e) {
    console.error(e);
  }
}
run();
