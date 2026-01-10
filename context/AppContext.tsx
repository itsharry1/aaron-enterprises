import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Booking, UserRole, BookingStatus } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: User) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to map DB columns (snake_case) to App types (camelCase)
const mapBookingFromDB = (data: any): Booking => ({
  id: data.id,
  userId: data.user_id,
  customerName: data.customer_name,
  customerPhone: data.customer_phone,
  customerAddress: data.customer_address,
  bookingType: data.booking_type,
  serviceId: data.service_id,
  planId: data.plan_id,
  purchaseDetails: data.purchase_details,
  date: data.date,
  time: data.time,
  status: data.status as BookingStatus,
  acType: data.ac_type,
  notes: data.notes,
  createdAt: data.created_at
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // --- Auth Logic ---

  const loadUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { user: supabaseUser } = session;
      const role = supabaseUser.user_metadata?.role as UserRole || UserRole.CUSTOMER;
      const name = supabaseUser.user_metadata?.name || 'User';
      const phone = supabaseUser.user_metadata?.phone || '';

      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name,
        phone,
        role
      };
      
      setUser(userData);
      // Fetch bookings after user is loaded
      fetchBookings(userData.id, userData.role);
    } else {
      setUser(null);
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { user: supabaseUser } = session;
        const role = supabaseUser.user_metadata?.role as UserRole || UserRole.CUSTOMER;
        const userData = {
           id: supabaseUser.id,
           email: supabaseUser.email || '',
           name: supabaseUser.user_metadata?.name || 'User',
           phone: supabaseUser.user_metadata?.phone || '',
           role
        };
        setUser(userData);
        fetchBookings(userData.id, userData.role);
      } else {
        setUser(null);
        setBookings([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser]);

  // --- Realtime Subscription ---
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBooking = mapBookingFromDB(payload.new);
            // Verify if this booking belongs to user or if user is admin
            if (user.role === UserRole.ADMIN || newBooking.userId === user.id) {
               setBookings(prev => {
                 // Avoid duplicates if addBooking already optimistically added it
                 if (prev.find(b => b.id === newBooking.id)) return prev;
                 return [newBooking, ...prev];
               });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedBooking = mapBookingFromDB(payload.new);
            if (user.role === UserRole.ADMIN || updatedBooking.userId === user.id) {
               setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
            }
          } else if (payload.eventType === 'DELETE') {
             setBookings(prev => prev.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }
    
    return { success: true };
  };

  const signup = async (userData: User): Promise<{ success: boolean; message?: string }> => {
    // Determine role (simple check for admin email for demo purposes)
    const role = userData.email.includes('admin') || userData.email.includes('aaron') ? UserRole.ADMIN : UserRole.CUSTOMER;

    const { error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          role: role
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookings([]);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/resetpassword/`,
    });

    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const resetPassword = async (token: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  // --- Database Logic ---

  const fetchBookings = async (currentUserId?: string, role?: UserRole) => {
    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

      if (role !== UserRole.ADMIN && currentUserId) {
        query = query.eq('user_id', currentUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      if (data) {
        setBookings(data.map(mapBookingFromDB));
      }
    } catch (err) {
      console.error("Unexpected error fetching bookings:", err);
    }
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user?.id || null, 
            customer_name: bookingData.customerName,
            customer_phone: bookingData.customerPhone,
            customer_address: bookingData.customerAddress,
            booking_type: bookingData.bookingType,
            service_id: bookingData.serviceId,
            plan_id: bookingData.planId,
            purchase_details: bookingData.purchaseDetails,
            date: bookingData.date,
            time: bookingData.time,
            status: 'Pending',
            ac_type: bookingData.acType,
            notes: bookingData.notes
          }
        ])
        .select();

      if (error) {
        console.error('Error adding booking:', error);
        alert('Failed to save booking. Please try again.');
        return;
      }

      // We rely on Realtime subscription to update state, 
      // but to ensure immediate UI feedback even if realtime is slow/off:
      if (data) {
        const newBooking = mapBookingFromDB(data[0]);
        setBookings(prev => {
            if (prev.find(b => b.id === newBooking.id)) return prev;
            return [newBooking, ...prev];
        });
      }
    } catch (err) {
      console.error("Unexpected error adding booking:", err);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }
      
      // Optimistic update (Realtime will confirm it)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      console.error("Unexpected error updating booking:", err);
    }
  };

  const refreshData = () => {
    if (user) {
      fetchBookings(user.id, user.role);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, login, signup, logout, forgotPassword, resetPassword, 
      bookings, addBooking, updateBookingStatus, refreshData 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};