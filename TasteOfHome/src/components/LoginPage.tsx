import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [error, setError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        interface LoginResponse {
          token: string;
        }
        const response = await axios.post<LoginResponse>('http://localhost:5000/api/login', formData);
        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/home');
      } catch (error) {
        setError('Invalid credentials');
      }
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="split-container">
      <div className="brand-side">
        <div className="brand-content">
          <img src="/tasteofhome.jpg" alt="Taste of Home" className="brand-image" />
          <h1>Taste of Home</h1>
          <p>Experience the comfort of homemade meals</p>
        </div>
      </div>
      
      <div className="login-side">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back</h2>
          
          <div className="form-group">
            <label htmlFor="email" style={{ textAlign: 'left', display: 'block' }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{ textAlign: 'left', display: 'block' }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="register-link">
            <p>New to Taste of Home? <Link to="/register">Create an account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;