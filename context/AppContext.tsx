import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Booking, UserRole, BookingStatus } from '../types';

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: User) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchUserProfile = async (userId: string) => {
    // dynamically import here to avoid circular dep if any, or just import at top
    const { supabase } = await import('../src/supabaseClient');
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data && !error) {
       setUser({
         id: data.id,
         name: data.name,
         email: data.email,
         phone: data.phone,
         role: data.role as UserRole
       });
    } else {
       setUser(null);
    }
  };

  const loadData = useCallback(async () => {
    const { supabase } = await import('../src/supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserProfile(session.user.id);
      
      // Load bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (bookingsData) {
        // Map database fields to our frontend camelCase types
        const formattedBookings: Booking[] = bookingsData.map(b => ({
          id: b.id,
          userId: b.user_id,
          customerName: b.customer_name,
          customerPhone: b.customer_phone,
          customerAddress: b.customer_address,
          bookingType: b.booking_type,
          serviceId: b.service_id,
          planId: b.plan_id,
          purchaseDetails: b.purchase_details,
          date: b.date,
          time: b.time,
          status: b.status,
          acType: b.ac_type,
          notes: b.notes,
          createdAt: b.created_at
        }));
        setBookings(formattedBookings);
      }
    } else {
      setUser(null);
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Set up auth state listener
    let authListener: any = null;
    import('../src/supabaseClient').then(({ supabase }) => {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          loadData();
        }
      });
      authListener = data.subscription;
    });

    return () => {
      if (authListener) {
         authListener.unsubscribe();
      }
    };
  }, [loadData]);


  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const { supabase } = await import('../src/supabaseClient');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, message: error.message };
    }
    await loadData();
    return { success: true };
  }, [loadData]);

  const signup = useCallback(async (userData: User): Promise<{ success: boolean; message?: string }> => {
    const { supabase } = await import('../src/supabaseClient');
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      // Create user profile in 'users' table
      const { error: profileError } = await supabase.from('users').insert([{
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: UserRole.CUSTOMER
      }]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }

    await loadData();
    return { success: true };
  }, [loadData]);

  const logout = useCallback(async () => {
    const { supabase } = await import('../src/supabaseClient');
    await supabase.auth.signOut();
    setUser(null);
    setBookings([]);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const { supabase } = await import('../src/supabaseClient');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
       return { success: false, message: error.message };
    }
    return { success: true, message: 'Password reset link sent to your email.' };
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    const { supabase } = await import('../src/supabaseClient');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
       return { success: false, message: error.message };
    }
    return { success: true };
  }, []);

  const addBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    const newBooking = {
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
      status: BookingStatus.PENDING,
      ac_type: bookingData.acType,
      notes: bookingData.notes
    };

    const { supabase } = await import('../src/supabaseClient');
    const { error } = await supabase
      .from('bookings')
      .insert([newBooking]);

    if (error) {
      console.error('Error adding booking:', error);
      return;
    }
    
    await loadData();
  }, [user, loadData]);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    const { supabase } = await import('../src/supabaseClient');
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error("Error updating booking status", error);
      return;
    }
    await loadData();
  }, [loadData]);

  const deleteBooking = useCallback(async (id: string) => {
    const { supabase } = await import('../src/supabaseClient');
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting booking", error);
      return;
    }
    await loadData();
  }, [loadData]);


  const value = useMemo(() => ({
    user, 
    login, 
    signup, 
    logout, 
    forgotPassword, 
    resetPassword, 
    bookings, 
    addBooking, 
    updateBookingStatus, 
    deleteBooking,
    refreshData
  }), [
    user, 
    bookings, 
    login, 
    signup, 
    logout, 
    forgotPassword, 
    resetPassword, 
    addBooking, 
    updateBookingStatus, 
    deleteBooking,
    refreshData
  ]);

  return (
    <AppContext.Provider value={value}>
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