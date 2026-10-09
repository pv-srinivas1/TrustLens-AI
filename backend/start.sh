#!/bin/bash
celery -A app.celery_app worker -l info --pool=solo &
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port $PORT
