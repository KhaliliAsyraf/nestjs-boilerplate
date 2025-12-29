# NestJS Boilerplate - Quick Start Guide

Get up and running with the NestJS Boilerplate in minutes!

## 🚀 Quick Start (5 minutes)

### Option 1: Using Make (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd nestjs-boilerplate

# Complete setup (install, start services, migrate, seed)
make setup

# Start development server
make dev
```

### Option 2: Manual Setup

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd nestjs-boilerplate

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start Docker services
docker-compose up -d

# 5. Run migrations
npm run migration:run

# 6. Seed database
npm run seed

# 7. Start development server
npm run start:dev
```

## 🎯 Access Points

After setup, access:

- **API**: http://localhost/api
- **Swagger Docs**: http://localhost/api/docs
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

## 🔐 Default Credentials

After seeding, you can login with:

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin123!`

**Regular User:**
- Email: `user@example.com`
- Password: `User123!`

## 📝 First API Call

### 1. Login
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "admin@example.com",
    "password": "Admin123!"
  }'
```

### 2. Copy the `accessToken` from response

### 3. Create a Post
```bash
curl -X POST http://localhost/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "Hello World!"
  }'
```

## 🧪 Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🛠️ Common Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npm run migration:run      # Run migrations
npm run seed              # Seed database

# Docker
docker-compose up -d      # Start all services
docker-compose down       # Stop all services
docker-compose logs -f    # View logs

# Testing
npm run test              # Run tests
npm run test:cov          # Test with coverage
```

## 📚 Next Steps

1. **Explore Swagger UI**: Visit http://localhost/api/docs
2. **Read the README**: Check out the full documentation
3. **Try WebSocket**: Connect to ws://localhost/ws
4. **Customize**: Start building your features!

## 🐛 Troubleshooting

### Port already in use
```bash
# Stop all services
docker-compose down

# Check what's using port 80
sudo lsof -i :80

# Start again
docker-compose up -d
```

### Database connection error
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Clear everything and start fresh
```bash
make clean
make setup
```

## 📖 Documentation

- [Full README](../README.md)
- [API Testing Guide](./API_TESTING.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Need Help?

- Check the logs: `docker-compose logs -f`
- Open an issue on GitHub
- Review the documentation

---

**Happy Coding! 🎉**
