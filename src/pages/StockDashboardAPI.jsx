import React, { useState, useEffect, useCallback } from 'react';
import { stockAPI, stockUtils } from '../services/api';
import BillParser from '../components/BillParser';
import './StockDashboard.css';

const StockDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBillParser, setShowBillParser] = useState(false);
  const [summary, setSummary] = useState({});
  const [editingStock, setEditingStock] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newStock, setNewStock] = useState({
    sku: '',
    quantity: 0,
    color: '',
    size: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // Load stocks from API with comprehensive error handling
  const loadStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await stockAPI.getStocks({
        limit: 1000, // Load all stocks
        sortBy: 'sku',
        sortOrder: 'asc'
      });
      
      if (response?.data?.stocks) {
        setStocks(response.data.stocks);
        setFilteredStocks(response.data.stocks);
        setSummary(response.data.summary || {});
        setSuccessMessage(`Loaded ${response.data.stocks.length} stock items successfully`);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load stocks';
      setError(`API Error: ${errorMessage}`);
      console.error('Failed to load stocks:', err);
      
      // Set empty data on error
      setStocks([]);
      setFilteredStocks([]);
      setSummary({});
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stocks on component mount
  useEffect(() => {
    loadStocks();
  }, []);

  // Filter stocks based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(stock =>
        stock.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stock.color && stock.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (stock.size && stock.size.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm, stocks]);

  // Enhanced manual quantity update with validation
  const handleQuantityUpdate = async (sku, newQuantity) => {
    const quantity = parseInt(newQuantity);
    
    // Validation
    if (isNaN(quantity) || quantity < 0) {
      setError('Quantity must be a non-negative number');
      setEditingStock(null);
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const stock = stocks.find(s => s.sku === sku);
      if (!stock) {
        throw new Error(`Stock with SKU ${sku} not found`);
      }

      // Send PUT request to update stock
      const response = await stockAPI.updateStock(sku, {
        quantity: quantity,
        color: stock.color,
        size: stock.size
      });

      if (response.success) {
        setSuccessMessage(`✅ Updated ${sku}: ${stock.quantity} → ${quantity}`);
        await loadStocks(); // Refresh data
      } else {
        throw new Error(response.message || 'Update failed');
      }
      
      setEditingStock(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Update failed';
      setError(`Failed to update ${sku}: ${errorMessage}`);
      console.error('Stock update error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced add stock with validation
  const handleAddStock = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newStock.sku.trim()) {
      setError('SKU is required');
      return;
    }
    
    const quantity = parseInt(newStock.quantity);
    if (isNaN(quantity) || quantity < 0) {
      setError('Quantity must be a non-negative number');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const stockData = {
        sku: newStock.sku.trim().toUpperCase(),
        quantity: quantity,
        color: newStock.color.trim() || null,
        size: newStock.size.trim() || null
      };

      const response = await stockAPI.createStock(stockData);
      
      if (response.success) {
        setSuccessMessage(`✅ Added new stock: ${stockData.sku} (Qty: ${stockData.quantity})`);
        setNewStock({ sku: '', quantity: 0, color: '', size: '' });
        setShowAddForm(false);
        await loadStocks();
      } else {
        throw new Error(response.message || 'Failed to create stock');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add stock';
      setError(`Add stock failed: ${errorMessage}`);
      console.error('Add stock error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced bill parsing with batch PATCH requests
  const handleBillParsed = async (parsedItems) => {
    if (!parsedItems || parsedItems.length === 0) {
      setError('No items found in the parsed bill');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setShowBillParser(false);

      // Prepare updates for batch PATCH request
      const updates = parsedItems.map(item => ({
        sku: item.sku.toUpperCase(),
        quantity: parseInt(item.quantity) || 0
      }));

      console.log('Sending batch update:', updates);

      // Send PATCH request to /api/stocks/batch
      const response = await stockAPI.batchUpdateStocks(updates, 'add');

      if (response.success) {
        const { successful = [], failed = [], notFound = [] } = response.data || {};
        
        // Build detailed success message
        let message = `📦 Bill processed successfully!\n`;
        message += `✅ Updated: ${successful.length} items\n`;
        
        if (failed.length > 0) {
          message += `❌ Failed: ${failed.length} items\n`;
        }
        
        if (notFound.length > 0) {
          message += `⚠️ Not Found: ${notFound.length} items\n`;
        }

        // Show detailed breakdown
        if (successful.length > 0) {
          message += `\nUpdated SKUs: ${successful.map(s => s.sku).join(', ')}`;
        }

        setSuccessMessage(message);
        
        // Log details for debugging
        console.log('Batch update results:', {
          successful,
          failed,
          notFound
        });

        // Refresh the stock data
        await loadStocks();
      } else {
        throw new Error(response.message || 'Batch update failed');
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to process bill';
      setError(`Bill processing failed: ${errorMessage}`);
      console.error('Bill processing error:', err);
      
      // Log the full error for debugging
      if (err.response?.data) {
        console.error('Server response:', err.response.data);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced stock deletion with confirmation
  const handleDeleteStock = async (sku) => {
    const stock = stocks.find(s => s.sku === sku);
    const confirmMessage = `Are you sure you want to delete stock "${sku}"?\n\nCurrent quantity: ${stock?.quantity || 'Unknown'}\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const response = await stockAPI.deleteStock(sku);
      
      if (response.success) {
        setSuccessMessage(`🗑️ Deleted stock: ${sku}`);
        await loadStocks();
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Delete failed';
      setError(`Failed to delete ${sku}: ${errorMessage}`);
      console.error('Delete stock error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="stock-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading stocks from backend API...</p>
          <small>Connecting to {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-dashboard">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-spinner">
            <div className="spinner"></div>
            <p>Processing request...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <h1>📦 Stock Dashboard (API)</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isProcessing}
          >
            ➕ Add Stock
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowBillParser(!showBillParser)}
            disabled={isProcessing}
          >
            📄 Upload Bill
          </button>
          <button 
            className="btn btn-outline"
            onClick={loadStocks}
            disabled={isProcessing || loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span>✅ {successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}>✕</button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total SKUs</h3>
          <p className="stat-number">{summary.totalStocks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Quantity</h3>
          <p className="stat-number">{summary.totalQuantity || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock</h3>
          <p className="stat-number">
            {filteredStocks.filter(s => s.quantity <= 10).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Filtered Results</h3>
          <p className="stat-number">{filteredStocks.length}</p>
        </div>
      </div>

      {/* Add Stock Form */}
      {showAddForm && (
        <div className="add-stock-form">
          <h3>Add New Stock</h3>
          <form onSubmit={handleAddStock}>
            <div className="form-row">
              <input
                type="text"
                placeholder="SKU (e.g., TSHIRT-RED-M)"
                value={newStock.sku}
                onChange={(e) => setNewStock({...newStock, sku: e.target.value})}
                disabled={isProcessing}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                min="0"
                value={newStock.quantity}
                onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                disabled={isProcessing}
                required
              />
              <input
                type="text"
                placeholder="Color (optional)"
                value={newStock.color}
                onChange={(e) => setNewStock({...newStock, color: e.target.value})}
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder="Size (optional)"
                value={newStock.size}
                onChange={(e) => setNewStock({...newStock, size: e.target.value})}
                disabled={isProcessing}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isProcessing}
              >
                {isProcessing ? '⏳ Adding...' : 'Add'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => setShowAddForm(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by SKU, color, or size..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Stock Table */}
      <div className="table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Color</th>
              <th>Size</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  {searchTerm ? 'No stocks match your search' : 'No stocks available'}
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => (
                <tr key={stock.sku} className={stock.quantity <= 10 ? 'low-stock' : ''}>
                  <td className="sku-cell">{stock.sku}</td>
                  <td className="quantity-cell">
                    {editingStock === stock.sku ? (
                      <input
                        type="number"
                        min="0"
                        defaultValue={stock.quantity}
                        onBlur={(e) => handleQuantityUpdate(stock.sku, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleQuantityUpdate(stock.sku, e.target.value);
                          }
                          if (e.key === 'Escape') {
                            setEditingStock(null);
                          }
                        }}
                        disabled={isProcessing}
                        autoFocus
                        title="Press Enter to save, Escape to cancel"
                      />
                    ) : (
                      <span
                        onClick={() => !isProcessing && setEditingStock(stock.sku)}
                        className={`editable-quantity ${isProcessing ? 'disabled' : ''}`}
                        title={isProcessing ? 'Processing...' : 'Click to edit quantity'}
                      >
                        {stock.quantity}
                        {stock.quantity <= 10 && ' ⚠️'}
                      </span>
                    )}
                  </td>
                  <td>{stock.color || '-'}</td>
                  <td>{stock.size || '-'}</td>
                  <td>
                    {new Date(stock.lastUpdated).toLocaleDateString()}
                    <br />
                    <small>{new Date(stock.lastUpdated).toLocaleTimeString()}</small>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      onClick={() => !isProcessing && setEditingStock(stock.sku)}
                      disabled={isProcessing}
                      title={isProcessing ? 'Processing...' : 'Edit quantity'}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => !isProcessing && handleDeleteStock(stock.sku)}
                      disabled={isProcessing}
                      title={isProcessing ? 'Processing...' : 'Delete stock'}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Parser Modal */}
      {showBillParser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>📄 Upload & Parse Bill</h2>
              <button 
                className="close-btn"
                onClick={() => !isProcessing && setShowBillParser(false)}
                disabled={isProcessing}
                title={isProcessing ? 'Processing bill...' : 'Close'}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <BillParser 
                onBillParsed={handleBillParsed} 
                disabled={isProcessing}
              />
              {isProcessing && (
                <div className="processing-message">
                  <p>⏳ Processing bill and updating inventory...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
