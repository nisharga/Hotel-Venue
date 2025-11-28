# Backend Architecture

This document describes the modular architecture of the Venue Booking Backend API.

## Architecture Pattern

The application follows a **three-layer architecture** pattern:

1. **Routes Layer** - HTTP routing and endpoint definitions
2. **Controller Layer** - Request/response handling and validation
3. **Service Layer** - Business logic and database operations

## Directory Structure

```
src/
├── index.ts                    # Main application entry point
├── lib/
│   └── db.ts                   # Database connection and logging
├── modules/
│   ├── venues/
│   │   ├── index.ts           # Module exports
│   │   ├── routes.ts          # Venue routes (HTTP endpoints)
│   │   ├── controller.ts      # Venue controller (request handling)
│   │   └── service.ts         # Venue service (business logic)
│   └── bookings/
│       ├── index.ts           # Module exports
│       ├── routes.ts          # Booking routes (HTTP endpoints)
│       ├── controller.ts      # Booking controller (request handling)
│       └── service.ts         # Booking service (business logic)
└── types/
    └── venue.types.ts         # Shared types and validation schemas
```

## Layer Responsibilities

### 1. Routes Layer (`routes.ts`)

**Purpose**: Define HTTP endpoints and map them to controller methods

**Responsibilities**:
- Define route paths
- Specify HTTP methods (GET, POST, PUT, DELETE)
- Map routes to controller methods
- No business logic

**Example**:
```typescript
// src/modules/venues/routes.ts
router.get('/', (req, res) => venueController.getVenues(req, res));
router.get('/:id', (req, res) => venueController.getVenueById(req, res));
```

### 2. Controller Layer (`controller.ts`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Validate request data (query params, body, params)
- Call appropriate service methods
- Format responses
- Handle errors and return appropriate HTTP status codes
- No direct database access

**Example**:
```typescript
// src/modules/venues/controller.ts
async getVenues(req: Request, res: Response): Promise<Response> {
  // 1. Validate request
  const validation = venueQuerySchema.safeParse(req.query);

  // 2. Call service
  const result = await venueService.getVenues(filters, pagination);

  // 3. Return response
  return res.json(result);
}
```

### 3. Service Layer (`service.ts`)

**Purpose**: Implement business logic and database operations

**Responsibilities**:
- Business logic implementation
- Database queries using Prisma
- Data transformations
- Reusable methods
- No HTTP-specific code

**Example**:
```typescript
// src/modules/venues/service.ts
async getVenues(filters: VenueFilters, pagination: PaginationParams) {
  // Build query
  const venues = await prisma.venue.findMany({ where, skip, take });

  // Return data
  return { data: venues, pagination: metadata };
}
```

## Module Structure

Each module (venues, bookings) follows the same structure:

```
module-name/
├── index.ts        # Exports all module components
├── routes.ts       # HTTP route definitions
├── controller.ts   # Request/response handling
└── service.ts      # Business logic
```

This allows for:
- Clean imports: `import { venueRoutes } from './modules/venues'`
- Easy testing of individual layers
- Clear separation of concerns
- Scalable architecture

## Data Flow

```
HTTP Request
    ↓
[Routes] - Define endpoint
    ↓
[Controller] - Validate & handle request
    ↓
[Service] - Execute business logic
    ↓
[Database] - Prisma ORM
    ↓
[Service] - Return data
    ↓
[Controller] - Format response
    ↓
HTTP Response
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single, well-defined responsibility
2. **Testability**: Easy to unit test each layer independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new modules or features
5. **Reusability**: Service methods can be reused across different controllers
6. **Type Safety**: TypeScript ensures type safety across layers

## Adding a New Module

To add a new module (e.g., "reviews"):

1. Create directory: `src/modules/reviews/`
2. Create `service.ts` with business logic
3. Create `controller.ts` for request handling
4. Create `routes.ts` for HTTP endpoints
5. Create `index.ts` to export module components
6. Import and register routes in `src/index.ts`

```typescript
// src/index.ts
import { reviewRoutes } from './modules/reviews';
app.use('/api/reviews', reviewRoutes);
```

## Best Practices

1. **Controllers** should be thin - just validate and delegate to services
2. **Services** should contain all business logic and be HTTP-agnostic
3. **Routes** should only define endpoints and map to controllers
4. Keep related functionality together in the same module
5. Use TypeScript types/interfaces to ensure consistency
6. Handle errors appropriately at each layer
