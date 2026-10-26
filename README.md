
# Subnivo — Subscription Management SaaS

Subnivo is a full-stack subscription management platform built with Next.js, React, MongoDB, and Stripe. It allows users to explore subscription plans, make secure payments, and manage their subscriptions, while admins can manage users, plans, payments, and subscriptions through a dedicated dashboard.

##  Features

- User registration and authentication
- Role-based user and admin access
- Subscription plan listing and management
- Stripe Checkout integration
- Stripe webhook handling
- Automatic subscription creation after successful payment
- Active subscription validation
- Subscription status and date tracking
- User dashboard and subscription details
- Admin dashboard for managing users, plans, and subscriptions
- Payment history and transaction records
- Responsive dark-themed UI
- Toast notifications for user feedback

## 🛠️ Tools & Technologies

### Frontend
- Next.js
- React.js
- JavaScript
- Tailwind CSS
- Redux Toolkit

### Backend
- Next.js API Routes
- Node.js
- MongoDB
- Mongoose

### Authentication & Payments
- NextAuth
- Stripe Checkout
- Stripe Webhooks

### Tools & Deployment
- Git
- GitHub
- Postman
- Vercel

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/kajal-rekha/subnix.git
```

### 2. Navigate to the project directory

```bash
cd subnix
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=

BASE_URL=http://localhost:3000
```

Add your own credentials to the environment variables. Never commit your `.env.local` file or expose secret keys publicly.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
```

To start the production server:

```bash
npm start
```

##  Payment Flow

1. The user selects a subscription plan.
2. The user proceeds to Stripe Checkout.
3. Stripe processes the payment.
4. Stripe sends a webhook event to the application.
5. The application verifies the event and creates the subscription.
6. The user can view their subscription details on the dashboard.

## 🌐 Live Demo

[Subnivo — Live Website](https://subnivo.vercel.app)

## 👨‍💻 Author

**Kajal Rekha**

- GitHub: [kajal-rekha](https://github.com/kajal-rekha)

---

⭐ If you find this project interesting, feel free to explore the repository.
