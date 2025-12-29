
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password?: string; // Included for simulated auth logic
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface AMCPlan {
  id: string;
  title: string;
  subtitle?: string;
  duration: string;
  servicesCount: number;
  features: string[];
  recommended?: boolean;
}

export interface Booking {
  id: string;
  userId: string | null; // null if guest
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceId?: string; // If booking a specific service
  planId?: string; // If buying a plan
  date: string;
  time: string;
  status: BookingStatus;
  acType: 'Split' | 'Window' | 'Cassette' | 'Other';
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}
