# Prosper API — Quick Reference Card

**Base URL:** `http://localhost:8000/api/` (dev)  
**Auth:** Bearer JWT token (SimpleJWT)  
**Format:** JSON  

---

## 🚀 Quick Start

```bash
# Get token
curl -X POST http://localhost:8000/api/token/ \
  -d "username=alex&password=secret"

# Use token
curl http://localhost:8000/api/dashboard/ \
  -H "Authorization: Bearer <token>"
```

---

## 📊 Endpoints Quick Reference

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **AUTH** |
| POST | `/api/auth/register/` | Create account | ❌ |
| POST | `/api/token/` | Get JWT tokens | ❌ |
| POST | `/api/token/refresh/` | Refresh access | ❌ |
| **DASHBOARD** |
| GET | `/api/dashboard/` | Home screen data | ✅ |
| GET/PATCH | `/api/profile/` | User settings | ✅ |
| **TRANSACTIONS** |
| GET | `/api/transactions/` | List all | ✅ |
| POST | `/api/transactions/` | Log transaction | ✅ |
| GET | `/api/transactions/weekly/` | Weekly summary | ✅ |
| GET | `/api/transactions/by_category/` | Grouped by cat | ✅ |
| **TARGETS** |
| GET | `/api/allocations/` | Income % split | ✅ |
| POST/PATCH | `/api/allocations/` | Update allocation | ✅ |
| GET | `/api/milestones/` | Savings goals | ✅ |
| POST | `/api/milestones/` | Create milestone | ✅ |
| POST | `/api/milestones/{id}/add_contribution/` | Add to goal | ✅ |
| POST | `/api/milestones/{id}/complete/` | Complete goal | ✅ |
| **VAULTS** |
| GET | `/api/vaults/` | All vaults | ✅ |
| GET | `/api/vaults/summary/` | Totals & days free | ✅ |
| POST | `/api/vaults/` | Create vault | ✅ |
| POST | `/api/vaults/{id}/contribute/` | Deposit | ✅ |
| **VEHICLE** |
| GET | `/api/vehicles/` | Vehicle data | ✅ |
| POST | `/api/vehicles/{id}/update_odometer/` | Update km | ✅ |
| POST | `/api/vehicles/{id}/add_fuel/` | Log fuel | ✅ |
| GET | `/api/maintenance-logs/` | Service history | ✅ |
| POST | `/api/maintenance-logs/` | Add log | ✅ |
| **NOTIFICATIONS** |
| GET | `/api/notifications/` | List alerts | ✅ |
| POST | `/api/notifications/mark_all_read/` | Mark all read | ✅ |
| POST | `/api/notifications/{id}/mark_read/` | Mark single read | ✅ |
| **REPORTS** |
| GET | `/api/reports/annual-vision/` | Chart data | ✅ |
| GET | `/api/reports/insights/` | Analytics | ✅ |
| **SYNC** |
| POST | `/api/sync/` | Batch sync | ✅ |

---

## 🔐 Authentication Flow

```javascript
// 1. Register
POST /api/auth/register/
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "secure123",
  "password_confirm": "secure123"
}
→ { "user_id": 1, "message": "..." }

// 2. Login (get tokens)
POST /api/token/
{
  "username": "alex",
  "password": "secure123"
}
→ { "access": "...", "refresh": "..." }

// 3. Access protected endpoint
GET /api/dashboard/
Headers: { "Authorization": "Bearer <access>" }

// 4. Refresh when expired
POST /api/token/refresh/
{ "refresh": "<refresh_token>" }
```

---

## 📱 Mobile App Integration

### Zustand Store ↔ API Mapping

| Zustand State | API Endpoint | Method |
|---------------|-------------|--------|
| `addTransaction()` | POST `/api/transactions/` | Create |
| `getDashboard()` | GET `/api/dashboard/` | Read |
| `setTargets()` | PATCH `/api/allocations/` | Update |
| `addVault()` | POST `/api/vaults/` | Create |
| `topUpSafetyNet()` | PATCH `/api/profile/` | Update |
| `syncOfflineData()` | POST `/api/sync/` | Batch |

### Expected Response Formats

**Dashboard summary:**
```json
{
  "cash_on_hand": 1250,
  "momo_balance": 3200,
  "total_saved": 8700,
  "top_expense": "Fuel",
  "top_expense_amount": 450,
  "safety_net": 2400,
  "safety_net_target": 5000,
  "recent_transactions": [...],
  "high_profit_days": 4,
  "break_even_days": 2,
  "loss_days": 1
}
```

**Transaction list:**
```json
{
  "count": 150,
  "next": "http://...page=2",
  "results": [
    {
      "id": 1,
      "amount": "150.00",
      "transaction_type": "EXPENSE",
      "method": "CASH",
      "category": 3,
      "category_name": "Fuel",
      "intent": "Afternoon fuel",
      "created_at": "2026-04-22T14:30:00Z"
    }
  ]
}
```

---

## 🧪 Testing with curl

```bash
# Create user + get token
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","email":"bob@test.com","password":"test123","password_confirm":"test123"}'

TOKEN=$(curl -s -X POST http://localhost:8000/api/token/ \
  -d "username=bob&password=test123" | jq -r .access)

# Dashboard
curl http://localhost:8000/api/dashboard/ \
  -H "Authorization: Bearer $TOKEN"

# List vaults
curl http://localhost:8000/api/vaults/ \
  -H "Authorization: Bearer $TOKEN"

# Add transaction
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":"200","transaction_type":"INCOME","method":"MOMO","category":1,"intent":"Morning fares"}'
```

---

## 🐛 Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Missing/invalid token | Get fresh token |
| `403 Forbidden` | User not owner | Check data ownership |
| `404 Not Found` | Wrong ID or user | Verify object belongs to user |
| `400 Validation` | Invalid payload | Check field types, required |
| `500 Server` | DB connection | Verify `DATABASE_URL` |

---

## 🚀 Production Deployment Checklist

- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` with domain
- [ ] Set strong `SECRET_KEY`
- [ ] Use Supabase PostgreSQL (`DATABASE_URL`)
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set `CORS_ALLOWED_ORIGINS` (exact origins)
- [ ] Run `python manage.py collectstatic`
- [ ] Configure Gunicorn + Nginx
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Enable logging to file
- [ ] Configure email backend (SMTP)
- [ ] Set up backup (Supabase automated)
- [ ] Enable rate limiting (optional)

---

**Last Updated:** 2026-04-22  
**API Version:** 1.0  
**Docs Location:** `server/README.md`
