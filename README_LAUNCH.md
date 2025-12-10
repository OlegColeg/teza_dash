
## ⚡ Quick Start (Copie-Paste Comenzile)

### Terminal 1 - Backend Server
```bash
cd "/Users/macbook/Desktop/Admin Dashboard/teza_dash/backend"
npm run dev
```
```
✅ Server running on http://localhost:3001
✅ Database connected
✅ Users table created
✅ Employees table created
✅ Contacts table created
✅ Invoices table created
```

### Terminal 2 - Frontend Server
```bash
cd "/Users/macbook/Desktop/Admin Dashboard/teza_dash"
npm run dev
```


```
  ▲ Next.js 15.1.6
  - Local:        http://localhost:3000
```

### Acces din Browser
- Deschide: http://localhost:3000
- Click "Înregistrare" și crează cont
- Completează formularul și apasă "Creează Cont"
- Ar trebui redirecționat automat la Dashboard

---

## ✅ Ce Sunt Funcțional

### ✔️ Autentificare
- [x] Register utilizatori noi
- [x] Login cu email/parolă
- [x] JWT tokens
- [x] Logout
- [x] Protected routes

### ✔️ CRUD Angajați
- [x] View toti angajații
- [x] Adaugă angajat nou
- [x] Editează angajat
- [x] Șterge angajat
- [x] Caută după nume/email

### ✔️ CRUD Contacte
- [x] View tote contactele
- [x] Șterge contact
- [x] Caută după nume

### ✔️ CRUD Facturi
- [x] View tote facturile
- [x] Statistici (Total, Numărul, Pending)
- [x] Șterge factura
- [x] Caută după numar

### ✔️ Management Profil
- [x] View profil utilizator curent
- [x] View informații din sidebar

### ✔️ UI/UX
- [x] Dark theme cu Tailwind CSS
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Smooth animations

---

## 🗄️ Database Tables Creat

```
✅ users (email, password, firstName, lastName, phone, city, role)
✅ employees (firstName, lastName, email, phone, department, position, salary, hireDate, status)
✅ contacts (firstName, lastName, email, phone, company, message)
✅ invoices (invoiceNumber, userId, amount, description, status, dueDate)
```

---

## 📚 API Endpoints (Gata)

### Auth (/auth)
```
POST   /auth/register       - Register user
POST   /auth/login          - Login user
GET    /auth/profile        - Get current user (auth required)
```

### Users (/users)
```
GET    /users               - Get all users (admin only)
GET    /users/:id           - Get user by ID
PUT    /users/:id           - Update user
DELETE /users/:id           - Delete user (admin only)
```

### Employees (/employees)
```
GET    /employees           - Get all employees
POST   /employees           - Create employee
GET    /employees/:id       - Get employee by ID
PUT    /employees/:id       - Update employee
DELETE /employees/:id       - Delete employee
```

### Contacts (/contacts)
```
GET    /contacts            - Get all contacts (auth required)
POST   /contacts            - Create contact (public)
GET    /contacts/:id        - Get contact by ID
DELETE /contacts/:id        - Delete contact (auth required)
```

### Invoices (/invoices)
```
GET    /invoices            - Get all invoices (auth required)
POST   /invoices            - Create invoice (auth required)
GET    /invoices/:id        - Get invoice by ID
PUT    /invoices/:id        - Update invoice (auth required)
DELETE /invoices/:id        - Delete invoice (auth required)
```

---

## 🧪 Test Rapid

### 1. Register Test User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Ion",
    "lastName": "Popescu",
    "phone": "+373 60 123 456",
    "city": "Chișinău"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

(Copiază `access_token` din response)

### 3. Create Employee (înlocuiți TOKEN)
```bash
curl -X POST http://localhost:3001/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "firstName": "Maria",
    "lastName": "Iacob",
    "email": "maria@company.com",
    "phone": "+373 60 555 555",
    "department": "IT",
    "position": "Developer",
    "salary": 3500,
    "hireDate": "2024-01-15",
    "status": "active"
  }'
```

### 4. Get All Employees
```bash
curl http://localhost:3001/employees \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 📁 Structura Proiect

```
teza_dash/
├── backend/                    # Node.js Express API
│   ├── config/
│   │   └── database.js         # PostgreSQL connection + table setup
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT verification
│   ├── routes/
│   │   ├── auth.routes.js      # Login/Register
│   │   ├── user.routes.js      # User CRUD
│   │   ├── employee.routes.js  # Employee CRUD
│   │   ├── contact.routes.js   # Contact CRUD
│   │   └── invoice.routes.js   # Invoice CRUD
│   ├── server.js               # Main server entry
│   └── package.json            # Backend dependencies
│
├── src/
│   └── app/
│       ├── auth/page.jsx       # Login/Register page
│       ├── dashboard/
│       │   └── employees/page.jsx  # Employees management
│       ├── contacts/page.jsx   # Contacts list
│       ├── invoices/page.jsx   # Invoices management
│       ├── components/
│       │   └── layout/         # Sidebar, Navbar, Footer
│       └── utils/
│           └── auth.js         # Auth helper functions
│
└── package.json                # Frontend dependencies
```

---

## 🚀 Deploy (Optional)

Dacă vrei să pui pe producție:

1. **Backend** - Railway, Heroku, Render
2. **Frontend** - Vercel, Netlify
3. **Database** - AWS RDS, Heroku Postgres

---

## 💡 Tips

- Token expiră după 7 zile (modifică JWT_EXPIRE în .env dacă vrei)
- Schimbă `JWT_SECRET` în .env înainte de production
- Default user role: `user`
- Admin role pentru: Delete users, Get all users
- Passwordele sunt hashe cu bcrypt (10 rounds)

---

## 🐛 Troubleshooting

| Problemă | Soluție |
|----------|----------|
| "Port 3000/3001 in use" | `lsof -ti:3000 \| xargs kill -9` |
| "Database connection failed" | Verifică psql: `psql -U postgres -d teza_dashboard -c "SELECT 1;"` |
| "CORS error" | Backend trebuie pe 3001, frontend pe 3000 |
| "Token invalid" | Login din nou pentru token nou |
| "Table doesn't exist" | Backend creează tabele automat la startup |

---

## 📞 Contact/Support

Dacă ceva nu funcționează:
1. Verifi că ambele servere rulează (`npm run dev`)
2. Deschide DevTools (F12) pe browser și cauta erori în Console
3. Verifi PostgreSQL: `brew services list | grep postgres`
4. Citește server logs din terminal

---

**Gata! Site-ul tău e funcțional! 🎉**

Ai un dashboard complet cu backend PostgreSQL, autentificare JWT, și CRUD-uri pentru angajați, contacte și facturi. Succes cu teza! 💪
