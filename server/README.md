# HTKSA – E-commerce First Release (COMP229)

This implements the required first-release features:
- **User Management & Security**: register, login, logout, edit profile; roles (`user`,`admin`).
- **Product Catalog**: categories (football/basketball), image/name/description/price/category; search & filter.
- **Shopping Cart & Checkout**: add/remove/update items; checkout creates orders with orderNumber + timestamp.
- **Order Management**: view/cancel past orders (user); admin manage orders.
- **Reviews & Ratings**: purchasers can rate/review; product avgRating auto-updates.

## Run locally
```bash
npm install
cp .env.example .env
# set MONGODB_URI, JWT_SECRET
npm run dev
```
Health check: `GET /health`

## Seed (admin + user + sample products)
```bash
npm run seed
# admin: admin@example.com / Admin!234
# user:  user1@example.com / User!234
```

## API summary

### Auth & Users
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/users/me` (Bearer)
- `PUT /api/users/me` (Bearer)
- `POST /api/users/logout` (Bearer)

### Products (public browse; admin manage)
- `GET /api/products?q=&category=&minPrice=&maxPrice=`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart (auth required)
- `GET /api/cart`
- `POST /api/cart/add` { productId, quantity }
- `PUT /api/cart/update` { productId, quantity }
- `DELETE /api/cart/remove` { productId }
- `DELETE /api/cart/clear`

### Orders
- `POST /api/orders/checkout` (auth) → creates order with `orderNumber`
- `GET /api/orders/my` (auth)
- `GET /api/orders/my/:id` (auth)
- `POST /api/orders/my/:id/cancel` (auth)
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin) { status }

### Reviews
- `POST /api/reviews` (auth) { productId, rating (1-5), comment }
- `GET /api/reviews/product/:productId`

---

Generated: 2025-11-06
