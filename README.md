# NestJS Boilerplate

A comprehensive, production-ready NestJS boilerplate with best practices, featuring TypeORM, Redis, RabbitMQ, WebSocket, and more.

## 🚀 Features

### Core Features
- ✅ **NestJS Framework** - Modern, scalable Node.js framework
- ✅ **TypeScript** - Full TypeScript support with strict typing
- ✅ **TypeORM** - Database ORM with PostgreSQL
- ✅ **Database Migrations** - Laravel-style migrations
- ✅ **Seeders & Factories** - Database seeding with factory pattern
- ✅ **Dependency Injection** - Built-in DI container

### Authentication & Security
- ✅ **JWT Authentication** - Bearer token authentication
- ✅ **User-based Authorization** - Role-based access control
- ✅ **Rate Limiting** - Throttling for API endpoints
- ✅ **Password Hashing** - Bcrypt password encryption
- ✅ **Request Validation** - Class-validator DTOs

### Caching & Performance
- ✅ **Redis Cache** - Distributed caching with Redis
- ✅ **Cache Manager** - Switchable cache drivers (like Laravel)
- ✅ **Query Optimization** - Eager loading relationships

### Background Processing
- ✅ **Bull Queue** - Redis-based job queue
- ✅ **Event Emitter** - Event-driven architecture
- ✅ **RabbitMQ** - Message broker integration
- ✅ **Queue Processors** - Background job processing

### Real-time Communication
- ✅ **WebSocket Gateway** - Socket.io integration
- ✅ **Room Management** - WebSocket room support
- ✅ **Real-time Events** - Live event broadcasting

### Developer Experience
- ✅ **Swagger Documentation** - Auto-generated API docs
- ✅ **CLI Commands** - Laravel-style artisan commands
- ✅ **Hot Reload** - Development with watch mode
- ✅ **ESLint & Prettier** - Code formatting and linting
- ✅ **Comprehensive Logging** - Request/response logging

### Testing
- ✅ **Jest** - Unit and integration testing
- ✅ **E2E Tests** - End-to-end testing with Supertest
- ✅ **Test Coverage** - Code coverage reports
- ✅ **Mocking** - Comprehensive test mocks

### Infrastructure
- ✅ **Docker Compose** - Multi-container setup
- ✅ **Nginx** - Reverse proxy configuration
- ✅ **PostgreSQL** - Production database
- ✅ **Redis** - Caching and queue backend
- ✅ **RabbitMQ** - Message broker

### HTTP & External APIs
- ✅ **HTTP Module** - Axios-based HTTP client
- ✅ **External API Integration** - Example implementations

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
cd nestjs-boilerplate
```

2. **Copy environment file**
```bash
cp .env.example .env
```

3. **Install dependencies**
```bash
npm install
```

4. **Start services with Docker**
```bash
docker-compose up -d
```

5. **Run migrations**
```bash
npm run migration:run
```

6. **Seed database**
```bash
npm run seed
```

7. **Start development server**
```bash
npm run start:dev
```

The application will be available at:
- API: http://localhost/api
- Swagger Docs: http://localhost/api/docs
- RabbitMQ Management: http://localhost:15672 (admin/admin)

## 📁 Project Structure

```
nestjs-boilerplate/
├── src/
│   ├── common/                 # Shared utilities
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Interceptors
│   │   └── interfaces/        # Common interfaces
│   ├── config/                # Configuration files
│   │   └── typeorm.config.ts  # TypeORM configuration
│   ├── database/              # Database related
│   │   ├── factories/         # Data factories
│   │   ├── migrations/        # Database migrations
│   │   └── seeds/             # Database seeders
│   ├── modules/               # Feature modules
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # Users module
│   │   ├── posts/            # Posts module (example CRUD)
│   │   ├── websocket/        # WebSocket module
│   │   └── command/          # CLI commands module
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
├── test/                      # E2E tests
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Application container
└── nginx/                     # Nginx configuration
```

## 🔧 Available Scripts

### Development
```bash
npm run start:dev      # Start in development mode with watch
npm run start:debug    # Start in debug mode
npm run build          # Build for production
npm run start:prod     # Start production build
```

### Database
```bash
npm run migration:generate -- -n MigrationName  # Generate migration
npm run migration:create -- -n MigrationName    # Create empty migration
npm run migration:run                           # Run migrations
npm run migration:revert                        # Revert last migration
npm run seed                                    # Run database seeders
```

### Testing
```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run e2e tests
```

### Code Quality
```bash
npm run lint           # Lint code
npm run format         # Format code with Prettier
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts (Mixed)
- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/:id` - Get post by ID (public)
- `POST /api/posts` - Create post (protected)
- `PATCH /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)
- `GET /api/posts/external` - Fetch external data example

## 🎯 Usage Examples

### Register a User
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "Password123!"
  }'
```

### Login
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "Password123!"
  }'
```

### Create a Post (with Bearer Token)
```bash
curl -X POST http://localhost/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post"
  }'
```

## 🔌 WebSocket Usage

Connect to WebSocket server:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost/ws');

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.emit('message', { text: 'Hello World' });

socket.on('message', (data) => {
  console.log('Received:', data);
});
```

## 🎨 CLI Commands

Run custom commands (similar to Laravel Artisan):

```bash
# Seed users
npm run seed:users

# Clear cache
npm run cache:clear
npm run cache:clear -- --all
npm run cache:clear -- --pattern "posts:*"
```

## 🧪 Testing

The project uses **Jest** as the testing framework with comprehensive test coverage:

### Unit Tests
Located in `*.spec.ts` files next to the source code:
- `users.service.spec.ts` - User service tests
- `auth.service.spec.ts` - Authentication tests
- `posts.service.spec.ts` - Posts service tests

### E2E Tests
Located in `test/` directory:
- `app.e2e-spec.ts` - End-to-end API tests

Run tests:
```bash
npm run test          # Unit tests
npm run test:cov      # With coverage
npm run test:e2e      # E2E tests
```

## 🐳 Docker Services

The application uses Docker Compose with the following services:

- **app** - NestJS application (port 3000)
- **nginx** - Reverse proxy (port 80)
- **postgres** - PostgreSQL database (port 5432)
- **redis** - Redis cache (port 6379)
- **rabbitmq** - RabbitMQ message broker (ports 5672, 15672)

## 🔄 Cache Strategy

The application implements a Laravel-like cache system with Redis:

```typescript
// Cache usage example
const cachedData = await this.cacheManager.get('key');
if (!cachedData) {
  const data = await this.fetchData();
  await this.cacheManager.set('key', data, 300); // TTL: 5 minutes
  return data;
}
return cachedData;
```

## 📊 Event System

Events are emitted throughout the application:

```typescript
// Emit event
this.eventEmitter.emit('post.created', { post, user });

// Listen to event
@OnEvent('post.created')
handlePostCreated(payload: any) {
  // Handle event
}
```

## 🔐 Environment Variables

Key environment variables (see `.env.example`):

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=nestjs_boilerplate

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

## 🏗️ Architecture

This boilerplate follows NestJS best practices:

1. **Modular Architecture** - Features organized in modules
2. **Dependency Injection** - Services injected via constructor
3. **DTOs** - Data Transfer Objects for validation
4. **Entities** - TypeORM entities for database models
5. **Guards** - JWT authentication guards
6. **Interceptors** - Logging and transformation
7. **Filters** - Global exception handling
8. **Pipes** - Validation pipes

## 📝 Best Practices Implemented

- ✅ Try-catch blocks with comprehensive logging
- ✅ Request validation with class-validator
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Rate limiting on sensitive endpoints
- ✅ Redis caching for performance
- ✅ Event-driven architecture
- ✅ Background job processing
- ✅ Database migrations and seeders
- ✅ Comprehensive error handling
- ✅ API documentation with Swagger
- ✅ Unit and E2E testing
- ✅ Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NestJS Team for the amazing framework
- All contributors and maintainers

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
