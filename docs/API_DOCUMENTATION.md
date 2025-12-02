# Kileo Ecommerce API Documentation

## Base URL
`https://api.kileo.com/v1`

## Authentication
All private endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

## Error Responses
All errors follow this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `POST /api/auth/verifyemail` - Verify email

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor (Admin)
- `PUT /api/vendors/:id/approve` - Approve vendor (Admin)
- `PUT /api/vendors/:id/reject` - Reject vendor (Admin)
- `GET /api/vendors/dashboard` - Get vendor dashboard

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Vendor/Admin)
- `PUT /api/products/:id` - Update product (Vendor/Admin)
- `DELETE /api/products/:id` - Delete product (Vendor/Admin)
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/vendor/:vendorId` - Get products by vendor

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)
- `GET /api/orders/mine` - Get user orders
- `GET /api/orders/vendor` - Get vendor orders (Vendor)

### Payments
- `POST /api/payments/stripe` - Process Stripe payment
- `POST /api/payments/paypal` - Create PayPal payment
- `POST /api/payments/paypal/execute` - Execute PayPal payment
- `POST /api/payments/razorpay` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/cod` - Process Cash on Delivery

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/coupon` - Apply coupon to cart
- `DELETE /api/cart/coupon` - Remove coupon from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:productId` - Remove item from wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PUT /api/reviews/:id/approve` - Approve review (Admin)
- `GET /api/reviews/user/:userId` - Get user reviews

### Coupons
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons/apply` - Apply coupon to order

### Payouts
- `GET /api/payouts` - Get all payouts (Admin)
- `GET /api/payouts/:id` - Get single payout
- `POST /api/payouts` - Create payout request (Vendor)
- `PUT /api/payouts/:id/status` - Update payout status (Admin)
- `GET /api/payouts/vendor` - Get vendor payouts (Vendor)
- `GET /api/payouts/balance` - Get vendor balance (Vendor)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread` - Get unread notifications count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### Support Tickets
- `GET /api/support-tickets` - Get all support tickets (Admin)
- `POST /api/support-tickets` - Create support ticket
- `GET /api/support-tickets/mine` - Get user support tickets
- `GET /api/support-tickets/:id` - Get single support ticket
- `PUT /api/support-tickets/:id` - Update support ticket (Admin)
- `POST /api/support-tickets/:id/reply` - Add reply to ticket
- `PUT /api/support-tickets/:id/close` - Close ticket
- `PUT /api/support-tickets/:id/assign` - Assign ticket to agent (Admin)

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create banner (Admin)
- `PUT /api/banners/:id` - Update banner (Admin)
- `DELETE /api/banners/:id` - Delete banner (Admin)
- `GET /api/banners/position/:position` - Get banners by position

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)
- `POST /api/blogs/:id/like` - Like blog
- `DELETE /api/blogs/:id/like` - Unlike blog
- `GET /api/blogs/featured` - Get featured blogs
- `GET /api/blogs/category/:category` - Get blogs by category

### Admin Dashboard
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/vendors` - Get all vendors
- `PUT /api/admin/vendors/:id/approve` - Approve vendor
- `PUT /api/admin/vendors/:id/reject` - Reject vendor
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    },
    "prev": {
      "page": 1,
      "limit": 10
    }
  },
  "data": [
    // array of items
  ]
}
```

## Rate Limiting
All endpoints are rate limited to 100 requests per 15 minutes per IP address.

## CORS
The API supports CORS for the frontend domain specified in environment variables.