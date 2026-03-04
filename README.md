# GachaMerch Backend

REST API backend for GachaMerch a Genshin Impact-themed weapon merchandise platform where users can browse, purchase, and manage weapon collections using in-game coins.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + Google OAuth
- **Validation**: Joi
- **Docs**: Swagger UI (`/api/docs`)

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- Google OAuth credentials (for Google login)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gachamerch
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### Database Setup

```bash
npx prisma migrate dev
npm run prisma:seed
```

### Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

| Method | Endpoint             | Auth  | Description                    |
| ------ | -------------------- | ----- | ------------------------------ |
| POST   | `/api/auth/register` | -     | Register with email & password |
| POST   | `/api/auth/login`    | -     | Login with email/username      |
| POST   | `/api/auth/google`   | -     | Login with Google              |
| GET    | `/api/auth/me`       | JWT   | Get current user               |
| PATCH  | `/api/auth/profile`  | JWT   | Update username/password       |
| GET    | `/api/weapons`       | -     | List weapons (paginated)       |
| POST   | `/api/weapons`       | Admin | Create weapon                  |
| PUT    | `/api/weapons/:id`   | Admin | Update weapon                  |
| DELETE | `/api/weapons/:id`   | Admin | Delete weapon                  |
| GET    | `/api/shop`          | -     | Browse shop                    |
| POST   | `/api/order/buy`     | JWT   | Purchase weapon with coins     |
| GET    | `/api/inventory`     | JWT   | View owned weapons             |
| GET    | `/api/notifications` | -     | Get notifications              |

Full API documentation available at `/api/docs` (Swagger UI).

## Project Structure

```
src/
├── controllers/    # Route handlers
├── middlewares/    # Auth, validation, etc.
├── routes/         # Express routers
├── services/       # Business logic
└── index.ts        # App entry point
prisma/
├── schema.prisma   # DB schema
└── seed.ts         # Seed data
assets/
└── data/           # Weapon data (JSON)
```
