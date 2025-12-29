# NestJS Boilerplate - Project Structure

## 📁 Complete Directory Structure

```
nestjs-boilerplate/
├── .env.example                    # Environment variables template
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier configuration
├── docker-compose.yml              # Docker services configuration
├── Dockerfile                      # Application container
├── Makefile                        # Common commands shortcuts
├── nest-cli.json                   # NestJS CLI configuration
├── package.json                    # Dependencies and scripts
├── README.md                       # Main documentation
├── tsconfig.json                   # TypeScript configuration
│
├── docs/                           # Documentation
│   ├── API_TESTING.md             # API testing guide
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── QUICKSTART.md              # Quick start guide
│
├── nginx/                          # Nginx configuration
│   └── nginx.conf                 # Reverse proxy config
│
├── src/                            # Source code
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   └── interfaces/
│   │       ├── pagination.interface.ts
│   │       └── user.interface.ts
│   │
│   ├── config/                    # Configuration
│   │   └── typeorm.config.ts     # TypeORM configuration
│   │
│   ├── database/                  # Database related
│   │   ├── factories/            # Data factories
│   │   │   ├── post.factory.ts
│   │   │   └── user.factory.ts
│   │   ├── migrations/           # Database migrations
│   │   │   ├── 1703000000001-CreateUsersTable.ts
│   │   │   └── 1703000000002-CreatePostsTable.ts
│   │   └── seeds/                # Database seeders
│   │       └── run-seed.ts
│   │
│   └── modules/                   # Feature modules
│       │
│       ├── auth/                  # Authentication
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── guards/
│       │   │   └── jwt-auth.guard.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   └── auth.service.spec.ts
│       │
│       ├── users/                 # Users management
│       │   ├── dto/
│       │   │   ├── create-user.dto.ts
│       │   │   └── update-user.dto.ts
│       │   ├── entities/
│       │   │   └── user.entity.ts
│       │   ├── users.controller.ts
│       │   ├── users.module.ts
│       │   ├── users.service.ts
│       │   └── users.service.spec.ts
│       │
│       ├── posts/                 # Posts (CRUD example)
│       │   ├── dto/
│       │   │   ├── create-post.dto.ts
│       │   │   └── update-post.dto.ts
│       │   ├── entities/
│       │   │   └── post.entity.ts
│       │   ├── listeners/
│       │   │   └── post-events.listener.ts
│       │   ├── processors/
│       │   │   └── notification.processor.ts
│       │   ├── posts.controller.ts
│       │   ├── posts.module.ts
│       │   ├── posts.service.ts
│       │   └── posts.service.spec.ts
│       │
│       ├── websocket/             # WebSocket
│       │   ├── websocket.gateway.ts
│       │   └── websocket.module.ts
│       │
│       └── command/               # CLI Commands
│           ├── commands/
│           │   ├── clear-cache.command.ts
│           │   └── seed-users.command.ts
│           └── command.module.ts
│
└── test/                          # E2E tests
    ├── app.e2e-spec.ts
    └── jest-e2e.json

```

## 🎯 Key Features by File

### Core Application Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Application bootstrap, global configuration |
| `src/app.module.ts` | Root module with all imports |
| `src/config/typeorm.config.ts` | Database configuration |

### Authentication & Authorization

| File | Purpose |
|------|---------|
| `auth.service.ts` | Login, register, JWT generation |
| `jwt.strategy.ts` | JWT validation strategy |
| `jwt-auth.guard.ts` | Route protection guard |

### Database

| File | Purpose |
|------|---------|
| `*.entity.ts` | TypeORM entities (models) |
| `migrations/*.ts` | Database schema migrations |
| `factories/*.ts` | Test data factories |
| `seeds/run-seed.ts` | Database seeder |

### Business Logic

| File | Purpose |
|------|---------|
| `*.controller.ts` | HTTP endpoints |
| `*.service.ts` | Business logic |
| `*.dto.ts` | Data validation |
| `*.spec.ts` | Unit tests |

### Infrastructure

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Multi-container setup |
| `Dockerfile` | App container definition |
| `nginx/nginx.conf` | Reverse proxy config |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `tsconfig.json` | TypeScript compiler options |
| `nest-cli.json` | NestJS CLI settings |
| `.eslintrc.js` | Code linting rules |
| `.prettierrc` | Code formatting rules |
| `package.json` | Dependencies and scripts |

## 📦 Module Structure

Each feature module follows this pattern:

```
module-name/
├── dto/                    # Data Transfer Objects
│   ├── create-*.dto.ts    # Creation validation
│   └── update-*.dto.ts    # Update validation
├── entities/              # Database entities
│   └── *.entity.ts
├── *.controller.ts        # HTTP endpoints
├── *.service.ts          # Business logic
├── *.service.spec.ts     # Unit tests
└── *.module.ts           # Module definition
```

## 🎨 Design Patterns Used

1. **Dependency Injection** - Services injected via constructor
2. **Repository Pattern** - TypeORM repositories
3. **Factory Pattern** - Data factories for testing
4. **Strategy Pattern** - Passport strategies
5. **Observer Pattern** - Event emitters
6. **Decorator Pattern** - Custom decorators
7. **Guard Pattern** - Route guards
8. **Interceptor Pattern** - Request/response transformation
9. **Filter Pattern** - Exception handling

## 🔐 Security Layers

1. **JWT Authentication** - Token-based auth
2. **Guards** - Route protection
3. **Validation Pipes** - Input validation
4. **Rate Limiting** - DDoS protection
5. **CORS** - Cross-origin configuration
6. **Password Hashing** - Bcrypt encryption

## 📊 Data Flow

```
Request → Nginx → NestJS App → Guard → Controller → Service → Repository → Database
                                  ↓
                            Interceptor
                                  ↓
                            Response
```

## 🧪 Testing Strategy

- **Unit Tests** (`.spec.ts`) - Test individual services
- **E2E Tests** (`test/*.e2e-spec.ts`) - Test complete flows
- **Mocking** - Mock dependencies for isolation
- **Coverage** - Track code coverage

## 🚀 Deployment Architecture

```
Internet → Nginx (Port 80/443)
            ↓
         NestJS App (Port 3000)
            ↓
    ┌──────┴──────┬──────────┬──────────┐
    ↓             ↓          ↓          ↓
PostgreSQL    Redis    RabbitMQ   WebSocket
```

## 📝 Best Practices Implemented

✅ Modular architecture
✅ Separation of concerns
✅ Dependency injection
✅ Error handling with try-catch
✅ Comprehensive logging
✅ Input validation
✅ Type safety
✅ Code documentation
✅ Test coverage
✅ Docker containerization
✅ Environment-based configuration
✅ Database migrations
✅ Caching strategy
✅ Background job processing
✅ Real-time communication
✅ API documentation

## 🔄 Request Lifecycle

1. **Request arrives** at Nginx
2. **Nginx forwards** to NestJS app
3. **Global interceptor** logs request
4. **Guard checks** authentication
5. **Validation pipe** validates DTO
6. **Controller** receives request
7. **Service** processes business logic
8. **Repository** interacts with database
9. **Response** sent back through chain
10. **Interceptor** logs response

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

This structure provides a solid foundation for building scalable, maintainable NestJS applications with industry best practices.
