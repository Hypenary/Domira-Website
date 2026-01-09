
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { 
  ShieldCheck, 
  Landmark, 
  Briefcase, 
  CheckCircle, 
  ArrowRight, 
  MapPin, 
  Award, 
  UserPlus, 
  FileCheck,
  Star,
  Zap,
  Globe
} from 'lucide-react';
import { api } from '../services/mockSupabase';

export const AgentApply: React.FC<{ onComplete: (ren: string, agency: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ren_number: '',
    agency_name: '',
    experience: '1-3',
    coverage: 'Kota Kinabalu',
    specialization: 'High-rise Residential'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.agent.apply('current_user', formData);
      setSuccess(true);
      onComplete(formData.ren_number, formData.agency_name);
      setTimeout(() => navigate('/profile'), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-domira-dark flex items-center justify-center p-4">
        <div className="bg-domira-navy p-12 rounded-[3.5rem] border border-domira-gold/30 shadow-2xl text-center max-w-lg animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-domira-gold/10 border-4 border-domira-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
              <ShieldCheck className="w-12 h-12 text-domira-gold" />
           </div>
           <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Audit Initiated</h2>
           <p className="text-slate-400 font-medium text-lg leading-relaxed">
             Our compliance team is verifying your <span className="text-domira-gold font-black">REN credentials</span>. You will be notified via email within 48 hours.
           </p>
           <div className="mt-10 pt-10 border-t border-white/10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Onboarding</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark transition-colors duration-300 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-domira-gold/10 border border-domira-gold/20 rounded-full text-domira-gold text-[10px] font-black uppercase tracking-widest mb-6">
              <Landmark size={14} className="fill-domira-gold" /> Authorized Agent Channel
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-none">
             JOIN THE <span className="text-domira-gold italic">ELITE</span> NETWORK.
           </h1>
           <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
             Domira only lists properties from licensed REN/REA agents in Malaysia. Secure your badge today.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Form Column */}
           <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-domira-navy rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-10 md:p-14 space-y-10">
                 
                 <div className="space-y-8">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">REN / REA Registration Number</label>
                       <div className="relative">
                          <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-domira-gold" size={20} />
                          <input 
                            required 
                            type="text" 
                            placeholder="e.g. REN 12345" 
                            className="w-full pl-12 pr-4 py-5 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-black shadow-inner"
                            value={formData.ren_number}
                            onChange={(e) => setFormData({...formData, ren_number: e.target.value})}
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Agency Name (Sabah/Malaysia)</label>
                       <input 
                        required 
                        type="text" 
                        placeholder="e.g. Knight Frank Malaysia" 
                        className="w-full p-5 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold text-sm font-black shadow-inner"
                        value={formData.agency_name}
                        onChange={(e) => setFormData({...formData, agency_name: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Market Experience</label>
                          <select 
                            className="w-full p-5 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none font-bold text-sm"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          >
                             <option value="1-3">1-3 Years</option>
                             <option value="4-7">4-7 Years</option>
                             <option value="8+">8+ Years</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Primary Region</label>
                          <select 
                            className="w-full p-5 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none font-bold text-sm"
                            value={formData.coverage}
                            onChange={(e) => setFormData({...formData, coverage: e.target.value})}
                          >
                             <option value="Kota Kinabalu">Kota Kinabalu</option>
                             <option value="Penampang">Penampang</option>
                             <option value="Inanam">Inanam</option>
                             <option value="Sandakan">Sandakan</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-4 mb-8">
                       <input type="checkbox" required className="mt-1" />
                       <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                          I confirm that I am a licensed negotiator in Malaysia and agree to Domira's <span className="text-domira-gold">Strict Anti-Ghosting Policy</span>.
                       </p>
                    </div>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth 
                      size="lg" 
                      disabled={loading}
                      className="py-7 font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-domira-gold/20 bg-domira-gold text-domira-navy border-white/10 active:scale-95 transition-all"
                    >
                      {loading ? 'Authenticating REN...' : 'Join Authorized Registry'}
                    </Button>
                 </div>
              </form>
           </div>

           {/* Sidebar Column: Benefits */}
           <div className="space-y-8">
              <div className="bg-domira-navy p-8 rounded-[3rem] text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Star size={80} className="text-domira-gold" /></div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-domira-gold mb-8 flex items-center gap-2">
                    <Award size={16} /> Exclusive Perks
                 </h3>
                 <div className="space-y-6 relative z-10">
                    {[
                      { icon: CheckCircle, title: 'Verified Badge', desc: 'Higher trust from students' },
                      { icon: Zap, title: 'Direct Leads', desc: 'No gatekeeping between you and renters' },
                      { icon: Globe, title: 'Digital E-Sign', desc: 'Close deals 3x faster online' }
                    ].map((perk, i) => (
                      <div key={i} className="flex gap-4">
                         <perk.icon className="text-domira-gold shrink-0 mt-0.5" size={18} />
                         <div>
                            <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{perk.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase">{perk.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white dark:bg-domira-navy p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl text-center">
                 <div className="w-16 h-16 bg-slate-50 dark:bg-domira-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Briefcase size={28} className="text-domira-gold" />
                 </div>
                 <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Agency Support</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">
                    Managing a team of 10+? Contact <span className="text-domira-gold font-black">enterprise@domira.my</span> for specialized bulk dashboard access.
                 </p>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 text-center">
                 <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1 leading-relaxed">
                    Over 500+ successful matches processed this month in KK.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
