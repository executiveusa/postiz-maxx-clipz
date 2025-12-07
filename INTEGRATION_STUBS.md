# Integration Stubs and Configuration

This document describes which integrations are disabled by default in the zero-secrets deployment and how to enable them incrementally.

## Overview

The zero-secrets deployment mode starts with minimal configuration to ensure a working deployment with no third-party dependencies. All optional integrations are stubbed (disabled) by default and can be enabled incrementally as needed.

## Deployment Modes

### Zero-Secrets Mode (Default)
**Enabled Features:**
- Core authentication (email/password)
- Local file storage
- Basic post creation and scheduling
- Database (PostgreSQL)
- Queue management (Redis)

**Disabled Features:**
- Email verification
- All social media platform integrations
- Payment processing
- AI-powered features
- URL shortening services
- Third-party OAuth providers

### Basic Mode
**Additionally Enabled:**
- Email verification (Resend)
- Email notifications
- Local storage optimization

**Still Disabled:**
- Social media platforms
- Payment processing
- AI features
- URL shortening

### Full Mode
**All features enabled**

## Integration Categories

### 1. Email Services

#### Status in Zero-Secrets Mode
🔴 **Disabled** - Users are auto-activated without email verification

#### Configuration Required
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

#### How It Works When Disabled
- New users are automatically activated
- No email verification required
- No password reset emails
- No notification emails

#### When to Enable
- When you need to verify user identities
- When you want to send notifications
- For production deployments with public registration

#### Cost Consideration
- Resend free tier: 3,000 emails/month
- Upgrade required for higher volume

---

### 2. Social Media Platforms

All social media integrations are disabled by default. Enable them individually as needed.

#### Twitter/X

**Status:** 🔴 Disabled

**Configuration:**
```env
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
```

**Stub Behavior:**
- Twitter/X option hidden in platform selector
- Existing connections show as "unavailable"
- Attempts to post show friendly error message

**How to Enable:**
1. Create Twitter/X Developer account
2. Create app and get API credentials
3. Add credentials to environment
4. Restart services
5. Platform becomes available in UI

**Cost:** Free tier available with rate limits

#### LinkedIn

**Status:** 🔴 Disabled

**Configuration:**
```env
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
```

**Stub Behavior:** Same as Twitter/X

**How to Enable:** Similar to Twitter/X

**Cost:** Free with rate limits

#### Facebook & Instagram

**Status:** 🔴 Disabled

**Configuration:**
```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

**Stub Behavior:** Platforms hidden from selector

**How to Enable:**
1. Create Facebook Developer account
2. Create app
3. Get approval for Instagram Basic Display
4. Add credentials
5. Restart services

**Cost:** Free

#### YouTube

**Status:** 🔴 Disabled

**Configuration:**
```env
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
```

**Cost:** Free with quota limits

#### TikTok

**Status:** 🔴 Disabled

**Configuration:**
```env
TIKTOK_CLIENT_ID=your_client_id
TIKTOK_CLIENT_SECRET=your_client_secret
```

**Cost:** Free

#### Other Platforms

Similar configuration for:
- Reddit
- Pinterest
- Dribbble
- Discord
- Slack
- Mastodon
- Threads

All follow the same pattern:
1. Platform is hidden when not configured
2. Add CLIENT_ID and CLIENT_SECRET
3. Restart to enable

---

### 3. Storage Services

#### Local Storage (Default)

**Status:** 🟢 Enabled

**Configuration:**
```env
STORAGE_PROVIDER=local
UPLOAD_DIRECTORY=./uploads
```

**Behavior:**
- Files stored on Railway volume
- Limited by available disk space
- Persists across deploys

**Limitations:**
- No CDN distribution
- Single-region storage
- Volume size limits on free tier

#### Cloudflare R2 Storage

**Status:** 🔴 Disabled

**Configuration:**
```env
STORAGE_PROVIDER=cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKETNAME=your_bucket_name
CLOUDFLARE_BUCKET_URL=https://your-bucket.r2.cloudflarestorage.com/
CLOUDFLARE_REGION=auto
```

**Benefits:**
- S3-compatible storage
- Global CDN distribution
- No egress fees
- Higher storage limits

**Cost:** 
- Free tier: 10GB storage, 1M Class A operations/month
- Very affordable paid tier

---

### 4. Payment Processing

#### Stripe

**Status:** 🔴 Disabled

**Configuration:**
```env
STRIPE_PUBLISHABLE_KEY=pk_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_xxxxxxxxxxxx
STRIPE_SIGNING_KEY=whsec_xxxxxxxxxxxx
STRIPE_SIGNING_KEY_CONNECT=whsec_xxxxxxxxxxxx
FEE_AMOUNT=0.05
```

**Stub Behavior:**
- Payment features hidden in UI
- Subscription plans not available
- Free tier features only

**When to Enable:**
- Ready to monetize
- Have business entity set up
- Completed Stripe verification

**Cost:**
- Stripe: 2.9% + $0.30 per transaction
- No monthly fees

---

### 5. AI Features

#### OpenAI Integration

**Status:** 🔴 Disabled

**Configuration:**
```env
OPENAI_API_KEY=sk_xxxxxxxxxxxx
```

**Stub Behavior:**
- AI writing assistance disabled
- Content suggestions unavailable
- Image generation unavailable
- Users see "AI features require OpenAI API key" message

**Features When Enabled:**
- AI-powered post generation
- Content improvement suggestions
- Image caption generation
- Hashtag recommendations

**Cost:**
- Pay-per-use pricing
- GPT-4: ~$0.03 per 1k tokens
- GPT-3.5: ~$0.002 per 1k tokens
- Image generation: varies by model

---

### 6. URL Shortening

All URL shortening services are disabled by default.

#### Dub.co

**Status:** 🔴 Disabled

**Configuration:**
```env
DUB_TOKEN=your_token
DUB_API_ENDPOINT=https://api.dub.co
DUB_SHORT_LINK_DOMAIN=dub.sh
```

**Stub Behavior:**
- URLs posted as-is without shortening
- Short link features hidden

#### Short.io

**Status:** 🔴 Disabled

**Configuration:**
```env
SHORT_IO_SECRET_KEY=your_secret_key
```

#### Kutt.it

**Status:** 🔴 Disabled

**Configuration:**
```env
KUTT_API_KEY=your_api_key
KUTT_API_ENDPOINT=https://kutt.it/api/v2
KUTT_SHORT_LINK_DOMAIN=kutt.it
```

#### LinkDrip

**Status:** 🔴 Disabled

**Configuration:**
```env
LINK_DRIP_API_KEY=your_api_key
LINK_DRIP_API_ENDPOINT=https://api.linkdrip.com/v1/
LINK_DRIP_SHORT_LINK_DOMAIN=dripl.ink
```

---

### 7. Newsletter Services

#### Beehiiv

**Status:** 🔴 Disabled

**Configuration:**
```env
BEEHIIVE_API_KEY=your_api_key
BEEHIIVE_PUBLICATION_ID=your_publication_id
```

#### Listmonk

**Status:** 🔴 Disabled

**Configuration:**
```env
LISTMONK_DOMAIN=https://your-domain.com
LISTMONK_USER=your_username
LISTMONK_API_KEY=your_api_key
LISTMONK_LIST_ID=your_list_id
```

---

### 8. OAuth Providers

#### Generic OAuth (Authentik, Keycloak, etc.)

**Status:** 🔴 Disabled

**Configuration:**
```env
POSTIZ_GENERIC_OAUTH=true
NEXT_PUBLIC_POSTIZ_OAUTH_DISPLAY_NAME=Your Provider
NEXT_PUBLIC_POSTIZ_OAUTH_LOGO_URL=https://logo-url.com/logo.png
POSTIZ_OAUTH_URL=https://auth.example.com
POSTIZ_OAUTH_AUTH_URL=https://auth.example.com/authorize
POSTIZ_OAUTH_TOKEN_URL=https://auth.example.com/token
POSTIZ_OAUTH_USERINFO_URL=https://auth.example.com/userinfo
POSTIZ_OAUTH_CLIENT_ID=your_client_id
POSTIZ_OAUTH_CLIENT_SECRET=your_client_secret
```

**When Disabled:**
- Only email/password authentication available
- OAuth login button hidden

**When to Enable:**
- Integrating with corporate SSO
- Using self-hosted identity provider
- Centralizing authentication

---

## Testing Stub Behavior

To verify integration stubs are working correctly:

1. **Check UI**: Disabled features should be hidden or show clear "unavailable" messages
2. **Attempt Operations**: Trying to use disabled features should show friendly error messages
3. **Review Logs**: No errors about missing API keys should appear
4. **Health Checks**: Application should pass all health checks

## Enabling Integrations Incrementally

Recommended order for enabling features:

### Phase 1: Core Improvements (Week 1)
1. ✅ Email verification (Resend)
2. ✅ Cloudflare storage (optional)

### Phase 2: Social Media (Week 2-3)
3. ✅ Twitter/X (most common)
4. ✅ LinkedIn
5. ✅ Instagram/Facebook
6. ✅ Other platforms as needed

### Phase 3: Advanced Features (Week 4+)
7. ✅ AI features (OpenAI)
8. ✅ URL shortening
9. ✅ Payment processing (if monetizing)
10. ✅ Additional integrations as needed

## Validation Scripts

Use the provided scripts to validate configuration:

```bash
# Check which secrets are missing
node scripts/detect-secrets.mjs --mode zero_secrets

# Check for basic mode
node scripts/detect-secrets.mjs --mode basic

# Check for full mode
node scripts/detect-secrets.mjs --mode full

# Generate report
node scripts/detect-secrets.mjs --mode full --format markdown > integration-status.md
```

## Troubleshooting

### Integration Not Appearing After Adding Secrets

1. Verify environment variables are set:
   ```bash
   railway variables
   ```

2. Restart all services:
   ```bash
   railway restart
   ```

3. Check logs for errors:
   ```bash
   railway logs
   ```

4. Verify secret format matches `.agents` specifications

### Features Still Disabled Despite Configuration

1. Check `.agents` file for exact variable names
2. Ensure no typos in environment variable names
3. Verify values don't contain placeholder text
4. Check if additional variables are required (some integrations need multiple keys)

### Unexpected Costs

If you see unexpected charges:

1. Review Railway usage:
   ```bash
   node scripts/railway-usage-monitor.mjs
   ```

2. Check third-party service usage:
   - Resend dashboard
   - OpenAI usage page
   - Stripe dashboard
   - etc.

3. Consider disabling expensive features temporarily

4. Review `railway.toml` cost protection settings

## Documentation References

- **Secret Specifications**: See `.agents` file
- **Deployment Modes**: See `RAILWAY_DEPLOYMENT.md`
- **Cost Protection**: See `railway.toml` and `railway-usage-monitor.mjs`
- **Migration**: See `COOLIFY_MIGRATION.md` for self-hosted alternative

## Contributing

When adding new integrations:

1. Add to `.agents` file with complete specification
2. Update this document with stub behavior
3. Implement graceful degradation in code
4. Add validation to `detect-secrets.mjs`
5. Update deployment documentation
6. Test in zero-secrets mode

---

**Last Updated:** 2025-12-07

**Version:** 1.0.0

**Maintainer:** See repository README
