import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Home/home';
import Sell from './pages/Sell';
// Welcome Page
function WelcomePage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-layout">
      <div className="welcome-content">
        <h1>Welcome to Threadmark</h1>
        <p className="welcome-description">
          Your Blockchain-Based NFT Creator for Apparel
        </p>
        <button className="btn-start" onClick={handleStart}>
          Visit
        </button>
      </div>
      <div className="welcome-image">
        <img
          src="https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?cs=srgb&dl=pexels-willoworld-3768005.jpg&fm=jpg"
          alt="fashion store"
        />
      </div>
    </div>
  );
}

// Login Page
function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Simulating authentication (you would replace this with an API call)
    if (email === 'test@example.com' && password === '123') {
      setError('');
      navigate('/home'); // Redirect to home page
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="form-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          Login
        </button>
        <p>
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
        </p>
        <p>
          Don't have an account?{' '}
          <span className="toggle-link" onClick={() => navigate('/register')}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

// Registration Page
function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    mobile: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, dob, mobile } = formData;
    if (!name || !email || !password || !dob || !mobile) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    alert('Registration Successful!');
    navigate('/login'); // Redirect to login page after successful registration
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
        </div>
        <div className="input-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          Register
        </button>
        <p>
          Already have an account?{' '}
          <span className="toggle-link" onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
    </Router>
  );
}

export default App;