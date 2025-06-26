import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import './App.css';
import MenuPage from './components/MenuPage';
import { CartProvider } from './components/CartContext';
import OrderPage from './components/OrderPage';
import { ToastContainer } from 'react-toastify';
import TraditionalFoodPage from './components/TraditionalFoodPage';
import ModernFoodPage from './components/ModernFoodPage';
import VegFoodPage from './components/VegFoodPage'; // Import the new component
import NonVegFoodPage from './components/NonVegFoodPage';
function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<MenuPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/foods/traditional" element={<TraditionalFoodPage />} />
            <Route path="/foods/modern" element={<ModernFoodPage />} />
            <Route path="/foods/veg" element={<VegFoodPage />} />
          <Route path="/foods/nonveg" element={<NonVegFoodPage />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </CartProvider>
    </Router>
  );
}
export default App;