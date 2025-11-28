import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';

export interface VenueFilters {
  location?: string;
  minCapacity?: number;
  maxPricePerNight?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class VenueService {
  /**
   * Get venues with filters and pagination
   */
  async getVenues(
    filters: VenueFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { location, minCapacity, maxPricePerNight } = filters;
    const { page, limit } = pagination;

    // Build where clause
    const where: Prisma.VenueWhereInput = {};

    if (location) {
      where.location = {
        equals: location,
        mode: 'insensitive',
      };
    }

    if (minCapacity) {
      where.capacity = {
        gte: minCapacity,
      };
    }

    if (maxPricePerNight) {
      where.pricePerNight = {
        lte: maxPricePerNight,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [venues, totalCount] = await Promise.all([
      prisma.venue.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.venue.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: venues,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Get a single venue by ID
   */
  async getVenueById(id: string) {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        bookingInquiries: {
          select: {
            startDate: true,
            endDate: true,
            status: true,
          },
          where: {
            status: {
              in: ['pending', 'confirmed'],
            },
          },
        },
      },
    });

    return venue;
  }

  /**
   * Check if a venue exists
   */
  async venueExists(id: string): Promise<boolean> {
    const count = await prisma.venue.count({
      where: { id },
    });
    return count > 0;
  }
}

export default new VenueService();
