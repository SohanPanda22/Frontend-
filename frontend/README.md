# SafeStay Hub - Frontend

A modern React + Vite frontend for SafeStay Hub, a police-verified hostel booking platform with features like OTP verification, digital contracts, AR room tours, and canteen management.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Project Structure

```
src/
├── pages/              # Page components
│   ├── Home.jsx       # Landing page
│   ├── Login.jsx      # Login page
│   ├── Register.jsx   # Registration with OTP
│   ├── Dashboard.jsx  # Main dashboard
│   ├── tenant/        # Tenant dashboard
│   ├── owner/         # Hostel owner dashboard
│   ├── canteen/       # Canteen provider dashboard
│   └── admin/         # Admin dashboard
├── components/        # Reusable components
│   └── ProtectedRoute.jsx
├── services/          # API calls
│   └── api.js
├── store/             # State management
│   └── authStore.js
├── App.jsx
├── index.jsx
└── index.css          # Global styles
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env.local

```bash
cp .env.example .env.local
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API calls to `http://localhost:5000`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Features

### 🔐 Authentication
- User registration with phone verification via OTP
- Email/password login
- JWT token management
- Protected routes

### 🏘️ Tenant Dashboard
- Quick overview of hostel and canteen expenses
- Order food from canteen
- View contracts
- Track expenses
- Submit feedback
- Emergency SOS button

### 🏢 Hostel Owner Dashboard
- Create and manage hostels
- Upload 360° room tours
- Manage tenant requests
- View feedback
- Analytics and statistics

### 🍽️ Canteen Provider Dashboard
- Order management
- Menu management
- Tenant preferences
- Delivery coordination
- Analytics

### 👨‍💼 Admin Dashboard
- User management
- Hostel verification
- System statistics
- Report generation

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Auth Endpoints
- `POST /auth/register` - Register with OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/login` - Login

### Hostel Endpoints
- `GET /hostels/search` - Search hostels
- `GET /hostels/:id` - Get hostel details
- `POST /owner/hostels` - Create hostel
- `GET /owner/hostels` - Get user's hostels

### Canteen Endpoints
- `POST /canteen/orders` - Create order
- `GET /canteen/orders` - Get user's orders
- `POST /canteen/orders/verify-payment` - Verify payment with coupon

## Styling System

The project uses Tailwind CSS with a custom design system:

### Colors
- **Primary**: #2563EB (Blue)
- **Accent**: #F97316 (Orange)
- **Background**: #F9FAFB
- **Success**: #22C55E
- **Danger**: #EF4444

### Custom Classes
- `.btn-primary` - Primary button
- `.btn-accent` - Accent button
- `.input` - Form input
- `.card` - Card component
- `.stats-card` - Statistics card

## Deployment

### Using Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Using Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Environment Variables

```
VITE_API_URL=http://localhost:5000
```

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes auto-reflect without refresh
2. **DevTools**: Install React DevTools browser extension
3. **Debugging**: Open Chrome DevTools (F12) and check Console/Network tabs
4. **Zustand DevTools**: Track state changes in real-time

## Common Issues

### OTP Not Verifying
- Ensure backend is running on port 5000
- Check API proxy configuration in vite.config.js
- Verify backend database connection

### Styling Not Applied
- Ensure Tailwind CSS is properly configured
- Run `npm run build` to check for CSS errors
- Clear browser cache (Ctrl+Shift+Delete)

### API Calls Failing
- Check browser Network tab for CORS errors
- Ensure backend has CORS enabled
- Verify token is being sent in Authorization header

## Performance Optimization

- Code splitting for page components
- Image optimization with lazy loading
- Tree-shaking of unused dependencies
- Production build minification

## License

This project is licensed under the MIT License.
