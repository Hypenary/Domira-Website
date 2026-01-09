
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ShieldCheck, FileText, Upload, CheckCircle, ArrowLeft, Camera, Info } from 'lucide-react';

export const VerifyDocuments: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step < 2) setStep(step + 1);
      else {
        onComplete();
        navigate('/profile');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark py-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-12 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck className="w-4 h-4" /> Final Step: Document Audit
           </div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Verify Your Identity</h1>
           <p className="text-slate-500 font-medium text-sm">To prevent fraud, we require a scan of your official ID and income proof.</p>
        </div>

        <div className="bg-white dark:bg-domira-navy rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
           <div className="p-10 md:p-16">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex gap-2">
                    {[1, 2].map(i => (
                      <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${step >= i ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    ))}
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 2</span>
              </div>

              {step === 1 ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                   <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">National ID / Passport</h2>
                   <div className="aspect-video bg-slate-50 dark:bg-domira-dark rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 group hover:border-blue-500 transition-all cursor-pointer">
                      <Camera className="w-12 h-12 text-slate-300 mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-slate-500">Click to upload or drag photo</p>
                      <p className="text-[10px] text-slate-400 mt-2 uppercase">JPEG, PNG or PDF (Max 5MB)</p>
                   </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                   <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Proof of Income / Student ID</h2>
                   <div className="aspect-video bg-slate-50 dark:bg-domira-dark rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 group hover:border-blue-500 transition-all cursor-pointer">
                      <FileText className="w-12 h-12 text-slate-300 mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-slate-500">Latest 3-months payslip or offer letter</p>
                      <p className="text-[10px] text-slate-400 mt-2 uppercase">Confidential & Encrypted</p>
                   </div>
                </div>
              )}

              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleUpload} 
                disabled={loading}
                className="mt-10 py-5 font-black uppercase text-xs tracking-widest bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Analyzing Metadata...' : step === 1 ? 'Verify Identity' : 'Submit for Review'}
              </Button>
           </div>
           
           <div className="px-10 py-6 bg-slate-50 dark:bg-domira-deep border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                 Domira uses bank-level encryption. Your documents are never shared with housemates or third-parties without consent.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
