import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  Star, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Briefcase, 
  Mail, 
  Globe, 
  UserCheck,
  Zap,
  Building,
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/Button';

const KK_LOCATIONS = ["Alamesra", "Kota Kinabalu", "Jesselton Quay", "Inanam", "Cyberjaya", "Likas", "Penampang"];

const PARTNERS = [
  {
    id: 1,
    name: "KK Clean Pros",
    type: "cleaning",
    location: "Alamesra",
    rating: 4.7,
    services: ["Deep Cleaning", "Move-in/out", "Sanitization"],
    email: "contact@kkcleanpros.com",
    website: "kkcleanpros.com",
    desc: "Specializing in student and professional rentals. We guarantee a spotless move-in experience in North KK."
  },
  {
    id: 2,
    name: "Sabah Fix-It Squad",
    type: "maintenance",
    location: "Kota Kinabalu",
    rating: 4.8,
    services: ["Plumbing", "Electrical", "AC Servicing"],
    email: "help@sabahfixit.my",
    website: "sabahfixit.my",
    desc: "Reliable maintenance for modern homes. 24/7 emergency response for verified Domira properties."
  },
  {
    id: 3,
    name: "Ocean Breeze AC",
    type: "maintenance",
    location: "Jesselton Quay",
    rating: 4.5,
    services: ["AC Cleaning", "Chemical Wash", "Repair"],
    email: "hello@oceanac.com",
    website: "oceanac.com",
    desc: "Keeping KK cool. Specialized in high-rise condominium cooling systems and industrial chillers."
  },
  {
    id: 4,
    name: "Green Maid Services",
    type: "cleaning",
    location: "Inanam",
    rating: 4.3,
    services: ["Eco-friendly Cleaning", "Laundry", "Weekly Maid"],
    email: "info@greenmaid.com",
    website: "greenmaid.com",
    desc: "Sustainable cleaning solutions for environmentally conscious residents. Using only non-toxic agents."
  },
  {
    id: 5,
    name: "Sparkle & Shine KK",
    type: "cleaning",
    location: "Likas",
    rating: 4.6,
    services: ["Regular Cleaning", "Carpet Wash", "Window Cleaning"],
    email: "bookings@sparklekk.com",
    website: "sparklekk.com",
    desc: "Efficient cleaning for families and tech hubs. Trusted by 200+ landlords across Sabah."
  },
  {
    id: 6,
    name: "Penampang PowerTech",
    type: "maintenance",
    location: "Penampang",
    rating: 4.4,
    services: ["Electrical Rewiring", "Smart Home Setup", "CCTV"],
    email: "support@powertech.my",
    website: "powertech.my",
    desc: "Your digital home experts. Modernizing traditional homes with smart energy solutions."
  }
];

export const Services: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [agentSuccess, setAgentSuccess] = useState(false);

  const filteredPartners = PARTNERS.filter(p => {
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesLocation = filterLocation === 'all' || p.location === filterLocation;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesLocation && matchesSearch;
  });

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSuccess(true);
    setTimeout(() => setPartnerSuccess(false), 5000);
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAgentSuccess(true);
    setTimeout(() => setAgentSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300">
      {/* Hero Header */}
      <section className="bg-domira-navy pt-20 pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-domira-gold/10 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-domira-gold text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-domira-gold" /> Ecosystem Service Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            Professional <span className="text-domira-gold italic">Care</span> <br /> For Your Home.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Verified cleaning, maintenance, and expert support for the modern Malaysian lifestyle.
          </p>
        </div>
      </section>

      {/* Partner Directory Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="bg-white dark:bg-domira-navy rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <Building className="text-domira-gold" size={28} /> Partner Directory
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Vetted Professional Network in Sabah</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search service name..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-domira-gold text-sm font-bold transition-all shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 p-4 rounded-2xl outline-none text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 shadow-sm"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                {KK_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <div className="flex bg-slate-100 dark:bg-domira-dark p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button 
                  onClick={() => setFilterType('all')} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-domira-gold text-domira-navy shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterType('cleaning')} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'cleaning' ? 'bg-domira-gold text-domira-navy shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  Cleaning
                </button>
                <button 
                  onClick={() => setFilterType('maintenance')} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'maintenance' ? 'bg-domira-gold text-domira-navy shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  Maintenance
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map(partner => (
              <div key={partner.id} className="bg-white dark:bg-domira-dark rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:border-domira-gold/40 transition-all duration-500 group relative overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl border shadow-lg shadow-black/5 group-hover:scale-110 transition-transform ${partner.type === 'cleaning' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-domira-gold/10 text-domira-gold border-domira-gold/20'}`}>
                    {partner.type === 'cleaning' ? <Sparkles size={24} /> : <Wrench size={24} />}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-domira-navy rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-domira-gold fill-domira-gold" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">{partner.rating}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-domira-gold transition-colors">{partner.name}</h3>
                <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-domira-gold" /> {partner.location}
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium italic">
                  "{partner.desc}"
                </p>

                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {partner.services.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-slate-50 dark:bg-domira-navy text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-800 rounded-lg group-hover:border-domira-gold/20 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                   <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                     <span className="flex items-center gap-1"><Globe size={10} /> {partner.website}</span>
                     <span className="flex items-center gap-1"><Mail size={10} /> Email Verified</span>
                   </div>
                   <Button variant="primary" fullWidth className="font-black uppercase text-[10px] tracking-widest py-4 shadow-xl shadow-domira-gold/10 hover:translate-y-[-2px] active:translate-y-[0px] transition-all">
                    Contact Company
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="py-24 text-center">
              <Search className="w-20 h-20 text-slate-100 dark:text-slate-800 mx-auto mb-6" />
              <p className="text-slate-400 font-black text-xl uppercase tracking-tighter">No partners found in this area.</p>
              <Button variant="ghost" className="mt-4 text-domira-gold" onClick={() => {setFilterType('all'); setFilterLocation('all'); setSearchQuery('');}}>Reset All Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* Forms Section */}
      <section className="bg-slate-50 dark:bg-domira-deep py-32 border-y border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Company Partnership Request */}
          <div className="relative">
            <div className="mb-12">
              <div className="w-20 h-20 bg-domira-gold/10 rounded-3xl flex items-center justify-center mb-8 border border-domira-gold/20 shadow-2xl animate-pulse">
                <Briefcase className="text-domira-gold" size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">Become a <span className="text-domira-gold">Service Partner</span>.</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                Grow your business with Domira. Join our vetted network to receive steady job leads from Sabah's top landlords and tenants.
              </p>
            </div>

            {partnerSuccess ? (
              <div className="bg-white dark:bg-domira-navy border-2 border-green-500/30 p-12 rounded-[3rem] text-center shadow-2xl animate-in zoom-in-95">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Application Logged!</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Our partnership team will review your business and contact you within 48 hours.</p>
                <Button variant="outline" className="mt-8 border-slate-200 dark:border-slate-700 font-black uppercase text-[10px]" onClick={() => setPartnerSuccess(false)}>Send Another Request</Button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 hover:shadow-domira-gold/5 transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Company Name</label>
                    <input required type="text" placeholder="e.g. KK Fixers Ltd" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Expertise</label>
                    <select required className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold appearance-none cursor-pointer">
                      <option value="cleaning">Professional Cleaning</option>
                      <option value="maintenance">Maintenance & Repairs</option>
                      <option value="ac">Air Conditioning</option>
                      <option value="security">Security & Locks</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Company Website</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="url" placeholder="https://..." className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="email" placeholder="sales@business.com" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Partnership Pitch</label>
                  <textarea required rows={3} placeholder="Tell us why your company is a great fit for Domira's ecosystem..." className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold resize-none shadow-inner"></textarea>
                </div>
                <Button type="submit" variant="primary" fullWidth size="lg" className="font-black uppercase text-xs tracking-[0.2em] py-5 shadow-2xl shadow-domira-gold/20 hover:scale-[1.01] transition-transform">Submit Request</Button>
              </form>
            )}
          </div>

          {/* Agent Job Application */}
          <div className="relative">
            <div className="mb-12">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-2xl">
                <UserCheck className="text-blue-500" size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">Verification <span className="text-blue-500">Agents</span>.</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                Earn <span className="text-slate-900 dark:text-white font-black">RM 150 per audit</span>. Perform on-site checks and ensure quality listings in Kota Kinabalu.
              </p>
            </div>

            {agentSuccess ? (
              <div className="bg-white dark:bg-domira-navy border-2 border-blue-500/30 p-12 rounded-[3rem] text-center shadow-2xl animate-in zoom-in-95">
                <CheckCircle2 className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Application Sent!</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Our HR team will reach out to schedule your agent onboarding and vetting.</p>
                <Button variant="outline" className="mt-8 border-slate-200 dark:border-slate-700 font-black uppercase text-[10px]" onClick={() => setAgentSuccess(false)}>Apply Again</Button>
              </div>
            ) : (
              <form onSubmit={handleAgentSubmit} className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 hover:shadow-blue-500/5 transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input required type="text" placeholder="As per NRIC" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">MyKad Number</label>
                    <input required type="text" placeholder="XXXXXX-XX-XXXX" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input required type="tel" placeholder="+60 1X-XXXXXXX" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input required type="email" placeholder="personal@email.com" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Qualifications & Bio</label>
                  <textarea required rows={2} placeholder="Experience with real estate? Do you have transport? Why join?" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-bold resize-none shadow-inner"></textarea>
                </div>
                <Button type="submit" variant="primary" fullWidth size="lg" className="font-black uppercase text-xs tracking-[0.2em] py-5 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-2xl shadow-blue-500/20 hover:scale-[1.01] transition-transform">Apply as Agent</Button>
                <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 uppercase tracking-widest mt-4">
                  <Clock size={12} /> Flexible hours • Work in Kota Kinabalu
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
           <div className="group animate-in fade-in duration-1000">
              <div className="w-16 h-16 bg-slate-50 dark:bg-domira-navy rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800 shadow-xl group-hover:bg-domira-gold transition-colors">
                <ShieldCheck className="text-domira-gold group-hover:text-domira-navy transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Vetted Pros</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Only 100% verified Sabah-based businesses are listed.</p>
           </div>
           <div className="group animate-in fade-in duration-1000 delay-200">
              <div className="w-16 h-16 bg-slate-50 dark:bg-domira-navy rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800 shadow-xl group-hover:bg-domira-gold transition-colors">
                <CheckCircle2 className="text-domira-gold group-hover:text-domira-navy transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Quality Check</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Monthly audits to maintain service excellence scores.</p>
           </div>
           <div className="group animate-in fade-in duration-1000 delay-500">
              <div className="w-16 h-16 bg-slate-50 dark:bg-domira-navy rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800 shadow-xl group-hover:bg-domira-gold transition-colors">
                <UserCheck className="text-domira-gold group-hover:text-domira-navy transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Local Jobs</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Creating economic opportunity for verification agents in Sabah.</p>
           </div>
        </div>
      </section>
    </div>
  );
};
