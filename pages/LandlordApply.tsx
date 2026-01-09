
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ShieldAlert, Building, Key, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LandlordApply: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onComplete();
      setTimeout(() => navigate('/for-landlords'), 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-domira-navy flex items-center justify-center p-4">
        <div className="text-center animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-green-500/20 border-4 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-500" />
           </div>
           <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Application Received</h2>
           <p className="text-slate-400 font-medium">Our Trust & Safety team is auditing your credentials. Access will be granted shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Join Our <span className="text-domira-gold">Trusted</span> Network</h1>
           <p className="text-slate-500 font-medium">Verified landlords receive the "Verified Host" badge and 3x more premium inquiries.</p>
        </div>

        <form onSubmit={handleApply} className="bg-white dark:bg-domira-navy rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-10 md:p-16 space-y-10">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold" placeholder="As per NRIC/Passport" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SSM / Business Reg (Optional)</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold" placeholder="e.g. 202401023456" />
                 </div>
              </div>
              <div className="bg-slate-50 dark:bg-domira-dark p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                 <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2"><Building size={16} className="text-domira-gold"/> Portfolio Proof</h3>
                 <p className="text-xs text-slate-500 mb-6">Upload a copy of your utility bill or assessment tax (Cukai Pintu) to prove ownership.</p>
                 <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 rounded-2xl text-center cursor-pointer hover:border-domira-gold transition-all">
                    <Zap className="w-8 h-8 text-domira-gold mx-auto mb-2" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Ownership Proof</span>
                 </div>
              </div>
           </div>

           <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-4">
                 <input type="checkbox" required className="mt-1" />
                 <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">I agree to the Landlord Code of Conduct and confirm that all my property listings are real and verified.</p>
              </div>
              <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading} className="py-5 font-black uppercase text-xs tracking-widest">
                {loading ? 'Verifying Credentials...' : 'Submit Host Application'}
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
};
