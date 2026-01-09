
import React from 'react';
import * as Icons from 'lucide-react';
import { Badge } from '../types';

interface BadgeIconProps {
  badge: Badge;
  size?: number;
  showTooltip?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, size = 20, showTooltip = true }) => {
  const IconComponent = (Icons as any)[badge.icon];
  
  if (!IconComponent) return null;

  return (
    <div className="relative inline-block group">
      <div className={`p-2.5 rounded-xl border transition-all duration-300 ${badge.earned ? 'bg-domira-gold/10 border-domira-gold text-domira-gold shadow-lg shadow-domira-gold/5 scale-110' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 grayscale'}`}>
        <IconComponent size={size} strokeWidth={2.5} />
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-44 p-3 bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[300] text-center scale-90 group-hover:scale-100 origin-bottom invisible group-hover:visible backdrop-blur-md">
           <p className="text-[10px] font-black text-domira-gold uppercase tracking-widest mb-1">{badge.name}</p>
           <p className="text-[9px] text-slate-200 font-medium leading-tight">{badge.description}</p>
           {!badge.earned && badge.progress !== undefined && badge.total !== undefined && (
             <div className="mt-2">
                <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-domira-gold" style={{ width: `${(badge.progress / badge.total) * 100}%` }}></div>
                </div>
                <p className="text-[7px] font-black text-slate-500 mt-1 uppercase tracking-tighter">Progress: {badge.progress}/{badge.total}</p>
             </div>
           )}
           <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};
