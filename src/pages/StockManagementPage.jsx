import React from 'react';

const StockManagementPage = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '2rem' }}>Stock Management</h1>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Inventory Overview</h3>
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}>
              Add New Item
            </button>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>Item</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>SKU</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>Quantity</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', color: '#1e293b' }}>Sample Product A</td>
                  <td style={{ padding: '0.75rem', color: '#64748b' }}>SKU001</td>
                  <td style={{ padding: '0.75rem', color: '#1e293b' }}>150</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ 
                      backgroundColor: '#059669', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      In Stock
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button style={{ 
                      color: '#2563eb', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}>
                      Edit
                    </button>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', color: '#1e293b' }}>Sample Product B</td>
                  <td style={{ padding: '0.75rem', color: '#64748b' }}>SKU002</td>
                  <td style={{ padding: '0.75rem', color: '#1e293b' }}>5</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ 
                      backgroundColor: '#dc2626', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      Low Stock
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button style={{ 
                      color: '#2563eb', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}>
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem', 
              padding: '2rem',
              color: '#64748b'
            }}>
              🚧 Advanced stock management features coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagementPage;
