# Coolify Deployment Support

This document provides guidance for deploying Postiz MAXX CLIPZ on Coolify as an alternative to Railway.

## Overview

Coolify is an open-source, self-hostable Platform-as-a-Service (PaaS) alternative to Railway, Heroku, and Netlify. It provides similar deployment capabilities with more control and potentially lower costs.

## Prerequisites

- A server with Docker installed (minimum 2GB RAM, 2 CPU cores recommended)
- Coolify installed on your server ([Installation Guide](https://coolify.io/docs/installation))
- Domain name (optional but recommended)
- Hostinger VPN (optional, for secure tunneling)

## Deployment Configuration

### 1. Docker Compose Configuration

Coolify supports Docker Compose deployments. Use the development compose file as a starting point:

```bash
# Copy and modify the development compose file
cp docker-compose.dev.yaml docker-compose.coolify.yaml
```

### 2. Environment Variables

Coolify uses the same environment variables as defined in `.env.example`. Key differences:

#### Required Variables for Coolify:

```env
# Database (use Coolify's internal PostgreSQL)
DATABASE_URL="postgresql://postiz:YOUR_PASSWORD@postgres:5432/postiz"

# Redis (use Coolify's internal Redis)
REDIS_URL="redis://redis:6379"

# Application URLs (update with your Coolify domain)
FRONTEND_URL="https://your-domain.com"
NEXT_PUBLIC_BACKEND_URL="https://api.your-domain.com"
BACKEND_INTERNAL_URL="http://backend:3000"

# Security
JWT_SECRET="YOUR_GENERATED_SECRET_MIN_32_CHARS"
IS_GENERAL="true"

# Storage (start with local)
STORAGE_PROVIDER="local"
UPLOAD_DIRECTORY="/data/uploads"
```

### 3. Service Configuration

#### Frontend Service
```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: frontend
    ports:
      - "4200:4200"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
    volumes:
      - uploads:/data/uploads
    depends_on:
      - backend
```

#### Backend Service
```yaml
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
```

#### Workers Service
```yaml
  workers:
    build:
      context: .
      dockerfile: Dockerfile
      target: workers
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
```

#### Cron Service
```yaml
  cron:
    build:
      context: .
      dockerfile: Dockerfile
      target: cron
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
```

### 4. Database Configuration

Coolify can provision PostgreSQL automatically:

```yaml
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: postiz
      POSTGRES_USER: postiz
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```

### 5. Redis Configuration

```yaml
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
```

### 6. Volumes

```yaml
volumes:
  postgres_data:
  redis_data:
  uploads:
```

## Hostinger VPN Integration

If using Hostinger VPN for secure tunneling:

### Setup Steps

1. **Install Hostinger VPN** on your Coolify server:
```bash
# Follow Hostinger VPN installation instructions
# Typically involves downloading the VPN client and configuring
```

2. **Configure Network Routes**:
```bash
# Ensure Coolify can access external services through VPN
# Add routing rules if needed
```

3. **Update Docker Network Configuration**:
```yaml
networks:
  postiz-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

4. **VPN Tunnel Configuration**:
```env
# Add to your Coolify environment
VPN_ENABLED=true
VPN_GATEWAY=your-vpn-gateway
VPN_SUBNET=your-vpn-subnet
```

## Resource Limits

Coolify allows fine-grained resource control:

### Memory Limits
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### CPU Limits
```yaml
    deploy:
      resources:
        limits:
          cpus: '0.5'
        reservations:
          cpus: '0.25'
```

## Monitoring and Health Checks

### Health Check Configuration

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging

Coolify provides built-in log aggregation:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Cost Comparison

| Feature | Railway (Free Tier) | Coolify (Self-Hosted) |
|---------|--------------------|-----------------------|
| Monthly Cost | $0 (limited hours) | Server cost only (~$5-20/mo) |
| Database | 1GB PostgreSQL | Unlimited (server-dependent) |
| Redis | 512MB | Unlimited (server-dependent) |
| Compute | Limited hours | Unlimited |
| Storage | Limited | Server storage |
| Control | Limited | Full control |

## Migration from Railway

See [COOLIFY_MIGRATION.md](./COOLIFY_MIGRATION.md) for detailed migration steps.

## Backup and Restore

### Database Backup
```bash
# Backup PostgreSQL
docker exec -t postgres pg_dump -U postiz postiz > backup.sql

# Restore
cat backup.sql | docker exec -i postgres psql -U postiz postiz
```

### Volume Backup
```bash
# Backup uploads
docker run --rm -v postiz_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz /data
```

## Security Best Practices

1. **Use HTTPS**: Configure SSL certificates via Coolify's built-in Let's Encrypt integration
2. **Firewall**: Only expose necessary ports (80, 443)
3. **Database**: Use strong passwords and limit access
4. **Secrets**: Store secrets in Coolify's environment variable manager
5. **Updates**: Keep Coolify and Docker images updated
6. **VPN**: Use Hostinger VPN for additional security layer

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 4200, 5432, 6379 are not in use
2. **Memory Issues**: Increase server memory or adjust container limits
3. **Database Connection**: Verify DATABASE_URL is correct
4. **Build Failures**: Check Dockerfile and build context

### Debug Commands

```bash
# View logs
coolify logs <service-name>

# Restart service
coolify restart <service-name>

# Check resource usage
docker stats

# Database connection test
docker exec postgres psql -U postiz -d postiz -c "SELECT 1"
```

## Support and Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Postiz Documentation**: https://docs.postiz.com
- **Community Discord**: Check README for link
- **GitHub Issues**: Report bugs and issues

## Next Steps

1. Set up your Coolify instance
2. Configure environment variables
3. Deploy using Docker Compose
4. Run database migrations
5. Configure domain and SSL
6. Enable optional features incrementally

For detailed migration instructions, see [COOLIFY_MIGRATION.md](./COOLIFY_MIGRATION.md).
