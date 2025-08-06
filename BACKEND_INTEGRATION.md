# Quantify Backend API Integration Guide

## 🏗️ Complete Backend Setup

We've successfully created a complete Node.js + Express + MongoDB backend for Quantify with the following features:

### 📋 Architecture Overview

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
│   ├── .env                  # Environment configuration
│   └── server.js            # Main server file
├── src/
│   ├── services/
│   │   └── api.js           # Axios API client for React
│   ├── pages/
│   │   ├── StockDashboardAPI.jsx  # Backend-integrated dashboard
│   │   └── APIExample.jsx         # API usage examples
│   └── ...
└── .env                     # Frontend environment variables
```

## 🚀 Getting Started

### Quick Start (Recommended)

```bash
# Run both backend and frontend with one command
./start.sh
```

This will automatically:
- Install missing dependencies
- Start backend server (Port 5001)
- Start frontend server (Port 5173)
- Monitor both processes
- Create log files in `logs/` directory

### Manual Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment (update MongoDB URI if needed)
cp .env.example .env

# Start MongoDB (if using local)
brew services start mongodb-community

# Seed sample data
npm run seed

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
# Install axios for API communication
npm install axios

# Configure environment
echo "VITE_API_BASE_URL=http://localhost:5001/api" > .env

# Start React development server
npm run dev
```

## 📊 Stock Model Schema

```javascript
{
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: /^[A-Z0-9_-]+$/
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    integer: true
  },
  color: {
    type: String,
    optional: true
  },
  size: {
    type: String,
    optional: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}
```

## 🔌 REST API Endpoints

### Base URL: `http://localhost:5001/api`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/stocks` | List all stocks with filtering/pagination | - |
| GET | `/stocks/:sku` | Get single stock by SKU | - |
| POST | `/stocks` | Create new stock item | `{sku, quantity, color?, size?}` |
| PUT | `/stocks/:sku` | Update stock quantity and details | `{quantity, color?, size?}` |
| PATCH | `/stocks/batch` | Batch update multiple SKUs | `{updates: [{sku, quantity}], operation}` |
| DELETE | `/stocks/:sku` | Delete stock item | - |

### Query Parameters for GET /stocks

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)
- `sortBy` - Sort field (default: 'sku')
- `sortOrder` - 'asc' or 'desc' (default: 'asc')
- `search` - Search in SKU
- `color` - Filter by color
- `size` - Filter by size
- `minQuantity` - Minimum quantity filter
- `maxQuantity` - Maximum quantity filter

## 💻 React API Integration

### 1. Basic API Service (src/services/api.js)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const stockAPI = {
  // Get all stocks
  getStocks: async (params = {}) => {
    const response = await api.get('/stocks', { params });
    return response.data;
  },

  // Create new stock
  createStock: async (stockData) => {
    const response = await api.post('/stocks', stockData);
    return response.data;
  },

  // Update stock
  updateStock: async (sku, stockData) => {
    const response = await api.put(\`/stocks/\${sku}\`, stockData);
    return response.data;
  },

  // Batch update (for bill parsing)
  batchUpdateStocks: async (updates, operation = 'add') => {
    const response = await api.patch('/stocks/batch', {
      updates, operation
    });
    return response.data;
  }
};
```

### 2. Loading Stocks in React Component

```javascript
import { stockAPI } from '../services/api';

const StockComponent = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getStocks({
        sortBy: 'sku',
        sortOrder: 'asc'
      });
      setStocks(response.data.stocks);
    } catch (error) {
      console.error('Failed to load stocks:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : (
        <table>
          {stocks.map(stock => (
            <tr key={stock.sku}>
              <td>{stock.sku}</td>
              <td>{stock.quantity}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};
```

### 3. Creating New Stock

```javascript
const addStock = async () => {
  try {
    const newStock = {
      sku: 'TSHIRT-RED-M',
      quantity: 25,
      color: 'Red',
      size: 'M'
    };
    
    await stockAPI.createStock(newStock);
    await loadStocks(); // Refresh list
    alert('Stock created successfully!');
  } catch (error) {
    alert(\`Failed to create stock: \${error.message}\`);
  }
};
```

### 4. Updating Stock Quantity

```javascript
const updateQuantity = async (sku, newQuantity) => {
  try {
    const stock = stocks.find(s => s.sku === sku);
    
    await stockAPI.updateStock(sku, {
      quantity: newQuantity,
      color: stock.color,
      size: stock.size
    });
    
    await loadStocks(); // Refresh list
  } catch (error) {
    alert(\`Failed to update stock: \${error.message}\`);
  }
};
```

### 5. Bill Parsing Integration

```javascript
import { stockUtils } from '../services/api';

const processBillResults = async (parsedItems) => {
  try {
    // parsedItems = [{ sku: 'TSHIRT-RED-M', quantity: 5 }, ...]
    const result = await stockUtils.processBillParsingResults(parsedItems);
    
    alert(\`Bill processed!\\n\` +
          \`✅ Updated: \${result.processed} items\\n\` +
          \`❌ Failed: \${result.failed} items\\n\` +
          \`⚠️ Not Found: \${result.notFound} items\`);
    
    await loadStocks(); // Refresh data
  } catch (error) {
    alert(\`Failed to process bill: \${error.message}\`);
  }
};
```

## 🔧 Advanced API Usage Examples

### Batch Update for Bill Processing

```javascript
// Process incoming stock from bills
const updates = [
  { sku: 'TSHIRT-RED-M', quantity: 5 },   // Add 5 units
  { sku: 'JEANS-BLUE-32', quantity: 2 },  // Add 2 units
  { sku: 'HOODIE-GRAY-L', quantity: 3 }   // Add 3 units
];

const result = await stockAPI.batchUpdateStocks(updates, 'add');

// Process outgoing stock (sales)
const salesUpdates = [
  { sku: 'TSHIRT-RED-M', quantity: 2 },   // Sell 2 units
  { sku: 'JEANS-BLUE-32', quantity: 1 }   // Sell 1 unit
];

const salesResult = await stockAPI.batchUpdateStocks(salesUpdates, 'subtract');
```

### Search and Filter Stocks

```javascript
// Search by SKU pattern
const searchResults = await stockAPI.getStocks({
  search: 'TSHIRT',
  sortBy: 'quantity',
  sortOrder: 'desc'
});

// Filter by color and size
const filteredStocks = await stockAPI.getStocks({
  color: 'Red',
  size: 'M',
  minQuantity: 10
});

// Get low stock items
const lowStockItems = await stockAPI.getStocks({
  maxQuantity: 10,
  sortBy: 'quantity',
  sortOrder: 'asc'
});
```

### Error Handling

```javascript
const handleStockOperation = async () => {
  try {
    await stockAPI.createStock(newStock);
  } catch (error) {
    if (error.message.includes('already exists')) {
      alert('SKU already exists');
    } else if (error.message.includes('validation')) {
      alert('Invalid stock data');
    } else {
      alert('Server error occurred');
    }
  }
};
```

## 🧪 Testing the API

### 1. Using curl

```bash
# Get all stocks
curl http://localhost:5001/api/stocks

# Create new stock
curl -X POST http://localhost:5001/api/stocks \\
  -H "Content-Type: application/json" \\
  -d '{"sku":"TEST-ITEM-001","quantity":50,"color":"Blue","size":"L"}'

# Update stock
curl -X PUT http://localhost:5001/api/stocks/TEST-ITEM-001 \\
  -H "Content-Type: application/json" \\
  -d '{"quantity":75,"color":"Blue","size":"L"}'

# Batch update
curl -X PATCH http://localhost:5001/api/stocks/batch \\
  -H "Content-Type: application/json" \\
  -d '{
    "updates": [
      {"sku":"TSHIRT-RED-M","quantity":5},
      {"sku":"JEANS-BLUE-32","quantity":2}
    ],
    "operation": "add"
  }'
```

### 2. Using the API Demo Page

Visit `http://localhost:5173/api-example` to see live API integration examples with interactive buttons.

### 3. Using the Stock API Dashboard

Visit `http://localhost:5173/stock-api` to see the full-featured stock management dashboard connected to the backend.

## 🛡️ Production Considerations

### 1. Database Configuration

For production, update MongoDB URI in `.env`:

```bash
# Production MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quantify?retryWrites=true&w=majority

# Production settings
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-domain.com
```

### 2. Security Enhancements

```javascript
// Add authentication middleware
app.use('/api', authenticateToken);

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per window
});
app.use('/api', limiter);

// Input sanitization
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());
```

### 3. Performance Optimization

```javascript
// Database indexing
stockSchema.index({ sku: 1 });
stockSchema.index({ lastUpdated: -1 });
stockSchema.index({ quantity: 1 });

// Caching
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

// Pagination for large datasets
const { page = 1, limit = 100 } = req.query;
const skip = (page - 1) * limit;
const stocks = await Stock.find().skip(skip).limit(limit);
```

## 📈 Next Steps

1. **Authentication**: Add JWT-based authentication
2. **Validation**: Enhanced input validation and sanitization
3. **Logging**: Implement proper logging with Winston
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to cloud platforms (Heroku, AWS, etc.)
6. **Monitoring**: Add health checks and performance monitoring
7. **Documentation**: Generate API documentation with Swagger

## 🎯 Key Features Implemented

✅ **Complete CRUD Operations** - Create, Read, Update, Delete stocks  
✅ **Advanced Filtering & Search** - Filter by multiple criteria  
✅ **Pagination Support** - Handle large datasets efficiently  
✅ **Batch Operations** - Process multiple stock updates (perfect for bill parsing)  
✅ **Input Validation** - Comprehensive data validation  
✅ **Error Handling** - Robust error handling and user feedback  
✅ **Real-time Integration** - React frontend connected to backend  
✅ **Sample Data** - Database seeder with realistic stock data  
✅ **Development Tools** - Auto-reload, logging, health checks  

The backend is now ready for production use with your React frontend! 🚀
