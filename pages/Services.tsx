
import React, { useState } from 'react';
import { 
  Wrench, Sparkles, Star, Search, MapPin, CheckCircle2, Briefcase, Mail, Globe, UserCheck, Zap, Building, Phone, Clock, ChevronRight, ShieldCheck, UserPlus, Landmark, FileCheck, CheckCircle, Smartphone, ArrowRight, ShieldAlert, BadgeCheck, X, Calendar, MessageSquare
} from 'lucide-react';
import { Button } from '../components/Button';

const PARTNERS = [
  { id: 1, name: "KK Clean Pros", type: "cleaning", location: "Alamesra", rating: 4.9, services: ["Deep Cleaning", "Sanitization"], desc: "Sabah's top-rated student housing hygiene specialist." },
  { id: 2, name: "Sabah Fix-It Squad", type: "maintenance", location: "Kota Kinabalu", rating: 4.8, services: ["Plumbing", "Electrical"], desc: "Rapid response maintenance for verified Domira units." },
  { id: 3, name: "Ocean Breeze AC", type: "maintenance", location: "Jesselton Quay", rating: 4.7, services: ["AC Servicing", "Installation"], desc: "Expert cooling solutions for coastal high-rise properties." },
  { id: 4, name: "KL Crystal Clean", type: "cleaning", location: "Mont Kiara", rating: 5.0, services: ["Move-out Clean", "Fogging"], desc: "Premium hygiene partners for high-end Klang Valley units." },
  { id: 5, name: "Borneo Movers", type: "logistics", location: "Inanam", rating: 4.6, services: ["Moving", "Storage"], desc: "Safe, affordable relocation services for students and families." },
];

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'apply'>('directory');
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [agentSuccess, setAgentSuccess] = useState(false);
  const [inquiringPartner, setInquiringPartner] = useState<any | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiringPartner(null);
      alert("Inquiry transmitted. Partner will provide a quote within 4 hours.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300">
      {/* Inquiry Modal */}
      {inquiringPartner && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-domira-navy w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
              <div className="p-8 md:p-12">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Service Inquiry</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">To: {inquiringPartner.name}</p>
                    </div>
                    <button onClick={() => setInquiringPartner(null)} className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
                 </div>

                 {inquirySent ? (
                    <div className="py-20 text-center">
                       <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="text-green-500" size={40} />
                       </div>
                       <p className="text-lg font-black text-slate-900 dark:text-white uppercase">Inquiry Transmitted</p>
                    </div>
                 ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Property</label>
                          <select required className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none appearance-none cursor-pointer">
                             <option>Level 12, Unit 3A-01 (Current House)</option>
                             <option>Alamesra Loft A-102</option>
                          </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Preferred Date</label>
                             <input type="date" required className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Type</label>
                             <select className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none">
                                {inquiringPartner.services.map((s: string) => <option key={s}>{s}</option>)}
                             </select>
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Job Details</label>
                          <textarea required rows={4} className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none resize-none" placeholder="Describe the specific needs..."></textarea>
                       </div>
                       <div className="bg-domira-gold/5 p-4 rounded-2xl border border-domira-gold/20 flex items-center gap-3">
                          <ShieldCheck size={18} className="text-domira-gold" />
                          <p className="text-[9px] text-domira-gold font-black uppercase tracking-widest leading-relaxed">Escrow Protection Active: Only pay once the service is verified by you.</p>
                       </div>
                       <Button variant="primary" fullWidth size="lg" className="py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl bg-domira-gold text-domira-navy">Transmit Request</Button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Dynamic Header */}
      <section className="bg-domira-navy pt-24 pb-40 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-domira-gold/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-domira-gold text-[10px] font-black uppercase tracking-widest mb-10">
            <BadgeCheck size={14} className="fill-domira-gold" /> Ecosystem Service Hub
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.85] uppercase">
            Platform <span className="text-domira-gold italic">Services</span>.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            Verified cleaning, maintenance, and verification expertise for Sabah's most trusted rental community.
          </p>
          
          <div className="flex justify-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit mx-auto glass shadow-2xl">
             <button id="tab-directory" onClick={() => setActiveTab('directory')} className={`px-12 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-domira-gold text-domira-navy shadow-xl' : 'text-slate-400 hover:text-white'}`}>Active Directory</button>
             <button id="tab-apply" onClick={() => setActiveTab('apply')} className={`px-12 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'apply' ? 'bg-domira-gold text-domira-navy shadow-xl' : 'text-slate-400 hover:text-white'}`}>Join Platform</button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-32">
        {activeTab === 'directory' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             {PARTNERS.map(p => (
                <div key={p.id} className="bg-white dark:bg-domira-navy rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-xl hover:border-domira-gold transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity"><Building size={100} /></div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="p-5 bg-slate-50 dark:bg-domira-dark rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:bg-domira-gold transition-colors">
                        {p.type === 'cleaning' ? <Sparkles className="text-domira-gold group-hover:text-domira-navy" size={28}/> : <Wrench className="text-domira-gold group-hover:text-domira-navy" size={28}/>}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black border border-white/10 shadow-xl">
                        <Star size={12} className="text-domira-gold fill-domira-gold" /> {p.rating}
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{p.name}</h3>
                   <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8">
                     <MapPin size={12} className="text-domira-gold mr-1.5" /> {p.location}, Malaysia
                   </div>
                   <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-10 leading-relaxed">"{p.desc}"</p>
                   <div className="flex flex-wrap gap-2.5 mb-10">
                     {p.services.map(s => <span key={s} className="px-4 py-1.5 bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-400">{s}</span>)}
                   </div>
                   <Button variant="outline" fullWidth size="lg" className="py-5 font-black uppercase text-[10px] tracking-widest border-slate-200 dark:border-slate-800 text-slate-400 group-hover:border-domira-gold group-hover:text-domira-gold transition-all active:scale-95" onClick={() => setInquiringPartner(p)}>Inquire Services</Button>
                </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-6 duration-500">
             {/* Service Partner Path */}
             <div className="bg-white dark:bg-domira-navy rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700"><Building size={140} className="text-domira-gold" /></div>
                <div className="relative z-10">
                   <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 uppercase">Business <br/><span className="text-domira-gold">Partners</span>.</h2>
                   <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">Vetted maintenance and cleaning providers. Join Sabah's elite network for premium property leads.</p>
                   
                   {partnerSuccess ? (
                      <div className="py-20 text-center animate-in zoom-in-95">
                         <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/20 shadow-xl"><CheckCircle className="text-green-500" size={48}/></div>
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">Request Logged</h3>
                         <p className="text-slate-500 font-medium">Our onboarding team will contact you in 24 hours.</p>
                      </div>
                   ) : (
                      <form id="partner-onboarding" onSubmit={(e) => { e.preventDefault(); setPartnerSuccess(true); }} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Identity</label>
                              <input id="partner-company" required type="text" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm shadow-inner" placeholder="E.g. Borneo Cleaning Co" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Class</label>
                              <select id="partner-type" required className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm appearance-none cursor-pointer">
                                 <option>Professional Cleaning</option>
                                 <option>Plumbing & Electrical</option>
                                 <option>Furniture & Interiors</option>
                                 <option>HVAC Specialist</option>
                              </select>
                           </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Website</label>
                              <input id="partner-web" type="url" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm shadow-inner" placeholder="https://..." />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Email</label>
                              <input id="partner-email" required type="email" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm shadow-inner" placeholder="admin@service.my" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Pitch</label>
                           <textarea id="partner-pitch" required rows={4} className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-6 rounded-3xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm resize-none shadow-inner" placeholder="Why should Domira users choose your company? Mention your local track record..."></textarea>
                        </div>
                        <Button id="btn-submit-partner" type="submit" variant="primary" fullWidth size="lg" className="py-7 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-domira-gold/20">Submit Partnership Request</Button>
                      </form>
                   )}
                </div>
             </div>

             {/* Verification Agent Path */}
             <div className="bg-slate-950 text-white rounded-[3.5rem] border border-white/5 shadow-2xl p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700"><UserCheck size={140} className="text-blue-500" /></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <h2 className="text-4xl font-black tracking-tighter uppercase">Audit <br/><span className="text-blue-500">Agents</span>.</h2>
                      <div className="bg-blue-600/20 text-blue-400 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-blue-500/30 backdrop-blur-md shadow-xl">
                         Earn RM 150 / Audit
                      </div>
                   </div>
                   <p className="text-slate-400 font-medium mb-12 leading-relaxed">Earn reliable income performing on-site quality and identity checks across Malaysia. Flexible hours, verified job flow.</p>
                   
                   {agentSuccess ? (
                      <div className="py-20 text-center animate-in zoom-in-95">
                         <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-500/20 shadow-xl"><CheckCircle className="text-blue-500" size={48}/></div>
                         <h3 className="text-2xl font-black uppercase mb-2">Audit Form Sent</h3>
                         <p className="text-slate-400 font-medium">Compliance will reach out for your training session.</p>
                      </div>
                   ) : (
                      <form id="agent-onboarding" onSubmit={(e) => { e.preventDefault(); setAgentSuccess(true); }} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name (NRIC)</label>
                              <input id="agent-name" required type="text" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-bold text-sm shadow-inner" placeholder="As per MyKad" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MyKad Number</label>
                              <input id="agent-ic" required type="text" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-bold text-sm shadow-inner" placeholder="XXXXXX-XX-XXXX" />
                           </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone (WhatsApp)</label>
                              <input id="agent-phone" required type="tel" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-bold text-sm shadow-inner" placeholder="+60..." />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                              <input id="agent-email" required type="email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-bold text-sm shadow-inner" placeholder="agent@email.com" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Experience & Transport</label>
                           <textarea id="agent-bio" required rows={4} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white outline-none focus:border-blue-500 font-bold text-sm resize-none shadow-inner" placeholder="Mention your real estate background (if any) and your transport availability in your local area..."></textarea>
                        </div>
                        <Button id="btn-submit-agent" type="submit" variant="primary" fullWidth size="lg" className="py-7 font-black uppercase text-xs tracking-[0.2em] shadow-2xl bg-blue-600 hover:bg-blue-700 text-white border-blue-500 active:scale-95 transition-all">Apply as Audit Agent</Button>
                      </form>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
