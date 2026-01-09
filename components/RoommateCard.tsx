
import React from 'react';
import { RoommateProfile } from '../types';
import { MapPin, Briefcase, Heart, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface RoommateCardProps {
  profile: RoommateProfile;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({ profile }) => {
  const isEliteMatch = profile.match_percentage >= 90;

  return (
    <div className={`group bg-white dark:bg-domira-navy rounded-[2.5rem] p-8 border transition-all duration-500 flex flex-col h-full overflow-hidden relative ${isEliteMatch ? 'border-domira-gold/40 shadow-[0_20px_60px_rgba(251,191,36,0.1)] ring-2 ring-domira-gold/5' : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-domira-gold/30'}`}>
      
      {/* Visual Background Elements */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
         <Heart size={80} className={isEliteMatch ? 'text-domira-gold fill-domira-gold' : 'text-domira-gold'} />
      </div>

      <div className="flex items-start gap-6 mb-8 relative z-10">
        <div className="relative shrink-0">
             <img 
              src={profile.user.avatar_url} 
              alt={profile.user.full_name} 
              className={`w-24 h-24 rounded-[2.5rem] object-cover border-[6px] transition-transform duration-500 group-hover:scale-105 ${isEliteMatch ? 'border-domira-gold/20' : 'border-slate-50 dark:border-slate-800'}`}
            />
            <div className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-xl border-4 shadow-lg text-[10px] font-black ${profile.match_percentage > 85 ? 'bg-domira-gold text-domira-navy border-white dark:border-domira-navy' : 'bg-slate-900 text-white border-white dark:border-domira-navy'}`}>
              {profile.match_percentage}%
            </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight truncate">
               {profile.user.full_name}
             </h3>
             {profile.user.is_verified && <ShieldCheck className="text-domira-gold shrink-0" size={16} />}
          </div>
          <div className="flex flex-col gap-1.5">
             <div className="flex items-center text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">
               <Briefcase className="w-3.5 h-3.5 mr-2 text-domira-gold/60" />
               {profile.user.occupation}
             </div>
             <div className="flex items-center text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
               <MapPin className="w-3.5 h-3.5 mr-2 text-domira-gold/60" />
               {profile.preferred_locations[0]}
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <div className={`p-5 rounded-3xl border mb-6 italic text-sm font-medium line-clamp-2 transition-colors ${isEliteMatch ? 'bg-domira-gold/5 border-domira-gold/10 text-slate-700 dark:text-slate-300' : 'bg-slate-50 dark:bg-domira-dark/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}>
          "{profile.user.bio || "Searching for a harmonious living space in Sabah."}"
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {profile.lifestyle_tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className={`px-3 py-1.5 text-[9px] rounded-full font-black uppercase tracking-widest border transition-colors ${isEliteMatch ? 'bg-white dark:bg-slate-900 border-domira-gold/20 text-domira-gold' : 'bg-white dark:bg-domira-navy border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}>
              {tag}
            </span>
          ))}
          {profile.lifestyle_tags.length > 3 && (
            <span className="text-[9px] font-black text-slate-400 uppercase p-1.5">+{profile.lifestyle_tags.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
        <Link to={`/roommate/${profile.id}`}>
          <Button variant="outline" size="sm" className="w-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-[0.2em] py-4 hover:border-domira-gold">Full Profile</Button>
        </Link>
        <Link to={`/roommate/${profile.id}`}>
          <Button variant="primary" size="sm" className={`w-full text-[9px] font-black uppercase tracking-[0.2em] py-4 shadow-lg active:scale-95 transition-all ${isEliteMatch ? 'bg-domira-gold text-domira-navy shadow-domira-gold/20' : ''}`}>
             Match Request
          </Button>
        </Link>
      </div>

      {isEliteMatch && (
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-domira-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
    </div>
  );
};
