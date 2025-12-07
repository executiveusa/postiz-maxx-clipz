# Railway Zero-Secrets Deployment System

> **Universal meta-infrastructure for repo-agnostic, cost-protected deployment on Railway with automated failover to Coolify**

## 🎯 Overview

This deployment system enables:
- ✅ **Zero-secrets first deployment** - Deploy with minimal configuration
- ✅ **Cost-protection guardrails** - Automatic monitoring and shutdown
- ✅ **Incremental feature activation** - Add integrations as needed
- ✅ **Maintenance mode automation** - Automatic fallback when limits reached
- ✅ **Multi-host support** - Railway → Coolify migration path
- ✅ **Secret management architecture** - Centralized secret handling

## 📁 System Components

### Core Files

| File | Purpose |
|------|---------|
| `.agents` | Machine-readable secret specifications for all integrations |
| `master.secrets.json.template` | Template for local secret management |
| `railway.toml` | Railway configuration with cost-protection guardrails |
| `maintenance.html` | Static maintenance page for auto-shutdown scenarios |

### Documentation

| File | Purpose |
|------|---------|
| `RAILWAY_DEPLOYMENT.md` | Step-by-step Railway deployment guide |
| `COOLIFY_SUPPORT.md` | Coolify deployment configuration guide |
| `COOLIFY_MIGRATION.md` | Detailed migration checklist from Railway to Coolify |
| `INTEGRATION_STUBS.md` | Guide to disabled integrations and how to enable them |
| `ZERO_SECRETS_DEPLOYMENT.md` | This file - system overview |

### Automation Scripts

| Script | Purpose |
|--------|---------|
| `scripts/detect-secrets.mjs` | Validate environment configuration against `.agents` file |
| `scripts/railway-usage-monitor.mjs` | Monitor Railway usage and trigger cost-protection |

## 🚀 Quick Start

### 1. Choose Deployment Mode

**Zero-Secrets** (Recommended first deployment)
```bash
# Only requires 7 core environment variables
# No third-party integrations needed
# Free-tier compatible
```

**Basic** (With email)
```bash
# Adds email verification
# Requires Resend API key
# Still mostly free-tier compatible
```

**Full** (All features)
```bash
# All integrations enabled
# Requires 50+ environment variables
# Likely exceeds free tier
```

### 2. Install Dependencies

```bash
# Clone repository
git clone https://github.com/executiveusa/postiz-maxx-clipz.git
cd postiz-maxx-clipz

# Install dependencies
pnpm install

# Install Railway CLI (optional but recommended)
npm install -g @railway/cli
```

### 3. Validate Configuration

```bash
# Check which secrets are required for zero-secrets mode
node scripts/detect-secrets.mjs --mode zero_secrets

# Generate a report
node scripts/detect-secrets.mjs --mode zero_secrets --format markdown > status.md
```

### 4. Deploy to Railway

Follow the detailed guide in `RAILWAY_DEPLOYMENT.md`:

```bash
# Quick deployment (requires Railway CLI)
railway login
railway init
railway add --plugin postgresql
railway add --plugin redis
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set IS_GENERAL="true"
railway up
```

### 5. Monitor Usage

```bash
# Check current usage against free-tier limits
node scripts/railway-usage-monitor.mjs

# Monitor with auto-shutdown disabled (for testing)
node scripts/railway-usage-monitor.mjs --no-auto-shutdown
```

## 📊 Cost Protection Features

### Automatic Monitoring

The system monitors:
- Service runtime hours (500h/month free tier limit)
- Monthly credit usage ($5/month free tier limit)
- Database storage (1GB free tier limit)
- Redis memory (512MB free tier limit)

### Alert Thresholds

| Threshold | Action |
|-----------|--------|
| 75% | ⚠️ Warning logged |
| 90% | 🚨 Critical alert |
| 95% | 🛑 Auto-shutdown triggered |

### Auto-Shutdown Sequence

When free-tier limit is reached:

1. ✅ System logs shutdown event
2. ✅ Maintenance mode prepared
3. ✅ Static maintenance page deployed
4. ✅ Main services shut down
5. ✅ Migration guide displayed

Users see a professional maintenance page with:
- Clear explanation of cost-protection
- Migration options (upgrade or Coolify)
- Status information
- Next steps

## 🔐 Secret Management Architecture

### The `.agents` File

Machine-readable specification of all secrets:

```json
{
  "project": "postiz-maxx-clipz",
  "secrets": {
    "core": [...],
    "optional_storage": [...],
    "optional_email": [...],
    "optional_social_media": [...]
  },
  "deployment_modes": {
    "zero_secrets": {...},
    "basic": {...},
    "full": {...}
  }
}
```

### Master Secrets File

Local secret management:

```bash
# Copy template
cp master.secrets.json.template ~/.postiz/master.secrets.json

# Edit with your secrets
nano ~/.postiz/master.secrets.json

# Never commit this file!
```

### Secret Categories

1. **Core** - Required for basic functionality
2. **Storage** - Cloudflare R2 or local storage options
3. **Email** - Resend integration for notifications
4. **Social Media** - Platform-specific API credentials
5. **Integrations** - Third-party service connections
6. **Payment** - Stripe configuration
7. **OAuth** - Generic OAuth provider support
8. **Configuration** - Application settings

## 🔄 Integration Stubs

All optional integrations are **disabled by default**:

### Disabled Features in Zero-Secrets Mode

- ❌ Email verification (users auto-activated)
- ❌ All social media platforms
- ❌ Payment processing
- ❌ AI features (OpenAI)
- ❌ URL shortening services
- ❌ Third-party OAuth

### Stub Behavior

When integrations are disabled:
- Features are hidden from UI
- No error messages about missing credentials
- Application remains fully functional
- Users see clear messaging about unavailable features

### Enabling Integrations

See `INTEGRATION_STUBS.md` for detailed guide on enabling each integration incrementally.

## 🌐 Multi-Host Support

### Railway (Default)

**Pros:**
- Easy setup
- Automatic provisioning
- Free tier available
- Great for testing and low-traffic apps

**Cons:**
- Limited free tier
- Potentially expensive at scale
- Less control over infrastructure

### Coolify (Alternative)

**Pros:**
- Self-hosted (full control)
- Potentially much cheaper
- Unlimited resources (server-dependent)
- No vendor lock-in

**Cons:**
- Requires server management
- More complex setup
- Need to manage backups

### Migration Path

Railway → Coolify migration is fully supported:

1. ✅ Review `COOLIFY_SUPPORT.md`
2. ✅ Follow `COOLIFY_MIGRATION.md` checklist
3. ✅ Export data from Railway
4. ✅ Set up Coolify instance
5. ✅ Import data and deploy
6. ✅ Switch DNS
7. ✅ Verify and cleanup

### Hostinger VPN Support

For enhanced security with Coolify:

- VPN tunnel configuration included
- Network routing documentation
- Security best practices
- Integration guides

See `COOLIFY_SUPPORT.md` for details.

## 🛠️ Maintenance Mode

### Automatic Activation

Maintenance mode is triggered when:
- Free-tier limit reached (95%+)
- Manual activation requested
- Critical errors detected

### What Happens

1. Static `maintenance.html` deployed
2. Main services gracefully shut down
3. Database remains accessible for backup
4. Users see friendly maintenance page

### Manual Activation

```bash
# Deploy maintenance mode manually
# (Instructions in maintenance.html comments)
```

## 📈 Monitoring and Alerts

### Built-in Monitoring

```bash
# Check usage anytime
node scripts/railway-usage-monitor.mjs

# Add to cron for automatic monitoring
0 */6 * * * cd /path/to/project && node scripts/railway-usage-monitor.mjs
```

### What's Monitored

- ✅ Service runtime hours
- ✅ Credit usage
- ✅ Database storage
- ✅ Redis memory
- ✅ Projected monthly usage
- ✅ Cost trajectory

### Alert Levels

**🟢 OK** - Usage under 75%
```
All systems operating normally
```

**🟡 Warning** - Usage 75-90%
```
Monitor usage closely
Consider optimization or upgrade
```

**🔴 Critical** - Usage 90-95%
```
Urgent: approaching limits
Take action immediately
```

**⚫ Shutdown** - Usage 95%+
```
Auto-shutdown triggered
Maintenance mode activated
```

## 🔧 Troubleshooting

### Common Issues

**Issue: Build failures on Railway**
```bash
# Solution: Clear cache and rebuild
railway run pnpm install --force
```

**Issue: Database connection errors**
```bash
# Solution: Verify DATABASE_URL
railway variables | grep DATABASE_URL
```

**Issue: Missing secrets**
```bash
# Solution: Run validation
node scripts/detect-secrets.mjs --mode zero_secrets
```

**Issue: High memory usage**
```bash
# Solution: Check resource limits in railway.toml
# Consider upgrading or optimizing
```

### Debug Mode

```bash
# Enable verbose logging
railway logs --follow

# Check service status
railway status

# View environment variables
railway variables
```

## 📚 Documentation Index

### Getting Started
1. **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Deploy to Railway
2. **[INTEGRATION_STUBS.md](./INTEGRATION_STUBS.md)** - Understand disabled features

### Advanced Topics
3. **[COOLIFY_SUPPORT.md](./COOLIFY_SUPPORT.md)** - Self-hosted alternative
4. **[COOLIFY_MIGRATION.md](./COOLIFY_MIGRATION.md)** - Migration checklist

### Reference
5. **[.agents](./.agents)** - Secret specifications (JSON)
6. **[master.secrets.json.template](./master.secrets.json.template)** - Secret management

## 🎓 Best Practices

### Security

1. ✅ **Never commit secrets** - Use `.gitignore`
2. ✅ **Rotate secrets regularly** - Especially JWT_SECRET
3. ✅ **Use HTTPS** - Always in production
4. ✅ **Enable email verification** - For production deployments
5. ✅ **Limit API access** - Use rate limiting
6. ✅ **Monitor logs** - Watch for suspicious activity
7. ✅ **Backup regularly** - Database and uploads

### Cost Management

1. ✅ **Start with zero-secrets** - Minimal cost
2. ✅ **Monitor usage daily** - Use automation scripts
3. ✅ **Enable only needed features** - Incremental activation
4. ✅ **Set up alerts** - Before hitting limits
5. ✅ **Plan for migration** - Have Coolify ready as backup
6. ✅ **Optimize resources** - Review limits in railway.toml

### Deployment Strategy

1. ✅ **Deploy to Railway first** - Quick validation
2. ✅ **Test thoroughly** - Verify all core features
3. ✅ **Enable features incrementally** - One at a time
4. ✅ **Monitor each change** - Watch for issues
5. ✅ **Keep Railway as staging** - When migrating to Coolify
6. ✅ **Document everything** - Custom configurations

## 🤝 Contributing

When extending this system:

1. Update `.agents` file with new secrets
2. Document in `INTEGRATION_STUBS.md`
3. Add validation to `detect-secrets.mjs`
4. Test in zero-secrets mode
5. Update deployment guides
6. Add to this overview

## 📞 Support

- **Documentation**: Start with `RAILWAY_DEPLOYMENT.md`
- **Issues**: GitHub Issues
- **Community**: Discord (see main README)
- **API Docs**: https://docs.postiz.com

## 🗺️ Roadmap

### Current Features (v1.0)
- ✅ Zero-secrets deployment
- ✅ Cost-protection guardrails
- ✅ Maintenance mode automation
- ✅ Secret management system
- ✅ Railway deployment
- ✅ Coolify migration support

### Planned Features (v1.1)
- 🔄 Automatic secret injection
- 🔄 Multi-environment support
- 🔄 Enhanced monitoring dashboard
- 🔄 Cost prediction ML model
- 🔄 Automated testing suite

### Future Enhancements (v2.0)
- 🔮 Multi-cloud support (AWS, GCP, Azure)
- 🔮 Container orchestration (K8s)
- 🔮 Advanced failover logic
- 🔮 Cost optimization AI
- 🔮 Enterprise features

## 📄 License

Same as main project - see LICENSE file

## 🙏 Acknowledgments

- Railway.app for excellent PaaS platform
- Coolify for self-hosted alternative
- Postiz team for the amazing application
- Community contributors

---

**System Version:** 1.0.0

**Last Updated:** 2025-12-07

**Status:** ✅ Production Ready

**Deployment Mode:** Zero-Secrets | Basic | Full

For questions or issues, please refer to the documentation links above or open a GitHub issue.

---

Made with ❤️ for zero-friction deployment
