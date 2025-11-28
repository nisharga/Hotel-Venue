import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.bookingInquiry.deleteMany();
  await prisma.venue.deleteMany();

  // Create sample venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Mountain View Resort',
        description: 'Stunning mountain resort perfect for team retreats with breathtaking views and modern amenities.',
        location: 'Denver',
        address: '123 Mountain Rd, Denver, CO 80202',
        capacity: 50,
        pricePerNight: 2500,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Outdoor Activities', 'Spa'],
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Downtown Conference Center',
        description: 'Modern downtown venue with state-of-the-art facilities and easy access to restaurants.',
        location: 'San Francisco',
        address: '456 Market St, San Francisco, CA 94102',
        capacity: 100,
        pricePerNight: 4000,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'AV Equipment', 'Parking'],
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Beachside Villa',
        description: 'Relaxing beachfront property ideal for creative workshops and team bonding.',
        location: 'Miami',
        address: '789 Ocean Dr, Miami, FL 33139',
        capacity: 30,
        pricePerNight: 3200,
        amenities: ['WiFi', 'Beach Access', 'Catering', 'Pool', 'BBQ Area'],
        imageUrl: 'https://images.unsplash.com/photo-1582610116397-edb318620f90',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Tech Hub Loft',
        description: 'Industrial-style loft in the heart of tech district with high-speed internet.',
        location: 'Austin',
        address: '321 Innovation Way, Austin, TX 78701',
        capacity: 40,
        pricePerNight: 1800,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Whiteboards', 'Gaming Area'],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Lakeside Retreat',
        description: 'Peaceful lakeside venue offering tranquility and team building activities.',
        location: 'Seattle',
        address: '555 Lake Shore Dr, Seattle, WA 98101',
        capacity: 60,
        pricePerNight: 2800,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Kayaking', 'Hiking Trails'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Urban Garden Hotel',
        description: 'Boutique hotel with rooftop garden, perfect for small to medium teams.',
        location: 'New York',
        address: '888 Park Ave, New York, NY 10022',
        capacity: 35,
        pricePerNight: 3500,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Rooftop Garden', 'Gym'],
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Wine Country Estate',
        description: 'Elegant estate surrounded by vineyards, ideal for executive retreats.',
        location: 'Napa',
        address: '999 Vineyard Ln, Napa, CA 94559',
        capacity: 45,
        pricePerNight: 4500,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Wine Tasting', 'Spa'],
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Historic Mansion',
        description: 'Restored Victorian mansion with modern amenities and classic charm.',
        location: 'Boston',
        address: '111 Heritage St, Boston, MA 02108',
        capacity: 25,
        pricePerNight: 2200,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Library', 'Garden'],
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Desert Oasis Resort',
        description: 'Luxurious desert resort with stunning architecture and premium facilities.',
        location: 'Phoenix',
        address: '222 Desert Vista Rd, Phoenix, AZ 85004',
        capacity: 80,
        pricePerNight: 3800,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Pool', 'Golf Course'],
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Riverside Lodge',
        description: 'Cozy riverside lodge perfect for intimate team gatherings and workshops.',
        location: 'Portland',
        address: '333 River Bend Dr, Portland, OR 97201',
        capacity: 20,
        pricePerNight: 1500,
        amenities: ['WiFi', 'Conference Room', 'Catering', 'Fishing', 'Fire Pit'],
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      },
    }),
  ]);

  console.log(`✅ Created ${venues.length} venues`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
