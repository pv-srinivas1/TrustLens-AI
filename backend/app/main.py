import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import claims, exports

app = FastAPI(
    title="TrustLens Technologies API",
    description="AI-Powered Refund & Claim Verification Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for evidence uploads
if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
    UPLOAD_DIR = "/tmp/uploads"
else:
    UPLOAD_DIR = os.path.abspath(os.path.join(os.getcwd(), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to TrustLens Technologies API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(claims.router, prefix="/api/v1/claims", tags=["claims"])
app.include_router(exports.router, prefix="/api/v1/exports", tags=["exports"])

