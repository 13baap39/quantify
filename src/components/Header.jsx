import React from 'react';
import './Header.css';

const Header = ({ title = "Quantify", showNav = true }) => {
  return (
    <header className="app-header">
      <div className="container">
        <div className="header-logo">
          <h1>{title}</h1>
        </div>
        {showNav && (
          <nav className="header-nav">
            <a href="#dashboard" className="nav-link">Dashboard</a>
            <a href="#stock" className="nav-link">Stock</a>
            <a href="#analytics" className="nav-link">Analytics</a>
            <button className="login-btn">Login</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
