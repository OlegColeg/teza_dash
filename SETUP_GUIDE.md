# 🚀 Setup Complet - Teza Dashboard (Backend + Frontend)

## Prerequisite: PostgreSQL

### 1. Instalare PostgreSQL pe macOS

**Opțiunea 1: Folosind Homebrew (Recomandată)**
```bash
brew install postgresql@15
```

**Opțiunea 2: Descarcă Direct**
- https://www.postgresql.org/download/macosx/

### 2. Pornire PostgreSQL Service
```bash
# Dacă ai instalat cu Homebrew
brew services start postgresql@15

# Verifică dacă rulează
psql --version
```

### 3. Create Database
```bash
# Accesează PostgreSQL
psql -U postgres

# În psql prompt:
CREATE DATABASE teza_dashboard;
\q
```

Verificare:
```bash
psql -U postgres -d teza_dashboard -c "SELECT 1;"
```

---

## Backend Setup

### 1. Instalare Dependencies
```bash
cd "/Users/macbook/Desktop/Admin Dashboard/teza_dash/backend"
npm install
```

### 2. Configurare .env
Verifică că `backend/.env` are aceste valori:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teza_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
PORT=3001
NODE_ENV=development
```

### 3. Pornire Backend Server
```bash
npm run dev
```

Trebuie să vezi:
```
✅ Database connected: 2024-12-10T...
✅ Users table created
✅ Employees table created
✅ Contacts table created
✅ Invoices table created
✅ Server running on http://localhost:3001
```

---

## Frontend Setup

### 1. Instalare Dependencies (dacă nu ai făcut deja)
```bash
cd "/Users/macbook/Desktop/Admin Dashboard/teza_dash"
npm install
```

### 2. Pornire Frontend Dev Server (în alt terminal)
```bash
npm run dev
```

Trebuie să vezi:
```
  ▲ Next.js 15.1.6
  - Local:        http://localhost:3000
```

---

## 🧪 Testing End-to-End

### Test 1: Health Check Backend
```bash
curl http://localhost:3001/health
```

Așteptă răspuns:
```json
{"status":"Server is running","timestamp":"2024-12-10T..."}
```

### Test 2: Register User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Ion",
    "lastName": "Popescu",
    "phone": "+373 60 000 000",
    "city": "Chișinău"
  }'
```

Așteptă Token:
```json
{
  "message": "User registered successfully",
  "access_token": "eyJhbGciOi...",
  "user": {...}
}
```

### Test 3: Login User
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 4: Create Employee
```bash
# Folosește token-ul de mai sus în locul TOKEN_HERE
curl -X POST http://localhost:3001/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "firstName": "Maria",
    "lastName": "Iacob",
    "email": "maria@company.com",
    "phone": "+373 60 111 111",
    "department": "IT",
    "position": "Developer",
    "salary": 3000,
    "hireDate": "2024-01-15",
    "status": "active"
  }'
```

### Test 5: Access Frontend
1. Deschide http://localhost:3000
2. Click "Înregistrare" și creează cont cu email/parolă
3. Ar trebui redirecționat la Dashboard
4. Navighează la "Manage Team" din sidebar
5. Click "Adaugă Angajat" și adaugă angajați

---

## API Endpoints disponibili

### Auth
- `POST /auth/register` - Register utilizator nou
- `POST /auth/login` - Login utilizator
- `GET /auth/profile` - Get profil curent (necesită token)

### Users
- `GET /users` - Get toti utilizatorii (admin only)
- `GET /users/:id` - Get utilizator by ID
- `PUT /users/:id` - Update utilizator
- `DELETE /users/:id` - Delete utilizator (admin only)

### Employees
- `GET /employees` - Get toti angajatii
- `POST /employees` - Create angajat
- `GET /employees/:id` - Get angajat by ID
- `PUT /employees/:id` - Update angajat
- `DELETE /employees/:id` - Delete angajat

### Contacts
- `GET /contacts` - Get toti contactele (auth required)
- `POST /contacts` - Create contact (public)
- `DELETE /contacts/:id` - Delete contact (auth required)

### Invoices
- `GET /invoices` - Get tote facturile (auth required)
- `POST /invoices` - Create factura (auth required)
- `PUT /invoices/:id` - Update factura (auth required)
- `DELETE /invoices/:id` - Delete factura (auth required)

---

## Troubleshooting

### PostgreSQL nu se conectează
```bash
# Verify serviciul ruleaza
brew services list | grep postgres

# Restart
brew services restart postgresql@15
```

### Port 3001 este deja în use
```bash
# Kill procesul care ocupă portul
lsof -ti:3001 | xargs kill -9

# Sau foloseste alt port
PORT=3002 npm run dev
```

### Eroare: "database teza_dashboard does not exist"
```bash
psql -U postgres
CREATE DATABASE teza_dashboard;
\q
```

### Token expired
- Tokens sunt valabile 7 zile
- Login din nou pentru a obține token nou

### CORS errors
- Asigură-te că backend ruleaza pe 3001 și frontend pe 3000
- Backend-ul are CORS enabled pentru toate requesturile

---

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  city VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  salary DECIMAL(10, 2),
  hire_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📝 Notes

- Default role pentru noi utilizatori: `user`
- Admin role necesară pentru: GET all users, DELETE users
- Passworde sunt hashe cu bcrypt (10 rounds)
- JWT tokens expiră după 7 zile
- Modifică JWT_SECRET în production!

---

## Succes! 🎉

Odată ce backend și frontend rulează, site-ul ar trebui să fie funcțional cu:
- ✅ Autentificare cu JWT
- ✅ CRUD pentru angajați
- ✅ CRUD pentru contacte
- ✅ CRUD pentru facturi
- ✅ Management profil utilizator
- ✅ Dark theme cu Tailwind CSS

Dacă ai probleme, citește error message-urile din:
1. Browser Console (F12 → Console tab)
2. Backend Terminal (output din `npm run dev`)
3. PostgreSQL logs
