import { useState } from 'react'
import Contact from './components/Contact'
import AdminLogin from './components/AdminLogin'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login') // 'login' or 'contact'

  const navigateToContact = () => {
    setCurrentPage('contact')
  }

  const navigateToLogin = () => {
    setCurrentPage('login')
  }

  return (
    <>
      <div>
        {currentPage === 'login' ? (
          <AdminLogin onNavigateToContact={navigateToContact} />
        ) : (
          <Contact onNavigateToLogin={navigateToLogin} />
        )}
      </div>
    </>
  )
}

export default App
