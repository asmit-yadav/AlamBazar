import { useState, useEffect } from 'react'
import Contact from './components/Contact'
import AdminLogin from './components/AdminLogin'
import About from './components/About'
import UsedCar from './components/UsedCar'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'contact', 'about', or 'usedcar'
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : false
  })

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const navigateToContact = () => {
    setCurrentPage('contact')
  }

  const navigateToLogin = () => {
    setCurrentPage('login')
  }

  const navigateToAbout = () => {
    setCurrentPage('about')
  }

  const navigateToUsedCar = () => {
    setCurrentPage('usedcar')
  }

  return (
    <>
      <div>
        {currentPage === 'login' ? (
          <AdminLogin 
            onNavigateToContact={navigateToContact} 
            onNavigateToAbout={navigateToAbout}
            onNavigateToUsedCar={navigateToUsedCar}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        ) : currentPage === 'about' ? (
          <About 
            onNavigateToLogin={navigateToLogin}
            onNavigateToContact={navigateToContact}
            onNavigateToUsedCar={navigateToUsedCar}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        ) : currentPage === 'usedcar' ? (
          <UsedCar 
            onNavigateToAbout={navigateToAbout}
            onNavigateToContact={navigateToContact}
            onNavigateToLogin={navigateToLogin}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        ) : (
          <Contact 
            onNavigateToLogin={navigateToLogin} 
            onNavigateToAbout={navigateToAbout}
            onNavigateToUsedCar={navigateToUsedCar}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        )}
      </div>
    </>
  )
}

export default App
