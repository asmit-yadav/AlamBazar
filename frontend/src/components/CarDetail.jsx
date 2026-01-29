import React, { useState } from 'react';
import '../styles/CarDetail.css';

const CarDetail = ({ car, onBack, darkMode, onToggleDarkMode }) => {
  // Handle images - use uploaded images or fallback
  const images = car.images && car.images.length > 0
    ? car.images
    : ['https://via.placeholder.com/800x600?text=No+Image_Available'];

  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!car) {
    return <div>Car not found</div>;
  }

  const thumbnailImages = images;

  const carSpecs = [
    { label: 'Brand', value: car.brand },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year },
    { label: 'Fuel Type', value: car.fuel },
    { label: 'Transmission', value: car.transmission || 'Manual' },
    { label: 'Kilometers Driven', value: `${car.mileage} km` },
    { label: 'Ownership', value: '1' },
    { label: 'Location', value: 'Gorakhpur, Uttar Pradesh' }
  ];

  const contactDetails = [
    { name: 'Arjun Khan', phone: '9415482099' },
    { name: 'Arjun Khan', phone: '7408555232' },
    { name: 'Gaurav', phone: '9936480111' },
    { name: 'Kamlesh', phone: '9936473111' },
    { name: 'Vaibhav', phone: '9936480111' },
    { name: 'Vinay', phone: '9935309111' },
    { name: 'Gorakh Batra', phone: '9936359111' }
  ];

  return (
    <div className={`car-detail-wrapper ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="car-detail-header">
        <div className="header-content">
          <div className="logo">
            <h1>Yash Car <span className="bazaar">Bazaar</span></h1>
          </div>
          <nav className="nav-menu">
            <a onClick={onBack} style={{ cursor: 'pointer' }}>Back to Listings</a>
          </nav>
          <div className="header-actions">
            <button
              className="dark-mode-toggle"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <a href="tel:+919936369111" className="phone-btn">
              ☎ +91 99363 69111
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="car-detail-container">
        <div className="detail-wrapper">
          {/* Left Section - Images */}
          <div className="car-images-section">
            <div className="main-image-container">
              <img src={mainImage} alt={car.model} className="main-car-image" />
              <div className="image-counter">
                <span>Image {selectedImage + 1} / {thumbnailImages.length}</span>
              </div>
            </div>
            <div className="thumbnail-images">
              {thumbnailImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${car.model} ${idx + 1}`}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => {
                    setMainImage(img);
                    setSelectedImage(idx);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="car-info-section">
            {/* Title */}
            <h2 className="car-model-title">{car.model}</h2>

            {/* Location Badge */}
            <div className="location-badge">
              📍 Available at Yash Car Bazaar, Gorakhpur
            </div>

            {/* Price */}
            <h3 className="price-value">₹{(car.price / 100000).toFixed(2)}L</h3>

            {/* Quick Specs Grid */}
            <div className="quick-specs-box">
              <div className="quick-spec">
                <span className="spec-label">YEAR</span>
                <span className="spec-value-bold">{car.year}</span>
              </div>
              <div className="quick-spec">
                <span className="spec-label">FUEL</span>
                <span className="spec-value-bold">{car.fuel}</span>
              </div>
              <div className="quick-spec">
                <span className="spec-label">TRANSMISSION</span>
                <span className="spec-value-bold">{car.transmission || 'Manual'}</span>
              </div>
              <div className="quick-spec">
                <span className="spec-label">KILOMETERS</span>
                <span className="spec-value-bold">{car.mileage.toLocaleString()}</span>
              </div>
            </div>

            {/* Call Button */}
            <a href="tel:+919936369111" className="call-button">
              📞 Call Now For Enquiry
            </a>

            {/* Description */}
            <div className="description-section">
              <h3>Description</h3>
              <p className="location-text">Location: Yash Car Bazaar, Paideagan Gorakhpur 📍 Contact Us</p>
              <div className="contact-list">
                {contactDetails.map((contact, idx) => (
                  <a key={idx} href={`tel:+91${contact.phone}`} className="contact-link-item">
                    📞 {contact.name} {contact.phone}
                  </a>
                ))}
              </div>
            </div>

            {/* Car Specifications */}
            <div className="specifications-section">
              <h3>Car Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {carSpecs.map((spec, idx) => (
                    <tr key={idx}>
                      <td className="spec-label">{spec.label}</td>
                      <td className="spec-value-cell">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="car-detail-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FOUR WHEEL ALAM</h3>
            <p>CAR BAZAR PVT LTD</p>
            <p>Your trusted source for quality used cars</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#cars">Used Cars</a>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📞 +91 99363 69111</p>
            <p>📧 info@yashcarbazaar.com</p>
            <p>📍 Gorakhpur, Uttar Pradesh</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2024 Yash Car Bazaar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CarDetail;
