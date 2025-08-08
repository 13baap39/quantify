import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Dashboard - Quantify';
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#2563eb', marginBottom: '0.5rem', fontSize: '2.5rem' }}>
            Welcome to Your Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
            Here's an overview of your inventory and business metrics
          </p>
        </div>
        
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📦</div>
              <h3 style={{ color: '#1e293b', margin: 0 }}>Total Items</h3>
            </div>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>1,234</p>
            <p style={{ color: '#059669', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              ↗ +12% from last month
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', marginRight: '1rem' }}>⚠️</div>
              <h3 style={{ color: '#1e293b', margin: 0 }}>Low Stock Alerts</h3>
            </div>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>23</p>
            <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              Requires immediate attention
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', marginRight: '1rem' }}>💰</div>
              <h3 style={{ color: '#1e293b', margin: 0 }}>Total Value</h3>
            </div>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>$45,678</p>
            <p style={{ color: '#059669', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              ↗ +8% from last month
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📊</div>
              <h3 style={{ color: '#1e293b', margin: 0 }}>Monthly Orders</h3>
            </div>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#6366f1', margin: 0 }}>156</p>
            <p style={{ color: '#059669', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              ↗ +24% from last month
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Quick Actions
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <Link 
              to="/stock" 
              style={{
                display: 'block',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
                color: '#1e293b'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📦</div>
              <strong>Manage Stock</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                Add, edit, or remove items
              </p>
            </Link>

            <Link 
              to="/analytics" 
              style={{
                display: 'block',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
                color: '#1e293b'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>�</div>
              <strong>View Analytics</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                Analyze trends and insights
              </p>
            </Link>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              textAlign: 'center',
              color: '#1e293b'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
              <strong>Generate Report</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                Export inventory reports
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              textAlign: 'center',
              color: '#1e293b'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</div>
              <strong>Settings</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                Configure your preferences
              </p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>📊 Inventory Trends</h3>
          <div style={{
            height: '200px',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #e2e8f0'
          }}>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
              📈 Charts and analytics visualizations coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
