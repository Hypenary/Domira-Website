
import React, { useState, useEffect } from 'react';
import { UserProfile, LIFESTYLE_TAGS, Property, UserRole, Badge, Review } from '../types';
import { Button } from '../components/Button';
import { 
  Save, User, UserCheck, Camera, ArrowLeft, ArrowRight, Tag, Plus, X, 
  Heart, LogOut, LayoutGrid, Edit, ExternalLink, DollarSign, 
  ShieldCheck, ShieldAlert, CheckCircle2, Circle, Eye, EyeOff, 
  Sparkles, FileText, Award, TrendingUp, Star, Crown, Palette, 
  Zap, Settings, Users, MessageSquare, ThumbsUp, Quote, Briefcase, MapPin,
  // Fix: Added missing Building icon import
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

  // Gold Theme Selection
  const [selectedTheme, setSelectedTheme] = useState<UserProfile['gold_theme']>(user.gold_theme || 'Classic');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'gold') setActiveTab('gold');
    if (params.get('tab') === 'verification') setActiveTab('verification');
    if (params.get('tab') === 'reputation') setActiveTab('reputation');

    const fetchData = async () => {
      setLoading(true);
      try {
        const [all, mine] = await Promise.all([
          api.properties.list(),
          api.properties.listByLandlord(user.id)
        ]);
        setSavedProperties(all.filter(p => user.saved_listings?.includes(p.id)));
        setMyProperties(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id, user.saved_listings, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...formData, gold_theme: selectedTheme });
    alert("Profile Passport Updated!");
  };

  const toggleTag = (tag: string) => {
    const current = formData.lifestyle_tags;
    const updated = current.includes(tag) 
      ? current.filter(t => t !== tag) 
      : [...current, tag];
    setFormData({ ...formData, lifestyle_tags: updated });
  };

  const isLandlord = user.role === UserRole.LANDLORD;
  const isGold = user.is_gold;

  const THEMES = [
    { id: 'Classic', name: 'Classic Gold', desc: 'Standard elegant gold accents', bg: 'bg-white dark:bg-domira-dark', accent: 'text-domira-gold' },
    { id: 'Midnight', name: 'Midnight Gold', desc: 'Premium deep black interface', bg: 'bg-slate-950', accent: 'text-domira-gold shadow-domira-gold/20' },
    { id: 'Sunrise', name: 'Sunrise Gold', desc: 'Soft morning glow gradients', bg: 'bg-gradient-to-br from-amber-50 to-white dark:from-domira-deep dark:to-domira-dark', accent: 'text-amber-600' },
    { id: 'Sapphire', name: 'Sapphire Gold', desc: '60% Gold dominance on Navy', bg: 'bg-domira-dark border-domira-gold', accent: 'text-domira-gold' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-1000 py-0 overflow-hidden ${isGold && selectedTheme === 'Midnight' ? 'bg-slate-950 text-slate-100' : isGold && selectedTheme === 'Sunrise' ? 'bg-gradient-to-br from-amber-50 to-white dark:from-domira-deep dark:to-domira-dark' : isGold && selectedTheme === 'Sapphire' ? 'bg-domira-deep' : 'bg-white dark:bg-domira-dark'}`}>
      <VerificationAlert user={user} />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Superior Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 px-4">
           <div className="flex items-center gap-6">
              <Link to="/" className="p-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-domira-gold transition-all shadow-sm">
                 <ArrowLeft size={20} />
              </Link>
              <div>
                 <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-2">My Passport</h1>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" /> Identity Secure Hub
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <Link to={`/roommate/${user.id}`}>
                <Button variant="outline" className="px-6 py-3 border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                   <Eye size={14} /> View Public Passport
                </Button>
              </Link>
              {isGold ? (
                <div className="px-6 py-3 bg-domira-gold text-domira-navy rounded-2xl flex items-center gap-2 shadow-2xl shadow-domira-gold/30 font-black uppercase text-[10px] tracking-widest border border-white/20">
                  <Crown size={14} fill="currentColor"/> Gold Active
                </div>
              ) : (
                <button 
                  onClick={() => setActiveTab('gold')}
                  className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-domira-navy rounded-2xl flex items-center gap-2 shadow-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                >
                  <Sparkles size={14} className="text-domira-gold" /> Go Gold
                </button>
              )}
              <button onClick={onLogout} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all" title="Logout">
                 <LogOut size={20} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           {/* Passport Sidebar */}
           <div className="lg:col-span-1 space-y-8">
              <div className={`p-10 rounded-[3.5rem] border text-center relative overflow-hidden group transition-all duration-700 ${isGold ? 'bg-domira-navy dark:bg-domira-deep border-domira-gold/40 shadow-[0_40px_100px_rgba(251,191,36,0.1)] ring-2 ring-domira-gold/10' : 'bg-slate-50 dark:bg-domira-navy border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                 {isGold && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-domira-gold/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                 )}
                 <div className="relative inline-block mb-10">
                    <div className={`w-44 h-44 rounded-[3.5rem] p-1.5 transition-all duration-1000 ${isGold ? 'bg-gradient-to-tr from-domira-gold to-white/20 shadow-[0_20px_60px_rgba(251,191,36,0.3)]' : 'bg-slate-200 dark:bg-slate-700 shadow-xl'}`}>
                      <img src={formData.avatar_url} className={`w-full h-full rounded-[3.2rem] object-cover border-4 border-white dark:border-domira-navy`} />
                    </div>
                    <button className="absolute bottom-1 right-1 bg-domira-gold p-4 rounded-2xl text-domira-navy shadow-xl border-4 border-white dark:border-domira-navy hover:scale-110 transition-transform active:scale-90">
                       <Camera size={20} />
                    </button>
                 </div>
                 <h2 className={`text-4xl font-black tracking-tighter mb-1 ${isGold ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{formData.full_name}</h2>
                 <div className="flex flex-col gap-2 mb-10">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isGold ? 'text-domira-gold' : 'text-slate-400'}`}>{formData.occupation}</p>
                    <div className="flex justify-center items-center gap-1">
                       <Star size={12} className="text-domira-gold fill-domira-gold" />
                       <span className={`text-[10px] font-black ${isGold ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{user.rating || '5.0'}</span>
                       <span className="text-[10px] text-slate-500 font-bold uppercase ml-1">Rating</span>
                    </div>
                 </div>

                 <div className={`pt-10 border-t ${isGold ? 'border-white/5' : 'border-slate-100 dark:border-slate-800'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-8 ${isGold ? 'text-slate-50' : 'text-slate-400'}`}>Achievement Shelf</p>
                    <div className="grid grid-cols-4 gap-4">
                       {user.is_verified && (
                         <div className="flex justify-center">
                            <BadgeIcon badge={{id:'ver', name:'Verified Resident', icon:'ShieldCheck', earned:true, description:'Identity verified.'}} size={18} />
                         </div>
                       )}
                       {user.badges?.filter(b => b.earned).slice(0, 3).map(badge => (
                         <div key={badge.id} className="flex justify-center">
                            <BadgeIcon badge={badge} size={16} />
                         </div>
                       ))}
                       {isGold && (
                         <div className="flex justify-center">
                            <BadgeIcon badge={{id:'gold', name:'Domira Gold', icon:'Crown', earned:true, description:'Elite Member'}} size={18} />
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Dynamic Theme Widget (Visible only if Gold) */}
              {isGold && (
                <div className="bg-slate-950 border border-domira-gold/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform"><Palette size={60} className="text-domira-gold" /></div>
                   <h3 className="text-domira-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 relative z-10">Active Interface</h3>
                   <div className="grid grid-cols-4 gap-2 relative z-10">
                      {THEMES.map(t => (
                        <button 
                          key={t.id} 
                          onClick={() => setSelectedTheme(t.id as any)}
                          className={`h-10 rounded-xl border transition-all ${selectedTheme === t.id ? 'border-domira-gold bg-domira-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-slate-800 bg-slate-900 hover:border-slate-600'}`}
                          title={t.name}
                        ></button>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* Tabbed Dashboard */}
           <div className="lg:col-span-3 space-y-12">
              <div className="flex flex-wrap gap-2 md:gap-8 border-b border-slate-100 dark:border-slate-800">
                {[
                  { id: 'profile', label: 'Identity', icon: User },
                  { id: 'reputation', label: 'Reputation', icon: Star },
                  { id: 'verification', label: 'Security', icon: ShieldCheck },
                  { id: 'gold', label: 'Gold Privileges', icon: Crown },
                  { id: 'listings', label: 'Portfolio', icon: Building, hidden: !isLandlord },
                  { id: 'saved', label: 'Wishlist', icon: Heart }
                ].map(tab => !tab.hidden && (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`pb-5 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center gap-2 group ${activeTab === tab.id ? 'text-domira-gold' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <tab.icon size={14} className={`transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-domira-gold' : 'text-slate-400'}`} />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-domira-gold rounded-t-full shadow-[0_-4px_10px_rgba(251,191,36,0.5)]"></div>}
                  </button>
                ))}
              </div>

              <div className="min-h-[600px]">
                {activeTab === 'profile' && (
                  <div className="grid gap-12 animate-in fade-in duration-500">
                    <div className={`${isGold ? 'bg-white/5 backdrop-blur-md border-white/10' : 'bg-white dark:bg-domira-navy border-slate-100 dark:border-slate-800'} p-10 md:p-14 rounded-[3.5rem] border shadow-2xl relative`}>
                       {isGold && <div className="absolute top-0 right-0 p-12 opacity-5"><Quote size={120} className="text-domira-gold" /></div>}
                       <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                          <div className="grid md:grid-cols-2 gap-10">
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Public Display Name</label>
                                <input type="text" className={`w-full p-5 rounded-3xl font-bold outline-none transition-all shadow-inner ${isGold ? 'bg-slate-900 border-white/10 text-white focus:border-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-domira-gold'}`} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Occupation Context</label>
                                <input type="text" className={`w-full p-5 rounded-3xl font-bold outline-none transition-all shadow-inner ${isGold ? 'bg-slate-900 border-white/10 text-white focus:border-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-domira-gold'}`} value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
                             </div>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Behavioral Bio (How others see you)</label>
                             <textarea rows={5} className={`w-full p-6 rounded-[2rem] font-medium text-lg leading-relaxed outline-none transition-all shadow-inner resize-none italic ${isGold ? 'bg-slate-900 border-white/10 text-white focus:border-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-domira-gold'}`} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 ml-1">My Lifestyle Tags (Fingerprint)</label>
                            <div className="flex flex-wrap gap-3">
                               {LIFESTYLE_TAGS.map(tag => (
                                 <button 
                                   key={tag}
                                   type="button"
                                   onClick={() => toggleTag(tag)}
                                   className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.lifestyle_tags.includes(tag) ? 'bg-domira-gold text-domira-navy border-domira-gold shadow-lg shadow-domira-gold/20 scale-105' : (isGold ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400')}`}
                                 >
                                    {tag}
                                 </button>
                               ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-8 pt-10 border-t border-white/10">
                            <Button variant="primary" type="submit" className="px-14 font-black uppercase tracking-[0.2em] text-[10px] py-6 bg-domira-gold text-domira-navy shadow-2xl shadow-domira-gold/20 active:scale-95 transition-all">Apply Global Identity Update</Button>
                            <p className="hidden md:block text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">Last verification sync: 2 hours ago</p>
                          </div>
                       </form>
                    </div>
                  </div>
                )}

                {activeTab === 'reputation' && (
                  <div className="animate-in fade-in duration-500 space-y-12">
                     <div className="grid md:grid-cols-3 gap-8">
                        <div className={`p-10 rounded-[3rem] text-center border ${isGold ? 'bg-white/5 border-white/10' : 'bg-white dark:bg-domira-navy border-slate-100 dark:border-slate-800 shadow-xl'}`}>
                           <p className="text-7xl font-black text-domira-gold tracking-tighter mb-4">{user.rating || '5.0'}</p>
                           <div className="flex justify-center gap-1 mb-4">
                              {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-domira-gold fill-domira-gold" />)}
                           </div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Community Score</p>
                        </div>
                        <div className={`md:col-span-2 p-10 rounded-[3rem] border flex items-center gap-8 ${isGold ? 'bg-white/5 border-white/10' : 'bg-white dark:bg-domira-navy border-slate-100 dark:border-slate-800 shadow-xl'}`}>
                           <div className="p-6 bg-blue-500/10 rounded-[2rem] border border-blue-500/20 text-blue-500"><MessageSquare size={40} /></div>
                           <div>
                              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Active Endorsements</h3>
                              <p className="text-sm text-slate-500 font-medium">You have <span className="text-domira-gold font-black">{user.reviews?.length || 0} verified reviews</span> from previous housemates and landlords.</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] px-4">Verification History Feed</h3>
                        {user.reviews && user.reviews.length > 0 ? (
                           user.reviews.map(review => (
                              <div key={review.id} className={`p-10 rounded-[3rem] border group transition-all hover:border-domira-gold/30 ${isGold ? 'bg-white/5 border-white/10' : 'bg-white dark:bg-domira-navy border-slate-100 dark:border-slate-800 shadow-xl'}`}>
                                 <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                       <img src={review.author_avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10" alt="" />
                                       <div>
                                          <p className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">{review.author_name}</p>
                                          <p className="text-[10px] text-slate-500 font-bold uppercase">{review.date}</p>
                                       </div>
                                    </div>
                                    <div className="flex gap-1">
                                       {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} className="text-domira-gold fill-domira-gold" />)}
                                    </div>
                                 </div>
                                 <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-domira-gold/20 pl-6">
                                    "{review.comment}"
                                 </p>
                                 <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-xl uppercase tracking-[0.2em]">Escrow Verified Job</span>
                                    <button className="text-slate-400 hover:text-domira-gold transition-colors"><ThumbsUp size={18}/></button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="py-20 bg-slate-50 dark:bg-domira-navy/50 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center opacity-60">
                              <Zap size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-6" />
                              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No reviews logged yet.</p>
                           </div>
                        )}
                     </div>
                  </div>
                )}

                {activeTab === 'verification' && (
                  <div className="bg-white dark:bg-domira-navy p-12 md:p-20 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl animate-in slide-in-from-right-4">
                     <div className="flex flex-col items-center text-center">
                        <div className={`w-28 h-28 rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl ${user.is_verified ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-domira-gold/10 border-domira-gold/20 text-domira-gold animate-pulse'}`}>
                           <ShieldCheck size={56} />
                        </div>
                        <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase">Trust Protocol</h3>
                        <p className="text-slate-500 font-medium max-w-lg mb-16 text-xl leading-relaxed">
                          {user.is_verified 
                            ? "Your identity passport is fully synchronized. Landlords prioritize your inquiries by 400%."
                            : "Complete the mandatory behavioral audit and document verification to unlock premium listings."
                          }
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-10 w-full max-w-4xl">
                           <div className={`p-12 rounded-[3.5rem] border transition-all flex flex-col items-center group shadow-xl ${user.questionnaire_completed ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-50 dark:bg-domira-dark border-slate-200 dark:border-slate-800'}`}>
                              <Users className={`mb-8 ${user.questionnaire_completed ? 'text-green-500' : 'text-slate-300 group-hover:text-domira-gold'}`} size={48} />
                              <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3">Lifestyle Set</h4>
                              <p className={`text-sm font-black mb-8 ${user.questionnaire_completed ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                                {user.questionnaire_completed ? 'AUDIT COMPLETED' : 'INCOMPLETE'}
                              </p>
                              {!user.questionnaire_completed && (
                                <Link to="/verify-lifestyle" className="w-full">
                                  <Button variant="primary" fullWidth size="lg" className="font-black uppercase text-[10px] tracking-widest py-5 bg-domira-gold shadow-lg shadow-domira-gold/20">Establish Behavior</Button>
                                </Link>
                              )}
                           </div>
                           
                           <div className={`p-12 rounded-[3.5rem] border transition-all flex flex-col items-center group shadow-xl ${user.document_verified ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-50 dark:bg-domira-dark border-slate-200 dark:border-slate-800'}`}>
                              <FileText className={`mb-8 ${user.document_verified ? 'text-green-500' : 'text-slate-300 group-hover:text-domira-gold'}`} size={48} />
                              <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3">Identity Credentials</h4>
                              <p className={`text-sm font-black mb-8 ${user.document_verified ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                                {user.document_verified ? 'VERIFIED' : 'PENDING'}
                              </p>
                              {!user.document_verified && (
                                <Link to="/verify-documents" className="w-full">
                                  <Button variant="outline" fullWidth size="lg" className="font-black uppercase text-[10px] tracking-widest py-5 border-slate-200 dark:border-slate-700 text-slate-500">Upload Credentials</Button>
                                </Link>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'gold' && (
                  <div className="animate-in slide-in-from-bottom-10 duration-700">
                     {!isGold ? (
                       <div className="bg-slate-950 text-white rounded-[4rem] p-16 md:p-24 border-2 border-domira-gold/30 shadow-[0_50px_120px_rgba(251,191,36,0.2)] relative overflow-hidden text-center">
                          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-domira-gold/10 blur-[150px] rounded-full pointer-events-none"></div>
                          <div className="relative z-10">
                            <div className="w-28 h-28 bg-domira-gold/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 border border-domira-gold/40 shadow-2xl animate-pulse">
                              <Crown className="w-14 h-14 text-domira-gold" fill="currentColor" />
                            </div>
                            <h2 className="text-6xl font-black mb-8 tracking-tighter leading-tight">Elevate to <span className="text-domira-gold italic">Gold</span>.</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto mb-20 text-2xl font-medium leading-relaxed">The elite standard for rentals in Sabah. Enhanced visibility, priority matching, and premium themes.</p>
                            <div className="flex flex-col items-center gap-6">
                               <Link to="/checkout?type=UPGRADE&period=monthly">
                                 <Button variant="primary" size="lg" className="px-24 py-8 font-black uppercase text-sm tracking-[0.3em] shadow-[0_30px_60px_rgba(251,191,36,0.3)] bg-domira-gold text-domira-navy hover:scale-105 transition-all border-4 border-white/10">
                                   Unlock Gold RM 15/mo
                                 </Button>
                               </Link>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Support Included</p>
                            </div>
                          </div>
                       </div>
                     ) : (
                       <div className="bg-slate-950 text-white rounded-[4rem] p-16 md:p-24 border-2 border-domira-gold/50 shadow-[0_50px_150px_rgba(251,191,36,0.3)] relative overflow-hidden group">
                          <div className="absolute -top-40 -right-40 opacity-10 rotate-12 pointer-events-none transition-transform duration-[2000ms] group-hover:rotate-45 group-hover:scale-125">
                            <Crown size={600} fill="currentColor" className="text-domira-gold" />
                          </div>
                          <div className="relative z-10 flex flex-col md:flex-row gap-20">
                             <div className="flex-1 space-y-12">
                                <div>
                                   <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-domira-gold/20 border border-domira-gold/30 rounded-full text-domira-gold text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-xl shadow-domira-gold/10">
                                      <Star size={14} fill="currentColor" className="animate-spin-slow"/> Elite Gold Member
                                   </div>
                                   <h2 className="text-8xl font-black mb-8 tracking-tighter leading-[0.8]">Master <br/><span className="text-domira-gold italic">Control</span>.</h2>
                                   <p className="text-slate-400 font-medium text-2xl leading-relaxed max-w-lg">Your profile is currently receiving 1st-tier visibility in the Kota Kinabalu market.</p>
                                </div>
                                <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-2xl">
                                   <div className="flex justify-between items-center mb-10">
                                      <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Since</p><p className="text-2xl font-black text-white uppercase tracking-tight">Oct 2024</p></div>
                                      <div className="text-right"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cycle</p><p className="text-2xl font-black text-domira-gold uppercase tracking-tight">Monthly</p></div>
                                   </div>
                                   <button className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all border border-slate-800 shadow-xl">Manage Subscription</button>
                                </div>
                             </div>
                             <div className="w-full md:w-[400px] space-y-8 pt-20">
                                {[
                                  { icon: UserCheck, text: 'Unlimited Harmony Requests' },
                                  { icon: ShieldCheck, text: 'Ad-Free Interface Active' },
                                  { icon: Palette, text: 'Premium Themes Unlocked' },
                                  { icon: Crown, text: 'Verified Gold Passport' },
                                  { icon: Zap, text: 'Priority Matching Algorithm' }
                                ].map((perk, i) => (
                                  <div key={i} className="flex items-center gap-6 group cursor-default">
                                     <div className="w-14 h-14 rounded-[1.5rem] bg-domira-gold/10 border border-domira-gold/20 flex items-center justify-center group-hover:bg-domira-gold/30 transition-all duration-500 shadow-lg group-hover:shadow-domira-gold/20"><perk.icon size={24} className="text-domira-gold" /></div>
                                     <span className="text-sm font-black uppercase tracking-widest text-slate-200 group-hover:text-white transition-colors">{perk.text}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                     )}
                  </div>
                )}

                {activeTab === 'listings' && isLandlord && (
                  <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                     <Link to="/list-property" className="group h-full">
                        <div className="h-full min-h-[450px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3.5rem] flex flex-col items-center justify-center text-center p-12 hover:border-domira-gold hover:bg-domira-gold/5 transition-all shadow-inner">
                           <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:bg-domira-gold group-hover:text-domira-navy transition-all shadow-2xl shadow-black/10"><Plus size={40} /></div>
                           <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">New Asset</h3>
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">List to Sabah's elite network</p>
                        </div>
                     </Link>
                     {myProperties.map(p => <PropertyCard key={p.id} property={p} />)}
                  </div>
                )}

                {activeTab === 'saved' && (
                  <>
                    {savedProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                        {savedProperties.map(p => <PropertyCard key={p.id} property={p} />)}
                      </div>
                    ) : (
                      <div className="py-32 bg-white dark:bg-domira-navy rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-xl text-center">
                         <Heart className="w-20 h-20 text-slate-100 dark:text-slate-800 mx-auto mb-8" />
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Empty Wishlist</h3>
                         <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-12">Start liking units to build your collection.</p>
                         <Link to="/find-property">
                          <Button variant="outline" className="px-12 py-5 border-slate-200 dark:border-slate-700 font-black uppercase text-[10px] tracking-widest">Explore Listings</Button>
                         </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
