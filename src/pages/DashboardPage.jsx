import React from 'react';

const DashboardPage = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '2rem' }}>Dashboard</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Total Items</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>1,234</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Low Stock</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>23</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Total Value</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>$45,678</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>📊 Analytics Charts</h3>
          <p style={{ color: '#64748b' }}>
            🚧 Dashboard analytics and charts coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
