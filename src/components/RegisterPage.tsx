import React, { useState, useEffect } from 'react';
import './RegisterPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.googleusercontent.com",
          callback: handleGoogleSignUp,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signup_with",
            shape: "rectangular",
          }
        );
      }
    };

    // Load Google Identity Services script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleGoogleSignUp = async (response: any) => {
    setIsGoogleLoading(true);
    try {
      // Decode the JWT token to get user info
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const googleUser: GoogleUser = JSON.parse(jsonPayload);
      
      // Send Google user data to your backend
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-login`,
        {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          googleId: googleUser.sub,
          token: token
        }
      );

      const { token: authToken, user } = registerResponse.data;
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success('Google registration successful!');
      setTimeout(() => navigate('/home'), 2000);
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      toast.error(error.response?.data?.message || 'Google sign-up failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

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

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);
      toast.success('Registration successful!');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
      <ToastContainer />
      <div className="brand-side">
        <div className="brand-content">
          <img src="/TasteOfHome/tasteofhome.jpg" alt="Taste of Home" className="brand-image" />
          <h1>Taste of Home</h1>
          <p>Join us and experience the comfort of homemade meals</p>
        </div>
      </div>
      
      <div className="register-side">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Create Account</h2>
          
          <div className="form-group">
            <label htmlFor="name" style={{ textAlign: 'left', display: 'block' }}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

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

          <div className="form-group">
            <label htmlFor="phoneNumber" style={{ textAlign: 'left', display: 'block' }}>Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter 10-digit number"
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          <button type="submit" className="register-button">
            Create Account
          </button>

          {/* <div className="divider">
            <span>or</span>
          </div>

          <div className="google-signin-container">
            <div id="google-signup-button"></div>
            {isGoogleLoading && (
              <div className="google-loading">
                <span>Signing up with Google...</span>
              </div>
            )}
          </div> */}

          <div className="login-link">
            <p>Already have an account? <a href="#/login">Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;