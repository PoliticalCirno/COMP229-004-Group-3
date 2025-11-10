# External Design Document (EDD) v1 – HTKSA E-commerce

## Team
- **HTKSA** (COMP229 – Web Application Development)
- Members: Trong Do Huy Hoang (301449421), Ba Thinh Vuong (301464979), Kidus Teka (301505162), Seungju Lee (301441064), Ali Mustafa (301475653)

## Table of Contents
1. Project Overview
2. Information Architecture
3. Wireframes (Top-Level Features)
4. Initial Screenshots (placeholders)
5. Tech Stack & Environments
6. E‑commerce Top-Level Features

## 1) Project Overview
First Release focusing on: Auth (JWT), roles, product catalog, cart + checkout, orders, and reviews.

## 2) Information Architecture
```
User (name, email, password(hash), role)
 ├─ 1 Cart
 └─ many Orders

Product (name, desc, price, image, category, stock, avgRating)
 └─ many Reviews

Cart (user, items[{ product, quantity }])

Order (user, items[{ product, name, price, quantity }], total, status, orderNumber)

Review (user, product, rating, comment)  # one review per user per product
```
Routes: see README

## 3) Wireframes (Top-Level)
- Product Grid (search/filter), Product Detail (with reviews)
- Cart (qty adjust, remove/clear), Checkout Confirmation
- Orders list (View/Cancel), Admin product CRUD & orders status

## 4) Initial Screenshots (placeholders)
- Postman green runs
- Terminal server start
- Compass/Atlas showing collections

## 5) Tech Stack & Environments
- Node 20+, Express 4, Mongoose 8
- JWT auth, bcrypt
- Postman for API tests
- `.env` copied from `.env.example`

## 6) E‑commerce Top-Level Features
- Public: product browse/search/filter
- Auth users: cart & checkout, order history, cancel orders
- Admin: manage products and order statuses
- Reviews: purchasers only; product averages maintained
