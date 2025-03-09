# Inventory Express Server

## Objective

Create an Express Server for managing perishable inventory

## Installation

Ensure node version running is 20 and above

```bash
npm install
```

## Running db and app setup

Run a local DB instance via docker

```bash
npm run dev:up
```

Run DB migrations

```bash
npm run db:migrate
```

Generate Prisma client for db interactions

```bash
npm run prismaGenerate
```

Stop and Close local DB instance via docker

```bash
npm run dev:down
```

Reset local DB contents

```bash
npm run db:reset
```

## Running the app server

Ensure you have setup your env variables before continuing. Copy the contents of .env.example file

To build the app

```bash
npm run build
```

##### run app in development watch mode

```bash
npm run dev
```

##### run app in production mode

```bash
npm run start
```

## Running test cases

```bash
npm run test
```
