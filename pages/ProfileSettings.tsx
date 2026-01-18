
import React, { useState, useEffect } from 'react';
import { UserProfile, LIFESTYLE_TAGS, Property, UserRole, Badge, Review } from '../types';
import { Button } from '../components/Button';
import { 
  Save, User, UserCheck, Camera, ArrowLeft, ArrowRight, Tag, Plus, X, 
  Heart, LogOut, LayoutGrid, Edit, ExternalLink, DollarSign, 
  ShieldCheck, ShieldAlert, CheckCircle2, Circle, Eye, EyeOff, 
  Sparkles, FileText, Award, TrendingUp, Star, Crown, Palette, 
  Zap, Settings, Users, MessageSquare, ThumbsUp, Quote, Briefcase, MapPin,
  Building
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/mockSupabase';
import { PropertyCard } from '../components/PropertyCard';
import { BadgeIcon } from '../components/BadgeIcon';
import { VerificationAlert } from '../components/VerificationAlert';

interface ProfileSettingsProps {
  user: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'profile' | 'verification' | 'reputation' | 'gold' | 'listings' | 'saved'>('profile');
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    occupation: user.occupation || '',
    bio: user.bio || '',
    avatar_url: user.avatar_url,
    lifestyle_tags: user.lifestyle_tags || [],
    roommate_finding_active: user.roommate_finding_active,
  });
  
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<UserProfile['gold_theme']>(user.gold_theme || 'Classic');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') as any;
    if (tab) setActiveTab(tab);
    
    api.properties.list().then(all => setSavedProperties(all.filter(p => user.saved_listings?.includes(p.id))));
    api.properties.listByLandlord(user.id).then(mine => { setMyProperties(mine); setLoading(false); });
  }, [user.id, user.saved_listings, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...formData, gold_theme: selectedTheme });
    alert("Passport Synchronized.");
  };

  const toggleTag = (tag: string) => {
    const updated = formData.lifestyle_tags.includes(tag) ? formData.lifestyle_tags.filter(t => t !== tag) : [...formData.lifestyle_tags, tag];
    setFormData({ ...formData, lifestyle_tags: updated });
  };

  const isLandlord = user.role === UserRole.LANDLORD;
  const isGold = user.is_gold;

  const THEMES = [
    { id: 'Classic', name: 'Classic Gold' },
    { id: 'Midnight', name: 'Midnight Gold' },
    { id: 'Sunrise', name: 'Sunrise Gold' },
    { id: 'Sapphire', name: 'Sapphire Gold' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-1000 py-0 pb-20 ${isGold && selectedTheme === 'Midnight' ? 'bg-slate-950 text-slate-100' : isGold && selectedTheme === 'Sunrise' ? 'bg-gradient-to-br from-amber-50 to-white dark:from-domira-deep dark:to-domira-dark' : isGold && selectedTheme === 'Sapphire' ? 'bg-domira-deep' : 'bg-white dark:bg-domira-dark'}`}>
      <VerificationAlert user={user} />
      
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-8 px-2 md:px-4">
           <div className="flex items-center gap-5 md:gap-6">
              <Link to="/" className="p-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-domira-gold shadow-sm">
                 <ArrowLeft size={20} />
              </Link>
              <div>
                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-2">My Passport</h1>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" /> Identity Secure
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Link to={`/roommate/${user.id}`} className="shrink-0">
                <Button variant="outline" className="px-5 py-3 border-slate-200 dark:border-slate-800 font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
                   <Eye size={14} /> Public View
                </Button>
              </Link>
              {isGold ? (
                <div className="shrink-0 px-5 py-3 bg-domira-gold text-domira-navy rounded-2xl flex items-center gap-2 shadow-xl font-black uppercase text-[9px] tracking-widest border border-white/20">
                  <Crown size={14} fill="currentColor"/> Gold Active
                </div>
              ) : (
                <button onClick={() => setActiveTab('gold')} className="shrink-0 px-5 py-3 bg-slate-900 text-white dark:bg-white dark:text-domira-navy rounded-2xl flex items-center gap-2 shadow-xl font-black uppercase text-[9px] tracking-widest transition-all">
                  <Sparkles size={14} className="text-domira-gold" /> Go Gold
                </button>
              )}
              <button onClick={onLogout} className="shrink-0 p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                 <LogOut size={20} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
           {/* Sidebar - Stacks on mobile */}
           <div className="lg:col-span-1 space-y-6 md:space-y-8">
              <div className={`p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border text-center relative overflow-hidden transition-all duration-700 ${isGold ? 'bg-domira-navy dark:bg-domira-deep border-domira-gold/40 shadow-2xl' : 'bg-slate-50 dark:bg-domira-navy border-slate-100 dark:border-slate-800'}`}>
                 <div className="relative inline-block mb-8">
                    <div className={`w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] md:rounded-[3.5rem] p-1.5 transition-all duration-1000 ${isGold ? 'bg-gradient-to-tr from-domira-gold to-white/20' : 'bg-slate-200 dark:bg-slate-700 shadow-xl'}`}>
                      <img src={formData.avatar_url} className="w-full h-full rounded-[2.2rem] md:rounded-[3.2rem] object-cover border-4 border-white dark:border-domira-navy" alt="" />
                    </div>
                    <button className="absolute bottom-1 right-1 bg-domira-gold p-3 md:p-4 rounded-xl md:rounded-2xl text-domira-navy shadow-xl border-4 border-white dark:border-domira-navy">
                       <Camera size={16} className="md:w-5 md:h-5" />
                    </button>
                 </div>
                 <h2 className={`text-3xl md:text-4xl font-black tracking-tighter mb-1 ${isGold ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{formData.full_name}</h2>
                 <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-8 ${isGold ? 'text-domira-gold' : 'text-slate-400'}`}>{formData.occupation}</p>
                 
                 <div className={`pt-8 border-t ${isGold ? 'border-white/5' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className="grid grid-cols-4 gap-2">
                       {user.is_verified && <div className="flex justify-center"><BadgeIcon badge={{id:'ver', name:'Verified', icon:'ShieldCheck', earned:true, description:'ID verified.'}} size={16} /></div>}
                       {isGold && <div className="flex justify-center"><BadgeIcon badge={{id:'gold', name:'Gold', icon:'Crown', earned:true, description:'Elite Member'}} size={16} /></div>}
                       {user.badges?.filter(b => b.earned).slice(0, 2).map(badge => (
                         <div key={badge.id} className="flex justify-center"><BadgeIcon badge={badge} size={14} /></div>
                       ))}
                    </div>
                 </div>
              </div>
              
              {isGold && (
                <div className="bg-slate-950 border border-domira-gold/20 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                   <h3 className="text-domira-gold text-[9px] font-black uppercase tracking-[0.4em] mb-6">Active Theme</h3>
                   <div className="grid grid-cols-4 gap-2">
                      {THEMES.map(t => (
                        <button key={t.id} onClick={() => setSelectedTheme(t.id as any)} className={`h-8 md:h-10 rounded-xl border transition-all ${selectedTheme === t.id ? 'border-domira-gold bg-domira-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-slate-800 bg-slate-900'}`} title={t.name}></button>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* Content Tabs - Horizontal scroll on mobile */}
           <div className="lg:col-span-3 space-y-10 md:space-y-12">
              <div className="flex items-center overflow-x-auto pb-4 gap-6 md:gap-8 border-b border-slate-100 dark:border-slate-800 scrollbar-hide">
                {[
                  { id: 'profile', label: 'Identity', icon: User },
                  { id: 'reputation', label: 'Reviews', icon: Star },
                  { id: 'verification', label: 'Security', icon: ShieldCheck },
                  { id: 'gold', label: 'Privileges', icon: Crown },
                  { id: 'listings', label: 'Portfolio', icon: Building, hidden: !isLandlord },
                  { id: 'saved', label: 'Wishlist', icon: Heart }
                ].map(tab => !tab.hidden && (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`shrink-0 pb-4 px-1 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center gap-2 group ${activeTab === tab.id ? 'text-domira-gold' : 'text-slate-400'}`}
                  >
                    <tab.icon size={14} className={activeTab === tab.id ? 'text-domira-gold' : 'text-slate-400'} />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-domira-gold rounded-t-full shadow-[0_-4px_10px_rgba(251,191,36,0.5)]"></div>}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {activeTab === 'profile' && (
                  <div className="animate-in fade-in duration-500">
                    <div className={`${isGold ? 'bg-white/5 backdrop-blur-md border-white/10' : 'bg-white dark:bg-domira-navy border-slate-100 dark:border-slate-800'} p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-2xl relative`}>
                       <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12 relative z-10">
                          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Display Name</label>
                                <input type="text" className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl font-bold outline-none transition-all shadow-inner ${isGold ? 'bg-slate-900 border-white/10 text-white focus:border-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-domira-gold'}`} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Occupation</label>
                                <input type="text" className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl font-bold outline-none transition-all shadow-inner ${isGold ? 'bg-slate-900 border-white/10 text-white focus:border-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-domira-gold'}`} value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
                             </div>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Behavioral Bio</label>
                             <textarea rows={4} className={`w-full p-5 rounded-[1.5rem] md:rounded-[2rem] font-medium text-lg leading-relaxed outline-none transition-all shadow-inner resize-none italic ${isGold ? 'bg-slate-900 border-white/10 text-white focus:border-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-domira-gold'}`} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 ml-1">Lifestyle Fingerprint</label>
                            <div className="flex flex-wrap gap-2.5">
                               {LIFESTYLE_TAGS.map(tag => (
                                 <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-5 py-2.5 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.lifestyle_tags.includes(tag) ? 'bg-domira-gold text-domira-navy border-domira-gold shadow-lg' : (isGold ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400')}`}>
                                    {tag}
                                 </button>
                               ))}
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row items-center gap-6 pt-10 border-t border-white/10">
                            <Button variant="primary" type="submit" className="w-full md:w-auto px-14 font-black uppercase tracking-[0.2em] text-[10px] py-6 bg-domira-gold text-domira-navy shadow-2xl shadow-domira-gold/20 active:scale-95 transition-all">Synchronize Passport</Button>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">End-to-End Encrypted Data</p>
                          </div>
                       </form>
                    </div>
                  </div>
                )}
                {activeTab === 'saved' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in duration-500">
                    {savedProperties.length > 0 ? savedProperties.map(p => <PropertyCard key={p.id} property={p} />) : (
                      <div className="col-span-full py-24 bg-slate-50 dark:bg-domira-navy rounded-[3rem] border border-dashed border-slate-200 text-center opacity-60">
                         <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                         <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Wishlist Empty</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Other tabs can follow same pattern, ensuring padding and grid gap are responsive */}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
