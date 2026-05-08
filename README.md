## SMS Elevanda – Admin Portal (Staff)

This is the **Admin/Staff** application for **SMS Elevanda** (Elevanda Ventures).

Admins can:
- verify user devices (required before login works)
- manage classes and assign teachers
- view students, teachers, fee payments, grades, and attendance

## Tech stack
- **Backend**: Node.js, Express.js, PostgreSQL, Prisma, JWT (httpOnly cookies), SHA-512 password hashing, Zod, Helmet, express-rate-limit, Swagger
- **Frontend**: React + Vite, Tailwind CSS, Zustand, Axios, React Router v6, React Hook Form + Zod

## Prerequisites
- Node.js (LTS)
- PostgreSQL running locally
- A database created, for example: `sms_elevanda`

## Project structure
- `backend/`: Express API + Prisma
- `frontend/`: React admin dashboard

## Environment variables
Create `backend/.env` from `backend/.env.example` and update the values:

- **`DATABASE_URL`**: `postgresql://USER:PASSWORD@localhost:PORT/sms_elevanda`
- **`JWT_SECRET`**: long random string
- **`PORT`**: `5001` (default)
- **`CLIENT_URL`**: your frontend URL (example: `http://localhost:5175`)

## Setup and run (step by step)

### 1) Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs on `http://localhost:5001`.

**API documentation (Swagger UI):** `http://localhost:5001/api/docs`  
**OpenAPI JSON** (import into Postman or other tools): `http://localhost:5001/api/openapi.json`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on a Vite port like `http://localhost:5175`.

If your frontend port changes, update `backend/.env` `CLIENT_URL` to match.

## Create your first admin user
Use Swagger or any API client:
- **POST** `/api/auth/register` with `role: "ADMIN"` and your `deviceId`
- then verify the device using the **Users** page (or scripts below)

If you prefer Prisma Studio:
```bash
cd backend
npx prisma studio
```

## Seeding (optional)
This repository does **not** ship with a seed script. For demo data, you can create users/classes using the UI and Prisma Studio.

## Important login rule (device verification)
Login will fail with **403** until the user’s device is verified.

The backend checks:
- **deviceId must match** the browser Device ID
- **isDeviceVerified must be true**

### If you see "Device mismatch" (same browser, "same" ID in Prisma)

1. **Same URL every time:** The admin app saves the device ID in **browser localStorage per origin**. `http://localhost:5174` and `http://localhost:5175` are **two different origins** — each gets its **own** ID. Always open the admin UI on the **same** host and **port** (and match `CLIENT_URL` in `backend/.env` to that origin).

2. **Copy the ID from the login page** you actually use, then set `User.deviceId` in Prisma Studio to that exact string (no extra spaces or line breaks).

3. After editing in Prisma Studio, confirm `deviceId` in the table matches the login page character-for-character.

## Helpful scripts (backend)
Run scripts from `backend/`:

```bash
node scripts/check-user.cjs email@example.com
node scripts/verify-user.cjs email@example.com
node scripts/set-device.cjs email@example.com <deviceIdFromLoginPage>
node scripts/reset-password.cjs email@example.com <newPassword>
```

## API endpoints (Admin)

### Auth
- **POST** `/api/auth/register`: register staff (ADMIN/TEACHER) with `deviceId`
- **POST** `/api/auth/login`: login (device must match and be verified)
- **POST** `/api/auth/logout`: logout (clears cookie)

### Admin (requires ADMIN + auth cookie)
- **GET** `/api/admin/dashboard/stats`: dashboard statistics
- **GET** `/api/admin/users`: list all users
- **PATCH** `/api/admin/users/:id/verify-device`: verify a user device
- **GET** `/api/admin/teachers`: list teachers (includes assigned classes)
- **GET** `/api/admin/students`: list students (class + parent details)
- **GET** `/api/admin/classes`: list classes
- **POST** `/api/admin/classes`: create class
- **PATCH** `/api/admin/classes/:id`: update class (rename / assign teacher)
- **DELETE** `/api/admin/classes/:id`: delete class
- **GET** `/api/admin/fees`: list all fee transactions
- **GET** `/api/admin/grades`: list all grades (filters: `classId`, `term`, `subject`)
- **GET** `/api/admin/attendance`: list attendance (filters: `classId`, `status`, `dateFrom`, `dateTo`)

## Assumptions
- The database schema is shared with the client app for consistency.
- Sessions are handled with JWT stored in **httpOnly cookies**.
- Password hashing uses **SHA-512** (as required by the test).
- Basic security is enabled: Helmet headers + rate limiting + Zod validation on request bodies.

## Security notes (what is enforced)
- Passwords are hashed with **SHA-512 + salt**
- JWT is stored in an **httpOnly cookie** (not localStorage)
- **Helmet** is enabled
- **Rate limiting** is enabled (API abuse protection)
- Request bodies are validated using **Zod**



