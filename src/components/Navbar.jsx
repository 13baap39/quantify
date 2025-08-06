import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowUserMenu(false);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <nav className="navbar navbar-loading">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" className="brand-link">
              <h1>Quantify</h1>
            </Link>
          </div>
          <div className="navbar-loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Brand/Logo */}
          <div className="navbar-brand">
            <Link 
              to={currentUser ? "/dashboard" : "/"} 
              className="brand-link"
              onClick={closeMobileMenu}
            >
              <h1>Quantify</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            {currentUser ? (
              // Authenticated User Menu
              <div className="navbar-nav authenticated">
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/stock-dashboard" 
                  className={`nav-link ${isActiveRoute('/stock-dashboard') ? 'active' : ''}`}
                >
                  Stock Dashboard
                </Link>
                <Link 
                  to="/stock-api" 
                  className={`nav-link ${isActiveRoute('/stock-api') ? 'active' : ''}`}
                >
                  Stock API
                </Link>
                <Link 
                  to="/api-example" 
                  className={`nav-link ${isActiveRoute('/api-example') ? 'active' : ''}`}
                >
                  API Demo
                </Link>
                <Link 
                  to="/stock" 
                  className={`nav-link ${isActiveRoute('/stock') ? 'active' : ''}`}
                >
                  Stock
                </Link>
                <Link 
                  to="/bill-parser" 
                  className={`nav-link ${isActiveRoute('/bill-parser') ? 'active' : ''}`}
                >
                  Bill Parser
                </Link>
                <Link 
                  to="/bill-parser-test" 
                  className={`nav-link ${isActiveRoute('/bill-parser-test') ? 'active' : ''}`}
                >
                  Parser Test
                </Link>
                <Link 
                  to="/analytics" 
                  className={`nav-link ${isActiveRoute('/analytics') ? 'active' : ''}`}
                >
                  Analytics
                </Link>
                
                {/* User Avatar Dropdown */}
                <div className="user-menu">
                  <button
                    className="user-avatar"
                    onClick={handleUserMenuToggle}
                    aria-label="User menu"
                  >
                    {getUserInitials()}
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-name">{getUserDisplayName()}</div>
                        <div className="user-email">{currentUser?.email}</div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button
                        onClick={handleLogout}
                        className="logout-btn"
                      >
                        <span className="logout-icon">🚪</span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Non-authenticated User Menu
              <div className="navbar-nav unauthenticated">
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
                <button 
                  onClick={handleLoginClick}
                  className="login-btn"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {currentUser ? (
            // Authenticated Mobile Menu
            <div className="mobile-nav authenticated">
              <div className="mobile-user-info">
                <div className="mobile-avatar">{getUserInitials()}</div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">{getUserDisplayName()}</div>
                  <div className="mobile-user-email">{currentUser?.email}</div>
                </div>
              </div>
              
              <div className="mobile-nav-divider"></div>
              
              <Link 
                to="/dashboard" 
                className={`mobile-nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/stock-dashboard" 
                className={`mobile-nav-link ${isActiveRoute('/stock-dashboard') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📋 Stock Dashboard
              </Link>
              <Link 
                to="/stock-api" 
                className={`mobile-nav-link ${isActiveRoute('/stock-api') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                🔗 Stock API
              </Link>
              <Link 
                to="/api-example" 
                className={`mobile-nav-link ${isActiveRoute('/api-example') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                💻 API Demo
              </Link>
              <Link 
                to="/stock" 
                className={`mobile-nav-link ${isActiveRoute('/stock') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📦 Stock Management
              </Link>
              <Link 
                to="/bill-parser" 
                className={`mobile-nav-link ${isActiveRoute('/bill-parser') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                🔍 Bill Parser
              </Link>
              <Link 
                to="/bill-parser-test" 
                className={`mobile-nav-link ${isActiveRoute('/bill-parser-test') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                🧪 Parser Test
              </Link>
              <Link 
                to="/analytics" 
                className={`mobile-nav-link ${isActiveRoute('/analytics') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📈 Analytics
              </Link>
              
              <div className="mobile-nav-divider"></div>
              
              <button
                onClick={handleLogout}
                className="mobile-logout-btn"
              >
                🚪 Sign Out
              </button>
            </div>
          ) : (
            // Non-authenticated Mobile Menu
            <div className="mobile-nav unauthenticated">
              <Link 
                to="/signup" 
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                Create Account
              </Link>
              <button
                onClick={handleLoginClick}
                className="mobile-login-btn"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay for mobile menu and user dropdown */}
      {(isMobileMenuOpen || showUserMenu) && (
        <div
          className="navbar-overlay"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
