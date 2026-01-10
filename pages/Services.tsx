import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, Gauge, Wrench, Activity, Wind, Info, ChevronRight, Check, ShoppingBag } from 'lucide-react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  const navigate = useNavigate();

  // Map service IDs to icons for visual consistency
  const iconMap: Record<string, any> = {
    'install': Wind,
    'repair': Wrench,
    'service': Sparkles,
    'gas': Gauge,
    'emergency': Activity,
    'uninstall': Wrench,
    'ac-sale': ShoppingBag
  };

  const handleBookClick = (serviceId: string) => {
    if (serviceId === 'ac-sale') {
      navigate('/shop-ac');
    } else {
      navigate(`/book?service=${serviceId}`);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional AC services tailored to your needs. Contact us for a custom quote.
          </p>
        </div>

        {/* AMC Banner */}
        <div 
          onClick={() => navigate('/amc')}
          className="bg-gray-900/90 backdrop-blur-md rounded-3xl p-10 mb-16 shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden group border border-white/10 animate-zoom-in"
        >
           <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                 <div className="bg-brand-500/20 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Calendar size={36} className="text-brand-300" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">Annual Maintenance Contracts</h2>
                    <p className="text-gray-300 text-lg">Get year-round protection, priority support, and regular servicing.</p>
                 </div>
              </div>
              <button className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-10 rounded-full transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-105">
                 View Plans <ChevronRight size={20} />
              </button>
           </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.id] || Wrench;
            const isSale = service.id === 'ac-sale';
            
            return (
              <div 
                key={service.id}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-glass border border-white/50 overflow-hidden hover:shadow-glass-hover hover:bg-white/80 transition-all duration-300 flex flex-col group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Header */}
                <div className="p-8 border-b border-gray-100/50 bg-white/30">
                   <div className="flex justify-between items-start mb-6">
                      <div className="bg-white p-4 rounded-2xl text-brand-600 shadow-sm border border-white/80 group-hover:scale-110 transition-transform duration-300">
                         <Icon size={32} strokeWidth={1.5} />
                      </div>
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                   <p className="text-gray-600 leading-relaxed h-12 overflow-hidden line-clamp-2">
                     {service.description}
                   </p>
                </div>

                {/* Features */}
                <div className="p-8 flex-grow">
                   <div className="flex items-center gap-2 mb-5 text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <Info size={16} className="text-brand-500" />
                      Key Features
                   </div>
                   
                   <div className="flex flex-wrap gap-y-3">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm w-full">
                           <div className="bg-green-100/50 p-1 rounded-full text-green-600 mt-0.5">
                             <Check size={12} strokeWidth={3} /> 
                           </div>
                           <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Action */}
                <div className="p-6 bg-white/40 border-t border-white/60">
                   <button 
                     onClick={() => handleBookClick(service.id)}
                     className={`w-full bg-white hover:bg-brand-50 text-brand-700 font-bold py-4 rounded-xl border border-brand-200 hover:border-brand-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 hover:scale-105 ${isSale ? 'text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300' : ''}`}
                   >
                     {isSale ? (
                       <>Shop Now <ShoppingBag size={18} /></>
                     ) : (
                       "Book Service"
                     )}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 text-center text-sm text-blue-800 shadow-sm max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
           <p className="font-medium">Note: Service charges are determined after inspection and based on the scope of work.</p>
        </div>

      </div>
    </div>
  );
};

export default Services;