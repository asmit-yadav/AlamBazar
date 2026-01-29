import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UsedCar.css';
import CarDetail from './CarDetail';

const UsedCar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const onToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };
  const [filters, setFilters] = useState({
    search: '',
    brand: 'All',
    priceMin: 0,
    priceMax: 5000000,
    fuelType: 'All',
    transmission: 'Any'
  });

  const [sortBy, setSortBy] = useState('newest');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Sample car data - replace with API data
  const [carsData, setCarsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cars?limit=100'); // Fetch enough for demo
        const result = await response.json();

        if (result.success) {
          setCarsData(result.data.cars);
        } else {
          throw new Error(result.error?.message || 'Failed to fetch cars');
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Could not load inventory. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const brands = ['All', 'Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Mahindra', 'Toyota'];
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'CNG'];

  // Filter cars based on current filters
  const filteredCars = carsData.filter(car => {
    const matchesBrand = filters.brand === 'All' || car.brand === filters.brand;
    const matchesPrice = car.price >= filters.priceMin && car.price <= filters.priceMax;
    const matchesFuel = filters.fuelType === 'All' || car.fuel === filters.fuelType;
    const matchesSearch = car.model.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.brand.toLowerCase().includes(filters.search.toLowerCase());

    return matchesBrand && matchesPrice && matchesFuel && matchesSearch;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.year - a.year;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      brand: 'All',
      priceMin: 0,
      priceMax: 5000000,
      fuelType: 'All',
      transmission: 'Any'
    });
  };

  const handleCallClick = (carBrand) => {
    const message = `Hello, I'm interested in ${carBrand}`;
    const whatsappUrl = `https://wa.me/919936369111?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // If a car is selected, show the detail view
  if (selectedCar) {
    return (
      <CarDetail
        car={selectedCar}
        onBack={() => setSelectedCar(null)}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    );
  }

  return (
    <div className="used-car-wrapper">
      {/* Header */}
      <header className="used-car-header">
        <div className="header-content">
          <div className="logo">
            <h1>Yash Car <span className="bazaar">Bazaar</span></h1>
          </div>
          <nav className="nav-menu">
            <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a>
            <a onClick={() => { }} className="active" style={{ cursor: 'pointer' }}>Used Cars</a>
            <a onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</a>
            <a onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact</a>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Admin</a>
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

      {/* Hero Section */}
      <section className="used-car-hero">
        <h2>Our Inventory</h2>
        <p>Find the best verified used cars in Gorakhpur.</p>
      </section>

      {/* Main Content */}
      <div className="used-car-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <h3>🔽 Filters</h3>

          {/* Search */}
          <div className="filter-group">
            <label>Search Vehicle</label>
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="e.g. Swift, City..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <label>Brand</label>
            <div className="custom-dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              >
                <span>{filters.brand}</span>
                <span className="dropdown-icon">▼</span>
              </button>
              {isBrandDropdownOpen && (
                <div className="dropdown-menu">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      className={`dropdown-item ${filters.brand === brand ? 'active' : ''}`}
                      onClick={() => {
                        handleFilterChange('brand', brand);
                        setIsBrandDropdownOpen(false);
                      }}
                    >
                      <span className="dropdown-check">
                        {filters.brand === brand ? '✓' : ''}
                      </span>
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range-display">
              <span className="price-label">₹0.0L - ₹50.0L+</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', parseInt(e.target.value))}
              className="price-slider"
            />
            <div className="price-values">
              <span>₹0</span>
              <span>₹{(filters.priceMax / 100000).toFixed(1)}L</span>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="filter-group">
            <label>Fuel Type</label>
            <div className="fuel-pills">
              {fuelTypes.map(fuel => (
                <button
                  key={fuel}
                  className={`fuel-pill ${filters.fuelType === fuel ? 'active' : ''}`}
                  onClick={() => handleFilterChange('fuelType', fuel)}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="filter-group">
            <label>Transmission</label>
            <select
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
              className="filter-select"
            >
              <option>Any</option>
              <option>Manual</option>
              <option>Automatic</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button className="reset-btn" onClick={handleResetFilters}>
            ✕ Reset Filters
          </button>
        </aside>

        {/* Cars Grid */}
        <section className="cars-section">
          {/* Results Info and Sort */}
          <div className="results-header">
            <div className="results-count">
              Showing <span>{sortedCars.length}</span> results
            </div>
            <div className="sort-container">
              <label>Sort by:</label>
              <div className="custom-dropdown sort-dropdown">
                <button
                  className="dropdown-toggle sort-toggle"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  <span>
                    {sortBy === 'newest' && 'Newest Listed'}
                    {sortBy === 'price-low' && 'Price: Low to High'}
                    {sortBy === 'price-high' && 'Price: High to Low'}
                  </span>
                  <span className="dropdown-icon">▼</span>
                </button>
                {isSortDropdownOpen && (
                  <div className="dropdown-menu">
                    <button
                      className={`dropdown-item ${sortBy === 'newest' ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy('newest');
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      <span className="dropdown-check">
                        {sortBy === 'newest' ? '✓' : ''}
                      </span>
                      Newest Listed
                    </button>
                    <button
                      className={`dropdown-item ${sortBy === 'price-low' ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy('price-low');
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      <span className="dropdown-check">
                        {sortBy === 'price-low' ? '✓' : ''}
                      </span>
                      Price: Low to High
                    </button>
                    <button
                      className={`dropdown-item ${sortBy === 'price-high' ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy('price-high');
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      <span className="dropdown-check">
                        {sortBy === 'price-high' ? '✓' : ''}
                      </span>
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="cars-grid">
            {loading ? (
              <div className="loading-state">Loading inventory...</div>
            ) : sortedCars.length > 0 ? (
              sortedCars.map(car => (
                <div key={car.id} className="car-card">
                  <div className="car-image-wrapper">
                    <img
                      src={car.images && car.images.length > 0 ? car.images[0] : 'https://via.placeholder.com/280x200?text=No+Image'}
                      alt={car.model}
                      className="car-image"
                    />
                    <span className="used-badge">Used</span>
                    <div className="car-view-badge">360° View</div>
                  </div>

                  <div className="car-details">
                    <h3 className="car-brand">{car.brand}</h3>
                    <h2 className="car-model">{car.model} {car.variant}</h2>

                    <div className="car-specs">
                      <div className="spec">
                        <span className="spec-icon">📅</span>
                        <span className="spec-value">{car.year}</span>
                      </div>
                      <div className="spec">
                        <span className="spec-icon">⛽</span>
                        <span className="spec-value">{car.fuelType || car.fuel}</span>
                      </div>
                      <div className="spec">
                        <span className="spec-icon">🛣</span>
                        <span className="spec-value">{car.mileage ? car.mileage.toLocaleString() : 'N/A'} km</span>
                      </div>
                    </div>

                    <div className="car-footer">
                      <div className="price-section">
                        <label>Price</label>
                        <h3 className="car-price">₹{(car.price / 100000).toFixed(2)}L</h3>
                      </div>
                      <button
                        className="view-detail-btn"
                        onClick={() => setSelectedCar(car)}
                        title="View Details"
                      >
                        ↗️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No cars found matching your filters. Please try adjusting your search.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="used-car-footer">
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
              <li><a onClick={() => { }} style={{ cursor: 'pointer' }}>Used Cars</a></li>
              <li><a onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</a></li>
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

export default UsedCar;
