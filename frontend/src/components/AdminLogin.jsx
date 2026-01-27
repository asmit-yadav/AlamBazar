import React, { useState } from 'react';
import '../styles/AdminLogin.css';

const AdminLogin = ({ onNavigateToContact, onNavigateToAbout, onNavigateToUsedCar, darkMode, onToggleDarkMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your API call here
      console.log('Admin login attempt:', formData);
      
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      // Simulate API call
      setTimeout(() => {
        if (formData.email === 'admin@fourwheelalam.com' && formData.password === 'admin123') {
          console.log('Login successful');
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          setError('Invalid email or password');
        }
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    if (onNavigateToContact) {
      onNavigateToContact();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Header Navigation */}
      <header className="admin-header">
        <div className="header-content">
          <div className="logo">
            <h1>FOUR WHEEL <span className="alam">ALAM</span></h1>
            <p>CAR BAZAR PVT LTD</p>
          </div>
          <nav className="nav-menu">
            <a onClick={() => onNavigateToContact?.()} style={{cursor: 'pointer'}}>Home</a>
            <a onClick={() => onNavigateToContact?.()} style={{cursor: 'pointer'}}>Used Cars</a>
            <a onClick={() => onNavigateToAbout?.()} style={{cursor: 'pointer'}}>About Us</a>
            <a onClick={() => onNavigateToContact?.()} style={{cursor: 'pointer'}}>Contact</a>
          </nav>
          <div className="header-actions">
            <button 
              className="dark-mode-toggle" 
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <a href="tel:+919918476777" className="phone-btn">
              📞 +91 99184 76777
            </a>
          </div>
        </div>
      </header>

      <div className="login-container">
        {/* Left Section - Branding */}
        <div className="login-left-section">
        <div className="login-content">
          <div className="shield-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Four Wheel Alam</h1>
          <p>Secure Admin Dashboard for managing vehicle inventory.</p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="login-right-section">
        <div className="login-form-container">
          <a onClick={handleBackClick} className="back-button" style={{cursor: 'pointer'}}>
            ← Back to Website
          </a>

          <div className="form-header">
            <h2>Admin Sign In</h2>
            <p>Four Wheel Alam Car Bazar Pvt Ltd</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@fourwheelalam.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>© 2026 Four Wheel Alam Car Bazar.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminLogin;
