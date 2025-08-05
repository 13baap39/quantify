import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>Quantify</h1>
          </div>
          <nav className="nav">
            <button className="nav-btn">Login</button>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h2 className="hero-title">
                Streamline Your Stock Management
              </h2>
              <p className="hero-subtitle">
                Quantify helps you track, manage, and optimize your inventory with powerful analytics and real-time insights.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary">Get Started</button>
                <button className="btn btn-secondary">Learn More</button>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h3 className="section-title">Key Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Dashboard</h4>
                <p>Real-time overview of your inventory metrics and performance indicators.</p>
                <button className="btn btn-outline">View Dashboard</button>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h4>Stock Management</h4>
                <p>Efficiently track and manage your inventory across multiple locations.</p>
                <button className="btn btn-outline">Manage Stock</button>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h4>Analytics</h4>
                <p>Advanced analytics to help you make data-driven inventory decisions.</p>
                <button className="btn btn-outline">View Analytics</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Quantify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
