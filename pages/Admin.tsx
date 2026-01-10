import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { UserRole, BookingStatus } from '../types';
import { Check, X, Clock, Filter, Search, RefreshCw, AlertCircle, Calendar, MapPin, FileText, CheckCircle, XCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, bookings, updateBookingStatus, refreshData } = useApp();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Refresh data on mount to ensure we see latest bookings from other sessions
  useEffect(() => {
    refreshData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleStatusUpdate = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    if (newStatus === BookingStatus.CONFIRMED) {
      setNotification("Booking approved! Customer has been notified.");
      setTimeout(() => setNotification(null), 4000);
    } else if (newStatus === BookingStatus.CANCELLED) {
      setNotification("Booking rejected. Status updated.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/login" />;
  }

  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);

  // Filter for the main table
  const filteredBookings = statusFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const pendingCount = bookings.filter(b => b.status === BookingStatus.PENDING).length;
  const confirmedCount = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
  const completedCount = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
  const cancelledCount = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;

  const StatCard = ({ 
    title, 
    count, 
    icon: Icon, 
    colorClass, 
    bgClass, 
    filterType 
  }: { 
    title: string, 
    count: number, 
    icon: any, 
    colorClass: string, 
    bgClass: string,
    filterType: BookingStatus | 'ALL'
  }) => (
    <div 
      onClick={() => setStatusFilter(filterType)}
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all cursor-pointer hover:-translate-y-1 group ${
        statusFilter === filterType 
          ? `ring-2 ring-offset-2 ${colorClass.replace('text-', 'ring-')}` 
          : 'border-white/50 hover:border-white/80'
      } bg-white/70 backdrop-blur-md shadow-glass`}
    >
       <div className={`absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={64} />
       </div>
       <div className="relative z-10 flex flex-col justify-between h-full">
          <div className={`p-3 rounded-xl w-fit mb-4 ${bgClass} ${colorClass}`}>
             <Icon size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{count}</h3>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 md:right-8 z-50 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
          <div className="bg-green-500 rounded-full p-1"><Check size={14} strokeWidth={3} /></div>
          <span className="font-medium">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/50 animate-fade-in-down">
          <div>
             <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
             <p className="text-gray-600 font-medium">Manage bookings, technicians and services</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleManualRefresh}
              className={`p-2 rounded-full bg-white/50 hover:bg-white text-gray-600 hover:text-brand-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <div className="bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-white/60 font-bold flex items-center gap-2 text-sm text-gray-800">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
               Admin: {user.name}
            </div>
          </div>
        </header>

        {/* Action Required Section - Prominent Display for Pending */}
        {pendingBookings.length > 0 && (
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-orange-100 p-2 rounded-lg text-orange-600 animate-pulse">
                 <AlertCircle size={24} />
               </div>
               <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
               <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/30">{pendingBookings.length} New</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingBookings.map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-orange-500 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h3 className="font-bold text-gray-900 text-lg">{booking.customerName}</h3>
                         <p className="text-sm text-gray-500 font-medium">{booking.serviceId ? 'One-time Service' : 'AMC Plan Subscription'}</p>
                      </div>
                      <span className="bg-orange-50 text-orange-700 text-[10px] font-extrabold px-2 py-1 rounded border border-orange-100 uppercase tracking-wider">Pending</span>
                   </div>
                   
                   <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2.5 text-sm text-gray-700">
                         <Calendar size={16} className="text-brand-500" /> <span className="font-semibold">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-gray-700">
                         <Clock size={16} className="text-brand-500" /> <span>{booking.time}</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-gray-700">
                         <MapPin size={16} className="text-brand-500 mt-0.5 shrink-0" /> <span className="line-clamp-2">{booking.customerAddress}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        Requested: {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                   </div>
                   
                   <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, BookingStatus.CONFIRMED)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, BookingStatus.CANCELLED)}
                        className="flex-1 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <X size={18} /> Reject
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <StatCard 
             title="Total Bookings" 
             count={bookings.length} 
             icon={FileText} 
             colorClass="text-brand-600" 
             bgClass="bg-brand-50"
             filterType="ALL"
           />
           <StatCard 
             title="Pending" 
             count={pendingCount} 
             icon={AlertCircle} 
             colorClass="text-orange-600" 
             bgClass="bg-orange-50"
             filterType={BookingStatus.PENDING}
           />
           <StatCard 
             title="Confirmed" 
             count={confirmedCount} 
             icon={CheckCircle} 
             colorClass="text-blue-600" 
             bgClass="bg-blue-50"
             filterType={BookingStatus.CONFIRMED}
           />
           <StatCard 
             title="Completed" 
             count={completedCount} 
             icon={Check} 
             colorClass="text-green-600" 
             bgClass="bg-green-50"
             filterType={BookingStatus.COMPLETED}
           />
           <StatCard 
             title="Cancelled" 
             count={cancelledCount} 
             icon={XCircle} 
             colorClass="text-red-600" 
             bgClass="bg-red-50"
             filterType={BookingStatus.CANCELLED}
           />
        </div>

        {/* Filters and Search Bar Mock */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
           <h2 className="font-bold text-gray-900 text-xl pl-2 border-l-4 border-brand-500">
             {statusFilter === 'ALL' ? 'All Booking History' : `${statusFilter} Bookings`}
           </h2>
           <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search customer..." 
                   className="pl-10 pr-4 py-2.5 border border-white/60 bg-white/60 backdrop-blur-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 w-full shadow-sm"
                 />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl text-gray-700 hover:bg-white font-medium shadow-sm transition-colors">
                 <Filter size={18} /> Filter
              </button>
           </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass border border-white/50 overflow-hidden animate-zoom-in" style={{ animationDelay: '0.4s' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/60">
              <thead className="bg-white/40">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service Details</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{booking.customerName}</span>
                        <span className="text-sm text-gray-600 font-medium">{booking.customerPhone}</span>
                        <span className="text-xs text-gray-400 mt-1 max-w-[150px] truncate">{booking.customerAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-gray-900">{booking.serviceId ? 'Service' : 'AMC Plan'}</div>
                      <div className="text-sm text-gray-500 capitalize">{booking.serviceId || booking.planId}</div>
                      <div className="text-xs inline-block bg-white/50 border border-white/60 px-2 py-0.5 rounded mt-1 text-gray-600 font-medium">{booking.acType}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      <div className="font-bold text-gray-900">{booking.date}</div>
                      <div className="font-medium">{booking.time}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide ${
                        booking.status === BookingStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                        booking.status === BookingStatus.PENDING ? 'bg-orange-100 text-orange-800' :
                        booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                       <div className="flex gap-2">
                         {booking.status === BookingStatus.PENDING && (
                           <>
                             <button 
                                onClick={() => handleStatusUpdate(booking.id, BookingStatus.CONFIRMED)}
                                className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors shadow-sm"
                                title="Approve & Confirm"
                              >
                               <Check size={18} />
                             </button>
                             <button 
                                onClick={() => handleStatusUpdate(booking.id, BookingStatus.CANCELLED)}
                                className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors shadow-sm"
                                title="Reject"
                             >
                               <X size={18} />
                             </button>
                           </>
                         )}
                         {booking.status === BookingStatus.CONFIRMED && (
                            <button 
                              onClick={() => updateBookingStatus(booking.id, BookingStatus.COMPLETED)}
                              className="text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors text-xs font-bold"
                            >
                              <Clock size={14} /> Mark Done
                            </button>
                         )}
                         {booking.status === BookingStatus.COMPLETED && (
                            <span className="text-green-600 font-bold text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-100"><Check size={14}/> Done</span>
                         )}
                         {booking.status === BookingStatus.CANCELLED && (
                            <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-md border border-red-100">Cancelled</span>
                         )}
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No bookings found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;