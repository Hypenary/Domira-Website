
import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface BannerAdProps {
  user: UserProfile | null;
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ user, className = "" }) => {
  if (user?.is_gold) return null;

  return (
    <div className={`bg-slate-100 dark:bg-domira-navy/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-domira-gold opacity-5 blur-3xl rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">Sponsored</span>
          <span className="text-[10px] font-bold text-slate-400 italic tracking-tight">Unifi Student Fiber</span>
        </div>
        <div>
          <h4 className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-tight uppercase">High-Speed Study Fiber <br/>From RM 89/mo</h4>
          <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-widest">Zero Installation for Domira Users.</p>
        </div>
        <button className="flex items-center justify-between w-full p-4 bg-white dark:bg-domira-dark rounded-2xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-domira-gold hover:shadow-xl transition-all active:scale-95">
          Learn More <ExternalLink size={14} className="text-domira-gold" />
        </button>
        <div className="mt-2 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Remove ads with <span className="text-domira-gold font-black">Domira Gold</span></p>
           <Sparkles size={14} className="text-domira-gold animate-pulse" />
        </div>
      </div>
    </div>
  );
};
