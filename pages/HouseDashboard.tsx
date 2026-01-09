
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, MessageSquare, Plus, CheckCircle, Clock, 
  AlertTriangle, Send, Paperclip, Pin, Hash, DollarSign, 
  Smile, Share2, MoreHorizontal, User, Users, Info, BarChart3,
  Vote, Wrench, ShieldCheck, ChevronRight, FileText, Smartphone,
  ExternalLink, PenTool, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Bill, HouseMessage, MaintenanceTicket, HouseVote, UserProfile } from '../types';
import { BannerAd } from '../components/BannerAd';
import { VerificationAlert } from '../components/VerificationAlert';

const MOCK_BILLS: Bill[] = [
  { id: 'b1', title: 'TNB Electricity', total_amount: 320.50, due_date: 'Oct 30', status: 'PENDING', category: 'Electricity' },
  { id: 'b2', title: 'Unifi 100Mbps', total_amount: 147.00, due_date: 'Oct 25', status: 'LATE', category: 'Internet' },
];

const MOCK_TICKETS: MaintenanceTicket[] = [
  { id: 't1', property_id: 'prop_1', title: 'Living Room AC Leaking', category: 'Electrical', status: 'IN_PROGRESS', reported_at: 'Oct 22', description: 'Small puddle forming below the indoor unit.', reported_by: 'Kevin' },
  { id: 't2', property_id: 'prop_1', title: 'Kitchen Sink Clogged', category: 'Plumbing', status: 'RESOLVED', reported_at: 'Oct 15', description: 'Drainage very slow after dishwashing.', reported_by: 'Nurul' },
];

const MOCK_VOTES: HouseVote[] = [
  { id: 'v1', question: 'Should we allow cats in the house?', options: [{label: 'Yes', votes: 3}, {label: 'No', votes: 1}], status: 'ACTIVE', created_at: 'Oct 24' },
  { id: 'v2', question: 'Shared Fridge Cleaning Rotation?', options: [{label: 'Weekly', votes: 2}, {label: 'Bi-Weekly', votes: 2}], status: 'ACTIVE', created_at: 'Oct 25' },
];

const MOCK_MESSAGES: HouseMessage[] = [
  { id: 'm1', sender_id: 'u1', sender_name: 'Nurul', sender_avatar: 'https://picsum.photos/seed/nurul/100/100', text: 'Guys, siapa belum bayar Unifi? Bill dah late 2 hari.', timestamp: '10:00 AM' },
  { id: 'm2', sender_id: 'u2', sender_name: 'Kevin', sender_avatar: 'https://picsum.photos/seed/kevin/100/100', text: 'Sori2, baru perasan. Done bayar share saya. RM36.75 kan?', timestamp: '10:15 AM' },
];

export const HouseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bills' | 'chat' | 'votes' | 'maintenance' | 'payments'>('bills');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const housematesCount = 4;
  const myShare = MOCK_BILLS.reduce((acc, b) => acc + (b.total_amount/4), 0);

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300">
      <VerificationAlert user={user} />
      
      <div className="bg-domira-navy py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 glass">
                <Users className="w-8 h-8 text-domira-gold" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Level 12, Unit 3A-01</h1>
                <p className="text-slate-400 font-medium flex items-center gap-2">
                   <Users className="w-4 h-4" /> 4 Housemates • <span className="text-green-400">Lease Active</span>
                </p>
             </div>
          </div>
          
          <div className="flex flex-wrap bg-domira-dark/50 p-1 rounded-2xl border border-white/10 glass gap-1">
            {[
              { id: 'bills', label: 'Bills', icon: CreditCard },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'votes', label: 'Votes', icon: Vote },
              { id: 'maintenance', label: 'Fixes', icon: Wrench },
              { id: 'payments', label: 'Contract', icon: FileText }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-domira-gold text-domira-navy shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {activeTab === 'bills' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-domira-gold/10 border border-domira-gold/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden group">
                   <div>
                     <h2 className="text-domira-navy dark:text-domira-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2">Monthly Breakdown</h2>
                     <p className="text-4xl font-black text-slate-900 dark:text-white">RM {myShare.toFixed(2)}</p>
                     <p className="text-slate-500 font-bold text-xs mt-1">Your 1/4 share of pending house utilities.</p>
                   </div>
                   <Link to="/checkout?type=BILLS">
                    <Button variant="primary" size="lg" className="px-10 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-domira-gold/20">Pay All Shares</Button>
                   </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_BILLS.map(bill => (
                    <div key={bill.id} className="bg-white dark:bg-domira-navy p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-domira-gold/50 transition-all group">
                       <h3 className="text-slate-900 dark:text-white font-black text-lg mb-1">{bill.title}</h3>
                       <p className="text-xl font-bold text-domira-gold">RM {(bill.total_amount/4).toFixed(2)} <span className="text-[10px] text-slate-400 uppercase">My Share</span></p>
                       <Link to="/checkout?type=BILLS" className="block mt-6">
                        <Button variant="outline" fullWidth className="border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest">Pay via FPX</Button>
                       </Link>
                    </div>
                  ))}
                  {/* Integrated Ad in Bills Grid */}
                  {!user?.is_gold && <BannerAd user={user} className="h-full" />}
                </div>
             </div>
             <div className="bg-slate-50 dark:bg-domira-navy p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col">
                <h3 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-8"><BarChart3 size={16}/> Usage Insights</h3>
                <div className="h-40 flex items-end gap-2 mb-6">
                   {[40, 70, 45, 90, 60].map((h, i) => <div key={i} className="flex-1 bg-domira-gold/20 rounded-t-lg border-t-2 border-domira-gold" style={{height: `${h}%`}}></div>)}
                </div>
                <p className="text-xs text-slate-500 font-medium mb-8">Utilities are RM 120 higher than last month. Check the AC usage!</p>
                
                {/* Secondary Sidebar Ad */}
                {!user?.is_gold && (
                  <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
                    <BannerAd user={user} />
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-6 duration-500">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">House Votes</h2>
                <Button variant="primary" size="sm" className="font-black uppercase tracking-widest text-[10px]">Create Vote</Button>
             </div>
             {MOCK_VOTES.map(vote => (
               <div key={vote.id} className="bg-white dark:bg-domira-navy p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{vote.question}</h3>
                  <div className="space-y-4">
                     {vote.options.map((opt, i) => {
                       const total = vote.options.reduce((a, b) => a + b.votes, 0);
                       const perc = (opt.votes / total) * 100;
                       return (
                         <div key={i} className="relative group cursor-pointer">
                            <div className="flex justify-between items-center mb-2 text-xs font-black uppercase tracking-widest text-slate-500">
                               <span>{opt.label}</span>
                               <span className="text-slate-900 dark:text-white">{opt.votes} Votes</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 dark:bg-domira-dark rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-[2px]">
                               <div className="h-full bg-domira-gold rounded-full transition-all duration-1000" style={{width: `${perc}%`}}></div>
                            </div>
                         </div>
                       );
                     })}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Started {vote.created_at}</span>
                     <button className="text-[10px] font-black text-domira-gold uppercase tracking-widest hover:underline">Revote</button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500">
             <div className="bg-domira-navy p-10 rounded-[3rem] text-center border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <h2 className="text-2xl font-black text-white mb-4 tracking-tight">Something broken?</h2>
                   <p className="text-slate-400 text-sm mb-8 font-medium">Report issues directly to your landlord. Attach photos for faster resolution.</p>
                   <Button variant="primary" className="px-10 py-5 font-black uppercase text-xs tracking-widest shadow-xl shadow-domira-gold/20">Report New Issue</Button>
                </div>
                <Wrench className="absolute -bottom-10 -right-10 w-48 h-48 text-domira-gold opacity-5 rotate-12" />
             </div>

             <div className="grid gap-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-4">Active Tickets</h3>
                {MOCK_TICKETS.map(ticket => (
                  <div key={ticket.id} className="bg-white dark:bg-domira-navy p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-domira-gold transition-all">
                     <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                           {ticket.status === 'RESOLVED' ? <CheckCircle size={24}/> : <Clock size={24}/>}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-black text-slate-900 dark:text-white">{ticket.title}</h4>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium line-clamp-1">{ticket.description}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest">Reported by {ticket.reported_by} • {ticket.reported_at}</p>
                        </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-domira-gold transition-colors" />
                  </div>
                ))}
                
                {!user?.is_gold && <BannerAd user={user} className="mt-8" />}
             </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-500">
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-domira-navy p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                   <div className="flex justify-between items-center mb-10">
                      <div>
                         <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Tenancy Agreement</h2>
                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Agreement ID: DOM-8821-2024</p>
                      </div>
                      <ShieldCheck className="w-12 h-12 text-domira-gold" />
                   </div>
                   
                   <div className="aspect-[1/1.4] bg-slate-50 dark:bg-domira-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
                      <FileText className="w-16 h-16 text-slate-300 mb-6" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest mb-8">Full Digital Document Signature Verified</p>
                      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                         <div className="p-4 bg-white dark:bg-domira-navy rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-2">My Signature</p>
                            <div className="font-black italic text-domira-gold">Demo User</div>
                         </div>
                         <div className="p-4 bg-white dark:bg-domira-navy rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Landlord Signature</p>
                            <div className="font-black italic text-slate-400 underline decoration-slate-200">Sarah Lim</div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-8 flex gap-4">
                      <Button variant="outline" fullWidth className="py-4 font-black uppercase text-[10px] tracking-widest"><ExternalLink size={14} className="mr-2"/> View Full PDF</Button>
                      <Button variant="primary" fullWidth className="py-4 font-black uppercase text-[10px] tracking-widest"><PenTool size={14} className="mr-2"/> Amendment Request</Button>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-domira-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-domira-gold mb-8 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Escrow Status
                   </h3>
                   <div className="space-y-6 relative z-10">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Security Deposit</p>
                         <div className="flex justify-between items-center">
                            <span className="text-2xl font-black">RM 2,400.00</span>
                            <CheckCircle2 className="text-green-500" size={20} />
                         </div>
                         <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-1">Held Safely by Domira</p>
                      </div>
                      <div className="pt-6 border-t border-slate-800">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Utilities Advance</p>
                         <p className="text-xl font-black text-slate-400">RM 500.00</p>
                      </div>
                   </div>
                   <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-medium text-slate-400 italic leading-relaxed">
                      "Funds are only released to the landlord 24 hours after keys are handed over and move-in check is completed."
                   </div>
                </div>

                <div className="bg-white dark:bg-domira-navy p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                   <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-6">Payment Methods</h3>
                   <div className="grid grid-cols-3 gap-4">
                      {['FPX', 'TnG', 'Card'].map(m => (
                        <div key={m} className="p-3 bg-slate-50 dark:bg-domira-dark rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2 group hover:border-domira-gold transition-all">
                           <Smartphone size={18} className="text-slate-300 group-hover:text-domira-gold" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{m}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-domira-navy rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 h-[70vh] flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
             <div className="hidden md:flex w-80 bg-slate-50 dark:bg-domira-deep flex-col border-r border-slate-200 dark:border-slate-800">
                <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2"><Hash size={20} className="text-domira-gold"/> General</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">House Group Chat</p>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                   {['Nurul', 'Kevin', 'Aiman'].map(name => (
                     <div key={name} className="flex items-center gap-3">
                        <img src={`https://picsum.photos/seed/${name}/100/100`} className="w-8 h-8 rounded-full" alt="" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{name}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 ml-auto"></div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 flex flex-col relative">
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                   {messages.map((msg, i) => (
                      <div key={msg.id} className={`flex gap-4 ${msg.sender_id === 'me' ? 'flex-row-reverse' : ''}`}>
                         <img src={msg.sender_avatar} className="w-10 h-10 rounded-xl" alt="" />
                         <div className={`p-4 rounded-2xl text-sm ${msg.sender_id === 'me' ? 'bg-domira-gold text-domira-navy font-bold' : 'bg-slate-100 dark:bg-domira-dark text-slate-800 dark:text-slate-200'}`}>
                            {msg.text}
                         </div>
                      </div>
                   ))}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                   <div className="flex gap-4 items-center bg-slate-50 dark:bg-domira-dark p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <input 
                        type="text" 
                        placeholder="Message housemates..." 
                        className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-bold text-slate-900 dark:text-white"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button className="p-3 bg-domira-gold text-domira-navy rounded-xl shadow-lg"><Send size={18}/></button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
