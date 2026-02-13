# Quantum Commerce — Product Requirements Document (PRD)

## Project Overview

**Quantum Commerce** is a full-stack e-commerce platform with three independent applications: a customer-facing **frontend** storefront, an **admin** dashboard for management, and a shared **backend** API. Built to demonstrate production-grade engineering practices with product management (CRUD), JWT-based authentication, shopping cart, Stripe payments, and comprehensive test coverage.

| Attribute       | Detail                                                        |
| --------------- | ------------------------------------------------------------- |
| **Type**        | E-Commerce Platform (3-app architecture)                      |
| **Admin**       | React 19, TypeScript, React Router 7 (SSR), Redux, MUI, Tailwind CSS |
| **Frontend**    | React 19, TypeScript, React Router 7 (SSR), Redux Saga, MUI, Tailwind CSS |
| **Backend**     | Node.js, Express 4, TypeScript, MongoDB (Mongoose 9)          |
| **State Mgmt**  | Redux Toolkit + Redux Saga                                    |
| **Payments**    | Stripe (planned)                                              |
| **Testing**     | Jest, React Testing Library                                   |
| **Bundler**     | Vite 7 (Webpack planned for advanced config)                  |
| **API Testing** | Bruno                                                         |

---

## Architecture

```
┌─────────────────────────────┐   ┌──────────────────────────────┐
│        Frontend (Store)      │   │        Admin Dashboard        │
│  React 19 · Redux Saga      │   │  React 19 · Redux Toolkit     │
│                              │   │                               │
│  /  /products  /cart         │   │  /login  /dashboard           │
│  /checkout  /orders          │   │  /products (CRUD)             │
│  /login  /register           │   │  /orders  /users              │
└──────────────┬───────────────┘   └───────────────┬───────────────┘
               │ Axios (Bearer JWT)                │ Axios (Bearer JWT)
               └───────────────┬───────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                          Backend API                             │
│         Express 4 · TypeScript · Mongoose · JWT · bcrypt         │
│                                                                  │
│  /api/auth/*   /api/products/*   /api/cart/*                     │
│  /api/orders/*  /api/payments/*  /api/admin/*                    │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
          MongoDB Atlas          Stripe API
```

### Application Responsibilities

| App          | Purpose                                  | Users         |
| ------------ | ---------------------------------------- | ------------- |
| **frontend** | Customer-facing store — browse, cart, buy | Shoppers      |
| **admin**    | Management dashboard — products, orders  | Admin staff   |
| **backend**  | Shared REST API for both apps            | Internal only |

---

## Current State (What's Built)

### Backend
- Express server on port 5002 with CORS, Helmet, Morgan, rate limiting
- MongoDB Atlas connection via Mongoose
- **User model** — name, email, password (bcrypt hashed), role (user/admin), createdAt
- **Auth routes** — `POST /api/auth/register`, `POST /api/auth/login`
- JWT token generation (jsonwebtoken)
- Input validation (express-validator)

### Admin (formerly "frontend")
- React Router 7 with SSR enabled, Vite bundler
- **Pages** — Home, Login, Register, Dashboard (protected)
- Redux Toolkit store with auth slice (register/login async thunks)
- Axios instance with request interceptor (Bearer token) and 401 response interceptor
- Auth persistence via localStorage (token + user)
- Route protection via `requireAuth()` loader
- MUI + Tailwind CSS styling

### Frontend (Store) — Not yet created
- To be scaffolded as a new React Router 7 application

### API Testing
- Bruno collection with register/login endpoint tests

---

## Roadmap — Features to Build

### Phase 1: Product Management (CRUD)

**Backend**
- [ ] Product model — name, description, price, category, stock, images[], ratings, createdBy, timestamps
- [ ] `GET    /api/products`       — List products (pagination, search, filter by category/price)
- [ ] `GET    /api/products/:id`   — Get single product
- [ ] `POST   /api/products`       — Create product (admin only)
- [ ] `PUT    /api/products/:id`   — Update product (admin only)
- [ ] `DELETE /api/products/:id`   — Delete product (admin only)
- [ ] Auth middleware for route protection (`verifyToken`, `requireAdmin`)
- [ ] MongoDB indexes on `name` (text), `category`, `price` for fast queries

**Admin App**
- [ ] Product listing page with grid/list view (table with actions)
- [ ] Product create form (name, description, price, category, stock, images)
- [ ] Product edit form (pre-populated)
- [ ] Product delete with confirmation modal
- [ ] Search & filter products
- [ ] Pagination

**Frontend (Store) App — Scaffold**
- [ ] Initialize React Router 7 project (same stack as admin)
- [ ] Set up Redux store with saga middleware
- [ ] Set up Axios instance pointed at backend API
- [ ] Product listing page with grid view
- [ ] Product detail page
- [ ] Search bar with debounced API calls
- [ ] Category filter sidebar
- [ ] Price range filter
- [ ] Customer registration/login pages

---

### Phase 2: Shopping Cart

**Backend**
- [ ] Cart model — userId, items[{ productId, quantity, price }], totalPrice
- [ ] `GET    /api/cart`           — Get user's cart
- [ ] `POST   /api/cart`           — Add item to cart
- [ ] `PUT    /api/cart/:itemId`   — Update item quantity
- [ ] `DELETE /api/cart/:itemId`   — Remove item from cart
- [ ] `DELETE /api/cart`           — Clear cart
- [ ] Stock validation on add/update

**Frontend (Store) App**
- [ ] Cart page with item list, quantities, subtotals
- [ ] Add-to-cart button on product cards/detail page
- [ ] Cart icon with badge (item count) in navbar
- [ ] Quantity stepper (+/-) in cart
- [ ] Remove item button
- [ ] Cart summary (subtotal, tax, total)

**Redux Saga — Async Workflows (Frontend Store)**
- [ ] Set up Redux Saga middleware
- [ ] Cart sagas: add to cart, update quantity, remove item, clear cart
- [ ] Optimistic UI updates with rollback on API failure
- [ ] Automated retry logic (3 retries with exponential backoff) for transient failures
- [ ] Error handling saga (toast notifications for API errors)

---

### Phase 3: Checkout & Stripe Payment Integration

**Backend**
- [ ] Order model — userId, items[], shippingAddress, paymentStatus, orderStatus, stripePaymentIntentId, timestamps
- [ ] `POST /api/payments/create-intent` — Create Stripe PaymentIntent
- [ ] `POST /api/orders`                 — Create order after payment success
- [ ] `GET  /api/orders`                 — Get user's order history
- [ ] `GET  /api/orders/:id`             — Get order details
- [ ] Stripe webhook handler (`POST /api/webhooks/stripe`) for payment confirmation
- [ ] Order status enum: pending → paid → processing → shipped → delivered

**Frontend (Store) App**
- [ ] Checkout page with shipping address form
- [ ] Stripe Elements integration (card input)
- [ ] Payment processing with loading state
- [ ] Order confirmation page
- [ ] Order history page
- [ ] Order detail page with status timeline

**Admin App**
- [ ] Order management page (list all orders)
- [ ] Order detail view with status update controls
- [ ] Update order status (processing → shipped → delivered)

**Redux Saga — Checkout Flow (Frontend Store)**
- [ ] Checkout saga: validate cart → create payment intent → confirm payment → create order → clear cart
- [ ] Handle payment failures with user-friendly messages
- [ ] Retry logic for payment intent creation

---

### Phase 4: Webpack Optimization (Bundle Performance)

Applies to both **admin** and **frontend** apps:

- [ ] Migrate build from Vite to Webpack 5 (or add Webpack config alongside)
- [ ] Code splitting — route-based lazy loading (`React.lazy` + `Suspense`)
- [ ] Tree shaking — ensure ESM imports for MUI, lodash, etc.
- [ ] Bundle analysis (webpack-bundle-analyzer)
- [ ] Target: reduce initial bundle from ~850 KB to ~510 KB (40% reduction)
- [ ] Image optimization (compression, WebP, lazy loading)
- [ ] Gzip/Brotli compression

---

### Phase 5: Testing (95% Coverage Target)

**Unit Tests — Jest + React Testing Library**
- [ ] Redux sagas: cart saga, checkout saga, auth saga, error handling saga
- [ ] React components: ProductCard, Cart, Checkout, Login, Register, Dashboard
- [ ] API endpoints: auth, products, cart, orders, payments
- [ ] Utility functions: auth helpers, price formatters, validators

**Integration Tests**
- [ ] Store flow: register → login → browse → add to cart → checkout → order confirmation
- [ ] Admin flow: login → create product → update product → delete product
- [ ] Admin flow: login → view orders → update order status
- [ ] Cart: add items → update quantities → remove item → clear cart
- [ ] Payment: create intent → process payment → order creation
- [ ] Auth: token expiry → refresh → redirect flows

**Test Infrastructure**
- [ ] Jest configuration for admin, frontend, and backend
- [ ] Test database setup (MongoDB in-memory or test instance)
- [ ] API test helpers (supertest)
- [ ] Mock Stripe API for payment tests
- [ ] CI pipeline test integration
- [ ] Coverage reporting and thresholds

---

## Non-Functional Requirements

| Requirement      | Target                                                    |
| ---------------- | --------------------------------------------------------- |
| **Performance**  | Initial load < 2s, API response < 200ms (p95)            |
| **Bundle Size**  | Initial JS bundle ≤ 510 KB (gzipped) per app             |
| **Test Coverage**| ≥ 95% across sagas, components, and API endpoints         |
| **Security**     | JWT auth, bcrypt hashing, Helmet headers, rate limiting, input validation |
| **Database**     | Indexed queries for products (text search, category, price range) |
| **Error Handling**| Automated retry (3x exponential backoff), user-friendly error messages |
| **Accessibility** | WCAG 2.1 AA compliance for all UI components              |

---

## Data Models

### User
```typescript
{
  name: string           // 2-50 chars
  email: string          // unique, validated
  password: string       // min 6 chars, bcrypt hashed
  role: 'user' | 'admin' // default: 'user'
  createdAt: Date
}
```

### Product (planned)
```typescript
{
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  ratings: { user: ObjectId, score: number, review: string }[]
  averageRating: number
  createdBy: ObjectId    // ref: User (admin)
  createdAt: Date
  updatedAt: Date
}
```

### Cart (planned)
```typescript
{
  user: ObjectId         // ref: User
  items: {
    product: ObjectId    // ref: Product
    quantity: number
    price: number        // snapshot at time of add
  }[]
  totalPrice: number
}
```

### Order (planned)
```typescript
{
  user: ObjectId
  items: { product: ObjectId, quantity: number, price: number }[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  stripePaymentIntentId: string
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}
```

---

## Tech Stack Summary

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| **Admin App**    | React 19, TypeScript, React Router 7 (SSR), Redux Toolkit |
| **Frontend App** | React 19, TypeScript, React Router 7 (SSR), Redux Saga  |
| **UI**           | Material-UI 7, Tailwind CSS 4, Emotion                  |
| **Forms**        | React Hook Form, Yup validation                         |
| **HTTP Client**  | Axios (interceptors for auth)                           |
| **Backend**      | Node.js, Express 4, TypeScript                          |
| **Database**     | MongoDB Atlas, Mongoose 9                               |
| **Auth**         | JWT (jsonwebtoken), bcryptjs                            |
| **Payments**     | Stripe (Payment Intents API)                            |
| **Security**     | Helmet, express-rate-limit, express-validator, CORS      |
| **Build**        | Vite 7 → Webpack 5 (Phase 4)                           |
| **Testing**      | Jest, React Testing Library, Supertest                  |
| **API Testing**  | Bruno                                                   |
| **Logging**      | Morgan                                                  |

---

## File Structure (Target)

```
quantum-commerce/
├── memory/
│   └── PRD.md                      # This document
├── api-collections/                # Bruno API tests
│
├── backend/                        # Shared API server
│   └── src/
│       ├── config/                 # DB, Stripe config
│       ├── controllers/            # Auth, Product, Cart, Order, Payment
│       ├── middleware/             # auth (verifyToken, requireAdmin)
│       ├── models/                # User, Product, Cart, Order
│       ├── routes/                # Auth, Product, Cart, Order, Payment
│       ├── types/                 # TypeScript interfaces
│       ├── utils/                 # Helpers
│       └── server.ts
│
├── admin/                          # Admin dashboard app
│   ├── app/
│   │   ├── routes/                # Admin page components
│   │   └── root.tsx
│   └── src/
│       ├── components/
│       │   ├── common/            # Shared UI components
│       │   ├── layout/            # Admin layout (sidebar, header)
│       │   └── products/          # Product management components
│       ├── redux/
│       │   ├── store/             # Redux store config
│       │   └── slices/            # Auth, Product, Order slices
│       ├── services/api/          # API client modules
│       ├── hooks/
│       ├── types/
│       ├── utils/
│       └── styles/
│
└── frontend/                       # Customer-facing store app
    ├── app/
    │   ├── routes/                # Store page components
    │   └── root.tsx
    └── src/
        ├── components/
        │   ├── common/            # Shared UI components
        │   ├── layout/            # Store layout (navbar, footer)
        │   ├── products/          # ProductCard, ProductGrid
        │   ├── cart/              # CartItem, CartSummary
        │   └── checkout/          # CheckoutForm, PaymentForm
        ├── redux/
        │   ├── store/             # Redux store with saga middleware
        │   ├── slices/            # Auth, Product, Cart, Order slices
        │   └── sagas/             # Cart, Checkout, Error sagas
        ├── services/api/          # API client modules
        ├── hooks/
        ├── types/
        ├── utils/
        └── styles/
```

---

*Last updated: 2026-02-13*
