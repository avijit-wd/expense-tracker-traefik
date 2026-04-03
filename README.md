# Expense Tracker - Docker Compose Explained

This document provides a detailed explanation of the `compose.yaml` file used in this project.

## Architecture Overview

```
Client Request (port 9000)
        |
    [ Traefik LB ]  (port 80 internal / 9000 external)
       /        \
  [Frontend]   [Backend x3]
   (Nginx)      (FastAPI)
                    |
                [ PostgreSQL ]
```

- **Traefik** acts as a reverse proxy and load balancer
- **Frontend** is a Vite + React app served by Nginx
- **Backend** is a FastAPI app running on Uvicorn
- **PostgreSQL** is the database
- **Autoheal** monitors and restarts unhealthy containers

---

## Services Breakdown

### 1. `lb` - Traefik Load Balancer

```yaml
lb:
  image: traefik:v3
```

Uses the official Traefik v3 image as the reverse proxy / load balancer.

```yaml
restart: unless-stopped
```

Automatically restarts the container unless it was manually stopped.

```yaml
ports:
  - 9000:80 # Maps host port 9000 -> container port 80 (HTTP traffic)
  - 8080:8080 # Maps host port 8080 -> Traefik dashboard UI
```

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

Mounts the Docker socket so Traefik can discover other containers and their labels automatically (Docker provider).

```yaml
labels:
  - "autoheal=true"
```

Tells the `autoheal` service to monitor this container and restart it if it becomes unhealthy.

```yaml
command:
  - "--api.insecure=true"
```

Enables the Traefik web dashboard without authentication (on port 8080). **Not recommended for production** - use proper authentication.

```yaml
- "--providers.docker=true"
- "--providers.docker.exposedByDefault=false"
```

- Enables Docker as a configuration provider (Traefik reads container labels for routing rules).
- `exposedByDefault=false` means containers must explicitly opt-in with `traefik.enable=true`.

```yaml
- "--ping=true"
- "--ping.entrypoint=web"
- "--entrypoints.web.address=:80"
```

- Enables Traefik's `/ping` health endpoint.
- Binds the ping endpoint and all web traffic to port 80 inside the container.

```yaml
healthcheck:
  test:
    ["CMD-SHELL", "wget -q0- http://localhost:80/ping | grep -q 'OK' || exit 1"]
  interval: 10s # Check every 10 seconds
  timeout: 5s # Fail if no response within 5 seconds
  retries: 3 # Mark unhealthy after 3 consecutive failures
  start_period: 10s # Grace period before health checks begin
```

Checks Traefik's `/ping` endpoint to verify it's running and responding.

---

### 2. `frontend` - React App (Nginx)

```yaml
frontend:
  build:
    context: ./frontend
    args:
      VITE_API_BASE_URL: "/api"
```

- Builds the frontend image from `./frontend/Dockerfile`.
- Passes `VITE_API_BASE_URL=/api` as a build argument so the React app knows the API base path.

```yaml
labels:
  - "autoheal=true"
  - "traefik.enable=true"
  - "traefik.http.routers.frontend.rule=PathPrefix(`/`)"
  - "traefik.http.routers.frontend.entrypoints=web"
```

- Enables autoheal monitoring.
- `traefik.enable=true` - Opts this container into Traefik's routing.
- Routes all requests matching `/` (any path) to this service.
- Uses the `web` entrypoint (port 80).
- Since `PathPrefix(/)` is a catch-all, Traefik will prefer the more specific `/api` route for backend traffic.

```yaml
restart: unless-stopped
scale: 2
```

Runs **2 replicas** of the frontend for load balancing. Traefik automatically distributes traffic across them.

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Checks if Nginx is serving the frontend on port 80 (the default Nginx port inside the container).

---

### 3. `backend` - FastAPI App

```yaml
backend:
  build: ./backend
```

Builds the backend image from `./backend/Dockerfile`. Runs FastAPI with Uvicorn on port 5001.

```yaml
environment:
  DATABASE_HOST: db
```

Sets the database hostname to `db` (the service name), which Docker's internal DNS resolves to the database container's IP.

```yaml
labels:
  - "autoheal=true"
  - "traefik.enable=true"
  - "traefik.http.routers.backend.rule=PathPrefix(`/api`)"
  - "traefik.http.routers.backend.entrypoints=web"
```

- Enables autoheal monitoring.
- Routes all requests starting with `/api` to this service.
- Traefik prefers this over the frontend's `/` rule because `/api` is more specific.

```yaml
restart: unless-stopped
scale: 3
```

Runs **3 replicas** of the backend. Traefik load balances across all 3 instances.

```yaml
depends_on:
  - db
```

Ensures the `db` service starts before the backend. **Note:** This only waits for the container to start, not for PostgreSQL to be ready. The app should handle connection retries.

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5001/api"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Checks the FastAPI health endpoint on port 5001 (the port Uvicorn listens on inside the container).

---

### 4. `db` - PostgreSQL Database

```yaml
db:
  image: postgres:17
```

Uses the official PostgreSQL 17 image.

```yaml
volumes:
  - db-vol:/var/lib/postgresql/data:rw
  - ./db:/docker-entrypoint-initdb.d:ro
```

- `db-vol` - Named volume for persistent database storage. Data survives container restarts.
- `./db` - Mounts the local `db/` directory (containing SQL init scripts) into the container's init directory. PostgreSQL automatically executes `.sql` files here on first startup. Mounted as read-only (`:ro`).

```yaml
environment:
  - POSTGRES_PASSWORD=$POSTGRES_PASSWORD
  - POSTGRES_DB=$POSTGRES_DB
  - POSTGRES_USER=$POSTGRES_USER
```

Reads database credentials from the `.env` file in the project root. These configure:

- The superuser password
- The default database name
- The superuser username

```yaml
restart: unless-stopped
```

```yaml
labels:
  - "autoheal=true"
```

Enables autoheal monitoring for the database container.

```yaml
healthcheck:
  test:
    [
      "CMD-SHELL",
      "pg_isready -d $POSTGRES_DB -U $POSTGRES_USER -h 127.0.0.1 || exit 1",
    ]
  interval: 30s # Check every 30 seconds (less frequent since DB is stable)
  timeout: 10s # Allow 10 seconds for response
  retries: 5 # More retries since DB startup can be slow
  start_period: 10s # Grace period for initial startup
```

Uses PostgreSQL's built-in `pg_isready` utility to verify the database is accepting connections.

---

### 5. `autoheal` - Container Health Monitor

```yaml
autoheal:
  image: willfarrell/autoheal
  restart: always
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
```

- Monitors all containers with the `autoheal=true` label.
- Automatically restarts containers that become unhealthy (based on their healthcheck).
- Needs Docker socket access to restart containers.
- Uses `restart: always` (not `unless-stopped`) so it always runs, even after manual stops.

---

## Volumes

```yaml
volumes:
  db-vol:
```

Declares a named Docker volume for PostgreSQL data persistence. Data is stored on the host and survives `docker compose down`. Use `docker compose down -v` to delete it.

---

## Key Concepts

### Traefik Routing

Traefik routes traffic based on labels:

- `PathPrefix(/api)` -> backend (more specific, takes priority)
- `PathPrefix(/)` -> frontend (catch-all for everything else)

### Scaling

- Frontend: 2 replicas
- Backend: 3 replicas
- Traefik automatically load balances across all replicas

### Health Checks

Every service has a healthcheck. Combined with `autoheal`, unhealthy containers are automatically restarted.

| Service  | Check Method | Endpoint                      | Interval |
| -------- | ------------ | ----------------------------- | -------- |
| lb       | wget         | `localhost:80/ping`           | 10s      |
| frontend | curl         | `localhost:80/`               | 10s      |
| backend  | curl         | `localhost:5001/api`          | 10s      |
| db       | pg_isready   | `127.0.0.1` (PostgreSQL port) | 30s      |

### Environment Variables

Database credentials are stored in `.env` file (not committed to git):

```
POSTGRES_DB=expense_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-root-password
```

## Quick Commands

```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Check service health
docker compose ps

# Stop all services (keep data)
docker compose down

# Stop all services (delete data)
docker compose down -v

# Scale a specific service
docker compose up -d --scale backend=5
```

```
  Running the prod

  docker compose -f compose.yaml -f compose.prod.yaml up
```
