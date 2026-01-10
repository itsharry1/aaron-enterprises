import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { Calendar, User, Settings, Package, LogOut, CheckCircle, Clock, Menu, ShoppingBag } from 'lucide-react';

type DashboardView = 'bookings' | 'amc' | 'profile' | 'settings';

const Dashboard: React.FC = () => {
  const { user, bookings, logout } = useApp();
  const [activeView, setActiveView] = useState<DashboardView>('bookings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const userBookings = bookings.filter(b => b.userId === user.id || b.customerName === user.name);
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
                 booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
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
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass overflow-hidden border border-white/50 animate-fade-in-up">
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
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass overflow-hidden border border-white/50 p-8 animate-fade-in-up">
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
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass overflow-hidden border border-white/50 p-8 animate-fade-in-up">
             <h3 className="font-bold text-gray-900 text-xl mb-6">Profile Settings</h3>
             <form className="space-y-6 max-w-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <input type="text" defaultValue={user.name} className="w-full rounded-xl border-white/60 border px-4 py-2.5 bg-white/50" readOnly />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" defaultValue={user.phone || "Not set"} className="w-full rounded-xl border-white/60 border px-4 py-2.5 bg-white/50" readOnly />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                   <input type="email" defaultValue={user.email} className="w-full rounded-xl border-white/60 border px-4 py-2.5 bg-white/50" readOnly />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Saved Address</label>
                   <textarea rows={3} className="w-full rounded-xl border-white/60 border px-4 py-2.5 bg-white/50 focus:ring-brand-500 focus:border-brand-500" placeholder="Add a default address..."></textarea>
                </div>
                <button type="button" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                  Update Profile
                </button>
             </form>
          </div>
        );
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="min-h-screen py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 pl-2 border-l-4 border-brand-500 animate-slide-in-left">My Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Mobile User Header */}
          <div className="lg:hidden bg-white/60 backdrop-blur-md rounded-2xl shadow-glass p-4 flex items-center justify-between border border-white/50 animate-fade-in-down">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold shadow-inner">
                 {user.name.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h2 className="font-bold text-gray-900 text-sm">{user.name}</h2>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
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
                 {user.name.charAt(0).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                  <h2 className="font-bold text-gray-900 truncate">{user.name}</h2>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
               <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/50 flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Bookings</div>
                    <div className="text-3xl font-extrabold text-gray-900">{userBookings.length}</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shadow-sm">
                    <Calendar size={28} />
                  </div>
               </div>
               <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/50 flex items-center justify-between">
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