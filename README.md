# TimeX

A full-stack watch e-commerce application with an AI-powered watch recommendation feature. Customers can browse products, manage a cart, checkout, place orders, and track order history. Administrators can manage products and orders and view analytics. The application also includes an **AI Watch Finder** that lets users describe the watch they want in natural language and receive Gemini-powered recommendations.
 

## Overview

**Customer features:**
- User registration and login
- JWT-based authentication
- Browse products and view product details
- Shopping cart, checkout, order placement
- Order history (`/api/orders/my-orders`)
- AI Watch Finder for natural-language product discovery

**Admin features:**
- Product management (create/update/delete, with image upload)
- Order management and status updates
- Analytics dashboard (`/api/analytics`)

**AI Watch Finder:** users submit a query such as *"Affordable classic watch for daily office use"*. The backend loads the full product catalog, builds a prompt combining the query and product data, sends it to Gemini (`gemini-3.6-flash`), and returns a JSON list of recommended product IDs with short reasons. The frontend matches these IDs back to product data for display.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Redux Toolkit, React Router 7, Axios, Tailwind CSS, Lucide React |
| Backend | Java 21, Spring Boot 4.1.0, Spring Web MVC, Spring Data JPA, Spring Security, Maven |
| Authentication | JWT via `jjwt` (api / impl / jackson, 0.12.6) |
| Database | MySQL (`mysql-connector-j`) |
| AI | Google Gemini API via `com.google.genai` SDK (v1.16.0), model `gemini-3.6-flash` |

---

## System Architecture

```text
User
 ↓
React Frontend
 ↓
Axios / REST API
 ↓
Spring Boot Backend
 ├── Controllers
 ├── Services
 ├── Security / JWT
 └── Repositories
      ↓
   MySQL
```

**AI Watch Finder flow:**

```text
React
 ↓
AIController  (POST /api/ai/recommend)
 ↓
GeminiService
 ↓
Google Gemini API (gemini-3.6-flash)
 ↓
JSON recommendation response
 ↓
React UI
```

---

## Project Structure

> Backend and frontend structure below are both confirmed from source.

```text
timex-spring/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/timex/timex_backend/
│   │       │       ├── config/         # SecurityConfig
│   │       │       ├── controller/     # AuthController, ProductController, OrderController,
│   │       │       │                   # AnalyticsController, AIController
│   │       │       ├── dto/            # RegisterRequest, LoginRequest, AuthResponse, OrderRequest
│   │       │       ├── entity/         # User, Product, Order, OrderItem
│   │       │       ├── repository/     # UserRepository, ProductRepository, ...
│   │       │       ├── security/       # JwtAuthFilter
│   │       │       └── service/        # ProductService, OrderService, AnalyticsService, GeminiService
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # configured Axios instance for backend calls
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminRoute.jsx    # role-gated route wrapper for /admin/*
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AIWatchFinder.jsx # AI Watch Finder chat/search panel
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js    # auth state via React Context (not Redux)
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── EditProduct.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Products.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Shop.jsx
│   │   │   └── Signup.jsx
│   │   ├── redux/
│   │   │   ├── cartSlice.js      # Redux Toolkit is used for cart state only
│   │   │   └── store.js
│   │   ├── App.jsx               # routes + layout
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Backend Architecture

| Component | Responsibility |
|---|---|
| `AuthController` | Handles `/api/auth/register` and `/api/auth/login`. Encodes passwords via `PasswordEncoder`, authenticates via `AuthenticationManager`, and issues a JWT on success. |
| `ProductController` | CRUD for products under `/api/products`. Create and update accept `multipart/form-data` for image upload. |
| `OrderController` | Handles order placement, retrieval (own orders and all orders), and status updates. |
| `AnalyticsController` | Exposes `/api/analytics` — total revenue, orders, products, and users. |
| `AIController` | Receives a natural-language query at `/api/ai/recommend` and delegates to `GeminiService`. |
| `GeminiService` | Loads the full product catalog via `ProductRepository`, builds a prompt combining the user's query and product data, calls the Gemini API (`gemini-3.6-flash`), and returns the raw JSON recommendation response. |
| `ProductService` | Business logic for product retrieval and image-backed create/update/delete. |
| `OrderService` | Creates orders from `OrderRequest`, looks up orders by user email or by ID, and updates order status. |
| `AnalyticsService` | Aggregates revenue, order count, product count, and user count. |
| `UserRepository` | Confirmed methods used: `existsByEmail`, `existsByUsername`, `findByEmail`. |
| `JwtUtil` | Generates JWTs (`generateToken(email)`); referenced by `AuthController`. Implementation file not yet reviewed. |
| `SecurityConfig` | Located at `config/SecurityConfig.java`. Defines the full authorization rule set (see below), disables CSRF, enables CORS, sets session policy to `STATELESS`, registers `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`, and exposes `PasswordEncoder` (`BCryptPasswordEncoder`) and `AuthenticationManager` beans. |
| `JwtAuthFilter` | Located at `security/JwtAuthFilter.java`. Runs before Spring's standard auth filter to validate the JWT on each request. Internals not yet reviewed. |

---

## Authentication & Authorization

```text
Login
  ↓
AuthenticationManager authenticates (email + password)
  ↓
JwtUtil generates a token from the user's email
  ↓
Frontend receives token in AuthResponse
  ↓
Token sent with subsequent API requests
  ↓
JWT filter validates token (implementation location unconfirmed)
  ↓
Role-based authorization (role stored on User entity: "USER" or "ADMIN")
  ↓
Protected resource
```

Confirmed from `AuthController`:
- New users are always created with `role = "USER"` and `active = true`.
- Both register and login return an `AuthResponse` containing `id`, `username`, `email`, `role`, and the JWT.

Confirmed from `SecurityConfig` (`config/SecurityConfig.java`):
- Stateless sessions (no server-side session state); CSRF disabled; CORS enabled.
- `JwtAuthFilter` runs before Spring's `UsernamePasswordAuthenticationFilter` on every request.
- Passwords are hashed with `BCryptPasswordEncoder`.
- Full authorization rule set — see [API Documentation](#api-documentation) for the per-endpoint access column, all pulled directly from this file.

---

## API Documentation

Endpoints below are copied directly from the controller source.

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user (email + username uniqueness enforced) |
| POST | `/api/auth/login` | Public | Authenticate with email + password, receive a JWT |

### Products (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/{id}` | Public | Get a single product |
| POST | `/api/products` | Admin (`hasRole("ADMIN")`) | Create a product — `multipart/form-data`: `name`, `description`, `price`, `category`, `stockQuantity`, `image` |
| PUT | `/api/products/{id}` | Admin (`hasRole("ADMIN")`) | Update a product — same multipart fields, `image` optional |
| DELETE | `/api/products/{id}` | Admin (`hasRole("ADMIN")`) | Delete a product |

### Orders (`/api/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | USER or ADMIN | Create an order for the logged-in user |
| GET | `/api/orders/my-orders` | USER or ADMIN | Get the logged-in user's own orders |
| GET | `/api/orders` | Admin (`hasRole("ADMIN")`) | Get all orders |
| GET | `/api/orders/{id}` | USER or ADMIN | Get a single order by ID |
| PUT | `/api/orders/{id}/status?status={status}` | Admin (`hasRole("ADMIN")`) | Update an order's status |

### Analytics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/analytics` | Admin (`hasRole("ADMIN")`, matched via `/api/analytics/**`) | Returns `totalRevenue`, `totalOrders`, `totalProducts`, `totalUsers` |

### AI

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/ai/recommend` | Public (explicitly `permitAll()`) | Body: `{ "query": "<natural language description>" }`. Returns a JSON string of recommendations. |

**Example request:**
```json
POST /api/ai/recommend
{
  "query": "Affordable classic watch for daily office use"
}
```

**Example response** (shape enforced by the Gemini prompt in `GeminiService`):
```json
{
  "recommendations": [
    {
      "productId": 1,
      "reason": "Short explanation why this product matches the customer's request."
    }
  ]
}
```
Recommendations are capped at 3 products; `productId` must match an existing product; an empty array is returned if nothing matches or the query is blank.

---

## Database Design

Entities confirmed from `entity/` source.

```text
User
 │  (user_id FK on Order)
 └── Order
      │  (order_id FK on OrderItem)
      └── OrderItem  ──(productId, no JPA relation)──▶ Product
```

| Entity | Key fields |
|---|---|
| `User` | `id`, `username` (unique), `email` (unique), `password` (hashed), `role` (default `"USER"`), `active` (default `true`) |
| `Product` | `id`, `name`, `price`, `description`, `category`, `stockQuantity`, `imageUrl` |
| `Order` | `id`, `totalAmount`, `status`, `paymentId`, `createdAt`, `fullname`, `street`, `city`, `state`, `postalCode`, `country`, `user` (`@ManyToOne`), `items` (`@OneToMany`, cascade `ALL`, `orphanRemoval = true`) |
| `OrderItem` | `id`, `productId` (plain `Long`, **not** a JPA relation), `quantity`, `price`, `productName` (`@Transient`), `order` (`@ManyToOne`) |

**Relationships:**
- **User → Order**: one-to-many. `Order.user` is `@ManyToOne` with `@JoinColumn(name = "user_id")`, marked `@JsonIgnore` to avoid serializing the user in order responses.
- **Order → OrderItem**: one-to-many, cascade `ALL` with `orphanRemoval = true` — deleting an order removes its items.
- **OrderItem → Product**: *not* a JPA relationship. `OrderItem` only stores the raw `productId` (and a transient, non-persisted `productName`) rather than a `@ManyToOne Product` reference.

---

## AI Watch Finder

**Example input:**
```text
"Affordable classic watch for daily office use"
```

**Processing flow:**

```text
User Query
    ↓
React AIWatchFinder overlay (components/AIWatchFinder.jsx)
    ↓
POST /api/ai/recommend  { "query": "..." }
    ↓
AIController
    ↓
GeminiService — loads all products via ProductRepository,
                builds a prompt, calls Gemini
    ↓
Google Gemini API (model: gemini-3.6-flash)
    ↓
JSON: { "recommendations": [{ productId, reason }] }
    ↓
Frontend matches productId → full product data
    ↓
Recommendation Cards
```

**Component roles (confirmed from `GeminiService.java`):**

| Component | Role |
|---|---|
| `AIController` | Validates the incoming query isn't blank; returns `{"recommendations":[]}` if it is. Otherwise passes the query to `GeminiService`. |
| `GeminiService` | Fetches every product via `ProductRepository.findAll()`. If none exist, returns an empty result immediately. Otherwise builds a text block of all product data (ID, name, price, category, description, stock) and embeds it in a fixed instruction prompt. |
| Prompt contract | Instructs Gemini to recommend **only** from the listed products, cap results at 3, keep each reason under 30 words, return **only** valid JSON in the exact `{"recommendations":[{productId, reason}]}` shape, and return an empty array if nothing matches well. |
| Google Gemini API | Called via the `com.google.genai.Client`, model `gemini-3.6-flash`. The raw `response.text()` is returned directly as the controller's response body. |
| `ProductRepository` | Supplies the full, current product catalog used to ground every recommendation. |

This implementation sends the **entire product catalog** in the prompt on every request — it does not use RAG, embeddings, a vector database, agents, or fine-tuning.

> Note: since `GeminiService` returns Gemini's raw text directly, output correctness depends entirely on the model actually following the "JSON only" instruction — there's no server-side JSON validation/parsing visible in this controller.

---

## Frontend Architecture

**Routing** (confirmed from `App.jsx`, via React Router 7):

| Route | Page | Notes |
|---|---|---|
| `/` | `Home` | |
| `/shop` | `Shop` | Product listing |
| `/product/:id` | `ProductDetail` | |
| `/cart` | `Cart` | |
| `/login` | `Login` | |
| `/signup` | `Signup` | |
| `/orders` | `MyOrders` | Logged-in user's order history |
| `/checkout` | `Checkout` | |
| `/about` | `About` | |
| `/contact` | `Contact` | |
| `/admin` | `admin/Dashboard` | Wrapped in `AdminRoute` |
| `/admin/orders` | `admin/Orders` | Wrapped in `AdminRoute` |
| `/admin/products` | `admin/Products` | Wrapped in `AdminRoute` |
| `/admin/products/new` | `admin/AddProduct` | Wrapped in `AdminRoute` |
| `/admin/products/:id/edit` | `admin/EditProduct` | Wrapped in `AdminRoute` |

**Layout behavior:**
- `Navbar` and `Footer` render on all non-admin routes; hidden on any path starting with `/admin`.
- A floating "Ask AI" button (bottom-right, hidden on admin routes) opens the `AIWatchFinder` panel as an overlay rather than a dedicated page/route.
- `AdminRoute` gates every `/admin/*` route — the actual redirect/permission-check logic lives inside that component (not yet reviewed).

**State management:**
- **React Context** (`AuthContext.js`) handles authentication state — login/logout, current user, token — not Redux.
- **Redux Toolkit** (`redux/store.js`, `redux/cartSlice.js`) is used specifically for cart state.

**API layer:** `api/axios.js` provides a configured Axios instance for all backend calls; the JWT from `AuthContext` is presumably attached to protected requests (interceptor logic not yet reviewed).




## Installation & Setup

### Prerequisites

- Java 21
- Node.js and npm
- MySQL
- Maven wrapper confirmed present in `backend/` (`mvnw`, `mvnw.cmd`, `.mvn/`)

### Clone Repository

```bash
git clone <repository-url>
cd timex-spring
```

### Database Setup

```sql
CREATE DATABASE timex_db;
```

Confirmed connection string from `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/timex_db
spring.datasource.username=root
```

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
echo "PORT=3001" >> .env
npm start
```
The backend's `CorsConfig` only allows requests from `http://localhost:3001`, so the frontend must run on port `3001`, not the Create React App default of `3000`. Adding `PORT=3001` to a `.env` file in `frontend/` makes `npm start` use that port automatically going forward.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DB_PASSWORD` | MySQL password (referenced as `${DB_PASSWORD}` in `application.properties`) |
| `GEMINI_API_KEY` | API key for the Google Gemini API (referenced as `${GEMINI_API_KEY}`, injected into `GeminiService` via `@Value("${gemini.api.key}")`) |
| `PORT` (frontend) | Set to `3001` in `frontend/.env` so the React dev server matches the origin allowed by the backend's `CorsConfig` |

Confirmed settings in `application.properties`:
```properties
spring.application.name=timex-backend
spring.datasource.url=jdbc:mysql://localhost:3306/timex_db
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
file.upload-dir=./uploads
logging.level.org.springframework.security=DEBUG
gemini.api.key=${GEMINI_API_KEY}
```

Set the variables in your shell before running the backend:
```bash
export DB_PASSWORD="your_new_password"
export GEMINI_API_KEY="your_gemini_api_key"
```

Or in a local `.env` (not committed):
```env
DB_PASSWORD=your_new_password
GEMINI_API_KEY=your_gemini_api_key
```


---

## Running the Application

**Terminal 1 — Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

> Backend runs on Spring Boot's default port `8080` (no `server.port` override is set). Frontend runs on port `3001` (set via `frontend/.env`, since `CorsConfig` only allows `http://localhost:3001` — see [Environment Variables](#environment-variables)), not Create React App's default of `3000`.

---

## Security Notes

- **JWT authentication**: tokens are generated in `AuthController`/`JwtUtil` from the user's email after successful login or registration.
- **Password hashing**: `AuthController` encodes passwords via Spring Security's `PasswordEncoder` before saving — plaintext passwords are not stored.
- **Role-based authorization**: enforced in `SecurityConfig` via `hasRole("ADMIN")` / `hasAnyRole("USER", "ADMIN")` per endpoint. Product writes, all-orders view, order status updates, and analytics are ADMIN-only; order creation/viewing is open to any authenticated USER or ADMIN; product browsing, auth, and the AI recommender are public.
- **Environment variables**: `application.properties` references `${DB_PASSWORD}` and `${GEMINI_API_KEY}` — no hardcoded fallback values remain in the file. The exposed dev password was rotated after the earlier hardcoded value was found in git history.
- **API key protection**: the Gemini API key is only used server-side inside `GeminiService` and is never sent to the frontend.
- **CORS**: configured in `CorsConfig` — only `http://localhost:3001` is allowed to call `/api/**`, with `GET`/`POST`/`PUT`/`DELETE`/`OPTIONS` and credentials enabled. The frontend is configured to run on port `3001` to match (see [Frontend Setup](#installation--setup)). Update `allowedOrigins` to the real deployed frontend URL before deploying to production.
- **Debug logging**: Spring Security debug logging is currently enabled in `application.properties` — disable for production.

---

## Future Improvements

- Payment gateway integration 
- Wishlist functionality
- Product reviews and ratings
- Server-side JSON validation of Gemini's response before returning it to the client
- Docker-based deployment
- Cloud deployment (AWS, Render, Railway)
- Email notifications for order status changes


