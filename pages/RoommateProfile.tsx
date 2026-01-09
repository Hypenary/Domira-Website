
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/mockSupabase';
import { RoommateProfile as RoommateProfileType, UserProfile, Review } from '../types';
import { Button } from '../components/Button';
import { 
  MapPin, Briefcase, Calendar, Check, MessageSquare, ArrowLeft, 
  ShieldCheck, Tag, Heart, Info, Award, Star, Quote, 
  UserPlus, ShieldAlert, Zap, Clock, Smartphone, MoreHorizontal,
  ThumbsUp, Send, X, Camera, PenTool
} from 'lucide-react';
import { BadgeIcon } from '../components/BadgeIcon';

export const RoommateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<RoommateProfileType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [isConnectSent, setIsConnectSent] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) setCurrentUser(JSON.parse(saved));

    const fetchProfile = async () => {
      if (id) {
        const data = await api.roommates.getById(id);
        if (data) {
          setProfile(data);
          setLocalReviews(data.user.reviews || []);
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleConnect = () => {
    setIsConnectSent(true);
    // In a real app, this would trigger a notification
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const review: Review = {
      id: `r_${Date.now()}`,
      author_name: currentUser.full_name,
      author_avatar: currentUser.avatar_url,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setLocalReviews([review, ...localReviews]);
    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: '' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark transition-colors">
      <div className="w-12 h-12 border-4 border-domira-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark text-slate-900 dark:text-white font-black uppercase tracking-widest">
      Profile Not Found
    </div>
  );

  const stats = [
    { label: 'Trust Score', value: '4.9/5', icon: ShieldCheck, color: 'text-green-500' },
    { label: 'Match Rate', value: `${profile.match_percentage}%`, icon: Heart, color: 'text-domira-gold' },
    { label: 'Verifications', value: '3 Passed', icon: Check, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark transition-colors duration-300 pb-32">
      {/* Dynamic Header */}
      <div className="bg-domira-navy pt-10 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-domira-gold/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <Link to="/find-roommate" className="inline-flex items-center text-slate-400 hover:text-white mb-10 font-black uppercase text-[10px] tracking-widest transition-all">
             <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
           </Link>
           
           <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-domira-gold/20 blur-2xl rounded-full animate-pulse group-hover:bg-domira-gold/40 transition-all"></div>
                    <img 
                      src={profile.user.avatar_url} 
                      className="w-44 h-44 rounded-[3.5rem] object-cover border-[8px] border-white dark:border-domira-dark shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105"
                      alt={profile.user.full_name}
                    />
                    {profile.user.is_verified && (
                      <div className="absolute -bottom-2 -right-2 z-20 bg-domira-gold text-domira-navy p-3 rounded-2xl border-4 border-white dark:border-domira-dark shadow-xl">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                    )}
                 </div>
                 <div className="text-center md:text-left mb-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                       <h1 className="text-5xl font-black text-white tracking-tighter">{profile.user.full_name}</h1>
                       <span className="text-2xl font-medium text-slate-500">, {profile.age}</span>
                       {profile.user.is_gold && (
                         <div className="px-4 py-1.5 bg-domira-gold/10 border border-domira-gold/30 rounded-xl text-domira-gold text-[10px] font-black uppercase tracking-widest animate-pulse">
                            Gold Member
                         </div>
                       )}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-2"><Briefcase size={16} className="text-domira-gold" /> {profile.user.occupation}</span>
                       <span className="flex items-center gap-2"><MapPin size={16} className="text-domira-gold" /> {profile.preferred_locations[0]}</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 w-full lg:w-auto">
                 {!isConnectSent ? (
                   <Button variant="primary" size="lg" onClick={handleConnect} className="flex-1 lg:flex-none px-12 py-7 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-domira-gold/20 bg-domira-gold text-domira-navy border-white/10 active:scale-95 transition-all">
                      <UserPlus className="mr-2" size={18} /> Request Match
                   </Button>
                 ) : (
                   <Button variant="outline" size="lg" disabled className="flex-1 lg:flex-none px-12 py-7 font-black uppercase text-xs tracking-[0.2em] bg-green-500/10 text-green-500 border-green-500/20">
                      <Check className="mr-2" size={18} /> Match Request Sent
                   </Button>
                 )}
                 <button className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white hover:bg-white/10 transition-all">
                    <MessageSquare size={24} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Left Bento: Verification & Lifestyle */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {stats.map((s, idx) => (
                    <div key={idx} className="bg-white dark:bg-domira-navy p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl group hover:border-domira-gold transition-all duration-500">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-800 ${s.color}`}>
                             <s.icon size={24} />
                          </div>
                          <Zap size={14} className="text-slate-200 dark:text-slate-800" />
                       </div>
                       <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{s.value}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                    </div>
                 ))}
              </div>

              {/* Bio & Behavioral Blueprint */}
              <div className="bg-white dark:bg-domira-navy p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5"><Quote size={120} className="text-domira-gold" /></div>
                 
                 <div className="relative z-10">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Behavioral Blueprint</h2>
                    <p className="text-2xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic mb-12">
                      "{profile.user.bio || "I prioritize a peaceful, organized living environment where communication is open and house rules are respected. Looking for a high-harmony co-living experience."}"
                    </p>

                    <div className="space-y-10">
                       <div>
                          <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                             <Tag size={14} className="text-domira-gold" /> Active Lifestyle Tags
                          </h3>
                          <div className="flex flex-wrap gap-3">
                             {profile.lifestyle_tags.map(tag => (
                               <span key={tag} className="px-5 py-3 bg-slate-50 dark:bg-domira-dark rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-domira-gold hover:text-domira-gold transition-all cursor-default shadow-sm">
                                  {tag}
                               </span>
                             ))}
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-domira-gold/10 rounded-xl"><Clock size={20} className="text-domira-gold" /></div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">ASAP / Within 30 Days</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-domira-gold/10 rounded-xl"><Smartphone size={20} className="text-domira-gold" /></div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Contact</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">Domira Secure Chat</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Verified Achievements Shelf */}
              <div className="bg-slate-900 p-12 rounded-[3.5rem] border-2 border-domira-gold/20 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Award size={100} className="text-domira-gold" /></div>
                 <div className="relative z-10">
                    <h2 className="text-[10px] font-black text-domira-gold uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-4">Achievement Showcase</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                       {profile.user.badges && profile.user.badges.filter(b => b.earned).length > 0 ? (
                         profile.user.badges.filter(b => b.earned).map(badge => (
                            <div key={badge.id} className="flex flex-col items-center text-center group/badge">
                               <div className="mb-4 transform transition-transform group-hover/badge:scale-110 duration-500">
                                  <BadgeIcon badge={badge} size={28} />
                               </div>
                               <p className="text-[9px] font-black text-white uppercase tracking-widest">{badge.name}</p>
                            </div>
                         ))
                       ) : (
                         <div className="col-span-full py-10 flex flex-col items-center text-center opacity-40">
                            <ShieldAlert className="text-white mb-4" size={40} />
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Initial Audit Phase</p>
                         </div>
                       )}
                       {/* Default Platform Badges for all verified users */}
                       {profile.user.is_verified && (
                          <div className="flex flex-col items-center text-center">
                             <div className="mb-4">
                                <BadgeIcon badge={{id:'p1', name:'ID Verified', icon:'UserCheck', description:'Officially recognized identity.', earned:true}} size={28} />
                             </div>
                             <p className="text-[9px] font-black text-white uppercase tracking-widest">ID Verified</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Bento: Ratings & Reviews */}
           <div className="lg:col-span-1 space-y-8">
              
              {/* Trust Summary Card */}
              <div className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl text-center">
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Resident Reputation</h2>
                 
                 <div className="flex flex-col items-center mb-10">
                    <p className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none">
                       {localReviews.length > 0 
                          ? (localReviews.reduce((acc, r) => acc + r.rating, 0) / localReviews.length).toFixed(1)
                          : '5.0'}
                    </p>
                    <div className="flex gap-1 mb-4">
                       {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-domira-gold fill-domira-gold" />)}
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{localReviews.length} Community Reviews</p>
                 </div>

                 <div className="space-y-3">
                    <Button 
                      variant="primary" 
                      fullWidth 
                      className="py-5 font-black uppercase text-[10px] tracking-widest bg-domira-navy text-white hover:bg-slate-800 shadow-xl"
                      onClick={() => {
                        if (!currentUser) navigate('/auth');
                        else setShowReviewModal(true);
                      }}
                    >
                       Write Review
                    </Button>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-4 leading-relaxed">
                       Only users with documented co-living or leasing history can submit reviews.
                    </p>
                 </div>
              </div>

              {/* Review Feed */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Feedback</h3>
                    <MoreHorizontal size={16} className="text-slate-400" />
                 </div>
                 
                 {localReviews.length > 0 ? (
                   localReviews.map(review => (
                      <div key={review.id} className="bg-white dark:bg-domira-navy p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                               <img src={review.author_avatar} className="w-10 h-10 rounded-xl object-cover border-2 border-slate-50 dark:border-slate-700" alt="" />
                               <div>
                                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{review.author_name}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">{review.date}</p>
                               </div>
                            </div>
                            <div className="flex gap-0.5">
                               {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={10} className="text-domira-gold fill-domira-gold" />)}
                            </div>
                         </div>
                         <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic font-medium">
                            "{review.comment}"
                         </p>
                         <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[8px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">Verified History</span>
                            <button className="text-slate-300 hover:text-domira-gold transition-colors"><ThumbsUp size={14} /></button>
                         </div>
                      </div>
                   ))
                 ) : (
                   <div className="p-12 bg-white dark:bg-domira-navy rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-center opacity-60">
                      <Zap className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No reviews yet</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-domira-navy w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
              <div className="p-10 md:p-14">
                 <div className="flex justify-between items-center mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Submit Feedback</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Reviewing {profile.user.full_name}</p>
                    </div>
                    <button onClick={() => setShowReviewModal(false)} className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
                 </div>
                 
                 <form onSubmit={submitReview} className="space-y-8">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Establish Rating</label>
                       <div className="flex justify-center gap-4">
                          {[1,2,3,4,5].map(i => (
                             <button 
                              key={i} 
                              type="button"
                              onClick={() => setNewReview({...newReview, rating: i})}
                              className={`p-4 rounded-2xl transition-all ${newReview.rating >= i ? 'bg-domira-gold text-domira-navy shadow-xl scale-110' : 'bg-slate-50 dark:bg-domira-dark text-slate-300'}`}
                             >
                                <Star size={24} fill={newReview.rating >= i ? 'currentColor' : 'none'} />
                             </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Observations</label>
                       <textarea 
                         required 
                         rows={4} 
                         className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-6 rounded-3xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold resize-none shadow-inner"
                         placeholder="Detail your co-living or management experience..."
                         value={newReview.comment}
                         onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                       ></textarea>
                    </div>

                    <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 flex items-start gap-4">
                       <ShieldCheck className="text-blue-500 shrink-0" size={20} />
                       <p className="text-[10px] text-blue-500 font-bold uppercase leading-relaxed">
                          Your review will be analyzed by our moderation engine. False or inflammatory reviews will negatively impact your own Trust Score.
                       </p>
                    </div>

                    <Button variant="primary" fullWidth size="lg" className="py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl bg-domira-gold text-domira-navy border-white/10">
                       <Send className="mr-2" size={16} /> Finalize Submission
                    </Button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
