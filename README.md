# Quantify - Full-Stack Stock Management System

A modern full-stack web application for comprehensive stock management and inventory tracking with MongoDB backend, bill parsing, and real-time updates.

## 🚀 Features

- **🏠 Modern Landing Page** - Clean, responsive design with modern color scheme
- **🔐 User Authentication** - Firebase-powered login/signup with email/password
- **🛡️ Protected Routes** - Secure access to authenticated user areas
- **📊 Real-time Dashboard** - Live inventory metrics and KPIs from MongoDB
- **📦 Complete Stock Management** - Full CRUD operations with backend API
- **📄 Bill Processing** - OCR-powered PDF/Image bill parsing with batch updates
- **🔍 Advanced Filtering** - Search, sort, and filter stock by multiple criteria
- **⚡ Batch Operations** - Process multiple stock updates simultaneously
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS

## 🏗️ Architecture

### Frontend
- **React 19** with hooks and context
- **Vite** for fast development and building
- **Firebase Auth** for user authentication
- **Tailwind CSS** for modern styling
- **Axios** for API communication
- **Tesseract.js** for OCR processing
- **PDF.js** for PDF text extraction

### Backend
- **Node.js + Express** REST API
- **MongoDB + Mongoose** for data persistence
- **Express Validator** for input validation
- **CORS + Helmet** for security
- **Compression** for performance

## 📁 Project Structure

```
Quantify/
├── backend/                    # Node.js + Express Backend
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   └── Stock.js          # Stock schema with validation
│   ├── routes/
│   │   └── stocks.js         # REST API endpoints
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   ├── scripts/
│   │   └── seedDatabase.js   # Sample data seeder
│   └── server.js            # Main server file
├── src/                        # React Frontend
│   ├── components/            # Reusable React components
│   │   ├── AppRouter.jsx     # Main routing configuration
│   │   ├── BillParser.jsx    # OCR bill processing
│   │   ├── StockTable.jsx    # Stock data table
│   │   ├── Navbar.jsx        # Navigation component
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── pages/                # Page-level components
│   │   ├── LandingPage.jsx   # Main landing page
│   │   ├── LoginPage.jsx     # Firebase authentication
│   │   ├── DashboardPage.jsx # Dashboard with metrics
│   │   ├── StockDashboard.jsx # Local stock management
│   │   └── StockDashboardAPI.jsx # Backend-integrated dashboard
│   ├── services/
│   │   └── api.js           # Axios API client
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication state
│   ├── config/
│   │   └── firebase.js      # Firebase configuration
│   └── utils/
│       └── billParser.js    # OCR processing utilities
├── BACKEND_INTEGRATION.md     # Backend setup guide
├── DEV_SCRIPTS.md            # Development workflow
├── FIREBASE_SETUP.md         # Firebase configuration guide
├── start.sh                  # One-command dev startup
└── stop.sh                   # Graceful shutdown
```

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/13baap39/quantify.git
cd quantify

# Start everything (backend + frontend + database check)
./start.sh
```

This will automatically:
- ✅ Install all dependencies (frontend + backend)
- ✅ Check MongoDB connection
- ✅ Start backend server on port 5001
- ✅ Start frontend server on port 5173
- ✅ Create log files for debugging

### Manual Setup

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run seed    # Add sample data
   npm run dev     # Start backend server
   ```

2. **Frontend Setup**:
   ```bash
   npm install     # Install frontend dependencies
   npm run dev     # Start React development server
   ```

3. **Environment Configuration**:
   ```bash
   # Backend environment (backend/.env)
   MONGODB_URI=mongodb://localhost:27017/quantify
   PORT=5001
   
   # Frontend environment (.env)
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **Stock Dashboard**: [http://localhost:5173/stock-api](http://localhost:5173/stock-api)
- **Health Check**: [http://localhost:5001/health](http://localhost:5001/health)

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stocks` | Get all stocks with filtering/pagination |
| `GET` | `/api/stocks/:sku` | Get single stock by SKU |
| `POST` | `/api/stocks` | Create new stock item |
| `PUT` | `/api/stocks/:sku` | Update stock quantity and details |
| `PATCH` | `/api/stocks/batch` | Batch update multiple SKUs |
| `DELETE` | `/api/stocks/:sku` | Delete stock item |
| `GET` | `/health` | API health check |

## 📄 Bill Processing

The system supports automatic bill parsing:

1. **Upload** PDF or image files
2. **OCR Processing** extracts text using Tesseract.js
3. **Smart Parsing** identifies SKUs and quantities
4. **Batch Updates** sends PATCH request to update multiple stocks
5. **Real-time Feedback** shows successful/failed/not-found items

## Available Scripts

### Frontend
- `npm run dev` - Start React development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start Express server with nodemon
- `npm run seed` - Populate database with sample data
- `npm start` - Start production server

### Development
- `./start.sh` - Start both servers + MongoDB check
- `./stop.sh` - Stop all running servers

## Technology Stack

- **React 19** - Frontend framework with hooks and context
- **Vite 7** - Build tool and development server
- **Node.js + Express** - Backend REST API
- **MongoDB + Mongoose** - Database and ODM
- **Firebase Auth** - User authentication
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Tesseract.js** - OCR for bill processing
- **PDF.js** - PDF text extraction

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
