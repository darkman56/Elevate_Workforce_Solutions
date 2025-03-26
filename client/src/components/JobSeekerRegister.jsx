import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const JobSeekerRegister = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isEmailExists, setIsEmailExists] = useState(false); // Track if email exists
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/register', { fullName, email, password, role: 'job_seeker' });
      setMessage(res.data.message);
      setIsEmailExists(false); // Reset error state
      const loginRes = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('role', loginRes.data.role);
      localStorage.setItem('fullName', loginRes.data.fullName);
      navigate('/jobs');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error registering';
      setMessage(errorMsg);
      if (errorMsg === 'Email already exists') {
        setIsEmailExists(true); // Show login option
      } else {
        setIsEmailExists(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register (Job Seekers)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="show-password-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
      {message && (
        <p>
          {message}
          {isEmailExists && (
            <>
              {' '}Already have an account?{' '}
              <Link to="/jobseeker-login" className="login-instead-link">Login instead</Link>
            </>
          )}
        </p>
      )}
      {!isEmailExists && (
        <Link to="/jobseeker-login" className="register-link">Already registered? Log In</Link>
      )}
    </div>
  );
};

export default JobSeekerRegister;