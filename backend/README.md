# Quantify Backend API

A Node.js + Express + MongoDB backend for stock management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Copy `.env` and update MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/quantify`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/quantify`

3. **Start MongoDB** (if using local):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or run directly
   mongod
   ```

4. **Seed sample data:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📋 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stocks` | List all stocks with filtering/pagination |
| GET | `/stocks/:sku` | Get single stock by SKU |
| POST | `/stocks` | Create new stock item |
| PUT | `/stocks/:sku` | Update stock quantity and details |
| PATCH | `/stocks/batch` | Batch update multiple SKUs |
| DELETE | `/stocks/:sku` | Delete stock item |

### Example Requests

**Get all stocks:**
```bash
curl http://localhost:5000/api/stocks
```

**Create new stock:**
```bash
curl -X POST http://localhost:5000/api/stocks \
  -H "Content-Type: application/json" \
  -d '{"sku":"TSHIRT-RED-M","quantity":25,"color":"Red","size":"M"}'
```

**Update stock quantity:**
```bash
curl -X PUT http://localhost:5000/api/stocks/TSHIRT-RED-M \
  -H "Content-Type: application/json" \
  -d '{"quantity":30,"color":"Red","size":"M"}'
```

**Batch update (for bill parsing):**
```bash
curl -X PATCH http://localhost:5000/api/stocks/batch \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"sku":"TSHIRT-RED-M","quantity":5},
      {"sku":"JEANS-BLUE-32","quantity":2}
    ],
    "operation": "add"
  }'
```

## 🔧 Query Parameters

**GET /stocks** supports:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)
- `sortBy` - Sort field (default: 'sku')
- `sortOrder` - 'asc' or 'desc' (default: 'asc')
- `search` - Search in SKU
- `color` - Filter by color
- `size` - Filter by size
- `minQuantity` - Minimum quantity filter
- `maxQuantity` - Maximum quantity filter

Example:
```
GET /api/stocks?search=TSHIRT&color=Red&minQuantity=10&sortBy=quantity&sortOrder=desc
```

## 📊 Stock Model

```javascript
{
  sku: String,        // Required, unique, uppercase
  quantity: Number,   // Required, non-negative integer
  color: String,      // Optional
  size: String,       // Optional
  lastUpdated: Date,  // Auto-updated
  createdAt: Date,    // Auto-generated
  updatedAt: Date     // Auto-generated
}
```

## 🛠 Development

- **Auto-reload:** `npm run dev`
- **Seed data:** `npm run seed`
- **Check health:** `GET /health`
- **API info:** `GET /api`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection
├── models/
│   └── Stock.js         # Stock schema/model
├── routes/
│   └── stocks.js        # Stock API routes
├── middleware/
│   └── errorHandler.js  # Error handling
├── scripts/
│   └── seedDatabase.js  # Sample data seeder
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── server.js           # Main server file
```

## 🔒 Environment Variables

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quantify
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

For production deployment, update:
1. `MONGODB_URI` to production database
2. `NODE_ENV=production`
3. `FRONTEND_URL` to production domain
4. Use `npm start` instead of `npm run dev`
