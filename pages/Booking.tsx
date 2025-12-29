import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SERVICES, AMC_PLANS } from '../constants';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, FileCheck, Loader2, AlertCircle } from 'lucide-react';

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking, user } = useApp();
  
  const preSelectedServiceId = searchParams.get('service');
  const preSelectedPlanId = searchParams.get('plan');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Determine default type and ID
  const defaultType = preSelectedPlanId ? 'amc' : 'one-time';
  // If no params, default to first service
  const defaultId = preSelectedPlanId || preSelectedServiceId || (defaultType === 'one-time' ? SERVICES[0].id : AMC_PLANS[0].id);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    serviceType: defaultType,
    selectedId: defaultId,
    acType: 'Split',
    date: '',
    time: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field if it exists
    if (errors[e.target.name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleServiceTypeChange = (type: 'one-time' | 'amc') => {
    setFormData({ 
      ...formData, 
      serviceType: type, 
      selectedId: type === 'one-time' ? SERVICES[0].id : AMC_PLANS[0].id 
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time slot is required";
    if (!formData.selectedId) newErrors.selectedId = "Please select a service or plan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep(2);
    }
  };

  const confirmBooking = () => {
    setLoading(true);
    setTimeout(() => {
      // Create booking object with Pending status (handled in context)
      addBooking({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        serviceId: formData.serviceType === 'one-time' ? formData.selectedId : undefined,
        planId: formData.serviceType === 'amc' ? formData.selectedId : undefined,
        date: formData.date,
        time: formData.time,
        acType: formData.acType as any,
        notes: formData.notes
      });
      setLoading(false);
      setStep(3); // Success
    }, 1500);
  };

  const getSelectedItem = () => {
    if (formData.serviceType === 'one-time') {
      return SERVICES.find(s => s.id === formData.selectedId);
    }
    return AMC_PLANS.find(p => p.id === formData.selectedId);
  };

  const selectedItem = getSelectedItem();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10 animate-fade-in-down">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-white/60 text-gray-500'}`}>1</div>
          <div className={`w-16 h-1 rounded-full mx-2 ${step >= 2 ? 'bg-brand-600' : 'bg-white/40'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-white/60 text-gray-500'}`}>2</div>
          <div className={`w-16 h-1 rounded-full mx-2 ${step >= 3 ? 'bg-brand-600' : 'bg-white/40'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step >= 3 ? 'bg-green-600 text-white' : 'bg-white/60 text-gray-500'}`}>3</div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-glass border border-white/50 overflow-hidden animate-zoom-in">
          {/* STEP 1: Details Form */}
          {step === 1 && (
            <div className="p-8 md:p-10 animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book Your Service</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Service Selection Toggle */}
                <div className="flex bg-white/50 p-1.5 rounded-xl mb-8 border border-white/60">
                  <button
                    type="button"
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${formData.serviceType === 'one-time' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'}`}
                    onClick={() => handleServiceTypeChange('one-time')}
                  >
                    One-Time Service
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${formData.serviceType === 'amc' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'}`}
                    onClick={() => handleServiceTypeChange('amc')}
                  >
                    AMC Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select {formData.serviceType === 'one-time' ? 'Service' : 'Plan'}</label>
                    <div className="relative">
                      <select
                        name="selectedId"
                        value={formData.selectedId}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-900 appearance-none ${errors.selectedId ? 'border-red-500' : 'border-white/50'}`}
                      >
                        {formData.serviceType === 'one-time' 
                          ? SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)
                          : AMC_PLANS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)
                        }
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    {errors.selectedId && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.selectedId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">AC Type</label>
                    <div className="relative">
                      <select
                        name="acType"
                        value={formData.acType}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border-white/50 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 border bg-white/80 backdrop-blur-sm text-gray-900 appearance-none"
                      >
                        <option value="Split">Split AC</option>
                        <option value="Window">Window AC</option>
                        <option value="Cassette">Cassette AC</option>
                        <option value="Tower">Tower AC</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-brand-500"/>
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={`w-full pl-10 rounded-xl border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-900 ${errors.date ? 'border-red-500' : 'border-white/50'}`}
                      />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock size={18} className="text-brand-500"/>
                      </div>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className={`w-full pl-10 rounded-xl border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-900 appearance-none ${errors.time ? 'border-red-500' : 'border-white/50'}`}
                      >
                        <option value="">Select Time</option>
                        <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                        <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                        <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                        <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    {errors.time && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.time}</p>}
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-8 mt-8">
                  <h3 className="text-lg font-bold mb-6 text-gray-800">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-brand-500"/>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 rounded-xl border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-900 ${errors.name ? 'border-red-500' : 'border-white/50'}`}
                          placeholder="Your full name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={18} className="text-brand-500"/>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 rounded-xl border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-900 ${errors.phone ? 'border-red-500' : 'border-white/50'}`}
                          placeholder="10 digit mobile number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MapPin size={18} className="text-brand-500"/>
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full pl-10 rounded-xl border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-900 ${errors.address ? 'border-red-500' : 'border-white/50'}`}
                        placeholder="Complete address with landmark"
                      ></textarea>
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.address}</p>}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 text-lg hover:scale-[1.02]"
                >
                  Review Booking
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Booking Summary */}
          {step === 2 && (
            <div className="p-8 md:p-10 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Confirm Your Booking</h2>
              
              <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/60 mb-8 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-600">Service:</span>
                  <span className="font-bold text-brand-700 text-lg">{selectedItem?.title}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-600">AC Type:</span>
                  <span className="font-medium text-brand-700">{formData.acType}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200/50">
                  <span className="font-semibold text-gray-600">Date & Time:</span>
                  <span className="font-medium text-brand-700">{formData.date} | {formData.time}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">Address:</span>
                  <span className="font-medium text-gray-700 text-right text-sm ml-4 max-w-[200px]">{formData.address}</span>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 backdrop-blur-sm">
                    <FileCheck className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                       <h4 className="font-bold text-blue-900 text-sm">Booking Process</h4>
                       <p className="text-blue-800 text-sm mt-1">
                         Your booking will be sent to our admin team for approval. 
                         You will be contacted to confirm the final pricing and scope of work.
                       </p>
                    </div>
                 </div>
                 
                 <div className="mt-8 text-center">
                    {loading ? (
                      <button disabled className="w-full bg-gray-400 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                        <Loader2 className="animate-spin" /> Processing...
                      </button>
                    ) : (
                      <button onClick={confirmBooking} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 text-lg transition-transform hover:scale-[1.02]">
                        Confirm Booking
                      </button>
                    )}
                 </div>
                 
                 <div className="text-center mt-4">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-brand-600 underline font-medium">Back to details</button>
                 </div>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px] animate-zoom-in">
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-inner animate-pulse">
                  <CheckCircle size={56} />
               </div>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Sent!</h2>
               <p className="text-gray-600 mb-10 max-w-md text-lg">
                 Thank you, {formData.name}. Your request for <strong>{selectedItem?.title}</strong> has been received. 
               </p>
               <div className="flex gap-4">
                  <button onClick={() => navigate('/')} className="px-8 py-3 border border-gray-300 bg-white/50 rounded-xl font-bold hover:bg-white transition-colors">Back to Home</button>
                  <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-transform hover:scale-105">Go to Dashboard</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;