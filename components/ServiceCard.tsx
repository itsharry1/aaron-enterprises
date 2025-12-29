import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass hover:shadow-glass-hover border border-white/50 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-60"></div>
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <h3 className="absolute bottom-4 left-4 z-20 text-xl font-bold text-white drop-shadow-md">{service.title}</h3>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-600 mb-6 text-sm flex-grow font-medium leading-relaxed">{service.description}</p>
        
        <div className="space-y-3 mb-6 bg-white/40 p-4 rounded-xl border border-white/60">
          {service.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
              <Check size={16} className="text-brand-600 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Link 
          to={`/book?service=${service.id}`} 
          className="w-full mt-auto bg-white hover:bg-brand-50 text-brand-700 font-bold py-3.5 rounded-xl border border-brand-200 hover:border-brand-300 shadow-sm transition-all flex items-center justify-center gap-2 group/btn"
        >
          Book Now 
          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;