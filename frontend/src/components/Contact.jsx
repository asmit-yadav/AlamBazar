import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = ({ onNavigateToLogin, onNavigateToAbout, onNavigateToUsedCar, darkMode, onToggleDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your API call here
      console.log('Form submitted:', formData);
      setSubmitStatus('success');

      // Reset form after submission
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = `Hello, I'm interested in your services. My name is ${formData.name || 'User'}`;
    const whatsappUrl = `https://wa.me/919918476777?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-wrapper">
      {/* Header */}
      <header className="contact-header">
        <div className="header-content">
          <div className="logo">
            <h1>FOUR WHEEL <span className="alam">ALAM</span></h1>
            <p>CAR BAZAR PVT LTD</p>
          </div>
          <nav className="nav-menu">
            <a onClick={() => window.location.reload()} style={{cursor: 'pointer'}}>Home</a>
            <a onClick={() => onNavigateToUsedCar?.()} style={{cursor: 'pointer'}}>Used Cars</a>
            <a onClick={() => onNavigateToAbout?.()} style={{cursor: 'pointer'}}>About Us</a>
            <a href="/contact" className="active" style={{cursor: 'pointer'}}>Contact</a>
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

      {/* Hero Section */}
      <section className="contact-hero">
        <h2>Contact Us</h2>
        <p>Get in touch for test drives, enquiries, or support.</p>
      </section>

      {/* Main Contact Section */}
      <div className="contact-container">
        <div className="contact-content">
        {/* Left Section - Showroom Info */}
        <div className="showroom-section">
          <h2>Visit Our Showroom</h2>

          {/* Address */}
          <div className="contact-info-block">
            <div className="contact-icon address-icon">📍</div>
            <div className="contact-details">
              <h3>Address</h3>
              <p>Four Wheel Alam Car Bazar Pvt Ltd,<br />
                Main Road, Daudpur, near Beeaar Hyundai,<br />
                Gorakhpur, Uttar Pradesh 273001</p>
            </div>
          </div>

          {/* Phone */}
          <div className="contact-info-block">
            <div className="contact-icon phone-icon">📞</div>
            <div className="contact-details">
              <h3>Phone</h3>
              <p>Mon-Sat from 9am to 8pm<br />
                <span className="phone-number">+91 99184 76777</span></p>
            </div>
          </div>

          {/* Email */}
          <div className="contact-info-block">
            <div className="contact-icon email-icon">📧</div>
            <div className="contact-details">
              <h3>Email</h3>
              <p><a href="mailto:info@fourwheelalam.com">info@fourwheelalam.com</a></p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="business-hours">
            <div className="hours-icon">⏰</div>
            <h3>Business Hours</h3>
            <p>Monday - Sunday<span>10:00 AM - 7:00 PM</span></p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="message-section">
          <h2>Send us a Message</h2>
          <p className="form-subtitle">Fill out the form and we'll get back to you shortly.</p>

          <form onSubmit={handleSubmit}>
            {/* Name and Phone Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 ..."
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="I'm interested in ..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Send Button */}
            <button 
              type="submit" 
              className="send-btn"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Sending...' : '✈️ Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✓ Message sent successfully!
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✗ Error sending message. Please try again.
              </div>
            )}

            {/* Divider */}
            <div className="divider">OR</div>

            {/* WhatsApp Button */}
            <button 
              type="button" 
              className="whatsapp-btn"
              onClick={handleWhatsAppClick}
            >
              💬 Chat on WhatsApp
            </button>
          </form>
        </div>
      </div>
      </div>

      {/* Google Map Section */}
      <section className="map-section mt-10">
  <iframe
    src="https://www.google.com/maps?q=Gorakhpur%20Uttar%20Pradesh&output=embed"
    width="100%"
    height="450"
    style={{ border: 0, borderRadius: "24px" }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</section>


      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>FOUR WHEEL <span className="alam">ALAM</span></h3>
              <p>CAR BAZAR PVT LTD</p>
            </div>
            <p className="footer-description">
              Gorakhpur's trusted destination for certified used cars. Visit us at Daudpur for the best deals.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">📷</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => window.location.reload()} style={{cursor: 'pointer'}}>Home</a></li>
              <li><a onClick={() => onNavigateToUsedCar?.()} style={{cursor: 'pointer'}}>Used Cars</a></li>
              <li><a onClick={() => onNavigateToAbout?.()} style={{cursor: 'pointer'}}>About Us</a></li>
              <li><a onClick={() => {}} style={{cursor: 'pointer'}}>Contact Us</a></li>
              <li><a onClick={() => onNavigateToLogin?.()} style={{cursor: 'pointer'}}>Admin Login</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#">Buy Used Cars</a></li>
              <li><a href="#">Sell Your Car</a></li>
              <li><a href="#">Car Finance</a></li>
              <li><a href="#">Insurance Renewal</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="footer-contact">
              <p>📍 Main Road, Daudpur, near Beeaar Hyundai, Gorakhpur, Uttar Pradesh 273001</p>
              <p>📞 +91 9918476777</p>
              <p>📧 info@fourwheelalam.com</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2024 <span>Four Wheel Alam</span> - All Rights Reserved | Certified Used Car Dealers
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
