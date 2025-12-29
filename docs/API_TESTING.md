# API Testing Collection

This directory contains example API requests for testing the NestJS Boilerplate.

## Using cURL

### Authentication

#### Register
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "password": "Password123!",
    "firstName": "New",
    "lastName": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "admin@example.com",
    "password": "Admin123!"
  }'
```

Save the `accessToken` from the response for authenticated requests.

### Users

#### Get All Users (Protected)
```bash
curl -X GET http://localhost/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get User by ID (Protected)
```bash
curl -X GET http://localhost/api/users/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update User (Protected)
```bash
curl -X PATCH http://localhost/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

### Posts

#### Get All Posts (Public)
```bash
curl -X GET http://localhost/api/posts
```

#### Get Post by ID (Public)
```bash
curl -X GET http://localhost/api/posts/1
```

#### Create Post (Protected)
```bash
curl -X POST http://localhost/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My Awesome Post",
    "content": "This is the content of my post. It can be quite long.",
    "published": true
  }'
```

#### Update Post (Protected - Owner Only)
```bash
curl -X PATCH http://localhost/api/posts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Updated Title",
    "published": true
  }'
```

#### Delete Post (Protected - Owner Only)
```bash
curl -X DELETE http://localhost/api/posts/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Fetch External Data Example
```bash
curl -X GET http://localhost/api/posts/external
```

## Using Postman

1. Import the collection from `postman_collection.json` (if available)
2. Set up environment variables:
   - `base_url`: http://localhost/api
   - `access_token`: (will be set automatically after login)

## Using Swagger UI

Visit http://localhost/api/docs for interactive API documentation.

1. Click "Authorize" button
2. Enter your Bearer token
3. Try out the endpoints directly from the browser

## Rate Limiting

Note that some endpoints have rate limiting:
- Registration: 5 requests per minute
- Login: 10 requests per minute
- Create Post: 10 requests per minute

If you exceed the limit, you'll receive a 429 (Too Many Requests) response.
