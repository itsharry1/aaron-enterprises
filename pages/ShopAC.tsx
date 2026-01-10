import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BRANDS } from '../constants';
import { ShoppingBag, CheckCircle, Loader2, User, Phone, MapPin, IndianRupee, Wind } from 'lucide-react';

const ShopAC: React.FC = () => {
  const navigate = useNavigate();
  const { addBooking, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    acType: 'Split',
    tonnage: '1.5 Ton',
    brands: [] as string[],
    budget: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBrandToggle = (brand: string) => {
    setFormData(prev => {
      if (prev.brands.includes(brand)) {
        return { ...prev, brands: prev.brands.filter(b => b !== brand) };
      } else {
        return { ...prev, brands: [...prev.brands, brand] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addBooking({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        bookingType: 'PURCHASE',
        acType: formData.acType as any,
        purchaseDetails: {
          brands: formData.brands.length > 0 ? formData.brands : ['Any'],
          tonnage: formData.tonnage,
          budget: formData.budget || 'Not specified'
        },
        notes: formData.notes
      });
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting request", error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl max-w-lg text-center animate-zoom-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 mx-auto shadow-inner">
             <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Inquiry Received!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thanks for your interest in buying a new AC. Our sales team will call you shortly with the best deals tailored to your needs.
          </p>
          <div className="flex gap-4 justify-center">
             <button onClick={() => navigate('/')} className="px-6 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors">Home</button>
             <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg transition-transform hover:scale-105">View Status</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl text-orange-600 mb-6 shadow-sm transform rotate-6">
             <ShoppingBag size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Buy New AC</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get exclusive deals on top brands. Tell us your requirements, and we'll handle the delivery and installation.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-[2.5rem] shadow-glass border border-white/60 overflow-hidden animate-slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3">
             {/* Left Panel - Image/Info */}
             <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-6">Why Buy From Us?</h3>
                   <ul className="space-y-6">
                      <li className="flex items-start gap-3">
                         <div className="bg-white/20 p-2 rounded-lg"><CheckCircle size={20} /></div>
                         <div>
                            <p className="font-bold">Free Installation</p>
                            <p className="text-brand-100 text-sm">Professional fitting included worth ₹1500</p>
                         </div>
                      </li>
                      <li className="flex items-start gap-3">
                         <div className="bg-white/20 p-2 rounded-lg"><CheckCircle size={20} /></div>
                         <div>
                            <p className="font-bold">Genuine Warranty</p>
                            <p className="text-brand-100 text-sm">Brand warranty + 1 year service support</p>
                         </div>
                      </li>
                      <li className="flex items-start gap-3">
                         <div className="bg-white/20 p-2 rounded-lg"><CheckCircle size={20} /></div>
                         <div>
                            <p className="font-bold">Best Prices</p>
                            <p className="text-brand-100 text-sm">Wholesale rates direct to customer</p>
                         </div>
                      </li>
                   </ul>
                </div>
                <div className="mt-12 relative z-10 text-center opacity-80 text-sm">
                   Trusted by 5000+ customers in Gurugram
                </div>
             </div>

             {/* Right Panel - Form */}
             <div className="md:col-span-2 p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                   
                   {/* Personal Details */}
                   <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Contact Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                               <User size={18} />
                            </div>
                            <input 
                              type="text" 
                              name="name" 
                              value={formData.name} 
                              onChange={handleInputChange} 
                              required
                              placeholder="Your Name" 
                              className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            />
                         </div>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                               <Phone size={18} />
                            </div>
                            <input 
                              type="tel" 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange} 
                              required
                              placeholder="Phone Number" 
                              className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            />
                         </div>
                      </div>
                      <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                               <MapPin size={18} />
                            </div>
                            <textarea 
                              name="address" 
                              value={formData.address} 
                              onChange={handleInputChange} 
                              required
                              rows={2}
                              placeholder="Delivery Address" 
                              className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            />
                      </div>
                   </div>

                   {/* Requirements */}
                   <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">AC Requirements</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                            <div className="relative">
                               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <Wind size={18} />
                               </div>
                               <select 
                                 name="acType" 
                                 value={formData.acType} 
                                 onChange={handleInputChange}
                                 className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
                               >
                                  <option value="Split">Split AC</option>
                                  <option value="Window">Window AC</option>
                                  <option value="Cassette">Cassette AC</option>
                                  <option value="Tower">Tower AC</option>
                               </select>
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                            <select 
                                 name="tonnage" 
                                 value={formData.tonnage} 
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
                            >
                                  <option value="1 Ton">1 Ton</option>
                                  <option value="1.5 Ton">1.5 Ton</option>
                                  <option value="2 Ton">2 Ton</option>
                                  <option value="Other">Other</option>
                            </select>
                         </div>
                      </div>

                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Brands (Select multiple)</label>
                         <div className="flex flex-wrap gap-2">
                            {BRANDS.slice(0, 8).map(brand => (
                               <button
                                 key={brand}
                                 type="button"
                                 onClick={() => handleBrandToggle(brand)}
                                 className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                    formData.brands.includes(brand) 
                                    ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                                 }`}
                               >
                                  {brand}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Budget (Optional)</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                               <IndianRupee size={18} />
                            </div>
                            <input 
                              type="text" 
                              name="budget" 
                              value={formData.budget} 
                              onChange={handleInputChange} 
                              placeholder="e.g. 30,000 - 40,000" 
                              className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            />
                         </div>
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                   >
                      {loading ? <Loader2 className="animate-spin" /> : "Request Best Quote"}
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAC;