
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Shield, Users, Zap, CheckCircle, ArrowRight, Search, MapPin, DollarSign, Filter, Star, Sparkles, ShieldCheck, Landmark } from 'lucide-react';
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
           <div className="inline-flex gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-domira-gold text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-in slide-in-from-top-4">
              <ShieldCheck size={14} className="fill-domira-gold animate-pulse" /> Verified Network Sabah
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] flex flex-col">
             <span>RENT WITH <span className="text-domira-gold italic">TRUST</span></span>
             <span>LIVE WITH <span className="text-blue-400">PEACE</span></span>
           </h1>
           
           <p className="text-xl text-slate-400 max-w-2xl mb-12 font-medium">
             Kota Kinabalu's most secure rental marketplace. Lifestyle-matched housemates and manually verified properties.
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
                 Explore Units
              </Button>
           </form>

           <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-domira-gold"/> Halal Kitchen Options</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-domira-gold"/> Escrow Deposit Protection</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-domira-gold"/> Female-Only Units</span>
           </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-end mb-12">
              <div>
                 <p className="text-domira-gold font-black uppercase text-[10px] tracking-[0.3em] mb-2">Verified Collection</p>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Elite Housing Index</h2>
              </div>
              <Link to="/find-property" className="text-xs font-black text-slate-400 hover:text-domira-gold uppercase tracking-widest flex items-center gap-2 transition-colors">
                 Full Marketplace <ArrowRight size={14}/>
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map(prop => <PropertyCard key={prop.id} property={prop} />)}
           </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-24 bg-slate-50 dark:bg-domira-deep border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                 <div className="w-16 h-16 bg-domira-gold/10 rounded-2xl flex items-center justify-center mb-8 border border-domira-gold/20 shadow-xl">
                    <ShieldCheck className="text-domira-gold" size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 uppercase leading-[0.9]">The Gold <br/><span className="text-domira-gold">Standard</span>.</h2>
                 <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">
                    Our human agents physically audit properties to eliminate scams. Every "Verified" unit has been checked for address accuracy, ownership documents, and quality.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-3xl font-black text-slate-900 dark:text-white">100%</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Manual Audit</p>
                    </div>
                    <div>
                       <p className="text-3xl font-black text-slate-900 dark:text-white">RM 0</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fraud Losses</p>
                    </div>
                 </div>
              </div>
              <div className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Landmark size={120} className="text-domira-gold" /></div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">For Landlords</h3>
                 <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                    Elevate your profile by requesting a professional verification audit. Attract high-quality tenants faster with our "Verified Host" badge.
                 </p>
                 <Link to="/for-landlords">
                    <Button variant="primary" className="px-10 py-5 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-domira-gold/20">Access Landlord Hub</Button>
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Roommate Matching Teaser */}
      <section className="py-32 bg-white dark:bg-domira-dark">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-domira-gold font-black uppercase text-[10px] tracking-[0.3em] mb-6">Algorithm Matching</p>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-12 uppercase leading-none">Find Your <span className="text-domira-gold italic">Harmony</span>.</h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto mb-20">
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto"><Users size={24}/></div>
                  <p className="text-sm font-black uppercase text-slate-900 dark:text-white">Lifestyle Audit</p>
                  <p className="text-xs text-slate-500">Cleanliness, noise, and guest habits compared.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto"><CheckCircle size={24}/></div>
                  <p className="text-sm font-black uppercase text-slate-900 dark:text-white">Mutual Harmony</p>
                  <p className="text-xs text-slate-500">Only match with users sharing your core values.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto"><Shield size={24}/></div>
                  <p className="text-sm font-black uppercase text-slate-900 dark:text-white">Secured Chat</p>
                  <p className="text-xs text-slate-500">Privacy-first contact until both parties approve.</p>
               </div>
            </div>
            <Link to="/find-roommate">
               <Button variant="outline" className="px-12 py-6 border-slate-200 dark:border-slate-800 font-black uppercase text-xs tracking-widest hover:border-domira-gold hover:text-domira-gold transition-all">Launch Matching Engine</Button>
            </Link>
         </div>
      </section>

      {/* Community Proof */}
      {!user?.is_gold && (
        <section className="py-12 max-w-7xl mx-auto px-4">
           <BannerAd user={user} />
        </section>
      )}
    </div>
  );
};
