#!/bin/bash
set -e

echo "Creating IP..."
gcloud compute addresses create dashboard-ip --global --project YOUR_GCP_PROJECT_ID

echo "Creating NEG..."
gcloud compute network-endpoint-groups create dashboard-neg --region=us-east1 --network-endpoint-type=serverless --cloud-run-service=dashboard-gsmpro-ui --project YOUR_GCP_PROJECT_ID

echo "Creating Backend Service..."
gcloud compute backend-services create dashboard-backend --global --project YOUR_GCP_PROJECT_ID

echo "Adding NEG to Backend Service..."
gcloud compute backend-services add-backend dashboard-backend --global --network-endpoint-group=dashboard-neg --network-endpoint-group-region=us-east1 --project YOUR_GCP_PROJECT_ID

echo "Enabling IAP..."
gcloud compute backend-services update dashboard-backend --global --iap=enabled,oauth2-client-id=283955209087-v2fdmfjb1rjpmgsen2jtopu9b5u12p33.apps.googleusercontent.com,oauth2-client-secret=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 --project YOUR_GCP_PROJECT_ID

echo "Creating URL Map..."
gcloud compute url-maps create dashboard-url-map --default-service dashboard-backend --project YOUR_GCP_PROJECT_ID

echo "Creating SSL Certificate..."
gcloud compute ssl-certificates create dashboard-ssl --domains=dashboard.gsmpro.com --global --project YOUR_GCP_PROJECT_ID

echo "Creating Target HTTPS Proxy..."
gcloud compute target-https-proxies create dashboard-https-proxy --ssl-certificates=dashboard-ssl --url-map=dashboard-url-map --project YOUR_GCP_PROJECT_ID

echo "Creating Forwarding Rule..."
gcloud compute forwarding-rules create dashboard-fw-rule --global --target-https-proxy=dashboard-https-proxy --ports=443 --address=dashboard-ip --project YOUR_GCP_PROJECT_ID

echo "Done!"
