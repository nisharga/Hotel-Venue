# Complete Vercel Deployment Steps

The initial deployment failed because environment variables need to be configured. Follow these steps to complete the deployment.

## Current Status

✅ Project created on Vercel: `backend`
✅ Vercel project URL: https://backend-f4jpdjphq-kabirnishargagmailcoms-projects.vercel.app
❌ Deployment failed: Missing DATABASE_URL environment variable

## Steps to Complete Deployment

### Step 1: Add Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select the **backend** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add the following environment variable:

**Variable Name**: `DATABASE_URL`

**Value**:
```
postgresql://neondb_owner:npg_7AvlRCrs2tOy@ep-wild-frost-a4x3zoi0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Environments**: Select all three:
- ☑️ Production
- ☑️ Preview
- ☑️ Development

6. Click **Save**

### Step 2: Redeploy

After adding the environment variable, redeploy the project:

**Option A: Using Vercel Dashboard**
1. Go to the **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button

**Option B: Using CLI** (in the backend directory)
```bash
vercel --prod
```

### Step 3: Verify Deployment

Once the deployment succeeds, test your API:

```bash
# Health check
curl https://backend-f4jpdjphq-kabirnishargagmailcoms-projects.vercel.app/health

# Get venues
curl https://backend-f4jpdjphq-kabirnishargagmailcoms-projects.vercel.app/api/venues
```

### Step 4: Update Frontend Configuration

Once the backend is deployed, update your Next.js frontend:

1. Create/update `.env.local` in your Next.js project:
```bash
NEXT_PUBLIC_API_URL=https://backend-f4jpdjphq-kabirnishargagmailcoms-projects.vercel.app
```

2. Use this in your API client:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

## Alternative: Deploy Using Dashboard

If you prefer using Vercel Dashboard instead of CLI:

1. Go to https://vercel.com/new
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure project:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: Leave empty
4. Add environment variables (DATABASE_URL)
5. Click **Deploy**

## Troubleshooting

### If deployment still fails:

1. **Check build logs** in Vercel Dashboard → Deployments → Your Deployment
2. **Verify DATABASE_URL** is set correctly
3. **Check migrations** are in `prisma/migrations/` directory
4. **Test locally** first: `npm run build` should succeed

### If API returns 500 errors:

1. Check function logs in Vercel Dashboard
2. Verify database connection
3. Check if migrations ran successfully

## Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/kabirnishargagmailcoms-projects/backend
- **Production URL**: https://backend-f4jpdjphq-kabirnishargagmailcoms-projects.vercel.app
- **Inspect Latest Deployment**: https://vercel.com/kabirnishargagmailcoms-projects/backend/B86EbxqipzdBpTAyynf8mLcrVype

## Next Steps After Successful Deployment

1. ✅ Seed the database (optional):
   ```bash
   vercel env pull .env.production
   npm run prisma:seed
   ```

2. ✅ Test all endpoints

3. ✅ Update frontend environment variables

4. ✅ Set up custom domain (optional)

5. ✅ Enable monitoring and analytics

## Custom Domain Setup (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (~24-48 hours)

## Continuous Deployment

Once you connect a Git repository:
- Every push to `main` → Production deployment
- Pull requests → Preview deployments

To connect Git repository:
1. Go to Project Settings → Git
2. Connect your GitHub/GitLab/Bitbucket repository
3. Configure auto-deployment settings

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Prisma Deployment Guide: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Project Support: https://github.com/vercel/vercel/discussions
