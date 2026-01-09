
import React, { useState } from 'react';
import { X, Mail, Lock, User, KeyRound, Check, Smartphone, Globe, Chrome, Facebook, Apple, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        id: 'user_123',
        full_name: 'Demo User',
        avatar_url: 'https://picsum.photos/seed/user/200/200',
        role: UserRole.TENANT,
        is_verified: false,
        email
      });
      setLoading(false);
      onClose();
    }, 1000);
  };

  const SocialIcon = ({ icon: Icon, colorClass }: { icon: any, colorClass: string }) => (
    <button className="flex-1 flex items-center justify-center p-3 bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-100 transition-all group">
      <Icon size={18} className={`transition-transform group-hover:scale-110 ${colorClass}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-domira-navy w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="flex justify-center mb-8">
            <Logo size={64} className="shadow-xl rounded-full" />
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Access Domira'}
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {mode === 'login' ? 'Continue your housing journey' : 'Sabah\'s most trusted rental network'}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-10">
            <SocialIcon icon={Chrome} colorClass="text-red-500" />
            <SocialIcon icon={Facebook} colorClass="text-blue-600" />
            <SocialIcon icon={Apple} colorClass="text-slate-900 dark:text-white" />
            <SocialIcon icon={Globe} colorClass="text-blue-400" />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative px-4 bg-white dark:bg-domira-navy text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Email Auth</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" required placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm shadow-inner transition-all"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" required placeholder="Password" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-domira-gold font-bold text-sm shadow-inner transition-all"
              />
            </div>

            <Button variant="primary" fullWidth size="lg" className="font-black uppercase text-xs tracking-[0.2em] py-5 shadow-2xl shadow-domira-gold/20 bg-domira-gold text-domira-navy border-white/10">
              {loading ? 'Processing...' : mode === 'login' ? 'Authorize' : 'Register'}
            </Button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-domira-gold transition-colors block w-full">
              {mode === 'login' ? 'Need an account? Join now' : 'Already have an ID? Sign in'}
            </button>
            <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-50">
               <ShieldCheck size={12} /> SSL Encrypted Gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
