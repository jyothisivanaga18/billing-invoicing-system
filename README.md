# Billing & Invoicing System

A production-ready billing and invoicing platform built with Next.js, Node.js, MySQL, and Prisma.

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript & Tailwind CSS
- **Backend**: Node.js + Express with TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Payments**: Stripe, Razorpay, PayPal integration
- **Caching**: Redis
- **Email**: SMTP (Gmail/SendGrid)

## Project Structure

```
billing-invoicing-system/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database, payment gateways, env config
│   │   ├── controllers/       # Business logic handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── routes/            # API endpoint definitions
│   │   ├── services/          # External service integrations
│   │   ├── utils/             # Helpers and validators
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # Utilities and API client
│   │   ├── services/          # Frontend service layer
│   │   └── types/             # TypeScript type definitions
│   ├── public/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml          # Local development setup
```

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Redis 7+
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/jyothisivanaga18/billing-invoicing-system.git
cd billing-invoicing-system

# Copy and configure environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit environment files with your credentials
# Then start all services
docker-compose up -d
```

Access the app at: http://localhost:3000

### Option 2: Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required environment variables.

**Important**: Never commit `.env` files with real credentials.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout (invalidate refresh token)
- `POST /api/auth/refresh` - Refresh access token

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/send` - Send invoice to customer
- `GET /api/invoices/:id/pdf` - Download invoice PDF

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Payments
- `POST /api/payments/stripe` - Create Stripe payment intent
- `POST /api/payments/razorpay` - Create Razorpay order
- `POST /api/payments/webhook/stripe` - Stripe webhook handler
- `GET /api/payments` - List payment history

## Database Schema

The system uses MySQL with the following core entities:
- **Users** - System users with authentication
- **Customers** - Customer records
- **Invoices** - Invoice management with line items
- **Payments** - Payment records and transaction history
- **Subscriptions** - Recurring billing subscriptions

## Security Features

- JWT authentication with refresh token rotation
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- SQL injection prevention via Prisma ORM

## Production Deployment

- All secrets stored in environment variables
- Docker containers for consistent deployment
- Database connection pooling
- Redis for session/cache management
- HTTPS enforced in production

## License

MIT
