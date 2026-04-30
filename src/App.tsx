/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import PublicLayout from './pages/public/PublicLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import SeoSettings from './pages/admin/SeoSettings';
import AIContent from './pages/admin/AIContent';
import Downloads from './pages/admin/Downloads';
import Inquiries from './pages/admin/Inquiries';
import AdminProducts from './pages/admin/Products';
import Posts from './pages/admin/Posts';
import Users from './pages/admin/Users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="posts" element={<Posts />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="ai" element={<AIContent />} />
          <Route path="users" element={<Users />} />
          <Route path="seo" element={<SeoSettings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
