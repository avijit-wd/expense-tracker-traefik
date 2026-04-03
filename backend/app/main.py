import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.expenses import router as expenses_router
from app.utils.openapi import custom_openapi

app = FastAPI(
    title="Expense Tracker API", 
    version="1.0.0", 
    description="MVP API for tracking expenses",
    openapi_url="/api/openapi.json",  # OpenAPI schema
    docs_url="/api/docs",  # Swagger UI
    redoc_url="/api/redoc"  # Redoc UI
)

# Assign custom OpenAPI function
app.openapi = lambda: custom_openapi(app)

# Use `/api` as the global prefix for all routes
app.include_router(auth_router, prefix="/api/auth")
app.include_router(expenses_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/", include_in_schema=False)
def redirect_to_api():
    return RedirectResponse(url="/api")

# API Health Check at `/api`
@app.get("/api", summary="API Health Check")
def read_root():
    """Check if the backend is running and return the container ID."""
    container_id = os.popen("hostname").read().strip()
    return {
        "message": "FastAPI backend is running!",
        "container_id": container_id
    }