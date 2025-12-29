import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-brand-400" size={32} />
              <span className="text-xl font-bold">M/S Aaron Enterprises</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Trusted AC service provider. Professional technicians, affordable pricing, and genuine spare parts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-600 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b-2 border-brand-500 inline-block pb-1">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">Our Services</Link></li>
              <li><Link to="/amc" className="hover:text-brand-400 transition-colors">AMC Plans</Link></li>
              <li><Link to="/book" className="hover:text-brand-400 transition-colors">Book Service</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b-2 border-brand-500 inline-block pb-1">Our Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">AC Installation</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">AC Repair</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">Gas Refilling</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">Deep Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">Uninstallation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b-2 border-brand-500 inline-block pb-1">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-sm">H.No. 1685,559, Gali no. 7, Laxman Vihar Ph-2, Near Airtel Tower, Gurugram- 122001 (HR)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-400 flex-shrink-0" size={18} />
                <div className="flex flex-col">
                  <a href="tel:8077419349" className="hover:text-white">8077419349</a>
                  <a href="tel:8826613593" className="hover:text-white">8826613593</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-400 flex-shrink-0" size={18} />
                <a href="mailto:aaronenterprisesae@gmail.com" className="hover:text-white break-all">aaronenterprisesae@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} M/S Aaron Enterprises. All rights reserved.</p>
        </div>
      </div>
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918077419349" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
    </footer>
  );
};

export default Footer;