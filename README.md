# Task Management API

A RESTful API built with NestJS for managing tasks, users, and categories. This application provides user authentication, task management, and category organization features.

## Features

- **User Management**: User registration and authentication with JWT
- **Task Management**: Create, read, update, and delete tasks
- **Category Management**: Organize tasks with custom categories
- **Authentication**: Secure endpoints with JWT tokens
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI documentation
- **Data Validation**: Input validation with class-validator

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcryptjs
- **Containerization**: Docker & Docker Compose

## Prerequisites

### For Local Development

- Node.js (22.18.0)
- PostgreSQL (16.10)
- npm

### For Docker Development

- Docker
- Docker Compose

> **Note**: With Docker, you don't need to install Node.js or PostgreSQL locally.

## Installation

### Option 1: Local Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd taskmanagement
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
# If you run a local PostgreSQL server directly (not Docker), leave 5432 (or your local port):
# DATABASE_URL="postgresql://username:password@localhost:5432/taskmanagement"
# If you want to use the Docker Postgres from docker-compose.dev.yml (host port 5433 -> container 5432):
DATABASE_URL="postgresql://username:password@localhost:5433/taskmanagement"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1h"
PORT=3000
```

4. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run seed
```

### Option 2: Docker Setup (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd taskmanagement
```

2. Start with Docker Compose:

```bash
# For development
docker-compose -f docker-compose.dev.yml up --build

# For production
docker-compose up --build
```

That's it! Docker will handle:

- Installing dependencies
- Setting up PostgreSQL database
- Running database migrations
- Starting the application

> **Note**: The Docker setup automatically configures the database connection and environment variables.

## Running the Application

### Local Development (without Docker)

```bash
# Development mode
npm run start:dev
```

The application will be available at `http://localhost:3000`

### Docker Development

#### Using Docker Compose (Recommended)

For development with hot reload:

```bash
# Build and start services in development mode
docker-compose -f docker-compose.dev.yml up --build

# Run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop services and remove volumes
docker-compose -f docker-compose.dev.yml down -v
```

For production:

```bash
# Build and start services in production mode
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

#### Docker Services

The Docker setup includes:

- **PostgreSQL Database**: Host port 5433 (mapped to container port 5432) in development compose
- **NestJS Application**:
  - Development: Port 3000 (with hot reload)
  - Production: Port 3000

#### Environment Variables for Docker

The Docker containers use the following environment variables:

```env
# Database (inside containers use service name + internal port 5432)
DATABASE_URL=postgresql://username:password@postgres:5432/taskmanagement

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h

# Application
PORT=3000
```

#### Database Management with Docker

```bash
# Run database migrations
docker-compose exec app npx prisma migrate dev

# Reset database
docker-compose exec app npx prisma migrate reset

# Seed the database
docker-compose exec app npm run seed

# Access PostgreSQL directly (inside container network)
docker-compose exec postgres psql -U postgres -d taskmanagement

# Access PostgreSQL from host (dev compose mapped 5433 -> 5432)
psql -h localhost -p 5433 -U postgres -d taskmanagement

# View logs
docker-compose logs app
docker-compose logs postgres
```

#### Building Docker Image Manually

```bash
# Build production image
docker build -t taskmanagement:latest .

# Build development image
docker build --target dev -t taskmanagement:dev .

# Run container manually
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" taskmanagement:latest
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication

- `POST /users/signup` - Register a new user
- `POST /users/login` - Login user

### Tasks (Protected routes)

- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Categories (Protected routes)

- `GET /categories` - Get all categories for authenticated user
- `POST /categories` - Create a new category
- `GET /categories/:id` - Get a specific category
- `PATCH /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a task (with JWT token)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task management API",
    "status": "TODO",
    "dueDate": "2024-12-31T23:59:59Z"
  }'
```

## Database Schema

The application uses three main models:

- **User**: Stores user information and authentication data
- **Category**: Organizes tasks into categories (user-specific)
- **Task**: Main task entity with title, description, status, and due date

## Task Status Values

- `TODO` - Task is pending
- `IN_PROGRESS` - Task is being worked on
- `DONE` - Task is completed

## Project Structure

```
src/
├── auth/          # Authentication module (JWT strategy, guards)
├── users/         # User management (signup, login)
├── tasks/         # Task management (CRUD operations)
├── categories/    # Category management
├── prisma/        # Database service
├── interceptors/  # Global response transformation
├── app.module.ts  # Main application module
└── main.ts        # Application bootstrap
```
