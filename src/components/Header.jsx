import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ title = "Quantify", showNav = true }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-logo">
          <Link to={currentUser ? "/dashboard" : "/"} className="logo-link">
            <h1>{title}</h1>
          </Link>
        </div>
        {showNav && (
          <nav className="header-nav">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/stock" className="nav-link">Stock</Link>
                <Link to="/analytics" className="nav-link">Analytics</Link>
                
                {/* User Menu */}
                <div className="user-menu-container">
                  <button
                    className="user-avatar"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getUserInitials()}
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown" style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      marginTop: '0.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      minWidth: '200px',
                      zIndex: 50
                    }}>
                      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <p style={{ 
                          fontWeight: '600', 
                          color: '#1e293b', 
                          margin: '0 0 0.25rem 0',
                          fontSize: '0.875rem'
                        }}>
                          {getUserDisplayName()}
                        </p>
                        <p style={{ 
                          color: '#64748b', 
                          margin: 0,
                          fontSize: '0.75rem'
                        }}>
                          {currentUser?.email}
                        </p>
                      </div>
                      <div style={{ padding: '0.5rem' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.75rem',
                            border: 'none',
                            background: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            borderRadius: '0.25rem',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button className="login-btn" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </nav>
        )}
      </div>
      
      {/* Overlay to close user menu when clicking outside */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
