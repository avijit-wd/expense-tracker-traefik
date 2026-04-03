# Expense Tracker Application

A full-stack expense tracking application with user authentication, built using modern technologies and deployed with Docker Compose, Traefik reverse proxy, and PostgreSQL database.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Development](#development)
- [Production](#production)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)

---

## Overview

This application allows users to:
- Register and login with secure authentication
- Add, edit, and delete expenses
- View expenses in a table format
- Visualize expenses with charts
- Filter and categorize expenses

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client Request                              │
│                           (port 9000)                                │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Traefik Load Balancer                            │
│                     (port 80 internal)                               │
│                     Dashboard: http://localhost:8080                 │
└─────────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
        ┌─────────────────────────┐   ┌─────────────────────────────┐
        │   Frontend (Nginx)       │   │   Backend (FastAPI x3)       │
        │   React + Vite + TS      │   │   Python + Uvicorn           │
        │   Scale: 2 replicas      │   │   Scale: 3 replicas          │
        │   Path: /                │   │   Path: /api                 │
        └─────────────────────────┘   └─────────────────────────────┘
                                                   │
                                                   ▼
                                      ┌─────────────────────────────┐
                                      │   PostgreSQL Database       │
                                      │   (Persistent Volume)        │
                                      └─────────────────────────────┘
                                                   │
                                                   ▼
                                      ┌─────────────────────────────┐
                                      │   Autoheal Service          │
                                      │   (Health Monitor)           │
                                      └─────────────────────────────┘
```

### Traffic Flow

1. **All requests** hit Traefik on port 9000 (mapped to internal port 80)
2. **API requests** (`/api/*`) are routed to the backend service
3. **All other requests** (`/`) are routed to the frontend service
4. Traefik automatically load balances across multiple replicas

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.7.x | Type Safety |
| Vite | 6.x | Build Tool & Dev Server |
| Tailwind CSS | 4.x | Styling |
| React Router | 7.x | Client-side Routing |
| Axios | 1.7.x | HTTP Client |
| Recharts | 2.x | Data Visualization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.115.x | REST API Framework |
| Uvicorn | 0.34.x | ASGI Server |
| SQLAlchemy | 2.0.x | ORM |
| PyJWT | 2.10.x | JWT Authentication |
| Passlib + bcrypt | - | Password Hashing |
| psycopg2-binary | 2.9.x | PostgreSQL Driver |
| Pydantic | 2.10.x | Data Validation |

### Infrastructure
| Component | Version | Purpose |
|-----------|---------|---------|
| Docker | - | Containerization |
| Docker Compose | - | Multi-container Orchestration |
| Traefik | v3 | Reverse Proxy & Load Balancer |
| PostgreSQL | 17 | Database |
| Nginx | alpine | Static File Serving |
| Autoheal | willfarrell/autoheal | Container Health Monitor |

---

## Project Structure

```
expense-tracker-traefik/
├── compose.yaml              # Base Docker Compose (Traefik + DB)
├── compose.override.yaml     # Development overrides (hot reload)
├── compose.prod.yaml         # Production configuration
├── .env                      # Environment variables
│
├── backend/                  # FastAPI Backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # FastAPI app entry point
│       ├── db.py             # Database connection
│       ├── core/             # Core utilities
│       ├── models/           # SQLAlchemy models & Pydantic schemas
│       │   ├── models.py
│       │   └── schemas.py
│       ├── routes/           # API endpoints
│       │   ├── auth.py       # Authentication routes
│       │   └── expenses.py   # Expense CRUD routes
│       └── utils/            # Helper functions
│
├── frontend/                 # React Frontend
│   ├── Dockerfile
│   ├── nginx.conf            # Nginx configuration
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx          # Entry point
│       ├── App.tsx           # Main routing
│       ├── api/              # API client functions
│       │   ├── auth.ts
│       │   └── expenses.ts
│       ├── components/       # React components
│       │   ├── ExpenseChart.tsx
│       │   ├── ExpenseForm.tsx
│       │   ├── ExpenseFormFields.tsx
│       │   ├── ExpenseFormButtons.tsx
│       │   └── ExpenseTable.tsx
│       ├── pages/            # Page components
│       │   ├── AuthPage.tsx
│       │   └── Dashboard.tsx
│       ├── hooks/            # Custom React hooks
│       │   ├── useExpenses.ts
│       │   └── useExpenseForm.ts
│       ├── context/          # React context
│       │   └── RequireAuth.tsx
│       ├── constants/        # Constants
│       │   └── categories.ts
│       ├── types.ts          # TypeScript types
│       └── config.ts         # App configuration
│
└── db/                       # Database initialization
    ├── 01-init.sql           # Schema & roles
    ├── 02-rls.sql            # Row Level Security policies
    └── 03-seed.sql           # Sample data
```

---

## Features

### User Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes with authentication middleware
- Automatic token refresh

### Expense Management
- Create, Read, Update, Delete (CRUD) operations
- Categorization (Food, Transport, Entertainment, etc.)
- Date tracking for expenses
- Description and amount fields

### Dashboard
- Table view of all expenses
- Expense charts (Recharts)
- Filtering by category and date range
- Real-time updates

### Infrastructure
- Load balancing across multiple backend replicas
- Health checks for all services
- Automatic container restart on failure (Autoheal)
- Hot reload in development mode

---

## Prerequisites

- Docker Engine 24.x or later
- Docker Compose v2.x
- (Optional) Node.js 22+ for local frontend development
- (Optional) Python 3.12+ for local backend development

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker-traefik
```

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
POSTGRES_DB=expense_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
```

### 3. Start the Application

**Development Mode (with hot reload):**
```bash
docker compose up -d --build
```

**Production Mode:**
```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

### 4. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:9000 |
| Backend API | http://localhost:9000/api |
| API Documentation | http://localhost:9000/api/docs |
| Traefik Dashboard | http://localhost:8080 |

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `expense_tracker` |
| `POSTGRES_USER` | Database superuser | `postgres` |
| `POSTGRES_PASSWORD` | Database password | *(required)* |
| `DATABASE_HOST` | Database host (backend) | `db` |
| `VITE_API_BASE_URL` | API base URL (frontend) | `/api` |

### Docker Compose Files

| File | Purpose |
|------|---------|
| `compose.yaml` | Base services (Traefik, DB) |
| `compose.override.yaml` | Development overrides (hot reload) |
| `compose.prod.yaml` | Production config (health checks, autoheal, scaling) |

---

## Development

### Running in Development Mode

Development mode uses:
- `node:23` image for frontend with hot reload
- `python:3.12` image for backend with `--reload` flag
- Source code mounted as volumes for live updates

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
DATABASE_HOST=localhost uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload
```

**Frontend:**
```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:5001/api npm run dev
```

### Database Migrations

Database schema is initialized automatically via SQL scripts in `db/`:
- `01-init.sql` - Creates tables and roles
- `02-rls.sql` - Row Level Security policies
- `03-seed.sql` - Sample data

---

## Production

### Running in Production

```bash
# Build and start all services
docker compose -f compose.yaml -f compose.prod.yaml up -d --build

# Scale services
docker compose -f compose.yaml -f compose.prod.yaml up -d --scale backend=5 --scale frontend=3
```

### Production Configuration

- **Health checks** enabled for all services
- **Autoheal** monitors and restarts unhealthy containers
- **Scaled replicas** (3 backend, 2 frontend)
- **Nginx** serves optimized static files
- **Traefik** handles load balancing

### Security Considerations

1. **Change default passwords** in `.env`
2. **Enable HTTPS** in Traefik for production
3. **Disable Traefik dashboard** or add authentication
4. **Set `CORS_ORIGINS`** to specific domains
5. **Use secrets management** for sensitive data

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Expense Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses for authenticated user |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/{id}` | Update existing expense |
| DELETE | `/api/expenses/{id}` | Delete expense |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Backend health check (returns container ID) |

### Request/Response Examples

**Register User:**
```bash
curl -X POST http://localhost:9000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

**Login:**
```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
# Returns: {"access_token": "...", "token_type": "bearer"}
```

**Create Expense:**
```bash
curl -X POST http://localhost:9000/api/expenses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"description": "Groceries", "amount": 50.00, "category": "Food", "date": "2025-01-15"}'
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Roles

| Role | Purpose |
|------|---------|
| `auth_user` | Used for authentication (signup/login) |
| `app_user` | Used for application operations (CRUD) |

---

## Scaling

### Horizontal Scaling

```bash
# Scale backend to 5 replicas
docker compose -f compose.yaml -f compose.prod.yaml up -d --scale backend=5

# Scale frontend to 3 replicas
docker compose -f compose.yaml -f compose.prod.yaml up -d --scale frontend=3
```

### Load Balancing

Traefik automatically distributes traffic across replicas using round-robin load balancing.

### Resource Limits

Add resource limits in `compose.prod.yaml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker compose logs <service_name>

# Check container status
docker compose ps
```

**Database connection errors:**
```bash
# Verify database is running
docker compose ps db

# Check database logs
docker compose logs db

# Test connection
docker compose exec db pg_isready
```

**Frontend not loading:**
```bash
# Rebuild frontend
docker compose build frontend

# Check Nginx logs
docker compose logs frontend
```

**API returns 401 Unauthorized:**
- Check if JWT token is valid
- Verify Authorization header format: `Bearer <token>`
- Token may have expired - try logging in again

### Useful Commands

```bash
# Restart all services
docker compose restart

# Stop and remove containers (keep data)
docker compose down

# Stop and remove containers + volumes (delete data)
docker compose down -v

# View container health status
docker compose ps

# Execute command in running container
docker compose exec backend bash

# Access PostgreSQL
docker compose exec db psql -U postgres -d expense_tracker
```

---

## License

This project is provided as-is for educational and demonstration purposes.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Authors

Built with FastAPI, React, PostgreSQL, Traefik, and Docker.