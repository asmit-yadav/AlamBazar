import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import UsedCar from './components/UsedCar';
import About from './components/About';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Contact user={user} />} />
        <Route path="/used-cars" element={<UsedCar />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={!user ? <AdminLogin /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
