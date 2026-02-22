# Release Checklist API

This repository contains the backend API for the Release Checklist Tool.
The API allows creating and managing software releases and tracking their progress using a fixed checklist of steps.

The application is intentionally single-user and focuses on simplicity and correctness.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL (Neon)
- pg

---

## Prerequisites

- Node.js (v18 or later recommended)
- npm
- A PostgreSQL database (Neon or any hosted Postgres)

---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/Magneto008/release-checklist-backend
cd release-checklist-api

### 2. Install dependencies

npm install

### 3. Configure environment variables

Create a `.env` file in the root directory:

PORT=3000  
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require

---

## Database Schema

Run the following SQL in your PostgreSQL database:

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  due_date TIMESTAMP NOT NULL,
  additional_info TEXT,
  steps JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

Each release stores the completion state of its checklist steps in the `steps` JSONB column.

---

## API Endpoints

GET /api/releases  
Returns a list of all releases.

POST /api/releases  
Creates a new release.

Request body example:
{
  "name": "March Release",
  "dueDate": "2026-03-20T10:00:00Z",
  "additionalInfo": "Optional notes"
}

PUT /api/releases/:id  
Updates a release’s checklist steps or additional information.

Request body example:
{
  "steps": {
    "tests_passed": true
  }
}

DELETE /api/releases/:id  
Deletes a release (optional feature).

---

## Running the Server Locally

npm run dev

The API will be available at:
http://localhost:3000

---

## Notes

- Release status is automatically computed:
  - No steps completed → planned
  - Some steps completed → ongoing
  - All steps completed → done
- There is no user authentication by design.

---

## Deployment

The API can be deployed to platforms like Render or Railway.
Make sure to set the DATABASE_URL environment variable in the hosting dashboard.
