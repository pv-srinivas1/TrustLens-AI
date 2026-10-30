import os
import requests

RENDER_API_KEY = os.getenv("RENDER_API_KEY", "your-render-api-key")
headers = {
    "Authorization": f"Bearer {RENDER_API_KEY}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

service_id = "srv-db4be5ijnfac73arqdfg"

payload = {
    "serviceDetails": {
        "envSpecificDetails": {
            "dockerCommand": "bash start.sh",
            "dockerContext": "./backend",
            "dockerfilePath": "./backend/Dockerfile"
        }
    }
}

resp = requests.patch(f"https://api.render.com/v1/services/{service_id}", headers=headers, json=payload)
print(resp.status_code)
print(resp.json())
