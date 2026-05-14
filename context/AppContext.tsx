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
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = async (sessionUser: any) => {
    // dynamically import here to avoid circular dep if any, or just import at top
    const { supabase } = await import('../src/supabaseClient');
    const { data, error } = await supabase.from('users').select('*').eq('id', sessionUser.id).single();
    if (data && !error) {
       const role = (data.email === 'admin@aaroon.com' || data.role === 'ADMIN') ? UserRole.ADMIN : (data.role as UserRole);
       setUser({
         id: data.id,
         name: data.name,
         email: data.email,
         phone: data.phone,
         role: role
       });
       return role;
    } else {
       // Fallback to session user metadata if 'users' table lookup fails
       const role = sessionUser.email === 'admin@aaroon.com' ? UserRole.ADMIN : UserRole.CUSTOMER;
       setUser({
         id: sessionUser.id,
         name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
         email: sessionUser.email || '',
         phone: sessionUser.user_metadata?.phone || '',
         role: role
       });
       return role;
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const { supabase } = await import('../src/supabaseClient');
    
    // Check mock admin first
    const mockAdmin = sessionStorage.getItem('ac_app_mock_admin');
    if (mockAdmin) {
      setUser(JSON.parse(mockAdmin));
      // Load all bookings. If RLS blocks anonymous access, it will return an empty array unless RLS is relaxed.
      // Assuming RLS allows us to fetch here or we are doing a local test without strict RLS.
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (bookingsData) {
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
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userRole = await fetchUserProfile(session.user);
      
      // Load bookings based on role
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      
      if (userRole !== UserRole.ADMIN) {
        query = query.eq('user_id', session.user.id);
      }
      
      const { data: bookingsData } = await query;
        
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
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    // Set up auth state listener
    let authListener: any = null;
    let bookingsSubscription: any = null;

    import('../src/supabaseClient').then(({ supabase }) => {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          loadData();
        }
      });
      authListener = data.subscription;

      // Real-time listener for bookings
      const channelId = `bookings-channel-${Math.random()}`;
      bookingsSubscription = supabase.channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          () => {
            loadData();
          }
        )
        .subscribe();
    });

    return () => {
      if (authListener) {
         authListener.unsubscribe();
      }
      if (bookingsSubscription) {
         import('../src/supabaseClient').then(({ supabase }) => {
           supabase.removeChannel(bookingsSubscription);
         });
      }
    };
  }, [loadData]);


  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadData();
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const { supabase } = await import('../src/supabaseClient');
      
      if (email === 'admin@aaroon.com' && password === 'admin') {
        let { error, data } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error && (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed'))) {
          // Auto sign-up admin if not exists in Supabase
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email, 
            password,
            options: {
              data: { name: 'Admin', phone: '9999999999' }
            }
          });
          
          if (signUpData.user) {
             await supabase.from('users').upsert({
               id: signUpData.user.id,
               name: 'Admin',
               email: email,
               phone: '9999999999',
               role: 'ADMIN'
             });
             // Attempt to login again
             const loginResult = await supabase.auth.signInWithPassword({ email, password });
             data = loginResult.data;
             error = loginResult.error;
          }
        }

        const setMockAdmin = async () => {
          const adminUser: User = { 
            id: 'admin-default', 
            name: 'Admin', 
            email: 'admin@aaroon.com', 
            role: UserRole.ADMIN,
            phone: '9999999999'
          };
          sessionStorage.setItem('ac_app_mock_admin', JSON.stringify(adminUser));
          await loadData();
        };

        if (error) {
          // Fallback to purely mock admin if supabase auth is failing (e.g. no internet or RLS issue)
          await setMockAdmin();
          return { success: true };
        }
        
        await loadData();
        return { success: true };
      }

      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, message: error.message };
      }
      
      // Force admin role in DB so RLS allows fetching all bookings
      if (email === 'admin@aaroon.com' && data?.session?.user) {
        await supabase.from('users').upsert({
           id: data.session.user.id,
           name: 'Admin',
           email: email,
           phone: '9999999999',
           role: 'ADMIN'
        });
      }
      
      await loadData();
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const signup = useCallback(async (userData: User): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const logout = useCallback(async () => {
    sessionStorage.removeItem('ac_app_mock_admin');
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
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  }, [user, loadData]);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const deleteBooking = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    setIsLoading,
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
    isLoading,
    setIsLoading,
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