import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import StockManagementPage from '../pages/StockManagementPage';
import StockDashboard from '../pages/StockDashboard';
import StockDashboardAPI from '../pages/StockDashboardAPI';
import APIExample from '../pages/APIExample';
import BillParserDemo from '../pages/BillParserDemo';
import BillParserTest from '../pages/BillParserTest';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page route - custom navbar */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth pages - no navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes with navbar */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Navbar />
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/stock" 
            element={
              <ProtectedRoute>
                <Navbar />
                <StockManagementPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/stock-dashboard" 
            element={
              <ProtectedRoute>
                <Navbar />
                <StockDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/stock-api" 
            element={
              <ProtectedRoute>
                <Navbar />
                <StockDashboardAPI />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/api-example" 
            element={
              <ProtectedRoute>
                <Navbar />
                <APIExample />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bill-parser" 
            element={
              <ProtectedRoute>
                <Navbar />
                <BillParserDemo />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bill-parser-test" 
            element={
              <ProtectedRoute>
                <Navbar />
                <BillParserTest />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Navbar />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h2>Analytics</h2>
                  <p>Analytics features coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
