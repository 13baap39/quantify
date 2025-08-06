import React, { useState } from 'react';
import './StockTable.css';

const StockTable = ({ items, onUpdateStock }) => {
  const [quantityInputs, setQuantityInputs] = useState({});

  const handleQuantityChange = (itemId, value) => {
    setQuantityInputs(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleManualUpdate = (itemId, operation) => {
    const amount = parseInt(quantityInputs[itemId]) || 1;
    if (amount > 0) {
      onUpdateStock(itemId, operation, amount);
      setQuantityInputs(prev => ({
        ...prev,
        [itemId]: ''
      }));
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStockStatus = (quantity, minLevel) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < minLevel) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusText = (quantity, minLevel) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < minLevel) return 'Low Stock';
    return 'In Stock';
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h3>No stock items found</h3>
        <p>Try adjusting your search criteria or add new stock items.</p>
      </div>
    );
  }

  return (
    <div className="stock-table-container">
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={`table-row ${getStockStatus(item.quantity, item.minStockLevel)}`}>
                <td>
                  <span className="sku-code">{item.sku}</span>
                </td>
                <td>
                  <div className="product-info">
                    <span className="product-name">{item.name}</span>
                  </div>
                </td>
                <td>
                  <span className="category-tag">{item.category}</span>
                </td>
                <td>
                  <div className="quantity-cell">
                    <span className="quantity-value">{item.quantity}</span>
                    <span className="quantity-unit">{item.unit}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStockStatus(item.quantity, item.minStockLevel)}`}>
                    {getStockStatusText(item.quantity, item.minStockLevel)}
                  </span>
                </td>
                <td>
                  <span className="date-text">{formatDate(item.lastUpdated)}</span>
                </td>
                <td>
                  <div className="action-controls">
                    <div className="quantity-controls">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={quantityInputs[item.id] || ''}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="quantity-input"
                      />
                      <div className="action-buttons">
                        <button
                          onClick={() => handleManualUpdate(item.id, 'add')}
                          className="btn btn-success btn-small"
                          title="Add Stock"
                        >
                          ➕
                        </button>
                        <button
                          onClick={() => handleManualUpdate(item.id, 'subtract')}
                          className="btn btn-danger btn-small"
                          title="Remove Stock"
                        >
                          ➖
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
