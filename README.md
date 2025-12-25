# IBE Frontend - Review & Rating System

React frontend application for the Review & Rating System component of the Internet Booking Engine.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_USERNAME=placeholder_user
VITE_API_PASSWORD=placeholder_password
```

3. Start development server:
```bash
npm run dev
```

## Build

```bash
npm run build
```

Output is in the `dist/` directory, ready for AWS S3 + CloudFront deployment.

## API Endpoints

- `GET /api/config/reviews?hotelId={hotelId}` - Review configuration
- `GET /api/reviews/room/{roomId}?page=0&size=5&sortBy=createdAt` - Paginated reviews
- `GET /api/reviews/stats/{roomId}` - Review statistics
- `POST /api/reviews` - Create review

All requests use Basic Authentication.

## Rooms Data

Room metadata is owned by the Booking Engine. In this implementation, room data is mocked via `src/api/rooms.api.ts`. The Review & Rating System consumes room IDs as upstream data to fetch reviews and stats.

