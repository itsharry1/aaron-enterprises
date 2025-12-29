import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ShieldCheck, User, Mail, Phone, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        id: '', // Will be generated
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: UserRole.CUSTOMER
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-50 via-white to-blue-50">
      <div className="max-w-md w-full space-y-8 bg-white/60 backdrop-blur-xl p-10 rounded-[2rem] shadow-glass border border-white/50 relative overflow-hidden animate-zoom-in">
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="text-center relative z-10">
          <div className="mx-auto h-16 w-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
             <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join M/S Aaron Enterprises for seamless service booking
          </p>
        </div>

        <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-fade-in">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-brand-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm backdrop-blur-sm shadow-inner transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-brand-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm backdrop-blur-sm shadow-inner transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-brand-500" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm backdrop-blur-sm shadow-inner transition-all"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-brand-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm backdrop-blur-sm shadow-inner transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-brand-500" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm backdrop-blur-sm shadow-inner transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
             Already have an account?{' '}
             <Link to="/login" className="font-bold text-brand-600 hover:text-brand-500 hover:underline">
               Sign in here
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;