# Wallywood API

Node.js + Express + TypeScript + Prisma REST API for Wallywood film posters.

## Prerequisites
- Node.js 18+
- MySQL 8+ running locally
- Git
- Recommended: Postman

## Environment
Create `.env` in `Wallywood-api`:
```
DATABASE_URL="mysql://<user>:<password>@localhost:3306/Wallywood"
JWT_SECRET="change-me"
PORT=3000
```

## Install
From `Wallywood-api`:
```
npm install
```

## Prisma
Generate client and run migrations:
```
npx prisma generate
npx prisma migrate dev --name init
```

## Seed data
CSV files are in:
- `Filer til opgaven/genre.csv`
- `Filer til opgaven/poster.csv`
- `Filer til opgaven/genrePosterRel.csv`
- `csv filer/CartLine.csv`
- `csv filer/UserRating.csv`

Seed database:
```
npm run seed
```

If file path issues occur, seed script auto-resolves from:
- `Filer til opgaven`
- `csv filer`
- project root

## Run
```
npm run dev
```
Server: `http://localhost:3000`

## Auth
Login to get token:
```
POST /api/auth/login
Body: { "email": "admin@wallywood.dk", "password": "password123" }
```
Use `Authorization: Bearer <token>` for protected routes.

## Endpoints (examples)
- Posters: `GET /api/posters`, `GET /api/posters/:id`, `POST/PUT/DELETE` (ADMIN)
- Genres: `GET /api/genres`, `GET /api/genres/:id`, `POST/PUT/DELETE` (ADMIN)
- Users: `GET /api/users` (ADMIN), `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id` (ADMIN)
- Cart: `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`
- Ratings: `GET /api/ratings`, `GET /api/ratings/poster/:posterId`, `POST/PUT/DELETE /api/ratings` (auth)

## Postman
- Import requests, add `Bearer` token from `/api/auth/login`.
- Test get:
  - `GET http://localhost:3000/api/posters`
  - `GET http://localhost:3000/api/genres`

## GitHub
Initialize and push:
```
git init
git add .
git commit -m "Initial Wallywood API"
git branch -M main
git remote add origin https://github.com/<your-username>/wallywood-api.git
git push -u origin main
