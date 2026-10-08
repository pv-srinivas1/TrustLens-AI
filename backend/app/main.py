from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import claims

app = FastAPI(
    title="TrustLens AI API",
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

@app.get("/")
def read_root():
    return {"message": "Welcome to TrustLens AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(claims.router, prefix="/api/v1/claims", tags=["claims"])
