import React from 'react';
import './StockStats.css';

const StockStats = ({ totalItems, totalQuantity, lowStockCount }) => {
  const stats = [
    {
      title: 'Total Items',
      value: totalItems,
      icon: '📦',
      color: 'blue',
      description: 'Unique SKUs in inventory'
    },
    {
      title: 'Total Quantity',
      value: totalQuantity,
      icon: '📊',
      color: 'green',
      description: 'Units across all items'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount,
      icon: '⚠️',
      color: lowStockCount > 0 ? 'red' : 'green',
      description: 'Items below minimum level'
    }
  ];

  return (
    <div className="stock-stats">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-icon">
            {stat.icon}
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockStats;
