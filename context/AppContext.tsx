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
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load initial data
  useEffect(() => {
    // Load active session
    const storedUser = localStorage.getItem('ac_app_session_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load bookings
    const storedBookings = localStorage.getItem('ac_app_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    localStorage.setItem('ac_app_bookings', JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = JSON.parse(localStorage.getItem('ac_app_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...sessionUser } = foundUser;
      localStorage.setItem('ac_app_session_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    }

    // Default Admin for easy access if not registered
    if (email === 'admin@aaroon.com' && password === 'admin') {
      const adminUser: User = { 
        id: 'admin-default', 
        name: 'Admin', 
        email: 'admin@aaroon.com', 
        role: UserRole.ADMIN,
        phone: '9999999999'
      };
      localStorage.setItem('ac_app_session_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password' };
  }, []);

  const signup = useCallback(async (userData: User): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const users = JSON.parse(localStorage.getItem('ac_app_users') || '[]');
    
    if (users.some((u: any) => u.email === userData.email)) {
      return { success: false, message: 'User already exists' };
    }

    // Determine role based on email keyword for demo purposes
    const role = userData.email.includes('admin') || userData.email.includes('aaroon') ? UserRole.ADMIN : UserRole.CUSTOMER;

    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role
    };

    users.push(newUser);
    localStorage.setItem('ac_app_users', JSON.stringify(users));

    // Auto login
    const { password, ...sessionUser } = newUser;
    localStorage.setItem('ac_app_session_user', JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ac_app_session_user');
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Password reset link sent to your email.' };
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }, []);

  const addBooking = useCallback((bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: BookingStatus.PENDING,
      userId: user?.id || null
    };

    const currentBookings = JSON.parse(localStorage.getItem('ac_app_bookings') || '[]');
    const updatedBookings = [newBooking, ...currentBookings];
    saveBookings(updatedBookings);
  }, [user]);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    const currentBookings = JSON.parse(localStorage.getItem('ac_app_bookings') || '[]');
    const updatedBookings = currentBookings.map((b: Booking) => 
      b.id === id ? { ...b, status } : b
    );
    saveBookings(updatedBookings);
  }, []);

  const refreshData = useCallback(() => {
    const storedBookings = localStorage.getItem('ac_app_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

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