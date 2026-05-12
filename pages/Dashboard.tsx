import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { Calendar, User, Package, LogOut, CheckCircle, Clock, Menu, ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Camera } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../src/supabaseClient';

type DashboardView = 'bookings' | 'amc' | 'profile';

const Dashboard: React.FC = () => {
  const { user, bookings, logout, refreshData } = useApp();
  const [activeView, setActiveView] = useState<DashboardView>('bookings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthChecked(true);
    };
    checkSession();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // simple loading state
  }

  if (!session) {
    return <Navigate to="/login" />;
  }
  
  const userName = user?.name || session?.user?.user_metadata?.full_name || 'User';
  const userEmail = user?.email || session?.user?.email || '';
  const firstLetter = userName.charAt(0).toUpperCase();

  const userBookings = bookings.filter(b => b.userId === user?.id || b.customerName === userName);
  const activeAMC = userBookings.filter(b => b.planId && b.status === 'Confirmed');

  const renderBookingCard = (booking: any) => {
    const isPurchase = booking.bookingType === 'PURCHASE';
    const isAMC = booking.bookingType === 'AMC' || (booking.planId && !booking.serviceId);
    
    let title = 'Service Booking';
    if (isPurchase) title = 'Product Inquiry';
    else if (isAMC) title = 'AMC Purchase';

    let details = booking.serviceId ? 'Service' : 'Plan';
    if (isPurchase) {
       details = `${booking.acType} AC - ${booking.purchaseDetails?.tonnage || 'Standard'}`;
    }

    return (
       <div key={booking.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/40 transition-colors">
          <div className="mb-4 md:mb-0">
             <div className="flex items-center gap-3 mb-2">
               <span className="font-bold text-gray-900 text-lg">{title}</span>
               <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
                 booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                 booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
               }`}>{booking.status}</span>
             </div>
             
             {!isPurchase && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                   <span className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md"><Calendar size={14}/> {booking.date}</span>
                   <span className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md"><Clock size={14}/> {booking.time}</span>
                </div>
             )}

             <p className="text-sm text-gray-600 bg-white/30 p-2.5 rounded-lg border border-white/40 inline-block">
               {isPurchase ? (
                  <span className="flex items-center gap-2"><ShoppingBag size={14}/> <strong>Request:</strong> {details}</span>
               ) : (
                  <><span className="font-semibold">{booking.acType} AC</span> • {booking.customerAddress}</>
               )}
             </p>
          </div>
          <div className="text-right">
             <button className="text-brand-600 text-sm font-bold hover:text-brand-700 bg-white/50 hover:bg-white px-4 py-2 rounded-xl border border-white/50 shadow-sm transition-all">
               View Details
             </button>
          </div>
       </div>
    );
  };

  const renderContent = () => {
    switch(activeView) {
      case 'bookings':
        return (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass overflow-hidden border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
             <div className="px-6 py-5 border-b border-white/50 bg-white/40 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
                <span className="text-xs font-bold text-gray-500 bg-white/50 px-2 py-1 rounded-lg">{userBookings.length} total</span>
             </div>
             
             {userBookings.length === 0 ? (
               <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                 <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                 </div>
                 <p className="font-medium">You haven't made any bookings yet.</p>
                 <a href="/#/book" className="mt-4 text-brand-600 font-bold hover:underline">Book a service now</a>
               </div>
             ) : (
               <div className="divide-y divide-white/50">
                 {userBookings.map(renderBookingCard)}
               </div>
             )}
          </div>
        );
      case 'amc':
        return (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass overflow-hidden border border-white/50 p-8 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <h3 className="font-bold text-gray-900 text-xl mb-6">My AMC Plans</h3>
            {activeAMC.length > 0 ? (
               <div className="grid gap-6">
                 {activeAMC.map(plan => (
                   <div key={plan.id} className="bg-gradient-to-r from-brand-50/50 to-white/50 border border-brand-100 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-bold text-lg text-brand-900">Active Plan</h4>
                            <p className="text-brand-600 font-medium">Standard AMC Package</p>
                            <p className="text-sm text-gray-500 mt-2">Valid until: Dec 2024</p>
                         </div>
                         <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            Active
                         </div>
                      </div>
                      <div className="mt-6 flex gap-4">
                         <div className="text-center bg-white/60 p-3 rounded-xl border border-white/50 w-24">
                            <div className="text-2xl font-bold text-gray-900">2</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Left</div>
                         </div>
                         <div className="text-center bg-white/60 p-3 rounded-xl border border-white/50 w-24">
                            <div className="text-2xl font-bold text-gray-900">1</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Done</div>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                   <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-6 font-medium">You don't have any active AMC plans.</p>
                <a href="/#/amc" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                  View Plans
                </a>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass overflow-hidden border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
             {/* Profile Header/Banner */}
             <div className="h-32 bg-gradient-to-r from-brand-600 to-blue-800 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute -bottom-12 left-8 flex items-end gap-5">
                   <div className="relative z-10">
                      <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-xl">
                         <div className="w-full h-full bg-gradient-to-br from-brand-100 to-blue-50 rounded-full flex items-center justify-center text-brand-600 text-3xl font-extrabold border border-brand-100">
                            {firstLetter}
                         </div>
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-brand-600 transition-colors hover:scale-110">
                         <Camera size={16} />
                      </button>
                   </div>
                   <div className="mb-3 hidden sm:block relative z-10">
                      <h3 className="text-2xl font-extrabold text-white drop-shadow-md">{userName}</h3>
                      <p className="text-brand-100 text-sm font-medium drop-shadow-sm flex items-center gap-1">
                        <CheckCircle size={14} className="text-green-400" /> Verified Customer
                      </p>
                   </div>
                </div>
             </div>
             
             <div className="p-8 pt-20">
                <div className="sm:hidden mb-8">
                   <h3 className="text-2xl font-extrabold text-gray-900">{userName}</h3>
                   <p className="text-brand-600 text-sm font-medium flex items-center gap-1 mt-1">
                     <CheckCircle size={14} className="text-green-500" /> Verified Customer
                   </p>
                </div>

                <div className="max-w-3xl mx-auto">
                   <div className="space-y-8">
                      {/* Personal Information */}
                      <section>
                         <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-brand-500" /> Personal Information
                         </h4>
                         <form className="space-y-5 bg-white/40 p-6 rounded-2xl border border-white/60 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                  <div className="relative">
                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                     </div>
                                     <input type="text" defaultValue={userName} className="w-full rounded-xl border-gray-200 border pl-10 pr-4 py-2.5 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium text-gray-900 shadow-sm" />
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                  <div className="relative">
                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Phone size={18} />
                                     </div>
                                     <input type="tel" defaultValue={user?.phone || ""} placeholder="Not set" className="w-full rounded-xl border-gray-200 border pl-10 pr-4 py-2.5 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium text-gray-900 shadow-sm" />
                                  </div>
                               </div>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                               <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                     <Mail size={18} />
                                  </div>
                                  <input type="email" defaultValue={userEmail} className="w-full rounded-xl border-gray-200 border pl-10 pr-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed font-medium shadow-sm" readOnly />
                               </div>
                               <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500"/> Email is verified and cannot be changed.</p>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Saved Address</label>
                               <div className="relative">
                                  <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                     <MapPin size={18} />
                                  </div>
                                  <textarea rows={3} className="w-full rounded-xl border-gray-200 border pl-10 pr-4 py-2.5 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium text-gray-900 shadow-sm" placeholder="Add your default service address..."></textarea>
                               </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                               <button type="button" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95 flex items-center gap-2">
                                 Save Changes
                               </button>
                            </div>
                         </form>
                      </section>
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="min-h-screen py-6 md:py-12">
      <SEO title="My Dashboard" description="View your bookings, AMC plans, and profile." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 pl-2 border-l-4 border-brand-500 animate-slide-in-left">My Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Mobile User Header */}
          <div className="lg:hidden bg-white/60 backdrop-blur-md rounded-2xl shadow-glass p-4 flex items-center justify-between border border-white/50 animate-fade-in-down">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold shadow-inner">
                 {firstLetter}
               </div>
               <div>
                  <h2 className="font-bold text-gray-900 text-sm">{userName}</h2>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{userEmail}</p>
               </div>
             </div>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white rounded-lg shadow-sm">
                <Menu size={20} />
             </button>
          </div>

          {/* Sidebar Navigation */}
          <div className={`
            ${mobileMenuOpen ? 'block' : 'hidden'} 
            lg:block 
            bg-white/60 backdrop-blur-md rounded-2xl shadow-glass p-6 h-fit lg:sticky lg:top-24
            transition-all duration-300 border border-white/50 animate-slide-in-left
          `}>
            {/* Desktop User Info */}
            <div className="hidden lg:flex items-center gap-4 mb-8 p-4 bg-white/40 rounded-xl border border-white/50">
               <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xl font-bold shadow-inner">
                 {firstLetter}
               </div>
               <div className="overflow-hidden">
                  <h2 className="font-bold text-gray-900 truncate">{userName}</h2>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
               </div>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => { setActiveView('bookings'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeView === 'bookings' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-600 hover:bg-white/60 hover:text-brand-600'}`}
              >
                <Calendar size={20} /> My Bookings
              </button>
              <button 
                onClick={() => { setActiveView('amc'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeView === 'amc' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-600 hover:bg-white/60 hover:text-brand-600'}`}
              >
                <Package size={20} /> AMC Plans
              </button>
              <button 
                onClick={() => { setActiveView('profile'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeView === 'profile' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-600 hover:bg-white/60 hover:text-brand-600'}`}
              >
                <User size={20} /> Profile
              </button>
              <div className="pt-4 mt-4 border-t border-gray-200/50">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Stats (Always visible) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/50 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  <div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Bookings</div>
                    <div className="text-3xl font-extrabold text-gray-900">{userBookings.length}</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shadow-sm">
                    <Calendar size={28} />
                  </div>
               </div>
               <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/50 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  <div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active AMC</div>
                    <div className="text-3xl font-extrabold text-brand-600">{activeAMC.length}</div>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 shadow-sm">
                    <CheckCircle size={28} />
                  </div>
               </div>
            </div>

            {/* Dynamic Content Area */}
            {renderContent()}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;