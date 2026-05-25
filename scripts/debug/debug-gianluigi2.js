const { BigQuery } = require('@google-cloud/bigquery');
const bq = new BigQuery({ projectId: process.env.GCP_PROJECT_ID || 'YOUR_GCP_PROJECT_ID' });

async function run() {
  try {
    const [rows] = await bq.query(`
      SELECT staff_id, first_name, last_name, email
      FROM \`YOUR_GCP_PROJECT_ID.raw_layer.shopify_staff\`
      WHERE LOWER(first_name) LIKE '%gianl%' OR LOWER(last_name) LIKE '%gianl%'
    `);
    console.log("Staff encontrado:");
    console.log(rows);
  } catch (e) {
    console.error(e);
  }
}
run();
