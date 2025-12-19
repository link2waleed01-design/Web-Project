# E-commerce Backend API

A complete MERN stack e-commerce backend built with Node.js, Express, and MongoDB. Features JWT authentication, role-based authorization (customer/admin), and RESTful APIs for users, products, categories, and orders.

## Features

- **User Authentication**: Register, login with JWT tokens
- **Role-Based Access**: Customer and Admin roles
- **Product Management**: Full CRUD operations with category filtering
- **Category Management**: Organize products into categories
- **Order Management**: Create orders with automatic stock management
- **Error Handling**: Global error handler with meaningful messages
- **Security**: Password hashing with bcrypt, JWT authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt.js
- **Environment Variables**: dotenv

## Project Structure

```
ecommerce_backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── userController.js   # User management
│   ├── productController.js # Product CRUD
│   ├── categoryController.js # Category CRUD
│   └── orderController.js  # Order management
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── roleAuth.js        # Role-based authorization
│   └── errorHandler.js    # Global error handler
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Category.js        # Category schema
│   └── Order.js           # Order schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── userRoutes.js      # User endpoints
│   ├── productRoutes.js   # Product endpoints
│   ├── categoryRoutes.js  # Category endpoints
│   └── orderRoutes.js     # Order endpoints
├── .env                   # Environment variables
├── package.json
├── server.js              # Main entry point
└── README.md
```

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd ecommerce_backend
   ```

2. **Install dependencies** (already done if node_modules exists):
   ```bash
   npm install
   ```

3. **Configure environment variables** - Edit `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce_db
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB** - Make sure MongoDB is running locally or use MongoDB Atlas

5. **Start the server**:
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

6. **Server will be running at**: `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Categories

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get category by ID | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | Private |
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/user/:userId` | Get user's orders | Private |
| GET | `/api/orders/:id` | Get order by ID | Private |
| PUT | `/api/orders/:id` | Update order status | Admin |

## API Usage Examples

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Category (Admin)
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  }'
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Smartphone",
    "description": "Latest smartphone model",
    "price": 999.99,
    "category": "CATEGORY_ID",
    "stock": 50,
    "images": ["https://example.com/image1.jpg"]
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "products": [
      { "product": "PRODUCT_ID", "quantity": 2 }
    ]
  }'
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Creating an Admin User

To create an admin user, you can:

1. **Register a user via API**, then manually update the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Or include role in registration** (for development only):
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "adminpass123",
     "role": "admin"
   }
   ```

## Error Responses

All errors return JSON in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## License

ISC
