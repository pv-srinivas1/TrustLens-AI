# Start Redis
Start-Process -FilePath "Redis\redis-server.exe" -WindowStyle Minimized

# Start FastAPI Server
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", ".\venv\Scripts\activate; uvicorn app.main:app --host 0.0.0.0 --port 8000" -WindowStyle Normal -WorkingDirectory "$PWD"

# Start Celery Worker
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", ".\venv\Scripts\activate; celery -A app.celery_app worker -l info --pool=solo" -WindowStyle Normal -WorkingDirectory "$PWD"

Write-Host "TrustLens AI Backend has started."
Write-Host "1. Redis is running minimized."
Write-Host "2. FastAPI API is running on port 8000."
Write-Host "3. Celery background worker is running."
