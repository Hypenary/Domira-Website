
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mail, Lock, User, KeyRound, ArrowLeft, CheckCircle, Eye, EyeOff, Github, Chrome, Facebook, Apple, ShieldCheck, Globe } from 'lucide-react';
import { api } from '../services/mockSupabase';
import { UserRole } from '../types';
import { Logo } from '../components/Logo';

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const isSignupInit = searchParams.get('mode') === 'signup';
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>(isSignupInit ? 'signup' : 'login');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (authMode === 'forgot_password') {
      try {
        await api.auth.resetPassword(email);
        setResetSent(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      // Direct login/signup as a general user. 
      // Roles are upgraded via the Landlord Hub or Profile settings.
      const user = await api.auth.login(email, UserRole.TENANT);
      onLogin(user);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SocialButton = ({ icon: Icon, label, colorClass }: { icon: any, label: string, colorClass: string }) => (
    <button 
      type="button"
      className={`flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-domira-navy hover:bg-slate-50 dark:hover:bg-domira-dark transition-all duration-300 group shadow-sm hover:shadow-md hover:border-domira-gold/30`}
    >
      <Icon size={20} className={colorClass} />
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark flex transition-colors duration-300">
      {/* Left Side: Brand Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-domira-navy relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-domira-gold/10 blur-[150px] rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -ml-32 -mb-32"></div>
        
        <Link to="/" className="relative z-10 flex items-center gap-4 group">
          <Logo size={48} className="group-hover:scale-110 transition-transform duration-500" />
          <span className="text-2xl font-black text-white tracking-tighter">Domira</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85] mb-8">
            ACCESS THE <br />
            <span className="text-domira-gold italic">ELITE</span> RENTAL <br />
            NETWORK.
          </h1>
          <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed">
            The safest way to find homes and roommates in Malaysia. Verified by design, secured by technology.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
          <div>
            <p className="text-3xl font-black text-white">5k+</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-domira-gold">Verified Units</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">100%</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-domira-gold">Secure Gateway</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">0%</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-domira-gold">Fraud Rate</p>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="lg:hidden flex justify-center mb-10">
             <Logo size={64} className="shadow-2xl shadow-domira-gold/20 rounded-full" />
          </div>
          
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-3">
              {authMode === 'signup' ? 'Create Account' : authMode === 'login' ? 'Welcome Back' : 'Recover Password'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {authMode === 'signup' ? (
                <>Already a member? <button onClick={() => setAuthMode('login')} className="text-domira-gold font-black uppercase text-[10px] tracking-widest ml-2 hover:underline">Log in</button></>
              ) : (
                <>New to the platform? <button onClick={() => setAuthMode('signup')} className="text-domira-gold font-black uppercase text-[10px] tracking-widest ml-2 hover:underline">Sign up</button></>
              )}
            </p>
          </div>

          {authMode === 'forgot_password' && resetSent ? (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="p-10 bg-green-500/5 border border-green-500/20 rounded-[2.5rem] text-center">
                 <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                    <CheckCircle size={32} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Check Your Email</h3>
                 <p className="text-sm text-slate-500 font-medium mb-10">Instructions have been sent to reset your password.</p>
                 <Button variant="primary" fullWidth onClick={() => { setAuthMode('login'); setResetSent(false); }} className="py-4 font-black uppercase text-[10px] tracking-widest">Return to Login</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               {/* Social Login Options */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SocialButton icon={Chrome} label="Google" colorClass="text-red-500" />
                  <SocialButton icon={Facebook} label="Facebook" colorClass="text-blue-600" />
                  <SocialButton icon={Apple} label="Apple ID" colorClass="text-slate-900 dark:text-white" />
                  <SocialButton icon={Globe} label="Microsoft" colorClass="text-blue-400" />
               </div>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                  <div className="relative flex justify-center"><span className="px-4 bg-white dark:bg-domira-dark text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Or use email</span></div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" required placeholder="name@domain.com" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-navy/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm transition-all shadow-inner"
                        value={email} onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {authMode !== 'forgot_password' && (
                    <div>
                      <div className="flex justify-between items-center mb-2 px-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                        <button type="button" onClick={() => setAuthMode('forgot_password')} className="text-[9px] font-black text-domira-gold uppercase tracking-widest hover:underline">Forgot?</button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type={showPassword ? "text" : "password"} required placeholder="••••••••" 
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-domira-navy/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm transition-all shadow-inner"
                          value={password} onChange={e => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-domira-gold transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button 
                      type="submit" variant="primary" fullWidth size="lg" disabled={loading}
                      className="py-5 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-domira-gold/20 active:scale-95 transition-all bg-domira-gold text-domira-navy"
                    >
                      {loading ? 'Authenticating...' : authMode === 'signup' ? 'Create ID' : 'Sign In'}
                    </Button>
                  </div>
               </form>

               <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <ShieldCheck className="text-green-500" size={16} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     Secured by 256-bit bank-level encryption.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
