
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { RoommateCard } from '../components/RoommateCard';
import { Button } from '../components/Button';
import { 
  Filter, Users, X, Sparkles, Edit2, MapPin, Target, 
  BrainCircuit, Search, ArrowRight, CheckCircle2, 
  Heart, ShieldCheck, Zap, Info, Wand2
} from 'lucide-react';
import { api } from '../services/mockSupabase';
import { RoommateProfile, UserProfile, MALAYSIAN_LOCATIONS, LIFESTYLE_TAGS } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface FindRoommateProps {
  user: UserProfile | null;
}

export const FindRoommate: React.FC<FindRoommateProps> = ({ user }) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [locationQuery, setLocationQuery] = useState('');
  const [budgetMax, setBudgetMax] = useState<string>('any');
  const [genderFilter, setGenderFilter] = useState<string>('Any');
  const [wantedTags, setWantedTags] = useState<string[]>([]);
  
  // Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.roommates.list();
        let processedData = data;
        
        // Intelligent Scoring Logic
        if (user && user.lifestyle_tags && user.lifestyle_tags.length > 0) {
          processedData = data.map(profile => {
            const myTags = user.lifestyle_tags || [];
            const theirTags = profile.lifestyle_tags || [];
            const sharedTags = myTags.filter(tag => theirTags.includes(tag));
            
            // Base match starts at 50%
            let score = 50;
            // Overlap contribution
            if (myTags.length > 0) {
              const overlapRatio = sharedTags.length / myTags.length;
              score += Math.round(overlapRatio * 45); 
            }
            // Bonus for verification status
            if (profile.user.is_verified) score += 4;
            
            if (score > 99) score = 99;
            return { ...profile, match_percentage: score };
          });
          processedData.sort((a, b) => b.match_percentage - a.match_percentage);
        }
        setProfiles(processedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocationQuery(val);
    if (val.trim()) {
      const filtered = MALAYSIAN_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (loc: string) => {
    setLocationQuery(loc);
    setShowSuggestions(false);
  };

  const toggleWantedTag = (tag: string) => {
    setWantedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Main Filtering logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesLocation = locationQuery === '' || 
        profile.preferred_locations.some(loc => loc.toLowerCase().includes(locationQuery.toLowerCase()));
      
      let matchesBudget = true;
      if (budgetMax !== 'any') {
        const max = parseInt(budgetMax);
        matchesBudget = profile.budget_min <= max;
      }
      const matchesGender = genderFilter === 'Any' || profile.gender === genderFilter;
      const matchesTags = wantedTags.length === 0 || wantedTags.every(tag => profile.lifestyle_tags.includes(tag));

      return matchesLocation && matchesBudget && matchesGender && matchesTags;
    });
  }, [profiles, locationQuery, budgetMax, genderFilter, wantedTags]);

  const topMatches = useMemo(() => {
    return filteredProfiles.filter(p => p.match_percentage >= 90).slice(0, 3);
  }, [filteredProfiles]);

  const normalMatches = useMemo(() => {
    return filteredProfiles.filter(p => p.match_percentage < 90 || topMatches.length === 0);
  }, [filteredProfiles, topMatches]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark transition-colors duration-300 pb-20">
      {/* Search Header */}
      <div className="bg-domira-navy pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-domira-gold/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-domira-gold text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <BrainCircuit size={14} className="animate-pulse" /> Precision Match Engine
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
             FIND YOUR <br/><span className="text-domira-gold italic">IDEAL</span> PARTNER.
           </h1>
           <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
             Go beyond listings. Match with roommates based on real-world habits, shared values, and verified trust scores.
           </p>

           <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button 
                onClick={() => setShowWizard(true)}
                variant="primary" 
                size="lg" 
                className="px-12 py-7 font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_50px_rgba(251,191,36,0.3)] bg-domira-gold text-domira-navy border-4 border-white/10 hover:scale-105 transition-all"
              >
                 <Wand2 className="mr-3" size={18} /> Launch Match Wizard
              </Button>
              {!user && (
                 <Link to="/auth">
                   <Button variant="outline" size="lg" className="px-12 py-7 font-black uppercase tracking-[0.2em] text-xs text-white border-white/20 hover:bg-white/5">
                      Establish Your ID
                   </Button>
                 </Link>
              )}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        
        {/* Verification Call-to-Action for Unverified Users */}
        {user && !user.questionnaire_completed && (
           <div className="bg-slate-900 border-2 border-domira-gold/30 rounded-[3rem] p-10 mb-16 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-domira-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-domira-gold/20 rounded-3xl flex items-center justify-center border border-domira-gold/40 shadow-xl">
                       <Zap className="text-domira-gold" size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tight mb-2">Predictive Matching Inactive</h3>
                       <p className="text-slate-400 text-sm font-medium">We need your lifestyle fingerprint to predict 99% harmony matches.</p>
                    </div>
                 </div>
                 <Link to="/verify-lifestyle">
                    <Button variant="primary" className="px-10 py-5 font-black uppercase tracking-widest text-[10px] bg-domira-gold text-domira-navy shadow-xl shadow-domira-gold/20">Set Lifestyle Fingerprint</Button>
                 </Link>
              </div>
           </div>
        )}

        {/* Top Prediction Carousel (Only if highly rated matches exist) */}
        {user && user.questionnaire_completed && topMatches.length > 0 && (
           <div className="mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center justify-between mb-8 px-4">
                 <div>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Elite Selection</h2>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                       <Sparkles className="text-domira-gold" /> Predicted For You
                    </h3>
                 </div>
                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                    <BrainCircuit size={12} /> Real-time Compatibility Check
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {topMatches.map(profile => (
                   <div key={profile.id} className="relative">
                      <div className="absolute -top-3 -right-3 z-30 bg-domira-gold text-domira-navy px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-xl ring-4 ring-white dark:ring-domira-dark animate-bounce-slow">
                        99% Match
                      </div>
                      <RoommateCard profile={profile} />
                   </div>
                 ))}
              </div>
           </div>
        )}

        <div className="flex flex-col lg:flex-row gap-16">
           {/* Sidebar Controls */}
           <div className="w-full lg:w-80 space-y-12 shrink-0">
              <div className="relative group" ref={locationRef}>
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                  type="text" placeholder="Preferred Area..." 
                  className="w-full pl-12 pr-4 py-5 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:border-domira-gold transition-all shadow-xl shadow-black/5"
                  value={locationQuery} onChange={handleLocationChange}
                  onFocus={() => { if(locationQuery) setShowSuggestions(true); }}
                 />
                 {showSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-domira-navy rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                       {filteredLocations.map((loc, idx) => (
                         <button key={idx} onClick={() => selectLocation(loc)} className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                           {loc}
                         </button>
                       ))}
                    </div>
                 )}
              </div>

              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Budget Threshold</h4>
                 <div className="grid grid-cols-2 gap-2">
                    {['400', '600', '900', 'any'].map(val => (
                       <button 
                        key={val} 
                        onClick={() => setBudgetMax(val)}
                        className={`py-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${budgetMax === val ? 'bg-domira-gold text-domira-navy border-domira-gold shadow-lg' : 'bg-white dark:bg-domira-navy border-slate-200 dark:border-slate-800 text-slate-500'}`}
                       >
                         {val === 'any' ? 'No Limit' : `Up to ${val}`}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Lifestyle Filters</h4>
                 <div className="flex flex-wrap gap-2">
                    {LIFESTYLE_TAGS.slice(0, 10).map(tag => (
                      <button 
                        key={tag}
                        onClick={() => toggleWantedTag(tag)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${wantedTags.includes(tag) ? 'bg-domira-gold/10 border-domira-gold text-domira-gold shadow-md' : 'bg-white dark:bg-domira-navy border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'}`}
                      >
                        {tag}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-domira-navy border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform"><ShieldCheck size={60} className="text-domira-gold" /></div>
                 <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Trust Standard</h4>
                 <p className="text-slate-400 text-[10px] font-medium leading-relaxed relative z-10 uppercase">
                    All matching data is encrypted. We never share your contact info without a mutual "Harmony Request."
                 </p>
              </div>
           </div>

           {/* Results Grid */}
           <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Discovery Feed</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredProfiles.length} Profiles matched</p>
              </div>

              {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1,2,3,4].map(n => <div key={n} className="h-80 bg-white dark:bg-domira-navy rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800"></div>)}
                 </div>
              ) : filteredProfiles.length === 0 ? (
                 <div className="text-center py-32 bg-white dark:bg-domira-navy rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
                    <Users className="w-16 h-16 text-slate-100 dark:text-slate-800 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No Harmony Found</h3>
                    <p className="text-slate-500 text-sm font-medium mb-10">Try removing some lifestyle filters to widen your search.</p>
                    <Button variant="outline" className="px-10 border-slate-200 dark:border-slate-700 font-black uppercase text-[10px]" onClick={() => { setWantedTags([]); setBudgetMax('any'); setLocationQuery(''); }}>Reset All Filters</Button>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {normalMatches.map(profile => (
                       <RoommateCard key={profile.id} profile={profile} />
                    ))}
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Match Wizard Modal */}
      {showWizard && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-domira-navy w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
               <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-domira-deep">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-domira-gold/20 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="text-domira-gold" size={24} /></div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Find Your Match</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Specify your non-negotiables</p>
                     </div>
                  </div>
                  <button onClick={() => setShowWizard(false)} className="p-3 bg-white dark:bg-domira-dark border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                  <section>
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">1. Identify Habits</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {LIFESTYLE_TAGS.map(tag => (
                          <button 
                           key={tag}
                           onClick={() => toggleWantedTag(tag)}
                           className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex justify-between items-center group ${wantedTags.includes(tag) ? 'bg-domira-gold text-domira-navy border-domira-gold shadow-lg scale-[1.02]' : 'bg-slate-50 dark:bg-domira-dark border-slate-200 dark:border-slate-700 text-slate-400'}`}
                          >
                             {tag}
                             {wantedTags.includes(tag) && <CheckCircle2 size={14} />}
                          </button>
                        ))}
                     </div>
                  </section>

                  <section>
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">2. Basic Constraints</h3>
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[9px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Max Monthly Rent (RM)</label>
                           <select value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none">
                              <option value="any">No Budget Preference</option>
                              <option value="400">Below RM 400</option>
                              <option value="600">Below RM 600</option>
                              <option value="900">Below RM 900</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[9px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Gender Identity</label>
                           <div className="flex bg-slate-50 dark:bg-domira-dark p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                              {['Any', 'Male', 'Female'].map(g => (
                                <button key={g} onClick={() => setGenderFilter(g)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${genderFilter === g ? 'bg-domira-gold text-domira-navy shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{g}</button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </section>
               </div>

               <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-domira-deep">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    className="py-6 font-black uppercase text-xs tracking-[0.3em] shadow-2xl bg-domira-gold text-domira-navy border-white/10"
                    onClick={() => setShowWizard(false)}
                  >
                     Apply Harmony Filters
                  </Button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
