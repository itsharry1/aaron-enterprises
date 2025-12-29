import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User, LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useApp();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path ? 'text-brand-600 font-bold bg-brand-50/50 rounded-lg px-3 py-1' : 'text-gray-600 hover:text-brand-500 hover:bg-white/40 px-3 py-1 rounded-lg transition-all';

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeMenu}>
              <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-200">
                <ShieldCheck size={28} />
              </div>
              <div>
                <span className="font-bold text-lg md:text-xl text-brand-900 block leading-tight">M/S Aaron Enterprises</span>
                <span className="text-xs text-gray-500 font-medium tracking-wider">AC SERVICES & AMC</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/services" className={isActive('/services')}>Services</Link>
            <Link to="/amc" className={isActive('/amc')}>AMC Plans</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            
            {user ? (
               <div className="relative group">
                 <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-brand-600 bg-white/50 px-4 py-2 rounded-full border border-white/50 shadow-sm hover:shadow-md transition-all">
                    <User size={20} />
                    <span>{user.name}</span>
                 </button>
                 <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/50 ring-1 ring-black/5 transform origin-top-right">
                    <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                 </div>
               </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-brand-600 font-medium flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full border border-white/50 shadow-sm hover:shadow-md transition-all">
                <User size={18} /> Login
              </Link>
            )}

            <Link to="/book" className="bg-brand-600/90 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-brand-500/30 backdrop-blur-sm border border-transparent hover:scale-105 active:scale-95">
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <a href="tel:8077419349" className="mr-4 text-brand-600 bg-brand-50 p-2 rounded-full">
              <Phone size={20} />
            </a>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-lg rounded-b-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={closeMenu}>Home</Link>
            <Link to="/services" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={closeMenu}>Services</Link>
            <Link to="/amc" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={closeMenu}>AMC Plans</Link>
            <Link to="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={closeMenu}>Contact</Link>
            
            {user ? (
              <>
                 <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="block px-4 py-3 rounded-xl text-base font-medium text-brand-600 bg-brand-50/50" onClick={closeMenu}>
                    My Dashboard
                 </Link>
                 <button onClick={() => { logout(); closeMenu(); }} className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors">
                    Logout
                 </button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={closeMenu}>Login</Link>
            )}
            
            <div className="pt-4 mt-2">
               <Link to="/book" className="block w-full text-center bg-brand-600 text-white px-4 py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-transform" onClick={closeMenu}>
                Book a Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;