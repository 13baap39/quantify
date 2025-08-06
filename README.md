# Quantify - Stock Management Web App

A modern React web application built with Vite for streamlined stock management and inventory tracking.

## Features

- **Modern Landing Page** - Clean, responsive design with modern color scheme
- **User Authentication** - Firebase-powered login/signup with email/password
- **Protected Routes** - Secure access to authenticated user areas
- **Dashboard** - Real-time overview of inventory metrics and KPIs
- **Stock Management** - Comprehensive inventory tracking and management
- **Analytics** - Data visualization and insights (placeholder for future implementation)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Button.jsx      # Custom button component
│   ├── Header.jsx      # Navigation header with auth
│   ├── ProtectedRoute.jsx # Route protection wrapper
│   └── AppRouter.jsx   # Main routing configuration
├── pages/              # Page-level components
│   ├── LandingPage.jsx # Main landing page
│   ├── LoginPage.jsx   # User login with Firebase auth
│   ├── SignupPage.jsx  # User registration
│   ├── DashboardPage.jsx # Dashboard with metrics
│   └── StockManagementPage.jsx # Stock management interface
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── utils/              # Utility functions
│   └── helpers.js      # Common helper functions
├── assets/             # Static assets
├── App.jsx            # Main app component with auth provider
├── App.css            # App-specific styles
├── main.jsx           # Application entry point
└── index.css          # Global styles and CSS variables
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quantify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase Authentication:
   - Follow the detailed guide in `FIREBASE_SETUP.md`
   - Copy `.env.example` to `.env` and add your Firebase configuration
   - Or use the demo mode for development (no setup required)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## Technology Stack

- **React** - Frontend framework with hooks and context
- **Vite** - Build tool and development server
- **Firebase** - Authentication and backend services
- **React Router** - Client-side routing and navigation
- **CSS3** - Modern styling with CSS variables
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Color Scheme

The app uses a modern, professional color palette:

- Primary: `#2563eb` (Blue)
- Primary Dark: `#1d4ed8`
- Secondary: `#64748b` (Slate)
- Accent: `#06b6d4` (Cyan)
- Background: `#f8fafc` (Light Gray)
- Text Primary: `#1e293b` (Dark Slate)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
