import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
//import AdminPage from './pages/AdminPage';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import AdminProductsPage from './pages/AdminProductsPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas privadas */}
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="//products" element={<AdminProductsPage />} />
                  <Route path="/product/:productId" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/recover-password" element={<PasswordRecoveryPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/product/:productId" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile/*" element={<ProfilePage />} />
                  
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
