import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StockTable from '../components/StockTable';
import AddStockModal from '../components/AddStockModal';
import BillParser from '../components/BillParser';
import StockStats from '../components/StockStats';
import './StockDashboard.css';

const StockDashboard = () => {
  const { currentUser } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBillParser, setShowBillParser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Sample stock data - In a real app, this would come from your backend/Firebase
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStockItems([
        {
          id: 1,
          sku: 'PROD001',
          name: 'Wireless Headphones',
          category: 'Electronics',
          quantity: 25,
          unit: 'pieces',
          lastUpdated: new Date('2025-08-01'),
          minStockLevel: 10
        },
        {
          id: 2,
          sku: 'PROD002',
          name: 'Bluetooth Speaker',
          category: 'Electronics',
          quantity: 8,
          unit: 'pieces',
          lastUpdated: new Date('2025-08-02'),
          minStockLevel: 10
        },
        {
          id: 3,
          sku: 'PROD003',
          name: 'USB Cable Type-C',
          category: 'Accessories',
          quantity: 45,
          unit: 'pieces',
          lastUpdated: new Date('2025-08-03'),
          minStockLevel: 15
        },
        {
          id: 4,
          sku: 'PROD004',
          name: 'Laptop Stand',
          category: 'Accessories',
          quantity: 5,
          unit: 'pieces',
          lastUpdated: new Date('2025-08-04'),
          minStockLevel: 10
        },
        {
          id: 5,
          sku: 'PROD005',
          name: 'Wireless Mouse',
          category: 'Electronics',
          quantity: 15,
          unit: 'pieces',
          lastUpdated: new Date('2025-08-05'),
          minStockLevel: 10
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateStock = (id, operation, amount = 1) => {
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = operation === 'add' 
            ? item.quantity + amount 
            : Math.max(0, item.quantity - amount);
          
          return {
            ...item,
            quantity: newQuantity,
            lastUpdated: new Date()
          };
        }
        return item;
      })
    );
  };

  const addNewStock = (newItem) => {
    const newStockItem = {
      id: Date.now(),
      ...newItem,
      lastUpdated: new Date(),
      minStockLevel: newItem.minStockLevel || 10
    };
    setStockItems(prevItems => [...prevItems, newStockItem]);
  };

  const processBillData = (stockUpdates, billData) => {
    console.log('Processing bill data:', billData);
    console.log('Stock updates to apply:', stockUpdates);

    // Apply stock updates
    stockUpdates.forEach(update => {
      const existingItemIndex = stockItems.findIndex(item => item.sku === update.sku);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        setStockItems(prevItems =>
          prevItems.map(item => {
            if (item.sku === update.sku) {
              const newQuantity = update.operation === 'add' 
                ? item.quantity + update.quantity 
                : Math.max(0, item.quantity - update.quantity);
              
              return {
                ...item,
                quantity: newQuantity,
                lastUpdated: new Date()
              };
            }
            return item;
          })
        );
      } else {
        // Add new item if SKU doesn't exist
        const newStockItem = {
          id: Date.now() + Math.random(),
          sku: update.sku,
          name: update.name,
          category: 'Other',
          quantity: update.operation === 'add' ? update.quantity : 0,
          unit: 'pieces',
          lastUpdated: new Date(),
          minStockLevel: 10
        };
        
        setStockItems(prevItems => [...prevItems, newStockItem]);
      }
    });

    // Show success message
    const updatedCount = stockUpdates.length;
    alert(`Successfully processed bill! Updated ${updatedCount} item(s) in inventory.`);
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterLowStock || item.quantity < item.minStockLevel;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = stockItems.filter(item => item.quantity < item.minStockLevel).length;
  const totalItems = stockItems.length;
  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="stock-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Stock Dashboard</h1>
          <p>Welcome back, {currentUser?.email}!</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowBillParser(true)}
          >
            📄 Parse Bill
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add Stock Item
          </button>
        </div>
      </div>

      <StockStats 
        totalItems={totalItems}
        totalQuantity={totalQuantity}
        lowStockCount={lowStockCount}
      />

      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
            />
            <span>Show only low stock items</span>
          </label>
        </div>
      </div>

      <div className="table-container">
        <StockTable 
          items={filteredItems}
          onUpdateStock={updateStock}
        />
      </div>

      {showAddModal && (
        <AddStockModal
          onClose={() => setShowAddModal(false)}
          onAdd={addNewStock}
        />
      )}

      {showBillParser && (
        <BillParser
          onClose={() => setShowBillParser(false)}
          onStockUpdate={processBillData}
        />
      )}
    </div>
  );
};

export default StockDashboard;
