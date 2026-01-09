
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { 
  Check, ShieldCheck, Zap, BarChart, Building, UserCheck, Wrench, 
  TrendingUp, Eye, Clock, LayoutDashboard, Search, Info, Plus, ChevronRight,
  Calculator, Layers, ArrowRight, ShieldAlert, Sparkles, MessageCircle, Calendar,
  CreditCard, Inbox, Landmark, Briefcase, MoreVertical, AlertCircle, Home
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/mockSupabase';
import { UserRole, Inquiry, Property, RoommateProfile, UserProfile } from '../types';
import { ChatModal } from '../components/ChatModal';
import { TenantProfileModal } from '../components/TenantProfileModal';

export const ForLandlords: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'units' | 'leads' | 'fixes'>('dashboard');
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]);

  // Interaction State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatProperty, setChatProperty] = useState<Property | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<RoommateProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      if (u.landlord_status === 'approved' || u.agent_status === 'approved') {
        fetchDashboard();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [data, props] = await Promise.all([
        api.landlord.getDashboard('current_user'),
        api.properties.listByLandlord('current_user')
      ]);
      setDashboardData(data);
      setMyProperties(props);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (inq: Inquiry) => {
    const prop = myProperties.find(p => p.id === inq.property_id) || myProperties[0];
    if (prop) {
      setChatProperty(prop);
      setSelectedInquiry(inq);
      setIsChatOpen(true);
    }
  };

  const handleViewProfile = async (inq: Inquiry) => {
    setLoading(true);
    try {
      const profile = await api.roommates.getById(inq.tenant_id);
      if (profile) {
        setSelectedProfile(profile);
        setIsProfileOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mockApprove = () => {
    if (!user) return;
    const updatedUser = { ...user, landlord_status: 'approved' as const };
    setUser(updatedUser);
    localStorage.setItem('domira_user', JSON.stringify(updatedUser));
    fetchDashboard();
  };

  if (loading && !isProfileOpen && !isChatOpen) return <div className="min-h-screen bg-white dark:bg-domira-dark flex items-center justify-center"><div className="w-10 h-10 border-4 border-domira-gold border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user || (user.landlord_status !== 'approved' && user.agent_status !== 'approved')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-domira-dark transition-colors">
        <div className="bg-domira-navy pt-24 pb-44 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-domira-gold/5 blur-3xl rounded-full"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-domira-gold text-[10px] font-black uppercase tracking-widest mb-8">
               <ShieldAlert size={14} className="fill-domira-gold" /> Host Verification Required
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">Unlock the <span className="text-domira-gold italic">Market</span>.</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">To protect our tenants, all landlords and agents must be verified before listing units on Domira.</p>
            
            {user?.landlord_status === 'pending' || user?.agent_status === 'pending' ? (
              <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 inline-block">
                   <p className="text-domira-gold font-black uppercase text-xs tracking-[0.2em]">Application Currently Under Review</p>
                   <p className="text-slate-400 text-[10px] mt-2">You will be notified via email once approved.</p>
                </div>
                <button 
                  onClick={mockApprove}
                  className="mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-domira-gold border border-slate-700 rounded-2xl transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} /> [Test] Simulate Fast Approval
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <Link to="/landlord-apply">
                  <Button variant="primary" size="lg" className="w-full md:px-12 py-6 font-black uppercase tracking-widest text-xs shadow-2xl shadow-domira-gold/20">
                    Register as Landlord
                  </Button>
                </Link>
                <Link to="/agent-apply">
                  <Button variant="outline" size="lg" className="w-full md:px-12 py-6 font-black uppercase tracking-widest text-xs text-white border-white/20 hover:bg-white/5">
                    <Landmark size={16} className="mr-2 text-domira-gold" /> Licensed Agent Sign-up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Benefits for Agents Section */}
        <section className="py-32 max-w-7xl mx-auto px-4 -mt-20 relative z-20">
           <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl group hover:border-domira-gold/30 transition-all">
                 <div className="w-16 h-16 bg-domira-gold/10 rounded-2xl flex items-center justify-center mb-8"><Briefcase className="text-domira-gold" size={32} /></div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">For Property Owners</h3>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">Manage your units directly, collect rent digitally via FPX, and use our conversion planner to boost your yield by up to 20%.</p>
                 <Link to="/landlord-apply" className="text-domira-gold font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">Get Started <ArrowRight size={14}/></Link>
              </div>
              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><Landmark size={120} className="text-domira-gold" /></div>
                 <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10"><ShieldCheck className="text-domira-gold" size={32} /></div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">For Licensed Agents</h3>
                    <p className="text-slate-400 font-medium leading-relaxed mb-8">Unlock the verified agent badge, gain priority search placement, and use our digital tenancy tool to close deals in minutes, not days.</p>
                    <Link to="/agent-apply" className="text-domira-gold font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">Apply with REN <ArrowRight size={14}/></Link>
                 </div>
              </div>
           </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark pb-20 transition-colors">
      {/* Modal Systems */}
      {isChatOpen && chatProperty && selectedInquiry && (
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          property={chatProperty} 
          recipient={{
            id: selectedInquiry.tenant_id,
            name: selectedInquiry.tenant_name,
            avatar: selectedInquiry.tenant_avatar,
            role: 'tenant'
          }}
        />
      )}
      {isProfileOpen && selectedProfile && (
        <TenantProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          profile={selectedProfile} 
          onChat={() => {
            setIsProfileOpen(false);
            const inq = dashboardData.inquiries.find((i: Inquiry) => i.tenant_id === selectedProfile.id);
            if (inq) handleReply(inq);
          }}
        />
      )}

      <div className="bg-domira-navy pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <LayoutDashboard className="text-domira-gold" /> {user.role === UserRole.AGENT ? 'Agent Dashboard' : 'Landlord Hub'}
              </h1>
              <p className="text-slate-400 font-medium">Managing Portfolio: {user.full_name} {user.ren_number && `(${user.ren_number})`}</p>
            </div>
            <div className="flex gap-3">
               <Link to="/list-property"><Button variant="primary" className="font-black uppercase tracking-widest text-[10px] px-8">Add Listing</Button></Link>
               <Link to="/profile"><Button variant="outline" className="font-black uppercase tracking-widest text-[10px] text-white border-white/20">Profile</Button></Link>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mt-10 max-w-2xl overflow-x-auto scrollbar-hide">
            {[
              { id: 'dashboard', label: 'Overview', icon: BarChart },
              { id: 'units', label: 'My Units', icon: Building },
              { id: 'leads', label: 'Leads & Inquiries', icon: UserCheck },
              { id: 'fixes', label: 'Fixes', icon: Wrench },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-domira-gold text-domira-navy shadow-xl' : 'text-slate-400 hover:text-white'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard icon={Eye} label="Visibility" value={dashboardData.stats.totalViews} trend="+12%" color="blue" />
              <StatCard icon={MessageCircle} label="Active Leads" value={dashboardData.stats.activeInquiries} trend="3 New" color="gold" />
              <StatCard icon={Calendar} label="Viewings" value={dashboardData.stats.pendingViewings} trend="Sat 10AM" color="purple" />
              <StatCard icon={CreditCard} label="Revenue" value={`RM ${dashboardData.stats.totalReserved * 1200}`} trend="3 Deposits" color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-domira-navy rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-domira-deep/30 flex justify-between items-center">
                     <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Inbox size={18} className="text-domira-gold"/> Recent Applications
                     </h2>
                     <button onClick={() => setActiveTab('leads')} className="text-[10px] font-black text-domira-gold uppercase tracking-widest hover:underline">View All Leads</button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 p-20 text-center">
                     <p className="text-slate-400 text-sm italic">"Review applicants to ensure high-harmony matches."</p>
                  </div>
              </div>
              
              <div className="space-y-6">
                 {/* Property Conversion Planner Teaser */}
                 <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] border-2 border-domira-gold shadow-[0_20px_50px_rgba(251,191,36,0.15)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                       <Calculator size={80} className="text-domira-gold" />
                    </div>
                    <div className="relative z-10">
                       <div className="inline-flex gap-2 px-3 py-1 bg-domira-gold/20 border border-domira-gold/30 rounded-lg text-domira-gold text-[8px] font-black uppercase tracking-widest mb-6">
                          <Zap size={10} fill="currentColor" /> Landlord Toolkit
                       </div>
                       <h3 className="text-2xl font-black mb-3 tracking-tight">HMO Conversion Planner</h3>
                       <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">
                          Analyze your property to estimate potential <span className="text-white font-bold">RM 1,200+ monthly surplus</span> by converting to student shared rentals.
                       </p>
                       <Link to="/conversion-planner">
                          <Button variant="primary" fullWidth className="py-4 font-black uppercase text-[10px] tracking-widest shadow-xl bg-domira-gold text-domira-navy">
                             Launch Planner <ArrowRight size={14} className="ml-2" />
                          </Button>
                       </Link>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-domira-navy p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Links</h3>
                    <div className="space-y-2">
                       <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-between">
                          Order Signage <ChevronRight size={14} />
                       </button>
                       <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-between">
                          Tax Documents <ChevronRight size={14} />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-domira-navy rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-domira-deep/30 flex justify-between items-center">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                   <Inbox size={18} className="text-domira-gold"/> Active Inquiries
                </h2>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="bg-white dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-[10px] text-white outline-none focus:ring-2 focus:ring-domira-gold/20 transition-all w-64" 
                  />
                </div>
             </div>
             
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dashboardData.inquiries.length === 0 ? (
                  <div className="py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No active inquiries at the moment.</p>
                  </div>
                ) : (
                  dashboardData.inquiries.map((inq: Inquiry) => {
                    const linkedProperty = myProperties.find(p => p.id === inq.property_id);
                    return (
                      <div key={inq.id} className="px-8 py-8 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center gap-8 group">
                         <div className="flex items-center gap-6 flex-1 min-w-0">
                            <div className="relative shrink-0">
                               <img src={inq.tenant_avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-slate-100 dark:border-slate-700 group-hover:border-domira-gold transition-colors" alt="" />
                               {inq.status === 'PENDING' && (
                                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-domira-gold rounded-full border-2 border-white dark:border-domira-navy animate-pulse shadow-lg"></div>
                               )}
                            </div>
                            <div className="min-w-0">
                               <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-black text-slate-900 dark:text-white text-lg truncate cursor-pointer hover:text-domira-gold transition-colors" onClick={() => handleViewProfile(inq)}>
                                    {inq.tenant_name}
                                  </h3>
                                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${inq.type === 'CHAT' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {inq.type}
                                  </span>
                               </div>
                               <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 italic line-clamp-1">"{inq.message}"</p>
                               <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                  <span className="flex items-center gap-1.5"><Home size={12} className="text-domira-gold" /> {linkedProperty?.title || 'Unknown Asset'}</span>
                                  <span className="flex items-center gap-1.5"><Clock size={12} /> {inq.date}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            <Button variant="primary" size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-domira-gold/10" onClick={() => handleReply(inq)}>Reply Now</Button>
                            <Button variant="outline" size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => handleViewProfile(inq)}>Profile</Button>
                            <button className="p-3 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20}/></button>
                         </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="animate-in slide-in-from-bottom-6 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myProperties.map(prop => (
                  <div key={prop.id} className="bg-white dark:bg-domira-navy rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col group/card hover:border-domira-gold transition-all duration-500">
                    <div className="h-52 relative overflow-hidden">
                      <img src={prop.images[0]} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {prop.category}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="font-black text-slate-900 dark:text-white text-lg group-hover/card:text-domira-gold transition-colors">{prop.title}</h3>
                         <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${prop.verification_status === 'verified' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                           {prop.verification_status === 'verified' ? 'Verified Asset' : prop.verification_status === 'pending' ? 'Reviewing' : 'Unverified'}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white">{prop.beds} Vacant</p>
                         </div>
                         <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Monthly</p>
                            <p className="text-sm font-black text-domira-gold">RM {prop.price}</p>
                         </div>
                      </div>

                      <div className="mt-auto space-y-3">
                        {prop.verification_status === 'not_requested' && (
                          <Link to={`/checkout?type=VERIFY&id=${prop.id}`}>
                            <Button 
                              variant="primary" 
                              fullWidth 
                              size="sm" 
                              className="text-[10px] font-black uppercase tracking-widest py-3 bg-domira-gold shadow-lg shadow-domira-gold/20"
                            >
                               Get Trust Badge (RM150)
                            </Button>
                          </Link>
                        )}
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" fullWidth className="text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800" onClick={() => navigate(`/list-property`)}>Edit</Button>
                           <Link to={`/property/${prop.id}`} className="flex-1"><Button variant="ghost" size="sm" fullWidth className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-domira-gold">View</Button></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link to="/list-property" className="h-full">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-slate-400 hover:border-domira-gold hover:bg-domira-gold/5 transition-all group h-[480px] shadow-inner text-center">
                     <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 group-hover:bg-domira-gold/20"><Plus size={40} /></div>
                     <h3 className="font-black text-xl text-slate-800 dark:text-white uppercase tracking-tight mb-2">New Listing</h3>
                     <p className="text-xs font-medium max-w-[200px]">Add more assets to your KK portfolio.</p>
                  </div>
                </Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => {
  const colors: any = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    gold: 'text-domira-gold bg-domira-gold/10 border-domira-gold/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20'
  };
  return (
    <div className="bg-white dark:bg-domira-navy p-7 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl group hover:border-domira-gold transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl border ${colors[color]}`}><Icon className="w-6 h-6" /></div>
        <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg uppercase tracking-widest border border-green-500/20">{trend}</span>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
};
