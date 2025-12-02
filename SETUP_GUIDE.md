# Kileo Ecommerce Setup Guide

## Prerequisites
- Node.js v14+
- MongoDB v4.4+
- Redis (for caching)
- Cloudinary account (for image uploads)
- Payment gateway accounts (Stripe, PayPal, Razorpay)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/kileo-ecommerce.git
cd kileo-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and configure environment variables:
```bash
cp .env.example .env
```

4. Set up MongoDB connection in `.env`:
```
MONGO_URI=mongodb://localhost:27017/kileo_ecommerce
```

5. Set up JWT secret:
```
JWT_SECRET=your_secure_jwt_secret_here
```

6. Configure payment gateways with your API keys.

7. Set up email configuration for password reset and notifications.

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Database Setup

1. MongoDB should be running locally or on a cloud service
2. The application will automatically create collections on first run

## Payment Gateway Configuration

Configure the following in `.env`:

### Stripe
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### PayPal
```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Razorpay
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Cloudinary Setup

1. Sign up for Cloudinary account
2. Configure in `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running Tests

```bash
npm test
```

## Deployment

### Docker (Recommended)
1. Build Docker image:
```bash
docker build -t kileo-ecommerce .
```

2. Run container:
```bash
docker run -p 5000:5000 -d kileo-ecommerce
```

### PM2
```bash
npm install -g pm2
pm2 start server.js --name kileo-ecommerce
pm2 save
pm2 startup
```

## API Documentation

Full API documentation is available in `docs/API_DOCUMENTATION.md`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT secret key | Yes |
| JWT_EXPIRE | JWT expiration time | No (default: 30d) |
| SMTP_HOST | SMTP server host | Yes |
| SMTP_PORT | SMTP server port | Yes |
| SMTP_EMAIL | SMTP email address | Yes |
| SMTP_PASSWORD | SMTP password | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |
| STRIPE_SECRET_KEY | Stripe secret key | Yes |
| PAYPAL_CLIENT_ID | PayPal client ID | Yes |
| PAYPAL_CLIENT_SECRET | PayPal client secret | Yes |
| RAZORPAY_KEY_ID | Razorpay key ID | Yes |
| RAZORPAY_KEY_SECRET | Razorpay key secret | Yes |

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

### Payment Gateway Issues
- Verify API keys are correct
- Check sandbox vs production mode
- Review payment gateway logs

### Email Issues
- Verify SMTP configuration
- Check spam folder
- Review email provider logs

## Support

For support, please contact: support@kileo.com