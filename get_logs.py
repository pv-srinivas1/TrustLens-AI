"""TrustLens Technologies - Fetch Render Deployment Logs."""
import os
import requests

RENDER_API_KEY = os.getenv("RENDER_API_KEY", "your-render-api-key")
headers = {
    "Authorization": f"Bearer {RENDER_API_KEY}",
    "Accept": "application/json"
}

service_id = "srv-db4be5ijnfac73arqdfg"
resp = requests.get(f"https://api.render.com/v1/services/{service_id}/deploys", headers=headers)
deploys = resp.json()

if deploys:
    deploy_id = deploys[0]['deploy']['id']
    log_resp = requests.get(f"https://api.render.com/v1/services/{service_id}/deploys/{deploy_id}/logs", headers=headers)
    print("Logs:")
    print(log_resp.text)
else:
    print("No deploys found")
