import React from 'react';

const LoginPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2563eb' }}>
          Login to Quantify
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b' }}>
          🚧 Login functionality coming soon...
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
