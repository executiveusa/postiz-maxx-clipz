<p align="center">
  <a href="https://github.com/growchief/growchief">
    <img alt="automate" src="https://github.com/user-attachments/assets/d760188d-8d56-4b05-a6c1-c57e67ef25cd" />
  </a>
</p>

<p align="center">
  <a href="https://postiz.com/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/765e9d72-3ee7-4a56-9d59-a2c9befe2311">
    <img alt="Postiz Logo" src="https://github.com/user-attachments/assets/f0d30d70-dddb-4142-8876-e9aa6ed1cb99" width="280"/>
  </picture>
  </a>
</p>

<p align="center">
<a href="https://opensource.org/license/agpl-v3">
  <img src="https://img.shields.io/badge/License-AGPL%203.0-blue.svg" alt="License">
</a>
</p>

<div align="center">
  <strong>
  <h2>Your ultimate AI social media scheduling tool</h2><br />
  <a href="https://postiz.com">Postiz</a>: An alternative to: Buffer.com, Hypefury, Twitter Hunter, etc...<br /><br />
  </strong>
  Postiz offers everything you need to manage your social media posts,<br />build an audience, capture leads, and grow your business.
</div>

> **Note:** This repository contains the MAXX CLIPZ frontend rebrand of the Postiz project. Backend services remain unchanged.

<div class="flex" align="center">
  <br />
  <img alt="Instagram" src="https://postiz.com/svgs/socials/Instagram.svg" width="32">
  <img alt="Youtube" src="https://postiz.com/svgs/socials/Youtube.svg" width="32">
  <img alt="Dribbble" src="https://postiz.com/svgs/socials/Dribbble.svg" width="32">
  <img alt="Linkedin" src="https://postiz.com/svgs/socials/Linkedin.svg" width="32">
  <img alt="Reddit" src="https://postiz.com/svgs/socials/Reddit.svg" width="32">
  <img alt="TikTok" src="https://postiz.com/svgs/socials/TikTok.svg" width="32">
  <img alt="Facebook" src="https://postiz.com/svgs/socials/Facebook.svg" width="32">
  <img alt="Pinterest" src="https://postiz.com/svgs/socials/Pinterest.svg" width="32">
  <img alt="Threads" src="https://postiz.com/svgs/socials/Threads.svg" width="32">
  <img alt="X" src="https://postiz.com/svgs/socials/X.svg" width="32">
  <img alt="Slack" src="https://postiz.com/svgs/socials/Slack.svg" width="32">
  <img alt="Discord" src="https://postiz.com/svgs/socials/Discord.svg" width="32">
  <img alt="Mastodon" src="https://postiz.com/svgs/socials/Mastodon.svg" width="32">
  <img alt="Bluesky" src="https://postiz.com/svgs/socials/Bluesky.svg" width="32">
</div>

<p align="center">
  <br />
  <a href="https://docs.postiz.com" rel="dofollow"><strong>Explore the docs »</strong></a>
  <br />

  <br />
  <a href="https://youtube.com/@postizofficial" rel="dofollow"><strong>Watch the YouTube Tutorials»</strong></a>
  <br />
</p>

<p align="center">
  <a href="https://platform.postiz.com">Register</a>
  ·
  <a href="https://discord.postiz.com">Join Our Discord (devs only)</a>
  ·
  <a href="https://docs.postiz.com/public-api">Public API</a><br />
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@postiz/node">NodeJS SDK</a>
  ·
  <a href="https://www.npmjs.com/package/n8n-nodes-postiz">N8N custom node</a>
  ·
  <a href="https://apps.make.com/postiz">Make.com integration</a>
</p>


<br />

<p align="center">
  <video src="https://github.com/user-attachments/assets/05436a01-19c8-4827-b57f-05a5e7637a67" width="100%" />
</p>

## ✨ Features

| ![Image 1](https://github.com/user-attachments/assets/a27ee220-beb7-4c7e-8c1b-2c44301f82ef) | ![Image 2](https://github.com/user-attachments/assets/eb5f5f15-ed90-47fc-811c-03ccba6fa8a2) |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Image 3](https://github.com/user-attachments/assets/d51786ee-ddd8-4ef8-8138-5192e9cfe7c3) | ![Image 4](https://github.com/user-attachments/assets/91f83c89-22f6-43d6-b7aa-d2d3378289fb) |

# Intro

- Schedule all your social media posts (many AI features)
- Measure your work with analytics.
- Collaborate with other team members to exchange or buy posts.
- Invite your team members to collaborate, comment, and schedule posts.
- At the moment there is no difference between the hosted version to the self-hosted version

## Tech Stack

- NX (Monorepo)
- NextJS (React)
- NestJS
- Prisma (Default to PostgreSQL)
- Redis (BullMQ)
- Resend (email notifications)

## Quick Start

To have the project up and running, please follow the [Quick Start Guide](https://docs.postiz.com/quickstart)

## Firebase hosting & backend

The repository now ships with a Firebase-ready backend (`apps/firebase-functions`) and deployment workflow:

1. Install dependencies and authenticate with Firebase:
   ```bash
   pnpm install
   pnpm exec firebase login
   ```
2. Configure the project ID in [`.firebaserc`](./.firebaserc) or export `FIREBASE_DEPLOY_TARGET` when deploying from CI.
3. Populate the frontend runtime variables (e.g. in `.env.local`):
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=measurement-id
   NEXT_PUBLIC_FIREBASE_FUNCTION_URL=https://us-central1-your-project.cloudfunctions.net/api
   ```
4. (Optional) Point the frontend at local emulators by setting `NEXT_PUBLIC_FIREBASE_USE_EMULATORS=true` and running:
   ```bash
   pnpm run emulate:firebase
   ```
5. Build and deploy both the Next.js frontend and Firebase Functions backend in one command:
   ```bash
   pnpm run deploy:firebase
   ```

The Firebase Cloud Function exposes REST endpoints for managing scheduled posts (`/posts` CRUD + `/health`). The frontend automatically initialises the Firebase SDK when configuration is present, making it straightforward to adopt Firestore or Firebase Auth features across the application.

## Railway Zero-Secrets Deployment 🚀

Deploy Postiz with minimal configuration and automatic cost protection:

### Quick Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Add services
railway add --plugin postgresql
railway add --plugin redis

# Set required secrets
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set IS_GENERAL="true"

# Deploy
railway up
```

### Features

- ✅ **Zero-secrets mode** - Deploy with only 7 core environment variables
- ✅ **Cost-protection guardrails** - Automatic monitoring and shutdown before exceeding free tier
- ✅ **Incremental features** - Enable integrations one at a time as needed
- ✅ **Maintenance mode** - Automatic failover when limits reached
- ✅ **Migration support** - Easy path to Coolify for self-hosting

### Deployment Modes

| Mode | Required Secrets | Features | Cost |
|------|-----------------|----------|------|
| **Zero-Secrets** | 7 core vars | Basic functionality | Free tier ✅ |
| **Basic** | ~10 vars | + Email verification | Mostly free ⚠️ |
| **Full** | 50+ vars | All features enabled | Paid plan 💰 |

### Monitoring & Validation

```bash
# Check required secrets
npm run railway:detect-secrets

# Monitor usage
npm run railway:usage

# Check full configuration
npm run railway:detect-secrets:full
```

### Documentation

- **[🚀 Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[🔐 Integration Stubs](./INTEGRATION_STUBS.md)** - Which features are disabled by default
- **[📊 Zero-Secrets System](./ZERO_SECRETS_DEPLOYMENT.md)** - Complete system overview
- **[🐳 Coolify Migration](./COOLIFY_MIGRATION.md)** - Self-hosting alternative

### Secret Specifications

All secrets are documented in the [`.agents`](./.agents) file with:
- Required vs optional classification
- Format specifications
- Default values
- Railway auto-provision flags
- Category grouping

### Cost Protection

The system automatically:
- Monitors Railway free-tier usage
- Triggers warnings at 75% usage
- Auto-shuts down at 95% to prevent charges
- Deploys maintenance page
- Provides migration options

For more information, see [ZERO_SECRETS_DEPLOYMENT.md](./ZERO_SECRETS_DEPLOYMENT.md).

## Sponsor Postiz

We now give a few options to Sponsor Postiz:
- Just a donation: You like what we are building, and want to buy us some coffees so we can build faster.
- Main Repository: Get your logo with a backlink from the main Postiz repository. Postiz has almost 3m downloads and 20k views per month.
- Main Repository + Website: Get your logo on the central repository and the main website. Here are some metrics: - Website has 20k hits per month + 65 DR (strong backlink) - Repository has 20k hits per month + Almost 3m docker downloads.

Link: https://opencollective.com/postiz

## Postiz Compliance

- Postiz is an open-source, self-hosted social media scheduling tool that supports platforms like X (formerly Twitter), Bluesky, Mastodon, Discord, and others.
- Postiz hosted service uses official, platform-approved OAuth flows.
- Postiz does not automate or scrape content from social media platforms.
- Postiz does not collect, store, or proxy API keys or access tokens from users.
- Postiz never ask users to paste API keys into our hosted product.
- Postiz Users always authenticate directly with the social platform (e.g., X, Discord, etc.), ensuring platform compliance and data privacy.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=gitroomhq/postiz-app&type=Date)](https://www.star-history.com/#gitroomhq/postiz-app&Date)

## License

This repository's source code is available under the [AGPL-3.0 license](LICENSE).

<br /><br /><br />

<p align="center">
  <a href="https://www.g2.com/products/postiz/take_survey" target="blank"><img alt="g2" src="https://github.com/user-attachments/assets/892cb74c-0b49-4589-b2f5-fbdbf7a98f66" /></a>
</p>
