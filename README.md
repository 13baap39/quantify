# Quantify - Stock Management Web App

A modern React web application built with Vite for streamlined stock management and inventory tracking.

## Features

- **Modern Landing Page** - Clean, responsive design with modern color scheme
- **Dashboard** - Real-time overview of inventory metrics and KPIs
- **Stock Management** - Comprehensive inventory tracking and management
- **Login System** - User authentication (placeholder for future implementation)
- **Analytics** - Data visualization and insights (placeholder for future implementation)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Button.jsx      # Custom button component
│   └── Button.css      # Button component styles
├── pages/              # Page-level components
│   ├── LandingPage.jsx # Main landing page
│   ├── LoginPage.jsx   # Login page placeholder
│   ├── DashboardPage.jsx # Dashboard with metrics
│   └── StockManagementPage.jsx # Stock management interface
├── utils/              # Utility functions
│   └── helpers.js      # Common helper functions
├── assets/             # Static assets
├── App.jsx            # Main app component
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

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## Technology Stack

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **CSS3** - Modern styling with CSS variables
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
