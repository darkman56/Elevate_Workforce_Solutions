import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import JobSeekerRegister from './components/JobSeekerRegister';
import JobSeekerLogin from './components/JobSeekerLogin';
import CompanyLogin from './components/CompanyLogin';
import AdminLogin from './components/AdminLogin';
import JobList from './components/JobList';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const Header = () => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isAdminLoginPage = location.pathname === '/admin-login';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    navigate('/');
    setShowPopup(false);
  };

  return (
    <header>
      <Link to="/" className="header-title">
        <h1>Elevate Workforce Solutions</h1>
      </Link>
      {!isAdminLoginPage && (
        <div className="header-button">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="login-signup-btn" onClick={() => setShowPopup(!showPopup)}>
                Login/Signup
              </button>
              {showPopup && (
                <div className="auth-popup">
                  <button onClick={() => { navigate('/jobseeker-register'); setShowPopup(false); }}>
                    Register as Job Seeker
                  </button>
                  <button onClick={() => { navigate('/company-login'); setShowPopup(false); }}>
                    Login as Company
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobseeker-register" element={<JobSeekerRegister />} />
            <Route path="/jobseeker-login" element={<JobSeekerLogin />} />
            <Route path="/company-login" element={<CompanyLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;