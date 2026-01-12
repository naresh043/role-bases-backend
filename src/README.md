# Inventory & Order Management System – Backend

## Project Overview

This backend provides RESTful APIs for a Role-Based Inventory & Order Management System. It supports secure access control, inventory tracking, and order processing, developed as part of a Full-Stack Developer Intern assignment.

The backend ensures role-based access control (RBAC) with JWT authentication, allowing different user roles to perform specific actions while maintaining data security and integrity.

## Core Features (Backend)

- **JWT-based Authentication**: Secure login and token-based session management.
- **Role-Based Access Control (RBAC)**: Middleware to enforce permissions based on user roles (Admin, Sales Executive, Warehouse Staff, Viewer).
- **User & Role Management**: APIs for managing users and assigning roles.
- **Product CRUD APIs**: Full create, read, update, delete operations for products.
- **Order Creation and Tracking**: APIs for creating orders, tracking status, and managing order lifecycle.
- **Stock Update APIs with History/Logs**: Update stock levels and maintain audit logs for changes.
- **Secure Error Handling and Validation**: Comprehensive input validation and error responses.

## Tech Stack (Backend)

- **Node.js**: Runtime environment for server-side JavaScript.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB interactions.
- **JWT**: For authentication tokens.
- **bcryptjs**: For password hashing.
- **cors**: For handling cross-origin requests.
- **dotenv**: For environment variable management.
- **validator**: For input validation.

## System Architecture

The backend follows a layered architecture to ensure separation of concerns and maintainability:

- **Routes**: Define API endpoints and map to controllers.
- **Controllers**: Handle HTTP requests, validate inputs, and call services.
- **Services**: Contain business logic and interact with models.
- **Middlewares**: Handle authentication, authorization, and other cross-cutting concerns.
- **Models**: Define data schemas and interact with the database.

This structure promotes scalability, testability, and clean code organization.

## Authentication & Authorization Flow

1. **Login**: User provides credentials; upon validation, a JWT token is generated and returned.
2. **Token Verification**: Each protected route uses `authMiddleware` to verify the JWT token.
3. **Role-Based Access**: `rbacMiddleware` checks if the user's role has permission for the requested action.
4. **Session Expiry**: Tokens have expiration; refresh tokens can be used to obtain new access tokens.

## API Overview

The backend exposes RESTful APIs organized into modules:

- **Auth**: Login, logout, token refresh, user profile.
- **Users**: User management (Admin only).
- **Products**: Product CRUD (Admin only).
- **Orders**: Order creation and management (Sales).
- **Stock**: Stock updates and logs (Admin, Warehouse).
- **Dashboard**: Analytics and overview data.

Detailed API documentation is available via Postman collection or Swagger UI (not included in this README).

## Database Design (High-Level)

- **Users**: Stores user information, roles, and authentication details.
- **Products**: Manages product catalog with details like name, description, price.
- **Orders**: Tracks customer orders, items, status, and history.
- **StockLogs**: Logs all stock changes for auditing.

Relationships:

- Users can create Orders and perform Stock updates.
- Orders reference Products and Users.
- StockLogs reference Products and Users.

## Environment Variables

Configure the following in a `.env` file:

- `JWT_SECRET`: Secret key for JWT token signing.
- `DB_URL`: MongoDB connection string.
- `PORT`: Server port (default: 3000).

Example `.env`:

```
JWT_SECRET=your_jwt_secret_here
DB_URL=mongodb://localhost:27017/inventory_order_db
PORT=3000
```

## Setup & Installation (Backend Only)

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation Steps

1. Clone the repository and navigate to the backend directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables.
4. Start the server: `npm start`

### Running the Server

- Development: `npm run dev` (if available) or `npm start`
- Production: Set `NODE_ENV=production` and run `npm start`

The server will run on `http://localhost:3000` by default.

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcryptjs before storage.
- **Token Expiry**: JWT tokens expire after a set time; implement refresh logic.
- **RBAC Enforcement**: All sensitive routes are protected with role checks.
- **Input Validation**: All inputs are validated using the validator library.
- **Error Handling**: Sensitive information is not exposed in error responses.

## Notes

This backend is decoupled from the frontend and communicates via secure HTTP requests. The frontend consumes these APIs to provide a user interface for the system.

Ensure to follow best practices for deployment, including using HTTPS in production and regular security audits.
