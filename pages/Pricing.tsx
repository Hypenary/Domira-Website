
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, Users, Briefcase, Zap, CheckCircle2, Landmark, Shield, Heart, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';

export const Pricing: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const landlordPlans = [
    {
      name: "Property Verification",
      type: "Per Unit",
      price: "150",
      target: "Landlords",
      description: "Landlords pay to get a 'Verified' badge, attracting more tenants faster for higher occupancy.",
      perks: ["Verified Asset Badge", "Trust Score Boost", "Reduced Scam Alerts", "Manual agent vetting"],
      cta: "Verify a Unit",
      link: "/for-landlords",
      featured: true
    }
  ];

  const tenantPlans = [
    {
      name: "Basic Access",
      price: "0",
      target: "Renters",
      description: "Our core experience is free for renters to find their safe next home.",
      perks: ["Verified Listing Access", "Roommate Search", "House Dashboard", "Safe Deposit Escrow"],
      cta: "Start Free",
      link: "/find-property",
      featured: false,
      isOwned: !user?.is_gold
    },
    {
      id: 'gold',
      name: "Domira Gold",
      price: billingPeriod === 'monthly' ? "15" : "150",
      type: billingPeriod === 'monthly' ? "Per Month" : "Per Year",
      target: "Renters",
      description: "Priority matching, custom gold themes, and ad-free experience.",
      perks: [
        "Exclusive Gold Member Badge", 
        "3 Premium Interface Themes", 
        "Ad-Free Browser Experience",
        "Priority Search Placement",
        "Unlimited Match Requests"
      ],
      cta: user?.is_gold ? "Manage Gold Subscription" : "Upgrade to Gold",
      link: `/checkout?type=UPGRADE&period=${billingPeriod}`,
      featured: true,
      isOwned: user?.is_gold,
      saveText: billingPeriod === 'yearly' ? "SAVE 17%" : null
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300 pb-20">
      <section className="bg-domira-navy pt-20 pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-domira-gold/10 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-domira-gold text-[10px] font-black uppercase tracking-widest mb-8">
            <Crown size={14} className="fill-domira-gold" /> The Gold Standard
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            Rent with <span className="text-domira-gold italic">Confidence</span>. <br />
            Upgrade to <span className="text-domira-gold">Gold</span>.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Elevate your housing search with priority access and a premium interface designed for Sabah's top residents.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
             <span className={`text-xs font-black uppercase tracking-widest ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
             <button 
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-7 bg-slate-800 rounded-full relative p-1 transition-all"
             >
                <div className={`w-5 h-5 bg-domira-gold rounded-full shadow-lg transition-all transform ${billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
             </button>
             <span className={`text-xs font-black uppercase tracking-widest ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-domira-gold ml-1 text-[10px] bg-domira-gold/10 px-2 py-0.5 rounded-full">SAVE 17%</span></span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">For Tenants</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tenantPlans.map(plan => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">For Landlords</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="grid md:grid-cols-1 gap-8 max-w-lg mx-auto">
            {landlordPlans.map(plan => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ plan }: any) => {
  return (
    <div className={`flex flex-col h-full bg-white dark:bg-domira-navy rounded-[3rem] border p-10 transition-all duration-500 shadow-xl relative overflow-hidden group hover:scale-[1.02] ${plan.featured ? 'border-domira-gold ring-8 ring-domira-gold/5' : 'border-slate-100 dark:border-slate-800'}`}>
      {plan.featured && (
        <div className="absolute top-0 right-0 bg-domira-gold text-domira-navy px-8 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
          <Sparkles size={12} fill="currentColor" /> {plan.saveText || 'Elite Access'}
        </div>
      )}
      <div className="mb-8">
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${plan.id === 'gold' ? 'text-domira-gold' : 'text-slate-400'}`}>{plan.type || plan.target}</span>
        <h3 className={`text-3xl font-black tracking-tighter mt-1 ${plan.id === 'gold' ? 'text-domira-gold' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
      </div>
      <div className="mb-10">
        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
          <span className="text-lg font-medium text-slate-400 mr-1 uppercase">RM</span>{plan.price}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-4 leading-relaxed italic opacity-80">"{plan.description}"</p>
      </div>
      <div className="flex-1 mb-12 space-y-5">
        {plan.perks.map((perk: string) => (
          <div key={perk} className="flex items-center gap-4">
            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${plan.id === 'gold' ? 'bg-domira-gold/10 border border-domira-gold/20' : 'bg-green-500/10 border border-green-500/20'}`}>
              <CheckCircle2 size={14} className={plan.id === 'gold' ? 'text-domira-gold' : 'text-green-500'} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{perk}</span>
          </div>
        ))}
      </div>
      
      {plan.isOwned ? (
         <div className="flex items-center justify-center gap-3 py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <CheckCircle2 size={18} className="text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subscription Active</span>
         </div>
      ) : (
        <Link to={plan.link}>
          <Button 
            variant={plan.featured ? 'primary' : 'outline'} 
            fullWidth 
            className={`py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${plan.featured ? 'bg-domira-gold shadow-domira-gold/20 border-white/20' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
          >
            {plan.cta}
          </Button>
        </Link>
      )}
    </div>
  );
};
