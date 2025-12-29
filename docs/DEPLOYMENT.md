# Deployment Guide

This guide covers deploying the NestJS Boilerplate to production.

## Prerequisites

- Docker and Docker Compose installed on the server
- Domain name (optional, for SSL)
- Basic knowledge of Linux server administration

## Production Environment Setup

### 1. Server Preparation

Update your server:
```bash
sudo apt update && sudo apt upgrade -y
```

Install Docker and Docker Compose:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone Repository

```bash
git clone <your-repository-url>
cd nestjs-boilerplate
```

### 3. Environment Configuration

Create production environment file:
```bash
cp .env.example .env
```

Update `.env` with production values:
```env
NODE_ENV=production
PORT=3000

# Use strong passwords in production!
DATABASE_PASSWORD=your-strong-password
JWT_SECRET=your-very-long-random-secret-key
RABBITMQ_DEFAULT_PASS=your-rabbitmq-password

# Update other values as needed
```

### 4. Update Docker Compose for Production

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    environment:
      - NODE_ENV=production
    # Remove volume mounts for production

  nginx:
    restart: always
    # Add SSL configuration if needed

  postgres:
    restart: always
    # Consider using external managed database

  redis:
    restart: always

  rabbitmq:
    restart: always
```

### 5. Build and Start Services

```bash
# Build the application
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec app npm run migration:run

# Seed database (optional)
docker-compose -f docker-compose.prod.yml exec app npm run seed
```

### 6. SSL Configuration (Optional)

For HTTPS, update Nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... rest of configuration
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Use Let's Encrypt for free SSL certificates:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Health Checks

Monitor your application:
- Application: http://your-domain/api
- RabbitMQ Management: http://your-domain:15672

## Backup Strategy

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres nestjs_boilerplate > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres nestjs_boilerplate < backup.sql
```

### Automated Backups

Create a cron job:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Scaling

### Horizontal Scaling

Use Docker Swarm or Kubernetes for multi-instance deployment.

### Vertical Scaling

Adjust resource limits in `docker-compose.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure firewall (UFW)
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular backups
- [ ] Monitor logs for suspicious activity

## Troubleshooting

### Application won't start
```bash
docker-compose logs app
```

### Database connection issues
```bash
docker-compose exec app npm run typeorm -- query "SELECT 1"
```

### Clear cache
```bash
docker-compose exec app npm run cache:clear -- --all
```

## Performance Optimization

1. **Enable Redis persistence**
2. **Use connection pooling**
3. **Implement CDN for static assets**
4. **Enable Gzip compression in Nginx**
5. **Use PM2 for process management** (alternative to Docker)

## Maintenance

### Update Application

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec app npm run migration:run
```

### Database Migrations

```bash
# Create migration
docker-compose exec app npm run migration:create -- -n MigrationName

# Run migrations
docker-compose exec app npm run migration:run

# Revert migration
docker-compose exec app npm run migration:revert
```

## Support

For issues, please refer to the main README or open an issue on GitHub.
