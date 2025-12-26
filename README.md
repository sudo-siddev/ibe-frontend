# IBE Frontend - Review & Rating System

React frontend application for the Review & Rating System component of the Internet Booking Engine.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
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

For production deployment to S3 + CloudFront:

1. Create `.env.production` file with your production backend URL:
```env
VITE_API_BASE_URL=http://ibe-review-backend-env-v2.us-east-1.elasticbeanstalk.com
VITE_API_USERNAME=your_production_username
VITE_API_PASSWORD=your_production_password
```

2. Build the application:
```bash
npm run build
```

Output is in the `dist/` directory. Upload the contents to your S3 bucket and configure CloudFront distribution.

**Note:** Environment variables are baked into the build at build time. Update `.env.production` and rebuild when backend URL changes.

## API Endpoints

- `GET /api/config/reviews?hotelId={hotelId}` - Review configuration
- `GET /api/reviews/room/{roomId}?page=0&size=5&sortBy=createdAt` - Paginated reviews
- `GET /api/reviews/stats/{roomId}` - Review statistics
- `POST /api/reviews` - Create review

All requests use Basic Authentication.

## Rooms Data

Room metadata is owned by the Booking Engine. In this implementation, room data is mocked via `src/api/rooms.api.ts`. The Review & Rating System consumes room IDs as upstream data to fetch reviews and stats.

