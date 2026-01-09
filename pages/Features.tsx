
import React from 'react';
import { Shield, Users, Zap, Map as MapIcon, Vote, CreditCard, Wrench, Search, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  const allFeatures = [
    { icon: Shield, title: "Verified Assets", desc: "Every listing is manually vetted by our agents. No more phantom listings or deposit scams." },
    { icon: Users, title: "Roommate Matching", desc: "Our lifestyle algorithm pairs co-living partners based on shared habits and values." },
    { icon: MapIcon, title: "Neighborhood Explorer", desc: "Get real resident insights on flood risks, safety, and local mamak density." },
    { icon: Vote, title: "House Democracy", desc: "Vote on house rules and decisions digitally. Transparent co-living for everyone." },
    { icon: CreditCard, title: "Digital Payments", desc: "One-click rent collection via FPX and escrow protection for your deposits." },
    { icon: Wrench, title: "Maintenance Hub", desc: "Report issues with photo uploads and track repair status in real-time." },
    { icon: Search, title: "Smart Discovery", desc: "Filter properties by specific tenant needs like student-friendly or work-from-home ready." },
    { icon: Zap, title: "Automated Splitting", desc: "Utilities are split automatically between housemates based on your agreement." },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark py-20 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-domira-gold/10 border border-domira-gold/20 rounded-full text-domira-gold text-xs font-black uppercase tracking-widest mb-6">
              <Star className="w-4 h-4 fill-domira-gold" /> Premium Ecosystem
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">Built for <span className="text-domira-gold italic">Modern</span> Living.</h1>
           <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Domira isn't just a marketplace. It's a complete ecosystem designed to make renting in Malaysia safe, simple, and social.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {allFeatures.map((f, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 dark:bg-domira-navy border border-slate-200 dark:border-slate-800 hover:border-domira-gold/50 hover:shadow-2xl transition-all duration-500">
               <div className="w-16 h-16 bg-white dark:bg-domira-dark rounded-2xl flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-700 group-hover:bg-domira-gold transition-colors duration-500">
                  <f.icon className="w-7 h-7 text-domira-gold group-hover:text-domira-navy transition-colors duration-500" />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{f.title}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 rounded-[3rem] bg-domira-navy text-white text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <h2 className="text-3xl font-black mb-6 relative z-10">Ready to find your next home?</h2>
           <div className="flex justify-center gap-4 relative z-10">
              <Link to="/find-property">
                 <Button variant="primary" className="px-12 py-6 font-black uppercase tracking-widest text-xs">Browse Properties</Button>
              </Link>
              <Link to="/auth">
                 <Button variant="outline" className="px-12 py-6 font-black uppercase tracking-widest text-xs border-white/20 hover:bg-white/5">Create Account</Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};
