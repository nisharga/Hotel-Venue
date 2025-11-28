 import { defineConfig, env } from 'prisma/config';

    export default defineConfig({
      // For migrations and direct database access
      directUrl: env('DATABASE_URL'),
      // If using Prisma Accelerate for queries
      // accelerateUrl: env('ACCELERATE_URL'),
    });