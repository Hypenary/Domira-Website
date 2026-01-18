
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, CreditCard, Landmark, Smartphone, ArrowLeft, 
  CheckCircle, Clock, Info, Lock, Zap, Sparkles, ReceiptText, 
  Crown, Wallet, ChevronRight, ShieldAlert, BadgeCheck,
  Building, Handshake
} from 'lucide-react';
import { Button } from '../components/Button';
import { Property, UserProfile } from '../types';
import { api } from '../services/mockSupabase';

const MALAYSIAN_BANKS = [
  { id: 'm2u', name: 'Maybank2u', color: 'bg-[#FFD000]' },
  { id: 'cimb', name: 'CIMB Clicks', color: 'bg-[#ED1C24]' },
  { id: 'pbe', name: 'Public Bank', color: 'bg-[#C1272D]' },
  { id: 'rhb', name: 'RHB Now', color: 'bg-[#0051A0]' },
  { id: 'hlb', name: 'Hong Leong Connect', color: 'bg-[#003399]' },
];

const EWALLETS = [
  { id: 'tng', name: 'Touch n Go', color: 'bg-blue-600' },
  { id: 'grab', name: 'GrabPay', color: 'bg-green-600' },
];

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState<'RESERVE' | 'UPGRADE' | 'VERIFY' | 'BILLS'>('RESERVE');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'FPX' | 'CARD' | 'EWALLET'>('FPX');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const checkoutType = params.get('type') as any;
    const checkoutPeriod = params.get('period') as any;
    const id = params.get('id');
    
    if (checkoutType) setType(checkoutType);
    if (checkoutPeriod) setPeriod(checkoutPeriod);

    if (id && (checkoutType === 'RESERVE' || checkoutType === 'VERIFY' || !checkoutType)) {
      api.properties.getById(id).then(data => {
        if (data) setProperty(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [location]);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowConfirmButton(true);
    }, 2000);
  };

  const finalizePayment = async () => {
    if (type === 'UPGRADE') {
      const savedUser = localStorage.getItem('domira_user');
      if (savedUser) {
        const u = JSON.parse(savedUser) as UserProfile;
        u.is_gold = true;
        u.gold_theme = 'Midnight';
        localStorage.setItem('domira_user', JSON.stringify(u));
      }
    } else if (type === 'VERIFY' && property) {
       // Mock the verification update in our state-based DB
       await api.properties.update(property.id, { verification_status: 'verified', is_verified: true });
    }
    setStep(3);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark transition-colors">
      <div className="w-12 h-12 border-4 border-domira-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const getPriceData = () => {
    if (type === 'UPGRADE') {
      return { 
        title: `Domira Gold (${period === 'monthly' ? 'Monthly' : 'Annual'})`, 
        amount: period === 'monthly' ? 15 : 150, 
        desc: period === 'monthly' ? 'Priority matching active for 30 days' : 'Priority matching active for 1 year' 
      };
    }
    if (type === 'VERIFY') return { title: 'On-Site Audit Fee', amount: 150, desc: `Professional agent verification for ${property?.title}` };
    if (type === 'BILLS') return { title: 'Shared Utilities Payment', amount: 116.85, desc: 'TNB & High-Speed Internet share' };
    return { title: property?.title || 'Reservation Deposit', amount: property?.price || 0, desc: 'Secures your spot instantly' };
  };

  const priceData = getPriceData();
  const deposit = type === 'RESERVE' ? (property?.price || 0) * 2 : 0;
  const adminFee = type === 'RESERVE' ? 40 : 0;
  const total = priceData.amount + deposit + adminFee;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Superior Step Indicator */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 px-4">
           <div className="flex items-center gap-4 mb-8 md:mb-0">
             <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-domira-gold transition-all shadow-sm">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Checkout</h1>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                   <ShieldCheck size={12} className="text-green-500" /> Secure Financial Hub
                </p>
             </div>
           </div>

           <div className="flex items-center gap-4 md:gap-10">
              {[
                { id: 1, label: 'Review' },
                { id: 2, label: 'Authorize' },
                { id: 3, label: 'Confirm' }
              ].map(s => (
                <div key={s.id} className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${step >= s.id ? 'bg-domira-gold text-domira-navy shadow-lg shadow-domira-gold/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      {step > s.id ? <CheckCircle size={14} /> : s.id}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${step >= s.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s.label}</span>
                   {s.id < 3 && <div className="hidden md:block w-8 h-px bg-slate-200 dark:bg-slate-800"></div>}
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Left Section: Contextual Forms */}
           <div className="lg:col-span-2 space-y-8">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-8">
                   <div className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                      {type === 'UPGRADE' && <div className="absolute top-0 right-0 p-10 opacity-5"><Sparkles size={120} className="text-domira-gold" /></div>}
                      
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-8">Investment Summary</h2>
                      <div className="flex flex-col md:flex-row gap-8 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
                         <div className="relative shrink-0">
                            {type === 'UPGRADE' ? (
                              <div className="w-24 h-24 rounded-[2.5rem] bg-domira-gold/20 flex items-center justify-center border border-domira-gold/40 shadow-xl">
                                 <Crown className="text-domira-gold w-12 h-12" fill="currentColor" />
                              </div>
                            ) : type === 'BILLS' ? (
                              <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/30"><ReceiptText className="text-blue-500 w-10 h-10" /></div>
                            ) : (
                              <div className="group relative">
                                <img src={property?.images[0]} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white dark:border-domira-dark group-hover:scale-105 transition-transform duration-500" alt="" />
                                <div className="absolute -bottom-2 -right-2 bg-domira-gold p-2 rounded-xl border-4 border-white dark:border-domira-dark shadow-lg">
                                   <Building className="w-4 h-4 text-domira-navy" />
                                </div>
                              </div>
                            )}
                         </div>
                         <div className="flex-1">
                            <span className="text-[10px] font-black text-domira-gold uppercase tracking-[0.4em] mb-2 block">Premium Channel</span>
                            <h3 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight leading-none mb-3">{priceData.title}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{priceData.desc}</p>
                            
                            <div className="flex flex-wrap gap-3 mt-6">
                               <span className="px-3 py-1 bg-slate-50 dark:bg-domira-dark text-[9px] font-black uppercase text-slate-500 rounded-lg border border-slate-200 dark:border-slate-800">Direct FPX</span>
                               <span className="px-3 py-1 bg-slate-50 dark:bg-domira-dark text-[9px] font-black uppercase text-slate-500 rounded-lg border border-slate-200 dark:border-slate-800">E-Signature Ready</span>
                            </div>
                         </div>
                      </div>

                      {type === 'VERIFY' && (
                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl mb-10">
                           <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                              <ShieldCheck size={16} /> Identity & Quality Audit
                           </h4>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase">
                              This fee covers a physical on-site visit by a Domira agent to verify your unit's condition, address accuracy, and ownership documents. You'll receive the <span className="text-domira-gold font-black">"Verified Asset"</span> badge upon success.
                           </p>
                        </div>
                      )}

                      {type === 'RESERVE' && (
                        <div className="p-8 bg-slate-50 dark:bg-domira-dark rounded-3xl border border-slate-200 dark:border-slate-800 mb-10 shadow-inner">
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <ShieldCheck className="text-green-500" size={16} /> Domira Escrow Protocol
                           </h4>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="flex flex-col items-center text-center">
                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-domira-navy flex items-center justify-center mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <Lock className="w-5 h-5 text-domira-gold" />
                                 </div>
                                 <p className="text-[9px] font-black uppercase text-slate-900 dark:text-white">Secure Hold</p>
                                 <p className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Funds held by Domira Trust</p>
                              </div>
                              <div className="flex flex-col items-center text-center">
                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-domira-navy flex items-center justify-center mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <BadgeCheck className="w-5 h-5 text-domira-gold" />
                                 </div>
                                 <p className="text-[9px] font-black uppercase text-slate-900 dark:text-white">Verified Keys</p>
                                 <p className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Released after Move-in Confirmation</p>
                              </div>
                              <div className="flex flex-col items-center text-center">
                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-domira-navy flex items-center justify-center mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <Handshake className="w-5 h-5 text-domira-gold" />
                                 </div>
                                 <p className="text-[9px] font-black uppercase text-slate-900 dark:text-white">Full Protection</p>
                                 <p className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Refundable if unit is misrepresented</p>
                              </div>
                           </div>
                        </div>
                      )}

                      <Button variant="primary" fullWidth size="lg" className="py-7 font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-domira-gold/20 bg-domira-gold text-domira-navy border-white/20 active:scale-95 transition-all" onClick={() => setStep(2)}>
                        Proceed to Payment Selection
                      </Button>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white dark:bg-domira-navy p-10 md:p-14 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-right-10 duration-500">
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Secure Authorization</h2>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-10">Select your preferred financial channel</p>
                   
                   {!showConfirmButton ? (
                     <div className="space-y-10">
                        {/* Method Selector */}
                        <div className="flex p-1.5 bg-slate-50 dark:bg-domira-dark rounded-2xl border border-slate-200 dark:border-slate-800">
                           {[
                             { id: 'FPX', label: 'Online Banking', icon: Landmark },
                             { id: 'CARD', label: 'Credit/Debit', icon: CreditCard },
                             { id: 'EWALLET', label: 'E-Wallet', icon: Wallet },
                           ].map(m => (
                             <button 
                                key={m.id}
                                onClick={() => setPaymentMethod(m.id as any)}
                                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all gap-2 ${paymentMethod === m.id ? 'bg-white dark:bg-domira-navy text-domira-gold shadow-xl border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                             >
                                <m.icon size={20} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                             </button>
                           ))}
                        </div>

                        {paymentMethod === 'FPX' && (
                           <div className="animate-in fade-in duration-500">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Financial Providers</p>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {MALAYSIAN_BANKS.map(bank => (
                                  <button key={bank.id} onClick={() => setSelectedBank(bank.id)} className={`flex items-center gap-3 p-5 rounded-2xl border transition-all text-left ${selectedBank === bank.id ? 'bg-domira-gold text-domira-navy border-white shadow-xl scale-[1.02]' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-800 hover:border-domira-gold/30'}`}>
                                     <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${selectedBank === bank.id ? 'bg-white' : bank.color}`}></div>
                                     <span className={`text-[10px] font-black uppercase tracking-widest truncate ${selectedBank === bank.id ? 'text-domira-navy' : 'text-slate-900 dark:text-white'}`}>{bank.name}</span>
                                  </button>
                                ))}
                             </div>
                          </div>
                        )}

                        {paymentMethod === 'EWALLET' && (
                           <div className="animate-in fade-in duration-500">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Instant Checkout</p>
                             <div className="grid grid-cols-2 gap-4">
                                {EWALLETS.map(w => (
                                   <button key={w.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-domira-gold transition-all group">
                                      <div className="flex items-center gap-4">
                                         <div className={`w-10 h-10 rounded-xl ${w.color} flex items-center justify-center text-white shadow-lg`}>
                                            <Smartphone size={20} />
                                         </div>
                                         <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{w.name}</span>
                                      </div>
                                      <ChevronRight size={16} className="text-slate-300 group-hover:text-domira-gold" />
                                   </button>
                                ))}
                             </div>
                          </div>
                        )}

                        {paymentMethod === 'CARD' && (
                           <div className="animate-in fade-in duration-500 space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Secure Card Input</label>
                                    <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-domira-gold text-white font-bold" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Expiry</label>
                                       <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-domira-gold text-white font-bold" />
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">CVC</label>
                                       <input type="password" placeholder="•••" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-domira-gold text-white font-bold" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                       <Button 
                        variant="primary" 
                        fullWidth 
                        size="lg" 
                        disabled={(paymentMethod === 'FPX' && !selectedBank) || processing} 
                        onClick={handlePay} 
                        className="py-7 font-black uppercase text-xs tracking-[0.3em] shadow-2xl bg-domira-gold text-domira-navy mt-6 border-white/20"
                       >
                          {processing ? 'Connecting Gateway...' : `Initialize RM ${total.toFixed(2)}`}
                       </Button>
                     </div>
                   ) : (
                     <div className="text-center py-10 space-y-10 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-blue-500/20 shadow-xl">
                          <ShieldCheck className="text-blue-500" size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight uppercase">Ready to Authorize</h3>
                          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed uppercase font-bold tracking-tight">Authorizing payment of <strong className="text-domira-gold">RM {total.toFixed(2)}</strong> from your account.</p>
                        </div>
                        <Button variant="primary" fullWidth size="lg" onClick={finalizePayment} className="py-7 font-black uppercase text-xs tracking-[0.2em] bg-green-600 hover:bg-green-700 shadow-[0_20px_60px_rgba(22,163,74,0.3)] border-green-700 active:scale-95 transition-all">
                           Release Authorization
                        </Button>
                     </div>
                   )}
                </div>
              )}

              {step === 3 && (
                <div className="bg-white dark:bg-domira-navy p-16 md:p-24 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl text-center animate-in zoom-in-95 duration-700">
                   <div className="w-32 h-32 bg-green-500/10 border-4 border-green-500/20 rounded-[3rem] flex items-center justify-center mx-auto mb-10 animate-bounce">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                   </div>
                   <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 uppercase">Payment <span className="text-domira-gold">Cleared</span></h2>
                   <p className="text-slate-500 font-medium mb-16 text-lg max-w-lg mx-auto leading-relaxed">
                      {type === 'UPGRADE' ? 'The elite experience is now yours. Your gold interface and priority status have been activated.' : type === 'VERIFY' ? `Audit request for "${property?.title}" received. Our verification agents in KK will reach out within 24 hours.` : type === 'BILLS' ? 'Household obligations fulfilled. Your contributions are updated in the dashboard.' : 'Unit reservation locked. Your legal agreement is ready for final digital countersign.'}
                   </p>
                   <Link to={type === 'RESERVE' || type === 'BILLS' ? '/my-house' : type === 'VERIFY' ? '/for-landlords' : '/profile'}>
                      <Button variant="primary" fullWidth size="lg" className="py-8 font-black uppercase text-sm tracking-[0.4em] shadow-2xl bg-domira-gold text-domira-navy hover:scale-105 transition-all border-white/20">Go to Dashboard</Button>
                   </Link>
                </div>
              )}
           </div>

           {/* Right Section: Order Total & Summary */}
           <div className="lg:col-span-1">
              <div className={`p-10 rounded-[3.5rem] shadow-2xl border sticky top-28 transition-all duration-1000 group ${type === 'UPGRADE' || isGoldMember() ? 'bg-slate-950 border-domira-gold/40 ring-4 ring-domira-gold/5' : 'bg-domira-navy border-white/5'}`}>
                 <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3 ${type === 'UPGRADE' ? 'text-domira-gold' : 'text-slate-400'}`}>
                    <CreditCard size={18}/> Global Summary
                 </h3>
                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-slate-500 uppercase tracking-widest">{priceData.title}</span>
                       <span className="font-black text-white">RM {priceData.amount.toFixed(2)}</span>
                    </div>
                    {type === 'RESERVE' && (
                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <div className="flex flex-col">
                             <span className="text-slate-500 uppercase tracking-widest">Security Deposit</span>
                             <span className="text-[8px] text-domira-gold font-black uppercase tracking-widest mt-0.5">Escrow Vault</span>
                          </div>
                          <span className="font-black text-white">RM {deposit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-500 uppercase tracking-widest">Digital Stamp Duty</span>
                          <span className="font-black text-white">RM {adminFee.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-10 border-t-2 border-dashed border-white/10">
                       <span className="text-domira-gold font-black uppercase text-xs tracking-[0.4em]">Net Payable</span>
                       <div className="text-right">
                          <span className="text-4xl font-black tracking-tighter text-white">RM {total.toFixed(2)}</span>
                          <p className="text-[8px] font-bold uppercase text-slate-500 mt-1">Sabah SST @ 0% Included</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 text-[9px] font-bold text-slate-500 italic leading-relaxed text-center uppercase tracking-[0.2em] group-hover:border-domira-gold/30 transition-colors">
                    <div className="flex justify-center gap-4 mb-4">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/FPX_Logo.svg/1200px-FPX_Logo.svg.png" className="h-5 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" />
                    </div>
                    "Escrow protection active. Funds held by Domira Financial Trust."
                 </div>
              </div>

              {/* Extra Trust Badge */}
              <div className="mt-8 p-6 bg-slate-50 dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex items-center gap-4">
                 <div className="p-3 bg-green-500/10 rounded-xl shadow-lg"><ShieldCheck size={20} className="text-green-500" /></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white leading-none mb-1">Audit Guarantee</p>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-tighter">100% Refundable if Audit Fails</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper to check gold status from localStorage without being too reactive
function isGoldMember() {
  const u = localStorage.getItem('domira_user');
  if (!u) return false;
  return JSON.parse(u).is_gold;
}
