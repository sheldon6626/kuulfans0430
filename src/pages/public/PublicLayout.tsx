import { Outlet, Link } from 'react-router-dom';
import { Fan, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary p-2 rounded-lg group-hover:bg-secondary transition-colors">
                  <Fan className="w-8 h-8 text-white" />
                </div>
                <span className="font-serif font-bold text-2xl text-primary tracking-tight">Kuul Fans</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
              <Link to="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">Products</Link>
              <Link to="/about" className="text-gray-600 hover:text-primary font-medium transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary font-medium transition-colors">Contact</Link>
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden md:flex items-center">
              <Link to="/contact" className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md hover:shadow-lg">
                Get a Quote
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-primary p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Home</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Products</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">About Us</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Contact</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block mt-4 text-center bg-primary text-white px-3 py-3 text-base font-medium rounded-md shadow-sm">Get a Quote</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <Fan className="w-6 h-6 text-secondary" />
                <span className="font-serif font-bold text-xl text-white">Kuul Fans</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                The leading provider of one-stop ventilation and cooling solutions for industrial and commercial applications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-100">Products</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-gray-400 hover:text-secondary text-sm transition-colors">HVLS Fans</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-secondary text-sm transition-colors">Evaporative Air Coolers</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-secondary text-sm transition-colors">Evaporative Cooling Pads</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-secondary text-sm transition-colors">Exhaust Fans</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-100">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-secondary text-sm transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-secondary text-sm transition-colors">News & Blog</Link></li>
                <li><Link to="/projects" className="text-gray-400 hover:text-secondary text-sm transition-colors">Projects</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-secondary text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-100">Contact</h3>
              <address className="not-italic space-y-2 text-sm text-gray-400">
                <p>Email: info@kuulfans.com</p>
                <p>Global Industrial Park, Tech Avenue</p>
              </address>
              <div className="mt-4">
                <Link to="/admin/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Admin Login</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Kuul Fans. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <span className="hover:text-white cursor-pointer">Privacy Policy</span>
               <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
