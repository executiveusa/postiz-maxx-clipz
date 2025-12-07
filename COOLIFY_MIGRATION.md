# Coolify Migration Checklist

This document provides a step-by-step checklist for migrating Postiz MAXX CLIPZ from Railway to Coolify.

## Pre-Migration Checklist

- [ ] Review current Railway deployment and document configuration
- [ ] Set up Coolify instance on your server
- [ ] Ensure server meets minimum requirements (2GB RAM, 2 CPU cores)
- [ ] Configure domain DNS to point to Coolify server
- [ ] Install required dependencies (Docker, Docker Compose)
- [ ] Set up backup strategy for data migration
- [ ] Review `.agents` file for required secrets
- [ ] Prepare `master.secrets.json` with Coolify environment values

## Phase 1: Infrastructure Setup (Day 1)

### Server Preparation
- [ ] Provision server (VPS, dedicated, or cloud instance)
- [ ] Update server OS and install security updates
- [ ] Install Docker Engine (version 20.10 or higher)
- [ ] Install Docker Compose (version 2.0 or higher)
- [ ] Install Coolify following [official guide](https://coolify.io/docs/installation)
- [ ] Verify Coolify installation: `coolify version`
- [ ] Configure firewall rules (allow ports 80, 443, 22)
- [ ] Set up SSH key authentication
- [ ] Configure server monitoring (optional: Netdata, Prometheus)

### Coolify Configuration
- [ ] Access Coolify web interface
- [ ] Create new project: "postiz-maxx-clipz"
- [ ] Configure project settings
- [ ] Set up environment (production, staging, etc.)
- [ ] Enable SSL/TLS certificates (Let's Encrypt)
- [ ] Configure custom domain

## Phase 2: Data Export from Railway (Day 1-2)

### Database Backup
- [ ] Connect to Railway PostgreSQL instance
- [ ] Export database schema:
  ```bash
  railway run pg_dump -U user -d database --schema-only > schema.sql
  ```
- [ ] Export database data:
  ```bash
  railway run pg_dump -U user -d database --data-only > data.sql
  ```
- [ ] Verify backup files are complete
- [ ] Store backups securely (encrypted, off-site)

### Redis Data Export (if needed)
- [ ] Check if Redis persistence is enabled
- [ ] Export Redis data (if applicable):
  ```bash
  railway run redis-cli SAVE
  railway run redis-cli --rdb dump.rdb
  ```
- [ ] Document Redis configuration

### Media and Upload Files
- [ ] Export uploaded files from Railway volumes:
  ```bash
  railway run tar czf uploads.tar.gz /app/uploads
  ```
- [ ] Download backup to local machine
- [ ] Verify archive integrity
- [ ] Calculate total storage requirements

### Configuration Export
- [ ] Export all Railway environment variables:
  ```bash
  railway variables > railway-vars.txt
  ```
- [ ] Document any Railway-specific configurations
- [ ] Note any Railway plugins or add-ons used
- [ ] Export Railway deployment configuration

## Phase 3: Coolify Environment Setup (Day 2)

### Create Services in Coolify
- [ ] Create PostgreSQL service
  - [ ] Set database name: `postiz`
  - [ ] Set username: `postiz`
  - [ ] Generate and save strong password
  - [ ] Configure persistent volume
  - [ ] Set memory limit: 1GB (minimum)
- [ ] Create Redis service
  - [ ] Enable persistence (RDB + AOF)
  - [ ] Configure persistent volume
  - [ ] Set memory limit: 512MB (minimum)
- [ ] Verify services are running and accessible

### Configure Environment Variables
- [ ] Create Coolify environment from `master.secrets.json`
- [ ] Set core variables:
  - [ ] DATABASE_URL
  - [ ] REDIS_URL
  - [ ] JWT_SECRET (generate new or use existing)
  - [ ] FRONTEND_URL
  - [ ] NEXT_PUBLIC_BACKEND_URL
  - [ ] BACKEND_INTERNAL_URL
  - [ ] IS_GENERAL="true"
- [ ] Set storage configuration:
  - [ ] STORAGE_PROVIDER="local" (initially)
  - [ ] UPLOAD_DIRECTORY="/data/uploads"
- [ ] Add optional variables as needed
- [ ] Verify all required variables are set

### Network Configuration
- [ ] Create Docker network for services
- [ ] Configure internal service discovery
- [ ] Set up reverse proxy rules
- [ ] Configure SSL certificates
- [ ] Test domain resolution

## Phase 4: Application Deployment (Day 2-3)

### Build Configuration
- [ ] Clone repository to Coolify
- [ ] Configure build settings
- [ ] Set Node.js version (20.17.0)
- [ ] Configure pnpm package manager
- [ ] Test build process locally (if possible)

### Deploy Backend Service
- [ ] Configure backend build
- [ ] Set start command: `pnpm start:prod:backend`
- [ ] Set health check endpoint: `/api/health`
- [ ] Deploy backend service
- [ ] Monitor build logs
- [ ] Verify service starts successfully
- [ ] Test health endpoint

### Deploy Workers Service
- [ ] Configure workers build
- [ ] Set start command: `pnpm start:prod:workers`
- [ ] Deploy workers service
- [ ] Monitor logs for queue processing
- [ ] Verify Redis connection

### Deploy Cron Service
- [ ] Configure cron build
- [ ] Set start command: `pnpm start:prod:cron`
- [ ] Deploy cron service
- [ ] Monitor logs for scheduled tasks
- [ ] Verify cron jobs execute

### Deploy Frontend Service
- [ ] Configure frontend build
- [ ] Set start command: `pnpm start:prod:frontend`
- [ ] Deploy frontend service
- [ ] Monitor build logs
- [ ] Verify service starts successfully

## Phase 5: Data Migration (Day 3)

### Import Database
- [ ] Copy schema.sql to Coolify server
- [ ] Import schema:
  ```bash
  docker exec -i postgres psql -U postiz -d postiz < schema.sql
  ```
- [ ] Verify schema import
- [ ] Copy data.sql to Coolify server
- [ ] Import data:
  ```bash
  docker exec -i postgres psql -U postiz -d postiz < data.sql
  ```
- [ ] Verify data import
- [ ] Run database integrity checks
- [ ] Update sequences (if needed)

### Import Redis Data (if applicable)
- [ ] Copy dump.rdb to Coolify server
- [ ] Stop Redis service
- [ ] Replace Redis dump file
- [ ] Start Redis service
- [ ] Verify data loaded correctly

### Import Media Files
- [ ] Create uploads directory in volume
- [ ] Copy uploads.tar.gz to server
- [ ] Extract files:
  ```bash
  docker run --rm -v postiz_uploads:/data -v $(pwd):/backup alpine \
    tar xzf /backup/uploads.tar.gz -C /data
  ```
- [ ] Verify file permissions
- [ ] Test file access from application

### Run Migrations
- [ ] Connect to backend container
- [ ] Run Prisma migrations:
  ```bash
  docker exec backend pnpm run prisma-db-push
  ```
- [ ] Verify migration success
- [ ] Check application logs

## Phase 6: Testing and Validation (Day 3-4)

### Smoke Tests
- [ ] Access frontend URL
- [ ] Test user login
- [ ] Create test post
- [ ] Upload test media file
- [ ] Test API endpoints
- [ ] Verify cron jobs running
- [ ] Check worker queue processing

### Integration Tests
- [ ] Test authentication flow
- [ ] Test social media connections (if enabled)
- [ ] Test email notifications (if enabled)
- [ ] Test payment processing (if enabled)
- [ ] Test all major features
- [ ] Check error handling

### Performance Tests
- [ ] Measure page load times
- [ ] Test API response times
- [ ] Monitor database query performance
- [ ] Check Redis cache hit rates
- [ ] Monitor memory usage
- [ ] Monitor CPU usage

### Security Validation
- [ ] Verify HTTPS working correctly
- [ ] Test CORS configuration
- [ ] Verify JWT token validation
- [ ] Check database access controls
- [ ] Review exposed ports
- [ ] Scan for common vulnerabilities

## Phase 7: DNS and Traffic Cutover (Day 4-5)

### Pre-Cutover
- [ ] Reduce Railway DNS TTL to minimum (5 minutes)
- [ ] Notify users of planned migration
- [ ] Schedule maintenance window
- [ ] Prepare rollback plan
- [ ] Create final Railway backup

### DNS Cutover
- [ ] Enable maintenance mode on Railway
- [ ] Export final data snapshot from Railway
- [ ] Import final data to Coolify (if needed)
- [ ] Update DNS records to point to Coolify
- [ ] Monitor DNS propagation
- [ ] Test from multiple locations
- [ ] Verify SSL certificate working

### Post-Cutover Monitoring
- [ ] Monitor application logs (4 hours)
- [ ] Watch error rates
- [ ] Check database performance
- [ ] Monitor user traffic
- [ ] Verify all services running
- [ ] Check for failed jobs
- [ ] Review error logs

## Phase 8: Post-Migration Cleanup (Day 5-7)

### Railway Cleanup
- [ ] Keep Railway deployment running (24 hours) as backup
- [ ] Export final logs for reference
- [ ] Document any Railway-specific configurations
- [ ] Cancel Railway services (after verification)
- [ ] Delete Railway project (after data retention period)

### Optimization
- [ ] Optimize Docker images
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Configure monitoring alerts
- [ ] Optimize resource limits
- [ ] Enable caching where appropriate

### Documentation
- [ ] Document new deployment process
- [ ] Update README with Coolify instructions
- [ ] Document backup and restore procedures
- [ ] Create runbook for common issues
- [ ] Document monitoring and alerting
- [ ] Update team access and credentials

## Phase 9: Monitoring and Maintenance (Ongoing)

### Daily Monitoring
- [ ] Check application health
- [ ] Review error logs
- [ ] Monitor resource usage
- [ ] Check backup completion
- [ ] Verify SSL certificate validity

### Weekly Maintenance
- [ ] Review system performance
- [ ] Update Docker images
- [ ] Run security scans
- [ ] Review and clear old logs
- [ ] Test backup restoration

### Monthly Tasks
- [ ] Review and optimize costs
- [ ] Update dependencies
- [ ] Review security configurations
- [ ] Plan capacity upgrades
- [ ] Review incident reports

## Rollback Plan

In case of critical issues during migration:

### Immediate Rollback (within 24 hours)
- [ ] Update DNS to point back to Railway
- [ ] Disable Coolify deployment
- [ ] Verify Railway still functioning
- [ ] Investigate and document issues
- [ ] Plan remediation steps

### Data Sync Rollback
- [ ] If data was created on Coolify, export it
- [ ] Import new data to Railway
- [ ] Verify data consistency
- [ ] Switch traffic back to Railway

## Success Criteria

Migration is considered successful when:
- [ ] All services running on Coolify
- [ ] No critical errors in logs
- [ ] All features working as expected
- [ ] Performance meets or exceeds Railway
- [ ] Automated backups running
- [ ] Monitoring and alerts configured
- [ ] Team can access and manage deployment
- [ ] Documentation updated
- [ ] Railway can be safely decommissioned

## Cost Tracking

### Before Migration (Railway)
- Monthly cost: $__________
- Resource limits: __________
- Estimated overage risk: __________

### After Migration (Coolify)
- Server cost: $__________
- Additional services: $__________
- Total monthly cost: $__________
- Cost savings: $__________

## Emergency Contacts

- Server Provider Support: __________
- DNS Provider Support: __________
- Team Lead: __________
- Database Admin: __________
- DevOps Engineer: __________

## Notes and Observations

Add migration-specific notes here:

```
[Date] [Time] - [Note]
[Date] [Time] - [Note]
```

---

**Migration Status**: ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Rolled Back

**Start Date**: __________
**Completion Date**: __________
**Total Downtime**: __________
**Issues Encountered**: __________

---

*This checklist should be updated based on actual migration experience and project-specific requirements.*
