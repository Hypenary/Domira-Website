
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  User, 
  Filter, 
  ArrowRight, 
  Zap, 
  Heart,
  MessageSquare,
  ShieldCheck,
  Building,
  Info,
  ChevronRight,
  TrendingUp,
  X,
  // Added missing UserCheck icon import
  UserCheck
} from 'lucide-react';
import { Button } from '../components/Button';
import { api } from '../services/mockSupabase';
import { Gig, GigApplication, UserProfile, UserRole } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface GigHubProps {
  user: UserProfile | null;
}

export const GigHub: React.FC<GigHubProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'find' | 'post' | 'manage'>('find');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post Form State
  const [postSuccess, setPostSuccess] = useState(false);
  const [newGig, setNewGig] = useState<Partial<Gig>>({
    title: '',
    description: '',
    location: '',
    pay_amount: 0,
    duration: 1,
    category: 'Cleaning',
    is_public: true
  });

  // Application State
  const [applyingFor, setApplyingFor] = useState<Gig | null>(null);
  const [appMessage, setAppMessage] = useState('');
  const [appSuccess, setAppSuccess] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const data = await api.gigs.list();
      setGigs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== UserRole.LANDLORD) {
      alert("Only verified landlords can post gigs.");
      return;
    }
    try {
      await api.gigs.create(newGig);
      setPostSuccess(true);
      fetchGigs();
      setTimeout(() => {
        setPostSuccess(false);
        setActiveTab('find');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      await api.gigs.apply(applyingFor!.id, { message: appMessage });
      setAppSuccess(true);
      setTimeout(() => {
        setAppSuccess(false);
        setApplyingFor(null);
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGigs = gigs.filter(g => {
    const matchesType = filterType === 'all' || g.category.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const isVerified = user?.is_verified;

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300 pb-20">
      {/* Apply Modal */}
      {applyingFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-domira-navy rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
              <div className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Apply for Gig</h3>
                    <button onClick={() => setApplyingFor(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                 </div>
                 
                 {appSuccess ? (
                   <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Application Sent!</h4>
                      <p className="text-slate-500 text-sm">Landlord will be notified. Opening chat...</p>
                   </div>
                 ) : (
                   <form onSubmit={handleApply} className="space-y-6">
                      <div className="bg-slate-50 dark:bg-domira-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                         <p className="text-[10px] font-black text-domira-gold uppercase tracking-widest mb-1">{applyingFor.category}</p>
                         <h4 className="text-sm font-black text-slate-900 dark:text-white">{applyingFor.title}</h4>
                         <p className="text-xs text-slate-500 mt-1">RM {applyingFor.pay_amount} for {applyingFor.duration} hrs</p>
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Why are you a good fit?</label>
                         <textarea 
                           required 
                           rows={4} 
                           className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold resize-none shadow-inner"
                           placeholder="Tell the landlord about your experience and availability..."
                           value={appMessage}
                           onChange={(e) => setAppMessage(e.target.value)}
                         ></textarea>
                      </div>
                      <Button variant="primary" fullWidth size="lg" className="font-black uppercase text-xs tracking-widest py-5">Apply Now</Button>
                   </form>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-domira-navy pt-20 pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-domira-gold/10 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-domira-gold text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-domira-gold" /> 0% Commission Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            Student <span className="text-domira-gold italic">Gig Hub</span>. <br />
            Work Local. Earn Fast.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Connecting students with flexible cleaning and maintenance tasks. Direct pay, honest work, stronger community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-1">
             <button 
              onClick={() => setActiveTab('find')} 
              className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'find' ? 'bg-domira-gold text-domira-navy shadow-2xl' : 'text-slate-400 hover:text-white'}`}
             >
               Find Gigs
             </button>
             <button 
              onClick={() => setActiveTab('post')} 
              className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'post' ? 'bg-domira-gold text-domira-navy shadow-2xl' : 'text-slate-400 hover:text-white'}`}
             >
               Post a Gig
             </button>
             {user && (
                <button 
                onClick={() => setActiveTab('manage')} 
                className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-domira-gold text-domira-navy shadow-2xl' : 'text-slate-400 hover:text-white'}`}
                >
                  My Activity
                </button>
             )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        
        {activeTab === 'find' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
             {/* Search & Filter Bar */}
             <div className="bg-white dark:bg-domira-navy p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                    type="text" 
                    placeholder="Search by area or task..." 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-domira-gold text-sm font-bold shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <div className="flex gap-2">
                   {['All', 'Cleaning', 'Repair', 'Moving'].map(type => (
                     <button 
                      key={type}
                      onClick={() => setFilterType(type === 'All' ? 'all' : type)}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterType.toLowerCase() === type.toLowerCase() ? 'bg-domira-gold/10 border-domira-gold text-domira-gold' : 'bg-slate-50 dark:bg-domira-dark border-slate-200 dark:border-slate-800 text-slate-500'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>
             </div>

             {/* Gig Feed */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGigs.map(gig => (
                  <div key={gig.id} className="bg-white dark:bg-domira-navy rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-domira-gold/40 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                       <Briefcase size={80} className="text-domira-gold" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                       <div className="flex items-center gap-3">
                          <img src={gig.landlord_avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800" alt="" />
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{gig.landlord_name}</p>
                             <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-domira-gold fill-domira-gold" />
                                <span className="text-[10px] font-black text-slate-900 dark:text-white">{gig.landlord_rating}</span>
                             </div>
                          </div>
                       </div>
                       <div className="bg-green-500/10 px-3 py-1 rounded-xl text-[10px] font-black text-green-500 uppercase tracking-widest border border-green-500/20">
                          {gig.category}
                       </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-domira-gold transition-colors">{gig.title}</h3>
                    <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-6">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-domira-gold" /> {gig.location} <span className="mx-2">•</span> {gig.distance_from_ums} from UMS
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium line-clamp-2 italic">
                      "{gig.description}"
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                       <div className="flex justify-between items-center mb-6">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pay</p>
                             <p className="text-3xl font-black text-slate-900 dark:text-white">RM {gig.pay_amount}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Time</p>
                             <p className="text-lg font-black text-slate-700 dark:text-slate-300">{gig.duration} Hours</p>
                          </div>
                       </div>
                       <Button 
                        variant="primary" 
                        fullWidth 
                        className="py-4 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-domira-gold/10 group-hover:translate-y-[-2px] transition-all"
                        onClick={() => {
                          if(!isVerified) {
                             alert("You must be verified to apply for gigs.");
                             navigate('/verify-lifestyle');
                          } else {
                             setApplyingFor(gig);
                          }
                        }}
                       >
                         Apply for this Job
                       </Button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'post' && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-10 duration-500">
             <div className="bg-white dark:bg-domira-navy rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="bg-domira-gold p-8 md:p-12 text-center">
                   <h2 className="text-3xl font-black text-domira-navy mb-2 tracking-tight uppercase">Support a Student</h2>
                   <p className="text-domira-navy/70 font-bold text-sm">Post quick maintenance or cleaning tasks. Students keep 100% of the pay.</p>
                </div>
                
                {postSuccess ? (
                  <div className="p-20 text-center">
                     <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/20">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                     </div>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Gig Published!</h3>
                     <p className="text-slate-500 font-medium">Students in the area will be notified immediately.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePostGig} className="p-8 md:p-12 space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gig Title</label>
                           <input 
                            required 
                            name="title"
                            type="text" 
                            placeholder="e.g. One-time kitchen clean" 
                            className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner"
                            onChange={(e) => setNewGig({...newGig, title: e.target.value})}
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                           <select 
                            required 
                            className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold appearance-none cursor-pointer"
                            onChange={(e) => setNewGig({...newGig, category: e.target.value as any})}
                           >
                              <option value="Cleaning">Professional Cleaning</option>
                              <option value="Minor Repair">Minor Repair</option>
                              <option value="Moving">Help with Moving</option>
                              <option value="Other">Other Helper Task</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Task Description</label>
                        <textarea 
                          required 
                          rows={4} 
                          className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold resize-none shadow-inner"
                          placeholder="Describe the task in detail. Mention if tools are provided."
                          onChange={(e) => setNewGig({...newGig, description: e.target.value})}
                        ></textarea>
                     </div>

                     <div className="grid md:grid-cols-3 gap-8">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Total Pay (RM)</label>
                           <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                required 
                                type="number" 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner"
                                placeholder="50"
                                onChange={(e) => setNewGig({...newGig, pay_amount: parseInt(e.target.value)})}
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Est. Duration (Hrs)</label>
                           <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                required 
                                type="number" 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner"
                                placeholder="2"
                                onChange={(e) => setNewGig({...newGig, duration: parseInt(e.target.value)})}
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Visibility</label>
                           <select 
                            className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold"
                            onChange={(e) => setNewGig({...newGig, is_public: e.target.value === 'public'})}
                           >
                              <option value="public">Public (All Students)</option>
                              <option value="private">My Tenants Only</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Location Details</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Unit/Building name (Hidden from public)" 
                          className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner"
                          onChange={(e) => setNewGig({...newGig, location: e.target.value})}
                        />
                     </div>

                     <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth 
                      size="lg" 
                      className="font-black uppercase text-xs tracking-[0.2em] py-5 shadow-2xl shadow-domira-gold/20"
                      disabled={user?.role !== UserRole.LANDLORD}
                     >
                       {user?.role === UserRole.LANDLORD ? 'Post Gig for Free' : 'Only Landlords can post'}
                     </Button>
                     <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-black">All gigs must comply with local labour safety standards.</p>
                  </form>
                )}
             </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-domira-navy p-8 rounded-[2rem] border border-slate-800 text-white shadow-xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-domira-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Earnings</h4>
                   <p className="text-4xl font-black">RM 120.00</p>
                   <p className="text-xs text-green-400 mt-2 font-bold">+RM 50 this week</p>
                </div>
                <div className="bg-white dark:bg-domira-navy p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tasks Done</h4>
                   <p className="text-4xl font-black text-slate-900 dark:text-white">3 Gigs</p>
                   <p className="text-xs text-slate-400 mt-2 font-bold">1 in progress</p>
                </div>
                <div className="bg-white dark:bg-domira-navy p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Trust Score</h4>
                   <p className="text-4xl font-black text-slate-900 dark:text-white">4.9/5</p>
                   <p className="text-xs text-domira-gold mt-2 font-bold flex items-center gap-1"><ShieldCheck size={12}/> Vetted Helper</p>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Clock className="text-domira-gold" size={20}/> Ongoing & Past Tasks
                </h3>
                
                {[
                  { title: 'AC Filter Wash', landlord: 'Sarah Lim', status: 'In Progress', pay: 30, color: 'blue' },
                  { title: 'Furniture Assembly', landlord: 'Kevin Tan', status: 'Completed', pay: 60, color: 'green' },
                ].map((task, i) => (
                  <div key={i} className="bg-white dark:bg-domira-navy p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-domira-gold/30 transition-all">
                     <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${task.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                           <Briefcase size={24}/>
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-domira-gold transition-colors">{task.title}</h4>
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Landlord: {task.landlord}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-center md:text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                           <p className={`text-sm font-black uppercase ${task.color === 'blue' ? 'text-blue-500' : 'text-green-500'}`}>{task.status}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pay</p>
                           <p className="text-xl font-black text-slate-900 dark:text-white">RM {task.pay}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 hidden md:block" />
                     </div>
                  </div>
                ))}
                
                {/* Donation Prompt */}
                <div className="mt-12 bg-domira-gold/5 border-2 border-dashed border-domira-gold/20 p-10 rounded-[3rem] text-center relative overflow-hidden group">
                   <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-domira-gold opacity-5 group-hover:scale-110 transition-transform duration-700" />
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Keep Gig Hub Free!</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto mb-8">
                        Domira takes 0% cut from these jobs to support students in need. If you've found this helpful, consider a small donation to keep the lights on!
                      </p>
                      <Button variant="outline" className="px-10 py-4 font-black uppercase text-[10px] tracking-widest border-domira-gold/40 text-domira-gold hover:bg-domira-gold hover:text-domira-navy">Support Platform</Button>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
      
      {/* Ecosystem Footer Badge */}
      <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 pointer-events-none">
          <div className="flex items-center gap-3 font-black uppercase text-[10px] tracking-widest">
            <UserCheck size={24} className="text-blue-500" /> 100% Direct Pay
          </div>
          <div className="flex items-center gap-3 font-black uppercase text-[10px] tracking-widest">
            <CheckCircle2 size={24} className="text-domira-gold" /> Student Support
          </div>
          <div className="flex items-center gap-3 font-black uppercase text-[10px] tracking-widest">
            <ShieldCheck size={24} className="text-slate-500" /> No Fees Taken
          </div>
        </div>
    </div>
  );
};
