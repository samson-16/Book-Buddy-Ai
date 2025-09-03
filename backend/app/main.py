from fastapi import FastAPI
from app.routes import health, summarize
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BookBuddy AI MVP")

# Configure CORS: set ALLOWED_ORIGINS as a comma-separated env var (or leave unset to allow all origins for now)
raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
if raw_origins.strip() == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health")
app.include_router(summarize.router, prefix="/summarize")


@app.get("/")
async def root():
    return {"message": "BookBuddy AI backend is running"}
