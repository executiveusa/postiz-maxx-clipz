# Railway Zero-Secrets Deployment Guide

This guide provides step-by-step instructions for deploying Postiz MAXX CLIPZ on Railway using the zero-secrets architecture with cost-protection guardrails.

## Overview

The zero-secrets deployment approach allows you to deploy Postiz on Railway with minimal configuration, starting with only core infrastructure and adding optional features incrementally.

## Features

- ✅ Zero-secrets initial deployment
- ✅ Auto-provisioned PostgreSQL and Redis
- ✅ Cost-protection guardrails
- ✅ Automatic shutdown on free-tier limit
- ✅ Maintenance mode deployment
- ✅ Incremental feature activation
- ✅ Migration path to Coolify

## Prerequisites

- Railway account (free tier available)
- Railway CLI installed (optional but recommended)
- Git repository access
- Basic understanding of environment variables

## Deployment Modes

This project supports three deployment modes:

### 1. Zero-Secrets Mode (Recommended for initial deployment)
- **Features**: Core functionality only
- **Required Secrets**: 7 core variables
- **Cost**: Free tier compatible
- **Setup Time**: 5-10 minutes
- **Disabled**: Email, social media, payments, AI features

### 2. Basic Mode
- **Features**: Core + Email + Local storage
- **Required Secrets**: ~10 variables
- **Cost**: May exceed free tier with heavy usage
- **Setup Time**: 15-20 minutes
- **Disabled**: Social media, payments, AI features

### 3. Full Mode
- **Features**: All features enabled
- **Required Secrets**: 50+ variables
- **Cost**: Likely exceeds free tier
- **Setup Time**: 30+ minutes
- **Disabled**: None

## Step-by-Step Deployment

### Step 1: Install Railway CLI (Optional)

```bash
# Install via npm
npm install -g @railway/cli

# Or via curl (Unix)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"

# Login to Railway
railway login
```

### Step 2: Clone Repository

```bash
git clone https://github.com/executiveusa/postiz-maxx-clipz.git
cd postiz-maxx-clipz
```

### Step 3: Review Required Secrets

Check the `.agents` file to understand required secrets for your deployment mode:

```bash
cat .agents | grep -A 5 "zero_secrets"
```

For zero-secrets mode, you need:
1. `DATABASE_URL` - Auto-provisioned by Railway
2. `REDIS_URL` - Auto-provisioned by Railway
3. `JWT_SECRET` - Generate a random string
4. `FRONTEND_URL` - Provided by Railway after deployment
5. `NEXT_PUBLIC_BACKEND_URL` - Provided by Railway after deployment
6. `BACKEND_INTERNAL_URL` - Provided by Railway after deployment
7. `IS_GENERAL` - Set to "true"

### Step 4: Generate JWT Secret

Generate a strong JWT secret:

```bash
# Using openssl
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or online generator
# Visit: https://generate-secret.vercel.app/32
```

Save this secret for use in Step 6.

### Step 5: Create Railway Project

#### Via Dashboard (Recommended for beginners):

1. Go to [Railway Dashboard](https://railway.app/new)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select `executiveusa/postiz-maxx-clipz`
6. Railway will detect the `railway.toml` configuration

#### Via CLI:

```bash
# Initialize new project
railway init

# Link to repository
railway link
```

### Step 6: Add PostgreSQL and Redis

#### Via Dashboard:

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Click "New" again
4. Select "Database" → "Add Redis"
5. Railway will automatically set `DATABASE_URL` and `REDIS_URL`

#### Via CLI:

```bash
# Add PostgreSQL
railway add --plugin postgresql

# Add Redis
railway add --plugin redis
```

### Step 7: Configure Environment Variables

#### Via Dashboard:

1. Go to your service settings
2. Click "Variables"
3. Add the following variables:

```env
# Core Variables (Required)
JWT_SECRET=<your_generated_secret_from_step_4>
IS_GENERAL=true

# These will be set after first deployment:
# FRONTEND_URL=<will-be-provided-by-railway>
# NEXT_PUBLIC_BACKEND_URL=<will-be-provided-by-railway>
# BACKEND_INTERNAL_URL=<will-be-provided-by-railway>
```

#### Via CLI:

```bash
# Set JWT secret
railway variables set JWT_SECRET="<your_generated_secret>"

# Set IS_GENERAL
railway variables set IS_GENERAL="true"
```

### Step 8: Deploy Services

Railway will automatically deploy when you push to the main branch, or you can trigger manually:

#### Via Dashboard:
1. Click "Deploy"
2. Wait for build to complete
3. Monitor logs for any errors

#### Via CLI:
```bash
# Deploy current branch
railway up

# Or push to trigger auto-deploy
git push railway main
```

### Step 9: Update URL Variables

After first deployment, Railway provides public URLs:

1. Go to service "Settings" → "Domains"
2. Copy the generated domain (e.g., `https://your-app.up.railway.app`)
3. Update environment variables:

```env
FRONTEND_URL=https://your-frontend.up.railway.app
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
BACKEND_INTERNAL_URL=http://backend.railway.internal:3000
```

#### Via CLI:
```bash
railway variables set FRONTEND_URL="https://your-frontend.up.railway.app"
railway variables set NEXT_PUBLIC_BACKEND_URL="https://your-backend.up.railway.app"
railway variables set BACKEND_INTERNAL_URL="http://backend.railway.internal:3000"
```

### Step 10: Run Database Migrations

After deployment, run Prisma migrations:

#### Via Dashboard:
1. Go to service logs
2. Verify migration logs appear automatically

#### Via CLI:
```bash
railway run pnpm run prisma-db-push
```

### Step 11: Verify Deployment

1. Open the frontend URL in your browser
2. You should see the Postiz login/registration page
3. Create a test account
4. Verify you can access the dashboard

## Cost Protection and Monitoring

### Automatic Cost Protection

This deployment includes automatic cost-protection features:

1. **Resource Limits**: Minimal CPU and memory allocation
2. **Usage Monitoring**: Tracks Railway usage against free-tier limits
3. **Auto-Shutdown**: Automatically pauses service when approaching limits
4. **Maintenance Mode**: Deploys static maintenance page when shut down

### Monitor Usage

#### Via Dashboard:
1. Go to project settings
2. Click "Usage"
3. Monitor current usage vs. limits

#### Via CLI:
```bash
railway status
```

### Free Tier Limits (as of 2025)

Railway free tier includes:
- 500 hours of service runtime per month
- $5 credit per month
- 1GB PostgreSQL storage
- 512MB Redis memory

**Important**: The free tier resets monthly. Plan deployments accordingly.

## Adding Optional Features

After successful zero-secrets deployment, you can incrementally add features:

### Enable Email Verification

1. Sign up for [Resend](https://resend.com) (free tier available)
2. Get API key
3. Add to Railway variables:
```bash
railway variables set RESEND_API_KEY="re_xxxxxxxxxxxx"
railway variables set EMAIL_FROM_ADDRESS="noreply@yourdomain.com"
railway variables set EMAIL_FROM_NAME="Postiz MAXX CLIPZ"
```
4. Redeploy

### Enable Cloudflare Storage

1. Set up Cloudflare R2
2. Add to Railway variables:
```bash
railway variables set STORAGE_PROVIDER="cloudflare"
railway variables set CLOUDFLARE_ACCOUNT_ID="your-account-id"
railway variables set CLOUDFLARE_ACCESS_KEY="your-access-key"
railway variables set CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-key"
railway variables set CLOUDFLARE_BUCKETNAME="your-bucket-name"
railway variables set CLOUDFLARE_BUCKET_URL="https://your-bucket.r2.cloudflarestorage.com/"
```
3. Redeploy

### Enable Social Media Integration

Refer to `.agents` file for specific social media platform variables. Example for Twitter/X:

```bash
railway variables set X_API_KEY="your-api-key"
railway variables set X_API_SECRET="your-api-secret"
```

### Enable Stripe Payments

```bash
railway variables set STRIPE_PUBLISHABLE_KEY="pk_xxxxxxxxxxxx"
railway variables set STRIPE_SECRET_KEY="sk_xxxxxxxxxxxx"
railway variables set STRIPE_SIGNING_KEY="whsec_xxxxxxxxxxxx"
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with dependency errors

**Solution**:
```bash
# Clear Railway cache
railway run pnpm install --force

# Or via dashboard: Settings → Clear Build Cache
```

### Database Connection Issues

**Issue**: Cannot connect to database

**Solution**:
1. Verify `DATABASE_URL` is set correctly
2. Check PostgreSQL service is running
3. Review service logs for connection errors

### Redis Connection Issues

**Issue**: Queue jobs not processing

**Solution**:
1. Verify `REDIS_URL` is set correctly
2. Check Redis service is running
3. Restart workers service

### High Memory Usage

**Issue**: Service crashes due to memory limit

**Solution**:
1. Review cost protection settings in `railway.toml`
2. Consider upgrading Railway plan
3. Optimize application code
4. Reduce concurrent workers

### URL Variables Not Working

**Issue**: Frontend cannot connect to backend

**Solution**:
1. Verify all URL variables are set correctly
2. Ensure URLs use `https://` (not `http://`)
3. Use internal URLs for service-to-service communication
4. Check CORS configuration

## Maintenance Mode

If your service is automatically shut down due to cost protection:

1. A static maintenance page is deployed automatically
2. Check `maintenance.html` for the displayed message
3. Review Railway usage metrics
4. Options:
   - Upgrade to paid Railway plan
   - Optimize resource usage
   - Migrate to Coolify (see `COOLIFY_MIGRATION.md`)

## Backup and Disaster Recovery

### Database Backup

```bash
# Via CLI
railway run pg_dump > backup.sql
```

### Restore Database

```bash
railway run psql < backup.sql
```

### Environment Variable Backup

```bash
# Export all variables
railway variables > railway-env-backup.txt
```

## Upgrading from Free to Paid

If you need more resources:

1. Go to Railway dashboard
2. Click "Usage"
3. Click "Upgrade"
4. Select appropriate plan
5. Update cost protection settings if needed

## Migration to Coolify

If Railway costs become too high or you need more control:

1. Review [COOLIFY_SUPPORT.md](./COOLIFY_SUPPORT.md)
2. Follow [COOLIFY_MIGRATION.md](./COOLIFY_MIGRATION.md) checklist
3. Plan migration during low-traffic period
4. Keep Railway running as backup during migration

## Security Best Practices

1. **Rotate JWT Secret** regularly
2. **Use HTTPS** for all public URLs
3. **Enable email verification** in production
4. **Limit API access** with rate limiting
5. **Regular backups** of database and uploads
6. **Monitor logs** for suspicious activity
7. **Update dependencies** regularly

## Support and Resources

- **Railway Documentation**: https://docs.railway.app
- **Postiz Documentation**: https://docs.postiz.com
- **GitHub Issues**: https://github.com/executiveusa/postiz-maxx-clipz/issues
- **Community Discord**: See README for link

## Next Steps

After successful deployment:

1. ✅ Verify all core features working
2. ✅ Set up regular database backups
3. ✅ Monitor usage and costs
4. ✅ Plan which optional features to enable
5. ✅ Configure custom domain (optional)
6. ✅ Set up monitoring and alerts
7. ✅ Review security settings

## Deployment Checklist

- [ ] Railway account created
- [ ] Repository cloned
- [ ] JWT secret generated
- [ ] Railway project created
- [ ] PostgreSQL added
- [ ] Redis added
- [ ] Core environment variables set
- [ ] Initial deployment completed
- [ ] URL variables updated
- [ ] Database migrations run
- [ ] Deployment verified
- [ ] Test account created
- [ ] Usage monitoring set up
- [ ] Backup strategy planned
- [ ] Documentation updated

---

**Deployment Mode**: Zero-Secrets | Basic | Full (circle one)

**Deployment Date**: __________

**Railway Project URL**: __________

**Frontend URL**: __________

**Notes**: 

---

For advanced deployment scenarios or custom requirements, refer to the Railway documentation or contact support.
