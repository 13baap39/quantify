import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import stockRoutes from './routes/stocks.js';
import { errorHandler, notFound, requestLogger } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Quantify API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/stocks', stockRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Quantify Stock Management API',
    version: '1.0.0',
    endpoints: {
      stocks: {
        'GET /api/stocks': 'Get all stocks with optional filtering and pagination',
        'GET /api/stocks/:sku': 'Get single stock by SKU',
        'POST /api/stocks': 'Create new stock item',
        'PUT /api/stocks/:sku': 'Update stock quantity and details',
        'PATCH /api/stocks/batch': 'Batch update quantities for multiple SKUs',
        'DELETE /api/stocks/:sku': 'Delete stock item'
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n🚀 Quantify Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   GET    /api/stocks           - List all stocks`);
    console.log(`   GET    /api/stocks/:sku      - Get stock by SKU`);
    console.log(`   POST   /api/stocks           - Create new stock`);
    console.log(`   PUT    /api/stocks/:sku      - Update stock`);
    console.log(`   PATCH  /api/stocks/batch     - Batch update stocks`);
    console.log(`   DELETE /api/stocks/:sku      - Delete stock`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
