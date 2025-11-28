import { Router } from 'express';
import bookingController from './controller';

const router = Router();

/**
 * POST /api/bookings
 * Create a new booking inquiry
 * Required fields: venueId, companyName, email, startDate, endDate, attendeeCount
 */
router.post('/', (req, res) => bookingController.createBooking(req, res));

/**
 * GET /api/bookings
 * Get all booking inquiries
 */
router.get('/', (req, res) => bookingController.getAllBookings(req, res));

/**
 * GET /api/bookings/:id
 * Get a single booking inquiry by ID
 */
router.get('/:id', (req, res) => bookingController.getBookingById(req, res));

export default router;
