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
- `csv filer/user.csv`

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
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Posters**: `GET /api/posters`, `GET /api/posters/:id`, `POST/PUT/DELETE` (ADMIN)
- **Genres**: `GET /api/genres`, `GET /api/genres/:id`, `POST/PUT/DELETE` (ADMIN)
- **Users**: `GET /api/users` (ADMIN), `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id` (ADMIN)
- **Cart**: `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`
- **Ratings**: `GET /api/ratings`, `GET /api/ratings/poster/:posterId`, `POST/PUT/DELETE /api/ratings` (auth)

## Postman Collection
Import denne collection for at teste API'et:
[Wallywood API Postman Collection](https://jackshansen-5646948.postman.co/workspace/WallyWood~903fa4c3-a7af-4c08-a39d-6d9597dd0eaf/collection/49431152-81ef0f3b-c294-4271-b3e1-1d0ad3fbed16?action=share&creator=49431152)

### Postman setup:
- Import collection from link above
- Create environment: `baseUrl = http://localhost:3000`, `token = (empty)`, `userId = (empty)`
- Login request has Tests script that auto-sets `{{token}}` and `{{userId}}`
- Collection uses Bearer Token auth with `{{token}}`

## GitHub
Initialize and push:
```
git init
git add .
git commit -m "Initial Wallywood API"
git branch -M main
git remote add origin https://github.com/<your-username>/wallywood-api.git
git push -u origin main

