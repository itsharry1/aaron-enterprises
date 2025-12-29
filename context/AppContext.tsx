import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking, UserRole, BookingStatus } from '../types';

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: User) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'ac_services_current_user',
  ALL_USERS: 'ac_services_all_users', // Database of users
  BOOKINGS: 'ac_services_bookings'
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_123',
    userId: 'u_1',
    customerName: 'Rajesh Koothrappali',
    customerPhone: '9876543210',
    customerAddress: 'Flat 402, DLF Phase 4, Gurugram',
    serviceId: 'repair',
    date: '2023-11-20',
    time: '10:00 AM',
    status: BookingStatus.PENDING,
    acType: 'Split',
    notes: 'AC not cooling properly',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk_124',
    userId: 'u_2',
    customerName: 'Penny Smith',
    customerPhone: '9123456789',
    customerAddress: 'Villa 12, Nirvana Country, Gurugram',
    planId: 'standard',
    date: '2023-11-22',
    time: '02:00 PM',
    status: BookingStatus.CONFIRMED,
    acType: 'Window',
    createdAt: new Date().toISOString()
  }
];

// Initial Admin User for demo
const INITIAL_ADMIN: User = {
  id: 'admin_1',
  name: 'Admin User',
  email: 'admin@aaronenterprises.in',
  role: UserRole.ADMIN,
  password: 'password123',
  phone: '9999999999'
};

const INITIAL_CUSTOMER: User = {
  id: 'user_1',
  name: 'Demo User',
  email: 'user@gmail.com',
  role: UserRole.CUSTOMER,
  password: 'password123',
  phone: '8888888888'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const storedAllUsers = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);

    // Load Users DB
    if (storedAllUsers) {
      try {
        setAllUsers(JSON.parse(storedAllUsers));
      } catch (e) {
        console.error("Failed to parse users DB", e);
        setAllUsers([INITIAL_ADMIN, INITIAL_CUSTOMER]);
      }
    } else {
      const initialUsers = [INITIAL_ADMIN, INITIAL_CUSTOMER];
      setAllUsers(initialUsers);
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(initialUsers));
    }

    // Load Current Session
    if (storedCurrentUser) {
      try {
        setUser(JSON.parse(storedCurrentUser));
      } catch (e) {
        console.error("Failed to parse current user", e);
      }
    }

    // Load Bookings
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error("Failed to parse bookings from storage", e);
        setBookings(INITIAL_BOOKINGS);
      }
    } else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    
    setIsInitialized(true);
  }, []);

  // Persist current session
  useEffect(() => {
    if (isInitialized) {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  }, [user, isInitialized]);

  // Persist all users DB
  useEffect(() => {
    if (isInitialized && allUsers.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
    }
  }, [allUsers, isInitialized]);

  // Persist bookings on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    }
  }, [bookings, isInitialized]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      return { success: false, message: 'User not found. Please sign up.' };
    }

    if (foundUser.password !== password) {
      return { success: false, message: 'Invalid credentials.' };
    }

    setUser(foundUser);
    return { success: true };
  };

  const signup = async (userData: User): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = allUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: UserRole.CUSTOMER // Default to customer
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser); // Auto login after signup
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const addBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || null,
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <AppContext.Provider value={{ user, login, signup, logout, bookings, addBooking, updateBookingStatus }}>
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