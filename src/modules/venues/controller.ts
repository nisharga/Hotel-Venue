import { Request, Response } from 'express';
import venueService from './service';
import { venueQuerySchema } from '../../types/venue.types';

export class VenueController {
  /**
   * GET /api/venues
   * Get list of venues with optional filtering and pagination
   */
  async getVenues(req: Request, res: Response): Promise<Response> {
    try {
      // Validate and parse query parameters
      const queryValidation = venueQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: queryValidation.error.errors,
        });
      }

      const { location, minCapacity, maxPricePerNight, page, limit } = queryValidation.data;

      // Build filters
      const filters = {
        location,
        minCapacity,
        maxPricePerNight,
      };

      const pagination = {
        page,
        limit,
      };

      // Get venues from service
      const result = await venueService.getVenues(filters, pagination);

      return res.json(result);
    } catch (error) {
      console.error('Error fetching venues:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch venues',
      });
    }
  }

  /**
   * GET /api/venues/:id
   * Get a single venue by ID
   */
  async getVenueById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const venue = await venueService.getVenueById(id);

      if (!venue) {
        return res.status(404).json({
          error: 'Venue not found',
        });
      }

      return res.json({ data: venue });
    } catch (error) {
      console.error('Error fetching venue:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch venue',
      });
    }
  }
}

export default new VenueController();
