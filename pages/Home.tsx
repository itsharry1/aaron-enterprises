import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Clock, Wrench, Zap, CheckCircle, Headphones, ArrowRight, Wind, Gauge, Calendar, Sparkles, Activity } from 'lucide-react';
import { SERVICES, TESTIMONIALS, BRANDS, CITIES, AMC_PLANS } from '../constants';

const Home: React.FC = () => {
  const features = [
    {
      icon: Wrench,
      title: "AC Repair",
      desc: "Expert diagnosis and repair for all AC brands. Fast response times with genuine parts.",
      link: "/book?service=repair"
    },
    {
      icon: Wind,
      title: "Installation",
      desc: "Professional installation with proper sizing, optimal placement, and warranty support.",
      link: "/book?service=install"
    },
    {
      icon: Gauge,
      title: "Gas Refilling",
      desc: "Safe refrigerant top-ups with leak detection and eco-friendly gas options.",
      link: "/book?service=gas"
    },
    {
      icon: Calendar,
      title: "AMC Plans",
      desc: "Annual maintenance contracts with priority support, discounts, and scheduled visits.",
      link: "/amc"
    },
    {
      icon: Sparkles,
      title: "AC Cleaning",
      desc: "Deep cleaning services for filters, coils, and ducts. Improve air quality and efficiency.",
      link: "/book?service=service"
    },
    {
      icon: Activity,
      title: "Smart Monitoring",
      desc: "IoT-enabled monitoring with real-time alerts, usage analytics, and predictive maintenance.",
      link: "/contact"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop" 
            alt="AC Technician at work" 
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Professional AC Services <br/> At Your Doorstep
          </h1>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto font-light drop-shadow-md">
            Installation | Repair | AMC Plans | All AC Brands
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm animate-bounce-slow">
              <Zap size={20} /> Book Service Now
            </Link>
            <Link to="/amc" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-lg font-bold px-8 py-4 rounded-full border border-white/30 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105">
              <Shield size={20} /> View AMC Plans
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/90 text-sm font-medium animate-fade-in" style={{ animationDelay: '0.3s' }}>
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"><CheckCircle size={16} className="text-green-400"/> Verified Experts</div>
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"><CheckCircle size={16} className="text-green-400"/> 30-Day Warranty</div>
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"><CheckCircle size={16} className="text-green-400"/> Genuine Parts</div>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/60 hover:shadow-glass-hover hover:bg-white/80 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-brand-600 shadow-sm border border-brand-50 group-hover:scale-110 transition-transform">
                   <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm h-16">{feature.desc}</p>
                <Link to={feature.link} className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-2 group/link">
                   Learn More {feature.title === 'Installation' && <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/services" className="bg-white hover:bg-brand-50 text-brand-700 font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 transition-transform hover:scale-105 shadow-glass border border-white/50">
              View All Services <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-900/5 -skew-y-3 transform origin-top-left z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose M/S Aaron Enterprises?</h2>
                <div className="space-y-6">
                   <div className="flex gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm hover:scale-105 transition-transform duration-300">
                      <div className="bg-blue-100 p-3 rounded-xl h-fit text-brand-600"><Clock size={28} /></div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">On-Time Service</h3>
                        <p className="text-gray-600 text-sm">We value your time. Our technicians arrive within the scheduled 60-minute window.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm hover:scale-105 transition-transform duration-300">
                      <div className="bg-blue-100 p-3 rounded-xl h-fit text-brand-600"><Wrench size={28} /></div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">Expert Technicians</h3>
                        <p className="text-gray-600 text-sm">Background verified, highly trained professionals with 5+ years of experience.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm hover:scale-105 transition-transform duration-300">
                      <div className="bg-blue-100 p-3 rounded-xl h-fit text-brand-600"><Shield size={28} /></div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">Service Warranty</h3>
                        <p className="text-gray-600 text-sm">Get up to 90 days warranty on spare parts and 30 days on service labor.</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="relative animate-slide-in-right">
                 <div className="absolute inset-0 bg-brand-500 rounded-3xl transform rotate-3 opacity-20 blur-lg"></div>
                 <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop" className="rounded-3xl shadow-2xl w-full relative z-10 border-4 border-white/30" alt="Happy Technician" />
                 <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/60 hidden md:block z-20 animate-bounce-slow">
                    <div className="flex items-center gap-4">
                       <div className="text-4xl font-bold text-brand-600">15k+</div>
                       <div className="text-gray-600 text-sm leading-tight">Happy<br/>Customers</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* AMC Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16 animate-fade-in-down">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Flexible AMC plans designed to keep your AC running efficiently all year round.
              </p>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
              {AMC_PLANS.map((plan, index) => {
                const isPremium = plan.recommended;

                return (
                  <div 
                    key={plan.id}
                    className={`relative rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 w-full md:w-1/3 border animate-fade-in-up ${
                      isPremium 
                        ? 'bg-gray-900/95 text-white shadow-2xl md:-mt-8 md:-mb-4 z-10 border-gray-700 backdrop-blur-md' 
                        : 'bg-white/60 text-gray-900 shadow-glass border-white/60 backdrop-blur-md hover:bg-white/80'
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                     {isPremium && (
                       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/40 flex items-center gap-1">
                         <Zap size={14} fill="currentColor" /> Most Popular
                       </div>
                     )}

                     <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                           {plan.title === 'Basic' && <Headphones className="text-brand-500" size={24} />}
                           {plan.title === 'Premium' && <Zap className="text-yellow-400" size={24} />}
                           {plan.title === 'Business' && <Shield className="text-brand-500" size={24} />}
                           <h3 className="text-xl font-bold">{plan.title}</h3>
                        </div>
                        <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{plan.subtitle}</p>
                     </div>

                     <div className="flex-grow">
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
                              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30' 
                              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30'
                          }`}
                        >
                          Request Quote <ArrowRight size={18} />
                        </Link>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fade-in">What Our Customers Say</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((review, i) => (
                <div 
                  key={review.id} 
                  className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/50 hover:-translate-y-1 transition-transform duration-300 animate-zoom-in"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                   <div className="flex gap-1 text-yellow-400 mb-6 bg-yellow-50/50 w-fit px-3 py-1 rounded-full border border-yellow-100">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} className={i < review.rating ? "" : "text-yellow-300"} />
                      ))}
                   </div>
                   <p className="text-gray-700 italic mb-6 leading-relaxed">"{review.comment}"</p>
                   <div className="flex items-center gap-4 pt-4 border-t border-gray-100/50">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 shadow-inner">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                         <div className="font-bold text-gray-900">{review.name}</div>
                         <div className="text-xs text-gray-500">{review.date}</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Brands & Cities */}
      <section className="py-16 bg-white/40 backdrop-blur-md border-t border-white/40">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10 animate-fade-in">Trusted Brands We Service</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-gray-400 font-bold text-xl md:text-2xl opacity-60">
               {BRANDS.map((brand, i) => (
                 <span key={brand} className="hover:text-brand-500 transition-colors cursor-default hover:opacity-100 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>{brand}</span>
               ))}
            </div>
            
            <div className="mt-16 pt-12 border-t border-gray-200/50">
               <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8 animate-fade-in">Service Areas</p>
               <div className="flex flex-wrap justify-center gap-4">
                  {CITIES.map((city, i) => (
                    <span key={city} className="bg-white/80 border border-white/60 text-gray-600 px-6 py-2 rounded-full text-sm font-medium shadow-sm animate-zoom-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      {city}
                    </span>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;