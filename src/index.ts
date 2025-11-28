import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './lib/db';
import { venueRoutes } from './modules/venues';
import { bookingRoutes } from './modules/bookings';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Venue Booking API',
    version: '1.0.0',
    endpoints: {
      venues: '/api/venues',
      bookings: '/api/bookings',
      health: '/health',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting Venue Booking API...');
    console.log('');

    // Connect to database
    const connected = await connectDatabase();

    if (!connected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    console.log('');

    // Start Express server
    app.listen(PORT, () => {
      console.log('✅ Server is running');
      console.log(`🌐 Port: ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  - GET  http://localhost:${PORT}/api/venues`);
      console.log(`  - GET  http://localhost:${PORT}/api/venues/:id`);
      console.log(`  - POST http://localhost:${PORT}/api/bookings`);
      console.log(`  - GET  http://localhost:${PORT}/api/bookings`);
      console.log(`  - GET  http://localhost:${PORT}/api/bookings/:id`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

// Initialize database connection for serverless
connectDatabase().catch(err => {
  console.error('Failed to connect to database:', err);
});

// Export for Vercel serverless
export default app;

// Start the server only if running directly (not imported)
if (require.main === module) {
  startServer();
}
