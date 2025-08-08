import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginFormData {
  email: string;
  password: string;
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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [, setError] = useState<string>("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.googleusercontent.com",
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
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

  const handleGoogleSignIn = async (response: any) => {
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
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-login`,
        {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          googleId: googleUser.sub,
          token: token
        }
      );

      const { token: authToken, user } = loginResponse.data;
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));
      
      navigate("/home");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
  user: {
    name: string;
    avatar: string;
  };
}

        const response = await axios.post<LoginResponse>(
          `${import.meta.env.VITE_API_URL}/api/login`,
          formData
        );
        const { token , user } = response.data;
        localStorage.setItem("token", token);
        // console.log(user);
        // console.log(token);
        
        
        localStorage.setItem("user", JSON.stringify(user)); // ✅ Store profile data
        navigate("/home");
      } catch {
        setError("Invalid credentials");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="split-container">
      <div className="brand-side">
        <div className="brand-content">
          <img
            src="/TasteOfHome/tasteofhome.jpg"
            alt="Taste of Home"
            className="brand-image"
          />
          <h1>Taste of Home</h1>
          <p>Experience the comfort of homemade meals</p>
        </div>
      </div>

      <div className="login-side">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back</h2>

          <div className="form-group">
            <label
              htmlFor="email"
              style={{ textAlign: "left", display: "block" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="password"
              style={{ textAlign: "left", display: "block" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {/* <div className="divider">
            <span>or</span>
          </div>

          <div className="google-signin-container">
            <div id="google-signin-button"></div>
            {isGoogleLoading && (
              <div className="google-loading">
                <span>Signing in with Google...</span>
              </div>
            )}
          </div> */}

          <div className="register-link">
            <p>
              New to Taste of Home?{" "}
              <Link to="/register">Create an account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
