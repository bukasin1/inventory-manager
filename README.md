# auth-rbac-app

## Objective

Create an Express Server for managing perishable inventory

## Installation

```bash
# Ensure node version running is 16 and above
npm install
```

## Running db and app setup

```bash
# Run a local DB instance via docker
npm run dev:up

# Stop and Close local DB instance via docker
npm run dev:down

# Reset local DB contents
npm run db:reset

# Run DB migrations
npm run db:migrate

# Generate Prisma client for db interactions
npm run prismaGenerate
```

## Running the app server

```bash
# Ensure you have setup your env variables before continuing. Copy the contents of .env.example file

# development watch mode
npm run dev

# production mode
npm run start
```