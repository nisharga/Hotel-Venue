import { Request, Response } from 'express';
import bookingService from './service';
import { bookingInquirySchema } from '../../types/venue.types';

export class BookingController {
  /**
   * POST /api/bookings
   * Create a new booking inquiry
   */
  async createBooking(req: Request, res: Response): Promise<Response> {
    try {
      // Validate request body
      const validation = bookingInquirySchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid booking inquiry data',
          details: validation.error.errors,
        });
      }

      const { venueId, companyName, email, startDate, endDate, attendeeCount } = validation.data;

      // Check if venue exists
      const venue = await bookingService.getVenue(venueId);

      if (!venue) {
        return res.status(404).json({
          error: 'Venue not found',
        });
      }

      // Validate attendee count doesn't exceed venue capacity
      if (!bookingService.validateCapacity(attendeeCount, venue.capacity)) {
        return res.status(400).json({
          error: 'Validation error',
          message: `Attendee count (${attendeeCount}) exceeds venue capacity (${venue.capacity})`,
        });
      }

      // Check availability (no double-booking)
      const availabilityCheck = await bookingService.checkAvailability(
        venueId,
        new Date(startDate),
        new Date(endDate)
      );

      if (!availabilityCheck.isAvailable) {
        return res.status(409).json({
          error: 'Venue not available',
          message: 'The venue is already booked for the selected dates',
        });
      }

      // Create booking inquiry
      const bookingInquiry = await bookingService.createBooking({
        venueId,
        companyName,
        email,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        attendeeCount,
      });

      return res.status(201).json({
        message: 'Booking inquiry created successfully',
        data: bookingInquiry,
      });
    } catch (error) {
      console.error('Error creating booking inquiry:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create booking inquiry',
      });
    }
  }

  /**
   * GET /api/bookings
   * Get all booking inquiries
   */
  async getAllBookings(req: Request, res: Response): Promise<Response> {
    try {
      const bookings = await bookingService.getAllBookings();

      return res.json({
        data: bookings,
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch bookings',
      });
    }
  }

  /**
   * GET /api/bookings/:id
   * Get a single booking inquiry by ID
   */
  async getBookingById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const booking = await bookingService.getBookingById(id);

      if (!booking) {
        return res.status(404).json({
          error: 'Booking inquiry not found',
        });
      }

      return res.json({ data: booking });
    } catch (error) {
      console.error('Error fetching booking:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch booking',
      });
    }
  }
}

export default new BookingController();
