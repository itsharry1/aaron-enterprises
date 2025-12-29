import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Zap, Headphones, Shield, ArrowRight } from 'lucide-react';
import { AMC_PLANS } from '../constants';

const AMCPlans: React.FC = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-down">
          <span className="text-brand-600 font-bold tracking-widest uppercase text-xs bg-brand-50 px-4 py-2 rounded-full border border-brand-100">Annual Maintenance Contract</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-6">Best Protection for Your AC</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible AMC plans designed to keep your AC running efficiently all year round. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-6xl mx-auto">
          {AMC_PLANS.map((plan, i) => {
            const isPremium = plan.recommended;

            return (
              <div 
                key={plan.id}
                className={`relative rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 w-full md:w-1/3 border animate-fade-in-up ${
                  isPremium 
                    ? 'bg-gray-900/95 text-white shadow-2xl md:-mt-8 md:-mb-4 z-10 border-gray-700 backdrop-blur-xl' 
                    : 'bg-white/60 text-gray-900 shadow-glass border-white/60 backdrop-blur-md hover:bg-white/80'
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                 {isPremium && (
                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/40 flex items-center gap-1">
                     <Zap size={14} fill="currentColor" /> Most Popular
                   </div>
                 )}

                 <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/10 mb-4 shadow-inner">
                       {plan.title === 'Basic' && <Headphones className={isPremium ? "text-white" : "text-brand-500"} size={32} />}
                       {plan.title === 'Premium' && <Zap className="text-yellow-400" size={32} />}
                       {plan.title === 'Business' && <Shield className={isPremium ? "text-white" : "text-brand-500"} size={32} />}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                    <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{plan.subtitle}</p>
                 </div>

                 <div className="flex-grow bg-white/5 rounded-2xl p-4">
                    <ul className="space-y-4">
                       {plan.features.map((feature, idx) => (
                         <li key={idx} className="flex items-start gap-3">
                            <div className={`mt-1 rounded-full p-0.5 ${isPremium ? 'text-green-500' : 'text-green-600'}`}>
                               <CheckCircle size={18} fill={isPremium ? "rgba(34, 197, 94, 0.2)" : "rgba(34, 197, 94, 0.1)"} />
                            </div>
                            <span className={`text-sm font-medium ${isPremium ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div className="mt-8">
                    <Link 
                      to={`/book?plan=${plan.id}`}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${
                        isPremium 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30 hover:shadow-orange-500/50' 
                          : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30 hover:shadow-brand-500/50'
                      }`}
                    >
                      Request Quote <ArrowRight size={18} />
                    </Link>
                 </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-white/50 backdrop-blur-md rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-white/60 shadow-glass max-w-5xl mx-auto animate-zoom-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white p-6 rounded-full shadow-lg text-brand-600 border border-brand-100">
            <ShieldCheck size={48} />
          </div>
          <div className="flex-grow text-center md:text-left">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Not sure which plan to choose?</h3>
             <p className="text-gray-600 text-lg">Our experts can inspect your AC condition and suggest the best maintenance plan for you.</p>
          </div>
          <Link to="/contact" className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:scale-105 whitespace-nowrap">
             Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AMCPlans;