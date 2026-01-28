import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
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

  const navigateToAbout = () => {
    setCurrentPage('about')
  }

  const navigateToUsedCar = () => {
    setCurrentPage('usedcar')
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Contact user={user} />} />
        <Route
          path="/login"
          element={!user ? <AdminLogin /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
