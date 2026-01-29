import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';


const About = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const onToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };
  const [activeTab, setActiveTab] = useState(null);

  const features = [
    {
      id: 1,
      icon: '✓',
      title: '100% Non-Accidental',
      description: 'Every vehicle is thoroughly inspected'
    },
    {
      id: 2,
      icon: '₹',
      title: 'Best Price Guarantee',
      description: 'Competitive pricing with no hidden charges'
    },
    {
      id: 3,
      icon: '👥',
      title: '1000+ Happy Customers',
      description: 'Trusted by thousands of satisfied buyers'
    },
    {
      id: 4,
      icon: '📋',
      title: 'Paperwork Assistance',
      description: 'Complete documentation support provided'
    }
  ];

  const whyChooseUs = [
    {
      id: 1,
      icon: '✓',
      title: 'Verified Used Cars',
      description: 'Every car is thoroughly inspected and verified before listing. Complete documentation and history provided.'
    },
    {
      id: 2,
      icon: '₹',
      title: 'Best Price in Gorakhpur',
      description: 'Competitive pricing with no hidden charges. Get the best value for your money with transparent deals.'
    },
    {
      id: 3,
      icon: '↔',
      title: 'Easy Exchange',
      description: 'Looking to exchange your old car? We offer hassle-free exchange options with fair valuations.'
    },
    {
      id: 4,
      icon: '❤',
      title: 'Customer-First Approach',
      description: 'Your satisfaction is our priority. Honest dealing, personalized service, and lifetime support.'
    }
  ];

  const galleryImages = [
    { id: 1, alt: 'Showroom Entrance', title: 'Main Showroom' },
    { id: 2, alt: 'Car Display Area', title: 'Car Display' },
    { id: 3, alt: 'Cars Lineup', title: 'Vehicle Collection' },
    { id: 4, alt: 'Showroom Interior', title: 'Interior View' },
    { id: 5, alt: 'Parking Area', title: 'Parking Area' },
    { id: 6, alt: 'Display Hall', title: 'Display Hall' },
    { id: 7, alt: 'Office Area', title: 'Office' },
    { id: 8, alt: 'Front View', title: 'Front View' }
  ];

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="about-page">
      {/* Header Navigation */}
      <header className="about-header">
        <div className="header-content">
          <div className="logo">
            <h1>FOUR WHEEL <span className="alam">ALAM</span></h1>
            <p>CAR BAZAR PVT LTD</p>
          </div>
          <nav className="nav-menu">
            <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a>
            <a onClick={() => navigate('/used-cars')} style={{ cursor: 'pointer' }}>Used Cars</a>
            <a className="active" style={{ cursor: 'pointer' }}>About Us</a>
            <a onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact</a>
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
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>Driving Trust, Delivering Dreams since 2015.</p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="who-we-are" className="who-we-are">
        <div className="container">
          <div className="content-wrapper">
            <div className="about-content">
              <h3 className="section-label">WHO WE ARE</h3>
              <h2>Redefining the Used Car Buying Experience</h2>

              <p className="description">
                At Yash Car Bazaar, we believe buying a used car should be as exciting and worry-free as buying a new one. Founded with a vision to bring transparency to the pre-owned car market in Gorakhpur, we have served over 1,000+ happy families.
              </p>

              <p className="description">
                Every car in our inventory undergoes a rigorous 100+ point inspection. We don't just sell cars; we build relationships based on trust, quality, and after-sales support.
              </p>

              <div className="features-grid">
                {features.map(feature => (
                  <div key={feature.id} className="feature-item">
                    <span className="feature-icon">{feature.icon}</span>
                    <h4>{feature.title}</h4>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={() => handleScrollToSection('showroom')}>
                Visit Our Showroom
              </button>
            </div>

            <div className="about-image">
              <img src="https://via.placeholder.com/400x300?text=Showroom" alt="Yash Car Bazaar Showroom" />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="container">
          <div className="founder-card">
            <div className="founder-logo">
              <div className="logo-placeholder">YASH CARS</div>
            </div>
            <div className="founder-info">
              <span className="verified-badge">✓ Verified Owner</span>
              <h3>Vinay Kumar Singh</h3>
              <p className="position">Founder, Yash Car Bazaar</p>
              <blockquote>
                "I don't just sell cars; I deliver trust. Every vehicle in our showroom is personally verified by me to ensure my customers get nothing but the best."
              </blockquote>
              <div className="founder-stats">
                <div className="stat">
                  <h5>20+</h5>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <h5>1000+</h5>
                  <p>Happy Customers</p>
                </div>
                <div className="stat">
                  <h5>⭐⭐⭐⭐⭐</h5>
                  <p>Top Rated Dealer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose <span className="highlight">Yash Car Bazaar</span></h2>
          <p className="section-description">
            Your trusted partner for quality used cars in Gorakhpur with 20+ years of experience and thousands of satisfied customers.
          </p>

          <div className="benefits-grid">
            {whyChooseUs.map(benefit => (
              <div key={benefit.id} className="benefit-card">
                <span className="benefit-icon">{benefit.icon}</span>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Showroom Section */}
      <section id="showroom" className="our-showroom">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Our Showroom</h2>
              <p>Visit us to experience our premium collection.</p>
            </div>
            <button className="btn-outline">📍 Get Directions</button>
          </div>

          <div className="showroom-highlight">
            <h3>Showroom & <span className="highlight">Car Gallery</span></h3>
            <p>Real Cars. Real Showroom. Real Trust. Visit us today to experience quality.</p>

            <div className="gallery-grid">
              {galleryImages.map(image => (
                <div key={image.id} className="gallery-item">
                  <img
                    src={`https://via.placeholder.com/200x150?text=${image.alt}`}
                    alt={image.alt}
                  />
                  <div className="gallery-overlay">
                    <span>{image.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="trust-indicators">
        <div className="container">
          <div className="indicators-grid">
            <div className="indicator">
              <span className="indicator-icon">✓</span>
              <h4>Verified Cars</h4>
            </div>
            <div className="indicator">
              <span className="indicator-icon">🛡</span>
              <h4>Trusted Local Dealer</h4>
            </div>
            <div className="indicator">
              <span className="indicator-icon">₹</span>
              <h4>Transparent Pricing</h4>
            </div>
            <div className="indicator">
              <span className="indicator-icon">💬</span>
              <h4>Instant Enquiry</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>Yash Car <span className="bazaar">Bazaar</span></h3>
            </div>
            <p className="footer-description">
              Gorakhpur's most trusted destination for certified used cars. Quality checked, transparent pricing, and ready for the road.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-icon">f</a>
              <a href="https://instagram.com" className="social-icon">📷</a>
              <a href="https://twitter.com" className="social-icon">𝕏</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a></li>
              <li><a onClick={() => navigate('/used-cars')} style={{ cursor: 'pointer' }}>Used Cars</a></li>
              <li><a onClick={() => { }} style={{ cursor: 'pointer' }}>About Us</a></li>
              <li><a onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact Us</a></li>
              <li><a href="/login">Admin Login</a></li>
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
              <p>📍 YASH CAR BAZAAR, Chowk, Banagaon Colony, Paidigeanj, Gorakhpur, Uttar Pradesh 273001</p>
              <p>📞 +91 9936369111</p>
              <p>📞 +91 9415428299</p>
              <p>📧 <a href="mailto:info@yashcarbazaar.com">info@yashcarbazaar.com</a></p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 <span>Yash Car Bazaar</span> - All rights reserved.
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
