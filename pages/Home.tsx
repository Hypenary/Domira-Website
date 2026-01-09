
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Shield, Users, Zap, CheckCircle, ArrowRight, Search, MapPin, DollarSign, Filter, Star, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PropertyCard } from '../components/PropertyCard';
import { api } from '../services/mockSupabase';
import { Property, UserProfile } from '../types';
import { BannerAd } from '../components/BannerAd';
import { VerificationAlert } from '../components/VerificationAlert';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [featured, setFeatured] = useState<Property[]>([]);
  const [search, setSearch] = useState({ location: '', price: 'any', type: 'any' });

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) setUser(JSON.parse(saved));

    const fetchFeatured = async () => {
      const data = await api.properties.list();
      setFeatured(data.filter(p => p.is_verified).slice(0, 4));
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.location) params.set('location', search.location);
    if (search.price !== 'any') params.set('price', search.price);
    if (search.type !== 'any') params.set('type', search.type);
    navigate(`/find-property?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300">
      <VerificationAlert user={user} />
      
      {/* Hero Section */}
      <section className="relative bg-domira-navy pt-20 pb-44 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-domira-gold/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col items-center text-center z-10">
           <Logo variant="full" size={100} className="mb-8 text-white" />
           
           <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] flex flex-col">
             <span>RENT WITH <span className="text-domira-gold">TRUST</span></span>
             <span>LIVE WITH <span className="text-blue-400">PEACE</span></span>
           </h1>
           
           <p className="text-xl text-slate-400 max-w-2xl mb-12 font-medium">
             Verified listings and lifestyle-matched housemates in Kota Kinabalu.
           </p>
           
           {/* Enhanced Search Bar */}
           <form onSubmit={handleSearch} className="w-full max-w-5xl bg-white dark:bg-domira-navy p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 border border-white/10 glass mb-12">
              <div className="flex-1 flex items-center px-4 gap-3 py-4 md:py-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                 <MapPin className="text-domira-gold shrink-0" size={20} />
                 <input 
                  type="text" placeholder="Area (e.g. Sepanggar, Luyang)" 
                  className="bg-transparent text-sm font-black text-slate-900 dark:text-white outline-none w-full placeholder:text-slate-400"
                  value={search.location} onChange={e => setSearch({...search, location: e.target.value})}
                 />
              </div>
              <div className="flex-1 flex items-center px-4 gap-3 py-4 md:py-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                 <DollarSign className="text-domira-gold shrink-0" size={20} />
                 <select 
                  className="bg-transparent text-sm font-black text-slate-900 dark:text-white outline-none w-full cursor-pointer"
                  value={search.price} onChange={e => setSearch({...search, price: e.target.value})}
                 >
                    <option value="any">Max Budget</option>
                    <option value="500">Below RM 500</option>
                    <option value="1000">Below RM 1000</option>
                    <option value="2000">Below RM 2000</option>
                 </select>
              </div>
              <div className="flex-1 flex items-center px-4 gap-3 py-4 md:py-0">
                 <Users className="text-domira-gold shrink-0" size={20} />
                 <select 
                  className="bg-transparent text-sm font-black text-slate-900 dark:text-white outline-none w-full cursor-pointer"
                  value={search.type} onChange={e => setSearch({...search, type: e.target.value})}
                 >
                    <option value="any">Any Room Type</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Master Room">Master Room</option>
                    <option value="Entire Unit">Entire Unit</option>
                 </select>
              </div>
              <Button type="submit" variant="primary" size="lg" className="md:px-12 py-5 font-black uppercase tracking-widest text-xs shadow-xl">
                 Search Units
              </Button>
           </form>

           <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-domira-gold"/> Halal Kitchen Options</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-domira-gold"/> Pet-Friendly Filters</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-domira-gold"/> Gender Specific Units</span>
           </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-end mb-12">
              <div>
                 <p className="text-domira-gold font-black uppercase text-[10px] tracking-[0.3em] mb-2">Selected Assets</p>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Featured Verified Units</h2>
              </div>
              <Link to="/find-property" className="text-xs font-black text-slate-400 hover:text-domira-gold uppercase tracking-widest flex items-center gap-2 transition-colors">
                 See All Listings <ArrowRight size={14}/>
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map(prop => <PropertyCard key={prop.id} property={prop} />)}
           </div>
        </div>
      </section>

      {/* Home Sponsored Placement */}
      {!user?.is_gold && (
        <section className="py-12 max-w-7xl mx-auto px-4">
           <BannerAd user={user} />
        </section>
      )}

      {/* Feature Section */}
      <section className="py-24 bg-slate-50 dark:bg-domira-deep">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "Verified Assets", desc: "Every property is manually checked to eliminate phantom listings and deposit scams." },
                { icon: Users, title: "Co-Living Intelligence", desc: "Our lifestyle algorithm pairs you with residents who share your habits and values." },
                { icon: Zap, title: "Fintech Integration", desc: "Secure rent collection via FPX and automated utility splitting between housemates." },
              ].map((feature, idx) => (
                <div key={idx} className="p-10 rounded-[2.5rem] bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 shadow-xl hover:-translate-y-2 transition-all group">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-domira-dark rounded-2xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 group-hover:bg-domira-gold transition-colors">
                     <feature.icon className="w-7 h-7 text-domira-navy dark:text-domira-gold group-hover:text-domira-navy transition-colors" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{feature.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-domira-navy text-white text-center">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
               <p className="text-5xl font-black text-domira-gold mb-2">500+</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Units</p>
            </div>
            <div>
               <p className="text-5xl font-black text-domira-gold mb-2">2.5k</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Matches</p>
            </div>
            <div>
               <p className="text-5xl font-black text-domira-gold mb-2">0</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deposit Scams</p>
            </div>
            <div>
               <p className="text-5xl font-black text-domira-gold mb-2">4.9/5</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Rating</p>
            </div>
         </div>
      </section>
    </div>
  );
};
