import { Router } from 'express';
import venueController from './controller';

const router = Router();

/**
 * GET /api/venues
 * Get list of venues with optional filtering and pagination
 * Query params:
 * - location: Filter by city (optional)
 * - minCapacity: Minimum capacity required (optional)
 * - maxPricePerNight: Maximum price per night (optional)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 */
router.get('/', (req, res) => venueController.getVenues(req, res));

/**
 * GET /api/venues/:id
 * Get a single venue by ID
 */
router.get('/:id', (req, res) => venueController.getVenueById(req, res));

export default router;
