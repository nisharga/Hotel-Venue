# Deployment Guide - Vercel

This guide explains how to deploy the Venue Booking Backend API to Vercel.

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (`npm install -g vercel`)
3. PostgreSQL database (Neon, Supabase, or other provider)

## Deployment Steps

### 1. Prepare the Project

The project is already configured for Vercel deployment with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to ignore during deployment
- ✅ `package.json` - Build scripts configured
- ✅ Git repository initialized

### 2. Deploy to Vercel

Run the deployment command:

```bash
vercel
```

This will:
1. Ask you to log in (if not already logged in)
2. Ask for project configuration (accept defaults or customize)
3. Deploy your project

For production deployment:

```bash
vercel --prod
```

### 3. Set Environment Variables

After deployment, you need to add environment variables in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

```
DATABASE_URL = postgresql://neondb_owner:npg_7AvlRCrs2tOy@ep-wild-frost-a4x3zoi0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Important**: Set this for all environments (Production, Preview, Development)

### 4. Redeploy After Adding Environment Variables

After adding environment variables, redeploy:

```bash
vercel --prod
```

### 5. Run Database Migrations

The migrations will run automatically during the build process via the `vercel-build` script.

If you need to run migrations manually:

1. Go to Vercel Dashboard → Your Project → Settings → Functions
2. Or use Vercel CLI:

```bash
vercel env pull .env.production
npm run prisma:migrate:deploy
```

### 6. Seed the Database (Optional)

To seed the database with sample data:

```bash
# Pull production environment variables
vercel env pull .env.production

# Run seed script
npm run prisma:seed
```

## Vercel Configuration Explained

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

- **builds**: Specifies that we're building a Node.js application from `dist/index.js`
- **routes**: Routes all requests to our Express application

### Build Process

The `vercel-build` script in `package.json` runs:

1. `prisma generate` - Generates Prisma Client
2. `prisma migrate deploy` - Runs pending migrations
3. `tsc` - Compiles TypeScript to JavaScript

## Deployment URL

After deployment, Vercel will provide you with URLs:

- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-<hash>.vercel.app`

## Testing the Deployment

Test your deployed API:

```bash
# Health check
curl https://your-project-name.vercel.app/health

# Get venues
curl https://your-project-name.vercel.app/api/venues

# Create booking
curl -X POST https://your-project-name.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": "your-venue-id",
    "companyName": "Test Company",
    "email": "test@example.com",
    "startDate": "2024-12-01T00:00:00.000Z",
    "endDate": "2024-12-05T00:00:00.000Z",
    "attendeeCount": 30
  }'
```

## Continuous Deployment

Vercel automatically deploys when you push to Git:

1. Connect your GitHub/GitLab/Bitbucket repository in Vercel Dashboard
2. Every push to `main` branch triggers a production deployment
3. Pull requests create preview deployments

To connect Git:

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Connect your repository
3. Push changes:

```bash
git add .
git commit -m "Update API"
git push origin main
```

## Custom Domain (Optional)

To use a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed by Vercel

## Monitoring and Logs

View logs in Vercel Dashboard:

1. Go to your project
2. Click on **Deployments**
3. Click on a deployment
4. View **Functions** tab for logs

Or use CLI:

```bash
vercel logs
```

## Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Verify all dependencies are in `dependencies` (not `devDependencies`)
3. Ensure TypeScript compiles without errors locally

### Database Connection Issues

1. Verify `DATABASE_URL` is set in environment variables
2. Check database is accessible from Vercel's IP range
3. Ensure connection string includes `sslmode=require`

### 500 Errors

1. Check function logs in Vercel Dashboard
2. Verify environment variables are set correctly
3. Test database connection

### Migrations Not Running

1. Check that migrations exist in `prisma/migrations/`
2. Verify `vercel-build` script includes `prisma migrate deploy`
3. Check build logs for migration errors

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Port number (set automatically by Vercel) | No |
| `NODE_ENV` | Environment (set to "production" automatically) | No |

## Cost Considerations

Vercel Free Tier includes:
- 100 GB bandwidth per month
- 100 GB-hours serverless function execution
- Unlimited deployments

For production apps with high traffic, consider upgrading to Pro plan.

## Next Steps

After deployment:

1. Update `NEXT_PUBLIC_API_URL` in your Next.js frontend to point to the Vercel URL
2. Test all endpoints
3. Set up monitoring (Vercel Analytics, Sentry, etc.)
4. Configure custom domain (optional)
5. Set up CI/CD with GitHub integration

## Quick Deploy Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Open project in browser
vercel open
```

## Support

- Vercel Documentation: https://vercel.com/docs
- Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Community: https://github.com/vercel/vercel/discussions
