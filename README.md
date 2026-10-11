# Credit-Ledger

A customer credit (udhaar) management web app for small shopkeepers. The shopkeeper logs in, adds customers, records the credit given and the payments received, and always sees how much each customer still has to pay.

Spring Boot REST API (backend) + React (frontend) + Oracle Database.

## Features

- Login with JWT (passwords are hashed with BCrypt); all customer data needs a valid token
- Add, view, edit and delete customers (a customer who has entries cannot be deleted)
- Add credit and payment entries for each customer, with a full entry history
- Pending amount is calculated from the entries (credit minus payments)
- Customer list with search and pending amount; an "Advance" badge when a customer has paid extra
- WhatsApp reminder button that opens a message link for customers who have a pending amount
- Input validation (for example, 10-digit mobile number) with clear error messages

## Tech Stack

- **Backend:** Java 21, Spring Boot, Spring Data JPA, Spring Security + JWT (jjwt), Validation, Lombok, Maven
- **Database:** Oracle (FREE / XE)
- **Frontend:** React (Vite), react-router-dom, plain CSS

## Project Structure

```
credit-ledger/          Spring Boot backend
  src/main/java/com/nit/credit_ledger
    config/             CORS and security configuration
    controller/         Auth, Customer, Transaction controllers
    dto/                AuthRequest, CustomerSummary
    entity/             Customer, Transaction, TransactionType, User
    exception/          Not-found exception and global error handler
    repository/         Spring Data JPA repositories
    security/           JwtUtil and JwtAuthFilter
    service/            Auth, Customer, Transaction services
credit-ledger-ui/       React frontend
  src/pages/            Login, CustomerList, CustomerDetails
  src/components/       ProtectedRoute
  src/api.js            API URLs and authFetch (adds the token)
```

## Run It Locally

**You need:** Java 21, an Oracle database (XE / FREE), Node.js (LTS), and VS Code (or any IDE).

### 1. Backend

1. Go to `credit-ledger/src/main/resources`.
2. Copy `application-local.properties.example` to `application-local.properties` and put your own database username, password and a long JWT secret (at least 32 characters). This file is ignored by Git.
3. Open the `credit-ledger` folder and run `CreditLedgerApplication` (or `./mvnw spring-boot:run`).
4. The backend runs on `http://localhost:8080`. Tables are created automatically on first run.

### 2. Frontend

```
cd credit-ledger-ui
npm install
npm run dev
```

Open `http://localhost:5173`.

### 3. Create your first user

There is no register page. Create a shopkeeper account once using Postman:

`POST http://localhost:8080/api/auth/register` with JSON body

```json
{ "username": "shop1", "password": "your-password" }
```

Then log in with the same username and password on the login page.

## API Endpoints

| Method | URL | What |
| ------ | --- | ---- |
| POST | `/api/auth/register` | create a shopkeeper account |
| POST | `/api/auth/login` | log in, returns a JWT token |
| POST | `/api/customers` | add a customer |
| GET | `/api/customers` | list customers |
| GET | `/api/customers/summary` | customers with pending amount |
| GET | `/api/customers/{id}` | one customer |
| PUT | `/api/customers/{id}` | edit a customer |
| DELETE | `/api/customers/{id}` | delete a customer (blocked if entries exist) |
| POST | `/api/customers/{customerId}/transactions` | add a credit or payment entry |
| GET | `/api/customers/{customerId}/transactions` | entry history |
| GET | `/api/customers/{customerId}/pending` | pending amount |

All endpoints except `/api/auth/**` need the header `Authorization: Bearer <token>`.
