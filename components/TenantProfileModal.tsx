
import React from 'react';
import { X, ShieldCheck, Briefcase, MapPin, User, Calendar, MessageSquare, CheckCircle, Tag, Wallet, Compass } from 'lucide-react';
import { RoommateProfile } from '../types';
import { Button } from './Button';

interface TenantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RoommateProfile;
  onChat: () => void;
}

export const TenantProfileModal: React.FC<TenantProfileModalProps> = ({ isOpen, onClose, profile, onChat }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-domira-navy w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700/50 animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Fixed Header/Cover Section */}
        <div className="relative shrink-0">
          <div className="h-40 bg-gradient-to-br from-domira-deep via-slate-900 to-domira-navy">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2.5 bg-black/40 hover:bg-domira-gold hover:text-domira-navy rounded-full text-white transition-all z-20 backdrop-blur-md border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute -bottom-12 left-8 flex items-end gap-6 px-2">
            <div className="relative group">
              <img 
                src={profile.user.avatar_url} 
                className="w-32 h-32 rounded-3xl object-cover border-[6px] border-domira-navy shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" 
                alt={profile.user.full_name} 
              />
              <div className="absolute -bottom-2 -right-2 bg-domira-gold text-domira-navy p-2 rounded-xl border-4 border-domira-navy shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-16">
          <div className="mb-8">
            <div className="flex items-center justify-between items-start">
               <div>
                  <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                    {profile.user.full_name}
                    <span className="text-slate-500 font-medium text-2xl">{profile.age}</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-2 font-medium">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-domira-gold" /> {profile.user.occupation}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-domira-gold" /> Looking in {profile.preferred_locations[0]}</span>
                  </div>
               </div>
               <div className="hidden sm:block">
                  <div className="bg-domira-gold/10 border border-domira-gold/20 px-4 py-2 rounded-2xl">
                     <p className="text-[10px] font-black text-domira-gold uppercase tracking-[0.2em] mb-1">Match Score</p>
                     <p className="text-xl font-black text-white">{profile.match_percentage}%</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-10">
              {/* Bio Section */}
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <User className="w-3 h-3" /> Professional Bio
                </h3>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-domira-gold rounded-full opacity-50"></div>
                  <p className="text-slate-300 text-lg leading-relaxed font-medium pl-4">
                    {profile.user.bio}
                  </p>
                </div>
              </section>

              {/* Habits Section */}
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Lifestyle & House Habits
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {profile.lifestyle_tags.map(tag => (
                    <span key={tag} className="px-5 py-2.5 bg-slate-800/40 text-slate-200 rounded-2xl text-xs font-bold border border-slate-700/50 hover:border-domira-gold/50 hover:bg-slate-800 transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Context Cards */}
            <div className="space-y-6">
              <div className="bg-domira-deep/50 rounded-3xl p-6 border border-slate-800 shadow-inner">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Rental Context</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                     <div className="p-2 bg-slate-800 rounded-lg"><Wallet className="w-4 h-4 text-domira-gold" /></div>
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Monthly Budget</p>
                       <p className="text-white font-bold text-sm">RM {profile.budget_min} - {profile.budget_max}</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-3">
                     <div className="p-2 bg-slate-800 rounded-lg"><Compass className="w-4 h-4 text-domira-gold" /></div>
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Gender Preference</p>
                       <p className="text-white font-bold text-sm">{profile.gender}</p>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800/50">
                    <div className="bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl flex items-center gap-3">
                       <CheckCircle className="w-4 h-4 text-green-400" />
                       <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">ID Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                 <p className="text-[10px] text-blue-400 leading-relaxed font-bold uppercase tracking-tighter text-center">
                    Tenant since Oct 2023
                 </p>
              </div>
            </div>
          </div>
          
          {/* Add some padding at bottom of scrollable area */}
          <div className="h-8"></div>
        </div>

        {/* Sticky Action Footer */}
        <div className="shrink-0 px-8 py-6 bg-domira-deep border-t border-slate-800 flex flex-col sm:flex-row gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
           <Button 
             variant="primary" 
             fullWidth 
             className="py-5 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-domira-gold/10 hover:scale-[1.02] transition-transform active:scale-95"
             onClick={onChat}
           >
             <MessageSquare className="w-4 h-4 mr-2" /> Open Messenger
           </Button>
           <Button 
             variant="outline" 
             fullWidth 
             className="py-5 font-black uppercase text-xs tracking-[0.2em] text-slate-300 border-slate-700 hover:bg-slate-800 transition-all active:scale-95"
           >
             Schedule Viewing
           </Button>
        </div>
      </div>
    </div>
  );
};
