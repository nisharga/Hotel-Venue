import prisma from '../../lib/db';

export interface CreateBookingInput {
  venueId: string;
  companyName: string;
  email: string;
  startDate: Date;
  endDate: Date;
  attendeeCount: number;
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  conflictingBookings?: any[];
}

export class BookingService {
  /**
   * Check if a venue is available for the given dates
   */
  async checkAvailability(
    venueId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<AvailabilityCheck> {
    const conflictingBookings = await prisma.bookingInquiry.findMany({
      where: {
        venueId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: ['pending', 'confirmed'],
        },
        OR: [
          {
            // New booking starts during existing booking
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gt: startDate } },
            ],
          },
          {
            // New booking ends during existing booking
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          {
            // New booking completely contains existing booking
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });

    return {
      isAvailable: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined,
    };
  }

  /**
   * Get venue by ID
   */
  async getVenue(venueId: string) {
    return await prisma.venue.findUnique({
      where: { id: venueId },
    });
  }

  /**
   * Validate attendee count against venue capacity
   */
  validateCapacity(attendeeCount: number, venueCapacity: number): boolean {
    return attendeeCount <= venueCapacity;
  }

  /**
   * Create a new booking inquiry
   */
  async createBooking(data: CreateBookingInput) {
    const bookingInquiry = await prisma.bookingInquiry.create({
      data: {
        venueId: data.venueId,
        companyName: data.companyName,
        email: data.email,
        startDate: data.startDate,
        endDate: data.endDate,
        attendeeCount: data.attendeeCount,
      },
      include: {
        venue: {
          select: {
            name: true,
            location: true,
            pricePerNight: true,
          },
        },
      },
    });

    return bookingInquiry;
  }

  /**
   * Get all booking inquiries
   */
  async getAllBookings() {
    return await prisma.bookingInquiry.findMany({
      include: {
        venue: {
          select: {
            name: true,
            location: true,
            capacity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a single booking inquiry by ID
   */
  async getBookingById(id: string) {
    return await prisma.bookingInquiry.findUnique({
      where: { id },
      include: {
        venue: true,
      },
    });
  }
}

export default new BookingService();
