import { z } from 'zod';

// Validation schemas
export const venueQuerySchema = z.object({
  location: z.string().optional(),
  minCapacity: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  maxPricePerNight: z.string().transform(Number).pipe(z.number().positive()).optional(),
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default('10'),
});

export const bookingInquirySchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Valid email is required'),
  startDate: z.string().datetime('Start date must be a valid ISO 8601 datetime'),
  endDate: z.string().datetime('End date must be a valid ISO 8601 datetime'),
  attendeeCount: z.number().int().positive('Attendee count must be a positive number'),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type VenueQuery = z.infer<typeof venueQuerySchema>;
export type BookingInquiryInput = z.infer<typeof bookingInquirySchema>;
