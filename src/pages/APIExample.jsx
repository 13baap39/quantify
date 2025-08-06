import React, { useState, useEffect } from 'react';
import { stockAPI, stockUtils } from '../services/api';

// Example component showing API integration patterns
const APIIntegrationExample = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example 1: Load all stocks
  const loadStocks = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getStocks();
      setStocks(response.data.stocks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Create new stock
  const addStock = async () => {
    try {
      const newStock = {
        sku: 'DEMO-ITEM-001',
        quantity: 50,
        color: 'Blue',
        size: 'L'
      };
      
      await stockAPI.createStock(newStock);
      await loadStocks(); // Refresh list
      alert('Stock created successfully!');
    } catch (err) {
      alert(`Failed to create stock: ${err.message}`);
    }
  };

  // Example 3: Update stock quantity
  const updateStockQuantity = async (sku, newQuantity) => {
    try {
      const stock = stocks.find(s => s.sku === sku);
      if (!stock) return;

      await stockAPI.updateStock(sku, {
        quantity: newQuantity,
        color: stock.color,
        size: stock.size
      });
      
      await loadStocks(); // Refresh list
      alert('Stock updated successfully!');
    } catch (err) {
      alert(`Failed to update stock: ${err.message}`);
    }
  };

  // Example 4: Process bill parsing results
  const processBill = async () => {
    try {
      // Simulated bill parsing results
      const parsedItems = [
        { sku: 'TSHIRT-RED-M', quantity: 5 },
        { sku: 'JEANS-BLUE-32', quantity: 2 },
        { sku: 'HOODIE-GRAY-L', quantity: 3 }
      ];

      const result = await stockUtils.processBillParsingResults(parsedItems);
      
      alert(`Bill processed!\n` +
            `Updated: ${result.processed} items\n` +
            `Failed: ${result.failed} items\n` +
            `Not Found: ${result.notFound} items`);
      
      await loadStocks(); // Refresh list
    } catch (err) {
      alert(`Failed to process bill: ${err.message}`);
    }
  };

  // Example 5: Search stocks
  const searchStocks = async (searchTerm) => {
    try {
      const results = await stockUtils.searchStocks(searchTerm);
      setStocks(results);
    } catch (err) {
      alert(`Search failed: ${err.message}`);
    }
  };

  // Example 6: Get low stock items
  const getLowStock = async () => {
    try {
      const lowStockItems = await stockUtils.getLowStockItems(10);
      setStocks(lowStockItems);
      alert(`Found ${lowStockItems.length} items with low stock (≤10)`);
    } catch (err) {
      alert(`Failed to get low stock items: ${err.message}`);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔗 API Integration Examples</h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          Error: {error}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={loadStocks} disabled={loading}>
          🔄 Reload Stocks
        </button>
        <button onClick={addStock}>
          ➕ Add Demo Stock
        </button>
        <button onClick={processBill}>
          📄 Process Demo Bill
        </button>
        <button onClick={() => searchStocks('TSHIRT')}>
          🔍 Search T-Shirts
        </button>
        <button onClick={getLowStock}>
          ⚠️ Show Low Stock
        </button>
      </div>

      {/* Stocks List */}
      {loading ? (
        <p>Loading stocks...</p>
      ) : (
        <div>
          <h3>Stocks ({stocks.length})</h3>
          {stocks.length === 0 ? (
            <p>No stocks found</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>SKU</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Color</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Size</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.sku}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.sku}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.quantity}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.color || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.size || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button 
                        onClick={() => updateStockQuantity(stock.sku, stock.quantity + 5)}
                        style={{ marginRight: '5px' }}
                      >
                        +5
                      </button>
                      <button 
                        onClick={() => updateStockQuantity(stock.sku, Math.max(0, stock.quantity - 5))}
                      >
                        -5
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Code Examples */}
      <div style={{ marginTop: '40px' }}>
        <h3>💻 Code Examples</h3>
        
        <h4>1. Load All Stocks</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
{`const loadStocks = async () => {
  try {
    const response = await stockAPI.getStocks();
    setStocks(response.data.stocks);
  } catch (err) {
    console.error(err.message);
  }
};`}
        </pre>

        <h4>2. Create New Stock</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
{`const newStock = {
  sku: 'TSHIRT-BLUE-M',
  quantity: 25,
  color: 'Blue',
  size: 'M'
};

await stockAPI.createStock(newStock);`}
        </pre>

        <h4>3. Update Stock</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
{`await stockAPI.updateStock('TSHIRT-BLUE-M', {
  quantity: 30,
  color: 'Blue',
  size: 'M'
});`}
        </pre>

        <h4>4. Batch Update (Bill Processing)</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
{`const updates = [
  { sku: 'TSHIRT-RED-M', quantity: 5 },
  { sku: 'JEANS-BLUE-32', quantity: 2 }
];

const result = await stockAPI.batchUpdateStocks(updates, 'add');
console.log(\`Updated \${result.data.successful.length} items\`);`}
        </pre>

        <h4>5. Process Bill Parsing Results</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
{`const parsedItems = [
  { sku: 'TSHIRT-RED-M', quantity: 5 },
  { sku: 'JEANS-BLUE-32', quantity: 2 }
];

const result = await stockUtils.processBillParsingResults(parsedItems);
console.log(\`Processed: \${result.processed}, Failed: \${result.failed}\`);`}
        </pre>
      </div>
    </div>
  );
};

export default APIIntegrationExample;
