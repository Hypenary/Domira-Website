
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
      fetchDashboard();
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-domira-gold/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-domira-gold text-[10px] font-black uppercase tracking-widest mb-8">
               <ShieldAlert size={14} className="fill-domira-gold" /> Verification Protocol Active
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] uppercase">Manage Your <br/><span className="text-domira-gold italic">Portfolio</span>.</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">Verified hosts get 4x more tenant engagement. Apply today to unlock the Sabah rental marketplace.</p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link id="btn-landlord-reg" to="/landlord-apply">
                <Button variant="primary" size="lg" className="w-full md:px-12 py-7 font-black uppercase tracking-widest text-xs shadow-2xl shadow-domira-gold/20 active:scale-95 transition-all">
                  Registry for Landlords
                </Button>
              </Link>
              <Link id="btn-agent-reg" to="/agent-apply">
                <Button variant="outline" size="lg" className="w-full md:px-12 py-7 font-black uppercase tracking-widest text-xs text-white border-white/20 hover:bg-white/5 active:scale-95 transition-all">
                  <Landmark size={16} className="mr-3 text-domira-gold" /> Agent REN Channel
                </Button>
              </Link>
            </div>
            <button onClick={mockApprove} className="mt-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-domira-gold transition-colors underline underline-offset-8 decoration-slate-800">[Simulation: Bypass Vetting]</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark pb-24 transition-colors duration-300">
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

      <div className="bg-domira-navy pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
                <LayoutDashboard className="text-domira-gold" /> Host Dashboard
              </h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Managing ID: {user.full_name}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <Link to="/list-property" className="flex-1 md:flex-none"><Button id="btn-add-listing" variant="primary" className="w-full font-black uppercase tracking-widest text-[10px] px-10 py-4 shadow-xl">New Listing</Button></Link>
               <Link to="/profile" className="flex-1 md:flex-none"><Button variant="outline" className="w-full font-black uppercase tracking-widest text-[10px] text-white border-white/20 px-10 py-4">Profile Passport</Button></Link>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mt-12 max-w-2xl overflow-x-auto scrollbar-hide glass shadow-2xl">
            {[
              { id: 'dashboard', label: 'Overview', icon: BarChart },
              { id: 'units', label: 'Portfolio', icon: Building },
              { id: 'leads', label: 'Tenant Inquiries', icon: UserCheck },
              { id: 'fixes', label: 'Maintenance', icon: Wrench },
            ].map(tab => (
              <button 
                key={tab.id} id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-domira-gold text-domira-navy shadow-2xl scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard id="stat-views" icon={Eye} label="Impressions" value={dashboardData.stats.totalViews} trend="+18%" color="blue" />
              <StatCard id="stat-leads" icon={MessageCircle} label="Active Leads" value={dashboardData.stats.activeInquiries} trend="New" color="gold" />
              <StatCard id="stat-viewings" icon={Calendar} label="Viewings" value={dashboardData.stats.pendingViewings} trend="Syncing" color="purple" />
              <StatCard id="stat-revenue" icon={CreditCard} label="Pending Revenue" value="RM 550.00" trend="Escrow" color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                  {myProperties.some(p => p.verification_status === 'not_requested') && (
                     <div id="unverified-warning" className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-800/50 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-700"><Zap size={100} className="text-amber-600" /></div>
                        <div className="flex items-center gap-8 relative z-10">
                           <div className="w-20 h-20 bg-amber-500/20 rounded-[2rem] flex items-center justify-center border border-amber-500/40 shadow-xl">
                              <ShieldAlert className="text-amber-600" size={36} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Trust Deficit Detected</h3>
                              <p className="text-sm text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest mt-2">You have {myProperties.filter(p => p.verification_status === 'not_requested').length} unverified listings reducing your visibility.</p>
                           </div>
                        </div>
                        <button onClick={() => setActiveTab('units')} className="relative z-10 px-10 py-4 bg-amber-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(217,119,6,0.3)] hover:bg-amber-700 hover:translate-y-[-2px] transition-all active:scale-95">Initiate Audit RM150</button>
                     </div>
                  )}

                  <div className="bg-white dark:bg-domira-navy rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                      <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-domira-deep/30 flex justify-between items-center">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <Inbox size={20} className="text-domira-gold"/> Recent Applicant Activity
                        </h2>
                        <button onClick={() => setActiveTab('leads')} className="text-[10px] font-black text-domira-gold uppercase tracking-[0.2em] hover:underline">Manage All</button>
                      </div>
                      <div className="p-12 divide-y divide-slate-100 dark:divide-slate-800">
                        {dashboardData.inquiries.length > 0 ? (
                           dashboardData.inquiries.map((inq: any) => (
                             <div key={inq.id} className="py-8 flex items-center justify-between group">
                               <div className="flex items-center gap-6">
                                  <img src={inq.tenant_avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-slate-100 dark:border-slate-700 shadow-sm" />
                                  <div className="min-w-0">
                                     <p className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">{inq.tenant_name}</p>
                                     <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[300px] mt-1 italic">"{inq.message}"</p>
                                  </div>
                               </div>
                               <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-domira-gold hover:translate-x-1 transition-all" onClick={() => handleReply(inq)}>Open Thread <ChevronRight size={14} className="ml-1.5"/></Button>
                             </div>
                           ))
                        ) : (
                           <div className="text-center py-20 opacity-50">
                              <AlertCircle className="mx-auto mb-6 w-12 h-12 text-slate-300" />
                              <p className="text-slate-400 font-bold uppercase tracking-widest">No recent tenant activity.</p>
                           </div>
                        )}
                      </div>
                  </div>
              </div>
              
              <div className="space-y-8">
                 <div className="bg-slate-950 text-white p-10 rounded-[3rem] border-2 border-domira-gold shadow-[0_30px_60px_rgba(251,191,36,0.15)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700"><Calculator size={100} className="text-domira-gold" /></div>
                    <div className="relative z-10">
                       <div className="inline-flex gap-2 px-3 py-1 bg-domira-gold/20 border border-domira-gold/30 rounded-lg text-domira-gold text-[8px] font-black uppercase tracking-widest mb-8">
                          <TrendingUp size={10} /> ROI Maximizer
                       </div>
                       <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase leading-none">HMO <br/>Planner.</h3>
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">Project shared student rental yields for Sepanggar & Alamesra assets.</p>
                       <Link id="link-roi-tool" to="/conversion-planner">
                          <Button variant="primary" fullWidth className="py-5 font-black uppercase text-[10px] tracking-widest shadow-2xl bg-domira-gold text-domira-navy hover:scale-105 transition-transform">Launch ROI Tool</Button>
                       </Link>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-domira-navy p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">Quick Commands</h3>
                    <div className="space-y-3">
                       <button className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-between group">
                          Request Vetting <ChevronRight size={14} className="text-slate-300 group-hover:text-domira-gold" />
                       </button>
                       <button className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-between group">
                          Contract Builder <ChevronRight size={14} className="text-slate-300 group-hover:text-domira-gold" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {myProperties.map(prop => (
                  <div key={prop.id} id={`unit-card-${prop.id}`} className={`bg-white dark:bg-domira-navy rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col group/card transition-all duration-700 ${prop.verification_status === 'not_requested' ? 'border-amber-500/40 ring-8 ring-amber-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-domira-gold'}`}>
                    <div className="h-60 relative overflow-hidden">
                      <img src={prop.images[0]} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000" alt="" />
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                        {prop.category}
                      </div>
                      {prop.verification_status === 'not_requested' && (
                         <div className="absolute inset-0 bg-amber-950/20 backdrop-grayscale-[0.4] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <Link to={`/checkout?type=VERIFY&id=${prop.id}`}>
                               <Button variant="primary" size="sm" className="bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-amber-600 px-8 py-4">Vetting Required</Button>
                            </Link>
                         </div>
                      )}
                    </div>
                    <div className="p-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                         <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-tight group-hover/card:text-domira-gold transition-colors">{prop.title}</h3>
                         <div className={`shrink-0 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${prop.verification_status === 'verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : prop.verification_status === 'pending' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                           {prop.verification_status === 'verified' ? 'Verified' : prop.verification_status === 'pending' ? 'Pending Audit' : 'Trust Alert'}
                         </div>
                      </div>
                      
                      <div className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                        {prop.verification_status === 'not_requested' ? (
                          <Link id={`btn-verify-${prop.id}`} to={`/checkout?type=VERIFY&id=${prop.id}`}>
                            <Button variant="primary" fullWidth className="py-4 font-black uppercase text-[10px] tracking-widest bg-amber-500 shadow-xl shadow-amber-500/20 border-white/10 active:scale-95 transition-all">Start Trust Audit (RM150)</Button>
                          </Link>
                        ) : prop.verification_status === 'pending' ? (
                           <div className="w-full py-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-center shadow-inner"><span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse"><Clock size={14}/> Agent Dispatching Soon</span></div>
                        ) : (
                           <div className="w-full py-4 bg-green-500/5 border border-green-500/20 rounded-2xl text-center shadow-inner"><span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center justify-center gap-2"><ShieldCheck size={14}/> 100% Verified Asset</span></div>
                        )}
                        
                        <div className="flex gap-3">
                           <Button id={`btn-edit-${prop.id}`} variant="outline" size="sm" fullWidth className="py-3.5 text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:border-domira-gold transition-all" onClick={() => navigate(`/list-property`)}>Edit Profile</Button>
                           <Link to={`/property/${prop.id}`} className="flex-1"><Button variant="ghost" size="sm" fullWidth className="py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-domira-gold transition-all">Public Link</Button></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link to="/list-property" className="h-full">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 flex flex-col items-center justify-center text-slate-400 hover:border-domira-gold hover:bg-domira-gold/5 transition-all duration-500 group h-[480px] shadow-inner text-center">
                     <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-domira-gold/20 group-hover:scale-110 transition-all duration-500"><Plus size={48} /></div>
                     <h3 className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tight">Expand Portfolio</h3>
                     <p className="text-[11px] font-black uppercase tracking-[0.3em] mt-4 opacity-60">Add new listing in Sabah</p>
                  </div>
                </Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color, id }: any) => {
  const colors: any = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    gold: 'text-domira-gold bg-domira-gold/10 border-domira-gold/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20'
  };
  return (
    <div id={id} className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl group hover:border-domira-gold transition-all duration-500">
      <div className="flex justify-between items-start mb-8">
        <div className={`p-5 rounded-2xl border ${colors[color]} group-hover:scale-110 transition-transform duration-500`}><Icon className="w-7 h-7" /></div>
        <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-xl uppercase tracking-widest border border-green-500/20 shadow-sm">{trend}</span>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter leading-none">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{label}</p>
    </div>
  );
};
