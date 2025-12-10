# Teza Dashboard Backend

Backend pentru Teza Dashboard Admin cu autentificare JWT și PostgreSQL.

## Setup

### 1. Install PostgreSQL
- Descarcă și instalează PostgreSQL de la https://www.postgresql.org/download/macosx/
- La setup, ține-te minte credențialele (default: user=postgres, password=postgres)

### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE teza_dashboard;
\q
```

### 3. Install dependencies
```bash
cd backend
npm install
```

### 4. Configure .env
Editează `backend/.env` cu datele tale de bază de date.

### 5. Run server
```bash
npm run dev
```

Server va rula pe `http://localhost:3001`

## API Endpoints

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user (require token)

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin only)

### Employees
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

## Database Schema

### Users Table
- id (PK)
- email (UNIQUE)
- password (hashed)
- first_name
- last_name
- phone
- city
- role (user/admin)
- created_at
- updated_at

### Employees Table
- id (PK)
- first_name
- last_name
- email (UNIQUE)
- phone
- department
- position
- salary
- hire_date
- status (active/inactive)
- created_at
- updated_at

### Contacts Table
- id (PK)
- first_name
- last_name
- email
- phone
- company
- message
- created_at
- updated_at

### Invoices Table
- id (PK)
- invoice_number (UNIQUE)
- user_id (FK)
- amount
- description
- status (pending/paid)
- due_date
- created_at
- updated_at
