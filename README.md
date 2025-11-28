# Venue Booking Backend API

A REST API for managing venue bookings and inquiries built with TypeScript, Express, Prisma, and PostgreSQL.

## Features

- List venues with filtering and pagination
- Filter venues by location, capacity, and price
- Create booking inquiries with validation
- Automatic capacity validation
- Availability checking (no double-booking)
- Database connection logging

## Tech Stack

- **TypeScript** - Type-safe code
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use the provided Neon database)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Venues

#### GET /api/venues
Get a list of venues with optional filtering and pagination.

**Query Parameters:**
- `location` (string, optional) - Filter by city
- `minCapacity` (number, optional) - Minimum venue capacity
- `maxPricePerNight` (number, optional) - Maximum price per night
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Items per page

**Example:**
```bash
# Get all venues
curl http://localhost:3000/api/venues

# Filter by location
curl http://localhost:3000/api/venues?location=Denver

# Filter by capacity and price
curl http://localhost:3000/api/venues?minCapacity=40&maxPricePerNight=3000

# With pagination
curl http://localhost:3000/api/venues?page=2&limit=5
```

**Response:**
```json
{
  "data": [
    {
      "id": "clxxx...",
      "name": "Mountain View Resort",
      "description": "Stunning mountain resort...",
      "location": "Denver",
      "address": "123 Mountain Rd, Denver, CO 80202",
      "capacity": 50,
      "pricePerNight": 2500,
      "amenities": ["WiFi", "Conference Room", "Catering"],
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

#### GET /api/venues/:id
Get a single venue by ID.

**Example:**
```bash
curl http://localhost:3000/api/venues/clxxx...
```

### Booking Inquiries

#### POST /api/bookings
Create a new booking inquiry.

**Request Body:**
```json
{
  "venueId": "clxxx...",
  "companyName": "Tech Corp",
  "email": "contact@techcorp.com",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-05T00:00:00.000Z",
  "attendeeCount": 30
}
```

**Validation:**
- All fields are required
- Email must be valid
- Start date must be before end date
- Attendee count must not exceed venue capacity
- Venue must be available for selected dates

**Example:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": "clxxx...",
    "companyName": "Tech Corp",
    "email": "contact@techcorp.com",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-05T00:00:00.000Z",
    "attendeeCount": 30
  }'
```

**Response:**
```json
{
  "message": "Booking inquiry created successfully",
  "data": {
    "id": "clyyy...",
    "venueId": "clxxx...",
    "companyName": "Tech Corp",
    "email": "contact@techcorp.com",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-05T00:00:00.000Z",
    "attendeeCount": 30,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "venue": {
      "name": "Mountain View Resort",
      "location": "Denver",
      "pricePerNight": 2500
    }
  }
}
```

#### GET /api/bookings
Get all booking inquiries.

**Example:**
```bash
curl http://localhost:3000/api/bookings
```

#### GET /api/bookings/:id
Get a single booking inquiry by ID.

**Example:**
```bash
curl http://localhost:3000/api/bookings/clyyy...
```

## Database Schema

### Venue
- id (String, PK)
- name (String)
- description (String)
- location (String) - Indexed
- address (String)
- capacity (Int) - Indexed
- pricePerNight (Float) - Indexed
- amenities (String[])
- imageUrl (String, optional)
- timestamps

### BookingInquiry
- id (String, PK)
- venueId (String, FK) - Indexed
- companyName (String)
- email (String)
- startDate (DateTime) - Indexed
- endDate (DateTime) - Indexed
- attendeeCount (Int)
- status (String) - Default: "pending"
- timestamps

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

The application follows a **modular three-layer architecture** (Routes → Controller → Service). See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information.

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── lib/
│   │   └── db.ts          # Database connection
│   ├── modules/           # Modular architecture
│   │   ├── venues/
│   │   │   ├── index.ts   # Module exports
│   │   │   ├── routes.ts  # HTTP route definitions
│   │   │   ├── controller.ts  # Request/response handling
│   │   │   └── service.ts     # Business logic
│   │   └── bookings/
│   │       ├── index.ts   # Module exports
│   │       ├── routes.ts  # HTTP route definitions
│   │       ├── controller.ts  # Request/response handling
│   │       └── service.ts     # Business logic
│   ├── types/
│   │   └── venue.types.ts # Type definitions & validation
│   └── index.ts           # Main server file
├── .env                   # Environment variables
├── ARCHITECTURE.md        # Architecture documentation
├── package.json
└── tsconfig.json
```

### Architecture Layers

- **Routes**: Define HTTP endpoints and map to controllers
- **Controllers**: Handle requests, validate input, format responses
- **Services**: Implement business logic and database operations

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (e.g., venue not available)
- `500` - Internal Server Error

Error responses include descriptive messages:
```json
{
  "error": "Validation error",
  "message": "Attendee count exceeds venue capacity"
}
```
# app-backend
# Hotel-Venue
# Hotel-Venue
# Hotel-Venue
