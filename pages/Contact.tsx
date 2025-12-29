import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the email subject
    const subject = `New Inquiry from ${formData.name} - M/S Aaron Enterprises`;
    
    // Construct the email body with clear formatting
    const body = `Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

Message:
${formData.message}`;

    // Create the mailto link with encoded parameters
    const mailtoLink = `mailto:aaronenterprisesae@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open user's email client
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">Get In Touch</h1>
          <p className="text-lg text-gray-600">We are here to help you. Reach out to M/S Aaron Enterprises for any queries or support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/50 hover:shadow-glass-hover transition-shadow duration-300">
               <h3 className="text-xl font-bold text-gray-900 mb-8">Contact Information</h3>
               <div className="space-y-8">
                  <div className="flex items-start gap-5 group">
                     <div className="bg-brand-100/80 p-3.5 rounded-2xl text-brand-600 shadow-sm border border-brand-200 group-hover:scale-110 transition-transform"><Phone size={24} /></div>
                     <div>
                        <p className="font-bold text-gray-900 text-lg">Phone Support</p>
                        <p className="text-gray-600 font-medium">8077419349, 8826613593</p>
                        <p className="text-gray-500 text-sm mt-1">Mon-Sat 9am to 7pm</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                     <div className="bg-green-100/80 p-3.5 rounded-2xl text-green-600 shadow-sm border border-green-200 group-hover:scale-110 transition-transform"><MessageCircle size={24} /></div>
                     <div>
                        <p className="font-bold text-gray-900 text-lg">WhatsApp</p>
                        <p className="text-gray-600 font-medium">8077419349, 8826613593</p>
                        <p className="text-gray-500 text-sm mt-1">24/7 Chat Support</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                     <div className="bg-orange-100/80 p-3.5 rounded-2xl text-orange-600 shadow-sm border border-orange-200 group-hover:scale-110 transition-transform"><Mail size={24} /></div>
                     <div>
                        <p className="font-bold text-gray-900 text-lg">Email</p>
                        <p className="text-gray-600 font-medium break-all">aaronenterprisesae@gmail.com</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                     <div className="bg-blue-100/80 p-3.5 rounded-2xl text-blue-600 shadow-sm border border-blue-200 group-hover:scale-110 transition-transform"><MapPin size={24} /></div>
                     <div>
                        <p className="font-bold text-gray-900 text-lg">Head Office</p>
                        <p className="text-gray-600 font-medium">H.No. 1685,559, Gali no. 7, Laxman Vihar Ph-2, Near Airtel Tower, Gurugram- 122001 (HR)</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-2xl border border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock /> Business Hours</h3>
               <ul className="space-y-4 text-blue-100">
                  <li className="flex justify-between border-b border-gray-700 pb-3">
                    <span className="font-medium">Monday - Saturday</span> 
                    <span className="font-bold">09:00 AM - 08:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-700 pb-3">
                    <span className="font-medium text-red-300">Sunday</span> 
                    <span className="font-bold text-red-300">Closed</span>
                  </li>
               </ul>
            </div>
          </div>

          {/* Map & Form */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/50 animate-slide-in-right">
             <h3 className="text-xl font-bold text-gray-900 mb-8">Send us a Message</h3>
             <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border-white/60 border px-4 py-3 focus:ring-brand-500 focus:border-brand-500 bg-white/60 shadow-inner placeholder-gray-400 transition-all" 
                        placeholder="Your Name" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border-white/60 border px-4 py-3 focus:ring-brand-500 focus:border-brand-500 bg-white/60 shadow-inner placeholder-gray-400 transition-all" 
                        placeholder="Mobile Number" 
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                   <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border-white/60 border px-4 py-3 focus:ring-brand-500 focus:border-brand-500 bg-white/60 shadow-inner placeholder-gray-400 transition-all" 
                      placeholder="your@email.com" 
                    />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                   <textarea 
                      rows={4} 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border-white/60 border px-4 py-3 focus:ring-brand-500 focus:border-brand-500 bg-white/60 shadow-inner placeholder-gray-400 transition-all" 
                      placeholder="How can we help you?"
                   ></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02] flex items-center justify-center gap-2">
                   Send Message <Send size={18} />
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;