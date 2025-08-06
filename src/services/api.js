import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Stock API service
export const stockAPI = {
  // Get all stocks with optional filters
  getStocks: async (params = {}) => {
    try {
      const response = await api.get('/stocks', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stocks');
    }
  },

  // Get single stock by SKU
  getStock: async (sku) => {
    try {
      const response = await api.get(`/stocks/${sku}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stock');
    }
  },

  // Create new stock
  createStock: async (stockData) => {
    try {
      const response = await api.post('/stocks', stockData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create stock');
    }
  },

  // Update stock
  updateStock: async (sku, stockData) => {
    try {
      const response = await api.put(`/stocks/${sku}`, stockData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update stock');
    }
  },

  // Batch update stocks (for bill parsing)
  batchUpdateStocks: async (updates, operation = 'add') => {
    try {
      const response = await api.patch('/stocks/batch', {
        updates,
        operation
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to batch update stocks');
    }
  },

  // Delete stock
  deleteStock: async (sku) => {
    try {
      const response = await api.delete(`/stocks/${sku}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete stock');
    }
  }
};

// Helper functions for specific use cases
export const stockUtils = {
  // Process bill parsing results and update stocks
  processBillParsingResults: async (parsedItems) => {
    try {
      const updates = parsedItems.map(item => ({
        sku: item.sku,
        quantity: item.quantity
      }));

      const result = await stockAPI.batchUpdateStocks(updates, 'add');
      
      return {
        success: result.success,
        processed: result.data?.successful?.length || 0,
        failed: result.data?.failed?.length || 0,
        notFound: result.data?.notFound?.length || 0,
        details: result.data
      };
    } catch (error) {
      throw new Error(`Failed to process bill: ${error.message}`);
    }
  },

  // Search stocks by SKU pattern
  searchStocks: async (searchTerm) => {
    try {
      const result = await stockAPI.getStocks({ search: searchTerm });
      return result.data?.stocks || [];
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  },

  // Get low stock items
  getLowStockItems: async (threshold = 10) => {
    try {
      const result = await stockAPI.getStocks({ 
        maxQuantity: threshold,
        sortBy: 'quantity',
        sortOrder: 'asc'
      });
      return result.data?.stocks || [];
    } catch (error) {
      throw new Error(`Failed to fetch low stock items: ${error.message}`);
    }
  },

  // Get stock summary
  getStockSummary: async () => {
    try {
      const result = await stockAPI.getStocks({ limit: 1 });
      return result.data?.summary || {};
    } catch (error) {
      throw new Error(`Failed to fetch stock summary: ${error.message}`);
    }
  }
};

export default api;
