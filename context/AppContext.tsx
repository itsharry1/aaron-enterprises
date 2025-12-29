import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Booking, UserRole, BookingStatus } from '../types';

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: User) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to get token
  const getToken = () => localStorage.getItem('token');

  const fetchBookings = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setBookings([]);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  }, []);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsInitialized(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // After user is loaded, fetch their bookings
        await fetchBookings();
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user", error);
      localStorage.removeItem('token');
    } finally {
      setIsInitialized(true);
    }
  }, [fetchBookings]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data);
        await fetchBookings(); // Refresh bookings for logged in user
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const signup = async (userData: User): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setBookings([]);
  };

  const addBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBookingData)
      });

      if (response.ok) {
        // Refresh bookings list
        await fetchBookings();
      } else {
        console.error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking", error);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Optimistic update or refresh
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (error) {
      console.error("Error updating booking", error);
    }
  };

  const refreshData = () => {
    fetchBookings();
  };

  return (
    <AppContext.Provider value={{ user, login, signup, logout, bookings, addBooking, updateBookingStatus, refreshData }}>
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