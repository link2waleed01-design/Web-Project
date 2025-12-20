# E-commerce Frontend

A modern React frontend for the e-commerce backend, featuring Energy theme design with vibrant green accents and smooth animations.

## Features

- **User Panel**: Home, Products, Product Detail, Cart, Checkout, Profile
- **Admin Panel**: Dashboard, Products CRUD, Categories CRUD, Orders, Users
- **Authentication**: JWT-based login/register with protected routes
- **Shopping Cart**: Local storage persistence
- **Role-based Access**: Customer vs Admin route protection
- **Responsive**: Mobile, tablet, desktop layouts

## Tech Stack

- React 19 with Vite
- React Router DOM
- Axios for API calls
- Context API for state management

## Getting Started

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:** http://localhost:5173

> **Note:** Make sure the backend is running on port 5001

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Auth & Cart context
├── pages/          # Page components
│   └── admin/      # Admin panel pages
├── services/       # API service layer
├── App.jsx         # Main app with routing
└── App.css         # Global styles
```

## API Configuration

The frontend connects to the backend at `http://localhost:5001/api`. To change this, edit `src/services/api.js`.

## Admin Access

To access the admin panel:
1. Create a user account
2. Update the user's role to "admin" in MongoDB
3. Login and access `/admin`
