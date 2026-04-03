from fastapi.openapi.utils import get_openapi
from fastapi import FastAPI

def custom_openapi(app: FastAPI):
    """Custom OpenAPI documentation with JWT authentication."""
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    for path, methods in openapi_schema["paths"].items():
        for method in methods:
            methods[method]["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return openapi_schema