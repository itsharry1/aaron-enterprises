import { Service, AMCPlan, Review } from './types';

export const SERVICES: Service[] = [
  {
    id: 'install',
    title: 'AC Installation',
    description: 'Professional installation for Split and Window ACs with proper sealing and testing.',
    image: 'https://picsum.photos/800/600?random=1',
    features: ['Wall drilling & fitting', 'Gas pressure check', 'Leakage testing', '30-day installation warranty']
  },
  {
    id: 'repair',
    title: 'AC Repair',
    description: 'Diagnosis and repair of all AC issues including cooling, noise, and water leakage.',
    image: 'https://picsum.photos/800/600?random=2',
    features: ['Advanced diagnosis', 'PCB repair support', 'Genuine spare parts', '90-day service warranty']
  },
  {
    id: 'service',
    title: 'AC Cleaning',
    description: 'Comprehensive wet and dry servicing using jet pumps for deep cleaning.',
    image: 'https://picsum.photos/800/600?random=3',
    features: ['Filter cleaning', 'Coil washing', 'Drain pipe cleaning', 'Performance check']
  },
  {
    id: 'gas',
    title: 'Gas Refilling',
    description: 'Top-up or full gas refilling for R22, R32, and R410A refrigerants.',
    image: 'https://picsum.photos/800/600?random=4',
    features: ['Leak detection', 'Vacuuming', 'High-quality refrigerant', 'Cooling efficiency check']
  },
  {
    id: 'emergency',
    title: 'Emergency Repair',
    description: 'Urgent priority service for critical breakdown situations.',
    image: 'https://picsum.photos/800/600?random=6',
    features: ['Priority arrival', 'Senior technician', 'All brands supported', 'Immediate diagnosis']
  },
  {
    id: 'uninstall',
    title: 'Uninstallation',
    description: 'Safe removal of AC units with gas locking technology.',
    image: 'https://picsum.photos/800/600?random=5',
    features: ['Pump down gas lock', 'Pipe safety', 'Hole sealing', 'Packing assistance']
  }
];

export const AMC_PLANS: AMCPlan[] = [
  {
    id: 'basic',
    title: 'Basic',
    subtitle: 'Perfect for individual homeowners',
    duration: '1 Year',
    servicesCount: 1,
    features: ['Single AC service', 'Basic inspection', 'Filter cleaning', '30-day warranty', 'Email support'],
    recommended: false
  },
  {
    id: 'premium',
    title: 'Premium',
    subtitle: 'Best for comprehensive coverage',
    duration: '1 Year',
    servicesCount: 4,
    features: ['4 scheduled visits', 'Priority support', 'Gas top-up included', 'Deep cleaning', '20% off repairs', '90-day warranty', 'WhatsApp support'],
    recommended: true
  },
  {
    id: 'business',
    title: 'Business',
    subtitle: 'For offices and commercial spaces',
    duration: '1 Year',
    servicesCount: 0,
    features: ['Multiple AC units', 'Dedicated manager', 'Same-day response', 'Smart monitoring', 'Monthly reports', 'Custom SLA', '24/7 phone support'],
    recommended: false
  }
];

export const TESTIMONIALS: Review[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    rating: 5,
    comment: 'Excellent service! The technician arrived on time and fixed my Voltas AC cooling issue in 30 minutes.',
    date: '2023-10-15'
  },
  {
    id: '2',
    name: 'Priya Patel',
    rating: 4,
    comment: 'Took the Standard AMC plan. Very happy with the first service. Cleaning was thorough.',
    date: '2023-11-02'
  },
  {
    id: '3',
    name: 'Amit Singh',
    rating: 5,
    comment: 'Best AC installation service in the city. Professional tools and neat work. Highly recommended.',
    date: '2023-12-10'
  }
];

export const CITIES = [
  'Gurugram'
];

export const BRANDS = [
  'Voltas', 'LG', 'Daikin', 'Samsung', 'Hitachi', 'Blue Star', 'Panasonic', 'Carrier', 'Godrej', 'Mitsubishi'
];