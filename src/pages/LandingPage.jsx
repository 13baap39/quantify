import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      <Navbar />
      
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
                <button className="btn btn-primary" onClick={handleGetStarted}>
                  Get Started
                </button>
                <Link to="/signup" className="btn btn-secondary">
                  Sign Up Free
                </Link>
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
                <Link to="/dashboard" className="btn btn-outline">
                  View Dashboard
                </Link>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h4>Stock Management</h4>
                <p>Efficiently track and manage your inventory across multiple locations.</p>
                <Link to="/stock" className="btn btn-outline">
                  Manage Stock
                </Link>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h4>Analytics</h4>
                <p>Advanced analytics to help you make data-driven inventory decisions.</p>
                <Link to="/analytics" className="btn btn-outline">
                  View Analytics
                </Link>
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
