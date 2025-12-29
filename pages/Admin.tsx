import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { UserRole, BookingStatus } from '../types';
import { Check, X, Clock, Filter, Search, RefreshCw } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, bookings, updateBookingStatus, refreshData } = useApp();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh data on mount to ensure we see latest bookings from other sessions
  useEffect(() => {
    refreshData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/login" />;
  }

  const filteredBookings = statusFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const pendingCount = bookings.filter(b => b.status === BookingStatus.PENDING).length;
  const confirmedCount = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
  const completedCount = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
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

        {/* Dynamic Stats Row - Click to filter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in-up">
           <div 
             onClick={() => setStatusFilter('ALL')}
             className={`bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border transition-all cursor-pointer hover:-translate-y-1 ${statusFilter === 'ALL' ? 'border-brand-500 ring-2 ring-brand-500 ring-opacity-50' : 'border-white/50 hover:bg-white/80'}`}
           >
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Total Bookings</h3>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{bookings.length}</p>
              <span className="text-xs text-gray-400 mt-1 block font-medium">Click to view all</span>
           </div>
           <div 
             onClick={() => setStatusFilter(BookingStatus.PENDING)}
             className={`bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border transition-all cursor-pointer hover:-translate-y-1 ${statusFilter === BookingStatus.PENDING ? 'border-orange-500 ring-2 ring-orange-500 ring-opacity-50' : 'border-white/50 hover:bg-white/80'}`}
           >
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Pending Requests</h3>
              <p className="text-3xl font-extrabold text-orange-500 mt-2">{pendingCount}</p>
              <span className="text-xs text-gray-400 mt-1 block font-medium">Action required</span>
           </div>
           <div 
             onClick={() => setStatusFilter(BookingStatus.CONFIRMED)}
             className={`bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border transition-all cursor-pointer hover:-translate-y-1 ${statusFilter === BookingStatus.CONFIRMED ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-white/50 hover:bg-white/80'}`}
           >
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Confirmed</h3>
              <p className="text-3xl font-extrabold text-blue-500 mt-2">{confirmedCount}</p>
              <span className="text-xs text-gray-400 mt-1 block font-medium">Scheduled</span>
           </div>
           <div 
             onClick={() => setStatusFilter(BookingStatus.COMPLETED)}
             className={`bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-glass border transition-all cursor-pointer hover:-translate-y-1 ${statusFilter === BookingStatus.COMPLETED ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' : 'border-white/50 hover:bg-white/80'}`}
           >
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Completed</h3>
              <p className="text-3xl font-extrabold text-green-500 mt-2">{completedCount}</p>
              <span className="text-xs text-gray-400 mt-1 block font-medium">Finished jobs</span>
           </div>
        </div>

        {/* Filters and Search Bar Mock */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <h2 className="font-bold text-gray-900 text-xl pl-2 border-l-4 border-brand-500">
             {statusFilter === 'ALL' ? 'All Bookings' : `${statusFilter} Bookings`}
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
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass border border-white/50 overflow-hidden animate-zoom-in" style={{ animationDelay: '0.3s' }}>
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
                                onClick={() => updateBookingStatus(booking.id, BookingStatus.CONFIRMED)}
                                className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors shadow-sm"
                                title="Approve & Confirm"
                              >
                               <Check size={18} />
                             </button>
                             <button 
                                onClick={() => updateBookingStatus(booking.id, BookingStatus.CANCELLED)}
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