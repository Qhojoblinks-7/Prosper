# Prosper Backend API — Developer Documentation

**Version:** 1.0.0  
**Stack:** Django 5.2 + Django REST Framework + PostgreSQL (Supabase)  
**Auth:** JWT (SimpleJWT)  
**Status:** Development / Production Ready  

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Environment Setup](#environment-setup)
4. [API Reference](#api-reference)
5. [Data Models](#data-models)
6. [Authentication & Permissions](#authentication--permissions)
7. [Offline-First Sync](#offline-first-sync)
8. [Deployment](#deployment)
9. [Admin Interface](#admin-interface)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Python 3.11+
- pip
- virtualenv (recommended)
- PostgreSQL (optional, for production)

### Local Development Setup

```bash
# 1. Clone the repository
cd server

# 2. Create and activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env  # if exists, or edit .env manually
# Edit .env with your SECRET_KEY and DATABASE_URL

# 5. Apply migrations
python manage.py migrate

# 6. Create a superuser (admin)
python manage.py createsuperuser

# 7. Seed sample data (optional)
python manage.py loaddata initial_data.json

# 8. Run development server
python manage.py runserver 0.0.0.0:8000

# API will be available at http://localhost:8000/api/
```

### Verify Installation

```bash
# Check migrations are applied
python manage.py showmigrations finance

# Open API docs
# Swagger UI: http://localhost:8000/api/schema/swagger-ui/
# ReDoc: http://localhost:8000/api/schema/redoc/
```

---

## Architecture Overview

```
┌────────────────────┐
│   React Native     │  Mobile App (Expo)
│   (Zustand Store)  │
└────────▲───────────┘
         │ HTTPS/JSON
         │ REST API
         ▼
┌────────────────────┐
│   Django + DRF     │  Backend API Layer
│   (Serializers,    │  - Request validation
│    Viewsets)       │  - Business logic
└────────▲───────────┘
         │
         ▼
┌────────────────────┐
│   Django Models    │  Data Layer
│   (PostgreSQL)     │  - SQLite (dev)
│                    │  - Supabase (prod)
└────────────────────┘
```

### Core Principles

1. **RESTful Design** — Resource-oriented URLs, proper HTTP verbs, status codes
2. **User-Scoped Data** — All queries filtered by `request.user`
3. **Offline-First** — Mobile app caches locally; sync via batch endpoint
4. **Zero-Config Dev** — SQLite fallback if DATABASE_URL invalid
5. **Production-Ready** — JWT auth, CORS, rate limiting ready

---

## Environment Setup

### Required Environment Variables (`.env`)

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True  # Set to False in production
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database (Supabase PostgreSQL)
DATABASE_URL=postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET_KEY=your-jwt-secret  # Optional, uses SECRET_KEY if not set

# CORS (Optional)
CORS_ALLOWED_ORIGINS=https://prosper.app,exp://localhost:19000

# Email (Optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Database Options

**Development (default):**
- Uses SQLite at `server/db.sqlite3`
- No external dependencies

**Production (Supabase):**
```bash
# Get connection string from Supabase dashboard:
# Settings → Database → Connection string → "URI" format
DATABASE_URL=postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-africa-south-1.pooler.supabase.com:5432/postgres
```

---

## API Reference

### Base URL
```
Development:  http://localhost:8000/api/
Production:   https://api.prosper.app/v1/
```

### Authentication Endpoints

#### POST `/api/auth/register/`
Register a new driver account with default configuration.

**Request:**
```json
{
  "username": "driver_alex",
  "email": "alex@example.com",
  "password": "securepassword123",
  "password_confirm": "securepassword123",
  "first_name": "Alex",
  "last_name": "Morgan"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user_id": 1
}
```

**Note:** Automatically creates:
- Default allocations (50/20/10/20)
- 4 vaults (Emergency, Vehicle, School, Business)
- 2 milestones (License, Tires)
- Empty vehicle record

---

### Dashboard & Home

#### GET `/api/dashboard/`
Aggregated home screen data.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "cash_on_hand": 1250.00,
  "momo_balance": 3200.50,
  "total_saved": 8700.00,
  "top_expense": "Fuel",
  "top_expense_amount": 450.00,
  "safety_net": 2400.00,
  "safety_net_target": 5000.00,
  "recent_transactions": [
    {
      "id": 1,
      "amount": "150.00",
      "transaction_type": "INCOME",
      "method": "MOMO",
      "category": 3,
      "intent": "Morning fare",
      "created_at": "2026-04-22T08:30:00Z"
    }
  ],
  "high_profit_days": 4,
  "break_even_days": 2,
  "loss_days": 1
}
```

---

#### GET/PATCH `/api/profile/`
Driver profile settings.

**GET Response:**
```json
{
  "id": 1,
  "user": { "id": 1, "username": "alex" },
  "daily_goal": 400.00,
  "safety_net_target": 5000.00,
  "safety_net_current": 2400.00,
  "currency": "GHS",
  "is_shift_active": false,
  "days_of_freedom": 48
}
```

**PATCH (update goal):**
```json
{
  "daily_goal": 500.00
}
```

---

### Transactions

#### GET `/api/transactions/`
List all transactions (paginated, filtered by driver).

**Query Params:**
- `?transaction_type=INCOME` — filter by type
- `?category=3` — filter by category ID
- `?start_date=2026-04-01&end_date=2026-04-22` — date range
- `?ordering=-created_at` — sort

**Response:** Standard paginated DRF response.

#### POST `/api/transactions/`
Log new income/expense.

**Request:**
```json
{
  "amount": "150.00",
  "transaction_type": "EXPENSE",
  "method": "CASH",
  "category": 5,
  "intent": "Fuel for afternoon shift",
  "notes": "Shell station, Ring Road"
}
```

**Response (201):** Full transaction object with `synced: false`.

#### GET `/api/transactions/weekly/?weeks=4`
Weekly aggregation for analytics charts.

**Response:**
```json
[
  {
    "week": "Week 1",
    "income": 2850.00,
    "expense": 1200.00,
    "net": 1650.00
  },
  ...
]
```

---

### Set Targets (Allocations & Milestones)

#### GET `/api/allocations/`
List income allocation percentages.

**Response:**
```json
[
  {
    "id": 1,
    "label": "Operating Costs",
    "percent": 50,
    "color": "#F59E0B",
    "order": 0,
    "is_active": true
  },
  ...
]
```

#### POST/PATCH `/api/allocations/`
Create or update allocation. Total must not exceed 100%.

#### GET `/api/milestones/`
List active savings milestones.

**Response:**
```json
[
  {
    "id": 1,
    "name": "License Renewal",
    "target_amount": "800.00",
    "current_amount": "350.00",
    "deadline": "2026-06-15",
    "progress_percent": 43.8,
    "days_left": 55,
    "daily_needed": 8.18
  }
]
```

#### POST `/api/milestones/{id}/add_contribution/`
Add money toward milestone.

**Request:**
```json
{ "amount": 50.00 }
```

**Response:** `{ "new_total": 400.00 }`

---

### Savings Vaults

#### GET `/api/vaults/`
List all vaults with progress.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Emergency Net",
    "vault_type": "Emergency Net",
    "current_amount": "2500.00",
    "target_amount": "5000.00",
    "progress_percent": 50.0,
    "is_emergency": true
  }
]
```

#### GET `/api/vaults/summary/`
Aggregated vault stats.

**Response:**
```json
{
  "total_saved": 8700.00,
  "days_of_freedom": 174,
  "goal_progress": 43.5,
  "vault_count": 4
}
```

#### POST `/api/vaults/{id}/contribute/`
Add funds to a vault.

**Request:**
```json
{ "amount": 100.00 }
```

**Response:** `{ "vault_id": 1, "new_amount": 2600.00, "progress": 52.0 }`

---

### Vehicle Management

#### GET `/api/vehicles/`
Get vehicle profile (one per driver).

**Response:**
```json
{
  "id": 1,
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "license_plate": "GR 1234-20",
  "current_odometer": 45000,
  "km_until_service": 1250,
  "is_service_due": false,
  "fuel_efficiency": 12.5,
  "health_score": 85,
  "estimated_value": 80000.00,
  "maintenance_fund": 850.00,
  "maintenance_fund_target": 2000.00
}
```

#### POST `/api/vehicles/{id}/update_odometer/`
Update km reading.

**Request:** `{ "current_odometer": 46250 }`

#### POST `/api/vehicles/{id}/add_fuel/`
Log fuel purchase (also creates Transaction).

**Request:**
```json
{
  "quantity": 25.5,
  "cost": 180.00,
  "odometer": 46250
}
```

#### GET `/api/maintenance-logs/?vehicle=1`
Service history.

---

### Notifications

#### GET `/api/notifications/`
List notifications (most recent first).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Service Due Soon",
    "message": "Vehicle needs service in 250 km",
    "notification_type": "WARNING",
    "icon": "AlertTriangle",
    "is_read": false,
    "created_at": "2026-04-22T10:00:00Z"
  }
]
```

#### POST `/api/notifications/mark_all_read/`
Mark all as read.

**Response:** `{ "marked_read": 5 }`

#### POST `/api/notifications/{id}/mark_read/`
Mark single as read.

---

### Sync & Offline

#### POST `/api/sync/`
Batch upload local changes.

**Request:**
```json
{
  "device_id": "Android-12345",
  "transactions": [
    {
      "local_id": "temp_123",
      "amount": "100.00",
      "transaction_type": "INCOME",
      "method": "CASH",
      "intent": "Quick trip"
    }
  ],
  "vaults": [],
  "milestones": []
}
```

**Response (200):**
```json
{
  "status": "synced",
  "sync_id": 42
}
```

**Conflict Handling:** Server responds with `409 Conflict` and conflict details.

---

### Reports & Analytics

#### GET `/api/reports/annual-vision/`
Wealth projection data for Annual Vision screen.

**Response:**
```json
{
  "monthly_data": [
    {
      "month": "Jan",
      "income": 3200.00,
      "expense": 1800.00,
      "net": 1400.00,
      "running_total": 1400.00
    },
    ...
  ],
  "total_income": 12600.00,
  "total_expense": 7800.00,
  "net_profit": 4800.00,
  "avg_monthly_income": 3150.00,
  "projected_annual_savings": 37800.00,
  "current_year": 2026
}
```

#### GET `/api/reports/insights/?period=monthly`
Insight reports data.

**Response:**
```json
{
  "net_margin": 38.2,
  "avg_daily_profit": 425.00,
  "total_income": 15800.00,
  "active_days": 37,
  "reports": [
    { "name": "Monthly Statement - April 2026", "date": "2026-04-01" },
    { "name": "Q1 2026 Summary", "date": "2026-03-31" }
  ]
}
```

---

## Data Models

### Entity Relationship Overview

```
User (1) ──→ (1) DriverProfile
User (1) ──→ (N) Transaction
User (1) ──→ (N) Allocation
User (1) ──→ (N) Milestone
User (1) ──→ (N) Vault
User (1) ──→ (1) Vehicle
Vehicle (1) ──→ (N) MaintenanceLog
User (1) ──→ (N) Notification
User (1) ──→ (N) SyncLog
User (1) ──→ (N) PendingUpload
```

### Model Summaries

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **DriverProfile** | User preferences & goals | `daily_goal`, `safety_net_target`, `currency` |
| **Category** | Transaction categorization | `name`, `icon`, `color`, `is_income` |
| **Transaction** | Financial movements | `amount`, `transaction_type`, `method`, `category`, `odometer_reading` |
| **Budget** | Monthly spending limits | `driver`, `category`, `amount`, `period` |
| **Allocation** | Income distribution % | `driver`, `label`, `percent` |
| **Milestone** | Named savings goals | `name`, `target_amount`, `current_amount`, `deadline` |
| **Vault** | Savings containers | `name`, `current_amount`, `target_amount`, `allocation_percent` |
| **Vehicle** | Asset tracking | `license_plate`, `current_odometer`, `health_score`, `fuel_efficiency` |
| **MaintenanceLog** | Service history | `vehicle`, `service_type`, `cost`, `odometer_reading` |
| **Notification** | In-app alerts | `driver`, `title`, `type`, `is_read` |
| **SyncLog** | Sync audit trail | `driver`, `status`, `transaction_count` |
| **PendingUpload** | Offline queue | `driver`, `model_name`, `operation`, `data` |

---

## Authentication & Permissions

### JWT Tokens (SimpleJWT)

**Obtain Token:**
```bash
POST /api/token/
{
  "username": "driver_alex",
  "password": "secret"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Refresh Token:**
```bash
POST /api/token/refresh/
{ "refresh": "eyJ0eXAiOiJKV1Qi..." }
```

**Verify Token:**
```bash
POST /api/token/verify/
{ "token": "eyJ0eXAiOiJKV1Qi..." }
```

### Using Tokens in Mobile App

```javascript
// React Native / Expo
fetch('http://localhost:8000/api/dashboard/', {
  headers: {
    'Authorization': 'Bearer <access_token>',
    'Content-Type': 'application/json'
  }
})
```

### Permission Matrix

| Endpoint | Permission | User Filtering |
|----------|------------|----------------|
| `/api/auth/register/` | `AllowAny` | Creates own data |
| `/api/dashboard/` | `IsAuthenticated` | ✅ `driver=request.user` |
| `/api/transactions/` | `IsAuthenticated` | ✅ `driver=request.user` |
| `/api/vaults/` | `IsAuthenticated` | ✅ `driver=request.user` |
| `/api/allocations/` | `IsAuthenticated` | ✅ `driver=request.user` |
| `/api/notifications/` | `IsAuthenticated` | ✅ `driver=request.user` |

---

## Offline-First Sync

### Sync Strategy

1. **Local Write:** Mobile app writes to local MMKV/SQLite immediately
2. **Queue Flag:** Sets `synced = false` on Transaction
3. **Background Sync:** Every 30s (or on app foreground), POST to `/api/sync/`
4. **Server Apply:** Server processes batch, returns server IDs
5. **Confirm:** Mobile marks local records as `synced = true`

### Sync Payload Example

```json
{
  "device_id": "Android-X12345",
  "transactions": [
    {
      "local_id": "tmp_abc123",
      "amount": "250.00",
      "transaction_type": "EXPENSE",
      "method": "CASH",
      "category": 2,
      "intent": "Lunch",
      "created_at": "2026-04-22T12:34:56Z"
    }
  ]
}
```

**Server Response:**
```json
{
  "status": "synced",
  "sync_id": 123,
  "mapped_ids": {
    "tmp_abc123": 456
  }
}
```

### Conflict Resolution

- **Last-Write-Wins:** Timestamp-based (server timestamp wins)
- **Manual Merge:** If `409 Conflict`, client must refetch and reconcile

---

## Deployment

### Using Docker (Recommended)

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "prosper.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: prosper
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    command: gunicorn prosper.wsgi:application --bind 0.0.0.0:8000
    env_file: .env
    environment:
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@db:5432/prosper
    depends_on:
      - db
    ports:
      - "8000:8000"

volumes:
  postgres_data:
```

**Deploy:**
```bash
docker-compose up -d
```

### Manual Deployment (Ubuntu/VPS)

```bash
# Install system dependencies
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql

# Create DB
sudo -u postgres psql -c "CREATE DATABASE prosper;"

# Clone & setup
git clone <repo>
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure .env
nano .env  # Set DEBUG=False, SECRET_KEY, DATABASE_URL

# Collect static
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Serve with Gunicorn + Nginx
pip install gunicorn
gunicorn prosper.wsgi:application --bind 0.0.0.0:8000

# Set up systemd service
sudo nano /etc/systemd/system/prosper.service
```

---

## Admin Interface

### Access

```
URL: http://localhost:8000/admin/
Login: superuser credentials
```

### Available Models

All models registered with custom admin classes:
- **Transactions:** Full search, date hierarchy, filter by type/category
- **DriverProfile:** User goals & settings
- **Vehicle:** Service status, health score
- **Vaults:** Savings progress
- **Milestones:** Goal tracking
- **Notifications:** In-app messages
- **SyncLog:** Sync audit trail
- **Allocations:** Income split rules

### Bulk Actions

- Export CSV from any list view
- Edit multiple records inline
- Run custom admin actions (future: "Recalc health scores")

---

## Testing

### Running Tests

```bash
# All tests
python manage.py test finance

# Specific test file
python manage.py test finance.tests.test_models

# With coverage
coverage run --source='.' manage.py test finance
coverage report
```

### API Testing (Postman / cURL)

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","password_confirm":"test123"}'

# Get token
curl -X POST http://localhost:8000/api/token/ \
  -d "username=test&password=test123"

# Dashboard (authenticated)
curl http://localhost:8000/api/dashboard/ \
  -H "Authorization: Bearer <token>"
```

---

## Troubleshooting

### Common Issues

**1. `django.core.exceptions.ImproperlyConfigured: Settings not configured`**
```bash
# Ensure DJANGO_SETTINGS_MODULE is set (usually automatic)
export DJANGO_SETTINGS_MODULE=prosper.settings
```

**2. Database connection refused**
- SQLite: Check `db.sqlite3` exists and is writable
- PostgreSQL: Verify `DATABASE_URL` format, network access to Supabase

**3. CORS errors in mobile app**
- Ensure `CORS_ALLOW_ALL_ORIGINS = True` in dev
- For production, add `expo://` origin or specific domain

**4. Migrations stuck**
```bash
# Fake initial migration if tables exist
python manage.py migrate --fake-initial

# Or reset completely
rm db.sqlite3
rm -r finance/migrations/*
python manage.py makemigrations
python manage.py migrate
```

**5. `No module named 'environ'`**
```bash
pip uninstall environ  # problematic package
pip install django-environ
```

### Debugging Tips

```bash
# View SQL queries
python manage.py shell
>>> from django.db import connection
>>> connection.queries  # after an API call

# Check URL patterns
python manage.py show_urls

# Validate serializers
python manage.py check
```

### Logs

Logs written to `server/logs/django.log`. View with:
```bash
tail -f logs/django.log
```

---

## Performance & Optimization

### Database Indexes

Key indexes already defined in models:
- `Transaction`: `(driver, created_at)`, `(transaction_type, category)`
- `Vault`: `(driver, is_active)`
- `Milestone`: `(driver, status)`
- `SyncLog`: `(driver, started_at)`

### Query Optimization

- `select_related('category')` used where appropriate
- `prefetch_related` for nested relationships (future)
- Pagination default: 50 items/page (configurable)

### Caching (Optional)

Redis caching can be enabled for dashboard aggregates:

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://localhost:6379/1',
    }
}
```

---

## Contributing

### Code Style
- Follow PEP 8 (Python)
- Use `black` for formatting: `black .`
- Type hints encouraged

### Adding New Endpoints

1. Define model field (if needed) in `models.py`
2. Create serializer in `serializers.py`
3. Add view (ViewSet or APIView) in `views.py`
4. Register URL in `finance/urls.py`
5. Update `README.md` API section

### Pull Request Checklist
- [ ] Migrations generated & tested
- [ ] API docs updated
- [ ] Tests added (if logic complex)
- [ ] Admin registered (if model needs management)

---

## License

MIT License — See LICENSE file for details.

---

## Support

For issues, bugs, or feature requests:
- GitHub Issues: https://github.com/your-repo/prosper/issues
- Email: dev@prosper.app

**Built with ❤️ for drivers, by drivers.**
