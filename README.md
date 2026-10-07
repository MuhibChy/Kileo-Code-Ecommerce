# Kileo Code E-Commerce Platform

A modern, high-performance multivendor e-commerce platform built with React, Vite, Node.js, Express, and MongoDB.

## 🚀 Live Demo
**Production URL:** [https://muhibchy.github.io/Kileo-Code-Ecommerce/](https://muhibchy.github.io/Kileo-Code-Ecommerce/)

---

## ✨ Features

- **Storefront & Multivendor Marketplace**: Curated products from verified hardware labs and boutique vendors.
- **Dynamic Category & Search Filters**: Instant client-side search, category pills, price range, and sort orders.
- **Interactive Shopping Cart**: Slide-over drawer with item quantity adjustments, coupon validation (`KILEO20`, `WELCOME10`, `FREESHIP`), free shipping calculation, and subtotal breakdown.
- **4-Step Checkout Wizard**: Complete multi-step checkout flow (Delivery Address ➔ Shipping Method ➔ Payment Gateway ➔ Confetti Order Confirmation & Receipt).
- **Persistent Wishlist**: Save favorite items with local storage persistence and one-click move to cart.
- **Dual API Mode**:
  - **Static Demo Mode** (Default for GitHub Pages): Full marketplace functionality with mock persistence.
  - **Live MERN Backend Mode**: Connects to the Express/MongoDB server with live endpoint testing.
- **Product Details & Customer Reviews**: Image gallery, specifications table, and user review submission.
- **Developer Documentation Modal**: Embedded Setup Guide and REST API documentation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Stripe, PayPal, Razorpay.
- **Deployment**: GitHub Pages via GitHub Actions workflow (`.github/workflows/deploy.yml`).

---

## 💻 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/MuhibChy/Kileo-Code-Ecommerce.git
cd Kileo-Code-Ecommerce
```

### 2. Frontend (Client)
```bash
cd client
npm install
npm run dev
```

### 3. Backend (Server)
```bash
npm install
npm run server
```

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License.
